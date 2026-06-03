import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import { PHILOSOPHERS, TOPICS } from '../../../shared/philosophersData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LIBRARY_PATH = path.join(__dirname, '../../processed/library.json')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Text extractors ──────────────────────────────────────────────────────────

async function extractTextFromPDF(filePath) {
  // pdf-parse has a CommonJS default export; import dynamically
  const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js')
  const buffer = fs.readFileSync(filePath)
  const data = await pdfParse(buffer)
  return data.text
}

async function extractTextFromEPUB(filePath) {
  const { EPub } = await import('epub2')
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath)
    epub.on('end', async () => {
      const texts = []
      const chapterIds = epub.flow.map(c => c.id)
      let done = 0
      if (chapterIds.length === 0) return resolve('')

      chapterIds.forEach(id => {
        epub.getChapter(id, (err, text) => {
          if (!err && text) {
            // Strip HTML tags
            texts.push(text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
          }
          done++
          if (done === chapterIds.length) resolve(texts.join('\n\n'))
        })
      })
    })
    epub.on('error', reject)
    epub.parse()
  })
}

async function extractText(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.pdf' || mimeType === 'application/pdf') {
    return extractTextFromPDF(filePath)
  }
  if (ext === '.epub' || mimeType === 'application/epub+zip') {
    return extractTextFromEPUB(filePath)
  }
  throw new Error(`Unsupported file type: ${ext}`)
}

// ── Claude quote extractor ───────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a philosophical text analyst specialising in primary source material.
Your task: extract authentic philosophical quotes and identify the philosopher and work.

Valid topics: suffering | death | meaning | love | freedom | truth | god | beauty | evil | society

Return ONLY a JSON object — no markdown, no commentary — in this exact schema:
{
  "philosopher": "canonical name, e.g. 'Friedrich Nietzsche'",
  "philosopherId": "snake_case id matching one of: nietzsche|camus|dostoevsky|plato|aristotle|schopenhauer|beauvoir|sartre|marcus|kant — or a new id like 'hegel' if not in the list",
  "title": "detected work or book title",
  "year": <integer or null>,
  "quotes": [
    {
      "text": "exact quote, verbatim from the text",
      "source": "work title",
      "year": <integer or null>,
      "topic": "<one valid topic from the list above>"
    }
  ]
}

Rules:
- Only include quotes that are genuine philosophical statements (not plot descriptions or narrative filler)
- Aim for 15–25 quotes per chunk; favour quality over quantity
- If you cannot identify the philosopher with confidence, leave philosopherId as "unknown"
- Never fabricate quotes — only extract what appears verbatim in the text`

async function extractQuotesFromChunk(text, philosopherHint, chunkNum, totalChunks, emit) {
  const hint = philosopherHint
    ? `CONTEXT: This text is by ${philosopherHint}.\n\n`
    : ''

  emit(`⚙️  Running Claude on chunk ${chunkNum}/${totalChunks}…`)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `${hint}Extract philosophical quotes from this passage (chunk ${chunkNum} of ${totalChunks}):\n\n${text.slice(0, 80000)}`
    }]
  })

  const raw = response.content[0].text.trim()
  // Tolerate ```json ... ``` wrapping
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(cleaned)
}

// ── Library persistence ──────────────────────────────────────────────────────

function loadLibrary() {
  try {
    return JSON.parse(fs.readFileSync(LIBRARY_PATH, 'utf8'))
  } catch {
    return { books: [] }
  }
}

function saveLibrary(lib) {
  fs.writeFileSync(LIBRARY_PATH, JSON.stringify(lib, null, 2))
}

// ── Main processor ───────────────────────────────────────────────────────────

export async function processBook({ filePath, originalName, mimeType, philosopherHint }, emit = () => {}) {
  emit(`📖 Extracting text from ${originalName}…`)

  let rawText
  try {
    rawText = await extractText(filePath, mimeType)
  } catch (err) {
    emit(`❌ Text extraction failed: ${err.message}`)
    throw err
  }

  const charCount = rawText.length
  emit(`✅ Extracted ${charCount.toLocaleString()} characters`)

  if (!process.env.ANTHROPIC_API_KEY) {
    emit(`⚠️  No ANTHROPIC_API_KEY — skipping Claude processing. Add the key to server/.env and re-upload.`)
    return { philosopher: 'unknown', title: originalName, quotes: {}, charCount }
  }

  // Chunk into ≤80 000-char pieces (roughly 20K tokens each)
  const CHUNK_SIZE = 80000
  const chunks = []
  for (let i = 0; i < rawText.length; i += CHUNK_SIZE) {
    chunks.push(rawText.slice(i, i + CHUNK_SIZE))
  }
  // Limit to 4 chunks for now (covers ~320K chars / most novels)
  const chunksToProcess = chunks.slice(0, 4)

  emit(`🔢 Processing ${chunksToProcess.length} chunk(s) of ${CHUNK_SIZE.toLocaleString()} chars each…`)

  const allQuotes = {}
  let philosopher = 'unknown'
  let philosopherId = 'unknown'
  let title = originalName
  let year = null

  for (let i = 0; i < chunksToProcess.length; i++) {
    try {
      const result = await extractQuotesFromChunk(
        chunksToProcess[i],
        philosopherHint,
        i + 1,
        chunksToProcess.length,
        emit
      )

      if (i === 0) {
        philosopher = result.philosopher || philosopher
        philosopherId = result.philosopherId || philosopherId
        title = result.title || title
        year = result.year ?? year
      }

      const quotes = result.quotes || []
      emit(`  → Found ${quotes.length} quotes in chunk ${i + 1}`)

      quotes.forEach(q => {
        if (!q.text || !q.topic) return
        const topic = TOPICS.includes(q.topic) ? q.topic : 'meaning'
        if (!allQuotes[topic]) allQuotes[topic] = []
        // Deduplicate by first 60 chars
        const key = q.text.slice(0, 60)
        if (!allQuotes[topic].some(ex => ex.text.slice(0, 60) === key)) {
          allQuotes[topic].push({ text: q.text, source: title, year: q.year ?? year })
        }
      })
    } catch (err) {
      emit(`  ⚠️  Chunk ${i + 1} parse error: ${err.message} — continuing`)
    }
  }

  const totalExtracted = Object.values(allQuotes).reduce((s, a) => s + a.length, 0)
  emit(`✨ Total unique quotes extracted: ${totalExtracted}`)

  // Resolve to known philosopher if possible
  const knownPhil = PHILOSOPHERS.find(p =>
    p.id === philosopherId ||
    p.name.toLowerCase().includes(philosopher.toLowerCase().split(' ').pop()?.toLowerCase() || '')
  )
  if (knownPhil) {
    philosopherId = knownPhil.id
    emit(`📌 Matched to known philosopher: ${knownPhil.name}`)
  }

  // Persist to library.json
  const lib = loadLibrary()
  const existing = lib.books.findIndex(b => b.filename === originalName && b.philosopherId === philosopherId)
  const entry = {
    id: uuidv4(),
    filename: originalName,
    philosopher,
    philosopherId,
    title,
    year,
    charCount,
    processedAt: new Date().toISOString(),
    quoteCount: totalExtracted,
    quotes: allQuotes
  }

  if (existing >= 0) lib.books[existing] = entry
  else lib.books.push(entry)

  saveLibrary(lib)
  emit(`💾 Saved to library — ${totalExtracted} quotes for "${philosopher}"`)

  return entry
}

// ── Library query helpers (used by PhilosopherAgent) ─────────────────────────

export function getLibraryQuotesForPhilosopher(philosopherId) {
  const lib = loadLibrary()
  const merged = {}
  lib.books
    .filter(b => b.philosopherId === philosopherId)
    .forEach(b => {
      Object.entries(b.quotes || {}).forEach(([topic, quotes]) => {
        if (!merged[topic]) merged[topic] = []
        merged[topic].push(...quotes)
      })
    })
  return merged
}

export function getLibrary() {
  return loadLibrary()
}
