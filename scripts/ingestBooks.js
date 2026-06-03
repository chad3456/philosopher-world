/**
 * ingestBooks.js
 * Downloads every epub from the GitHub repo, extracts full text,
 * runs smart heuristic passage selection (no API key needed),
 * and writes server/processed/library.json.
 *
 * Run from repo root:  node scripts/ingestBooks.js
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { v4: uuidv4 } = require('../server/node_modules/uuid/dist/commonjs-browser/index.js')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR  = path.join(__dirname, '../server/uploads')
const LIBRARY_PATH = path.join(__dirname, '../server/processed/library.json')

fs.mkdirSync(UPLOADS_DIR, { recursive: true })

// ── Book manifest ─────────────────────────────────────────────────────────────
// raw GitHub URLs from the main branch
const BASE = 'https://raw.githubusercontent.com/chad3456/philosopher-world/main/'

const BOOKS = [
  {
    url: BASE + encodeURIComponent('(Penguin Classics) Friedrich Nietzsche_Michael A. Scarpitti_Robert C. Holub - On the genealogy of morals_ a polemic-Penguin Books Ltd (2013).epub'),
    filename: 'nietzsche-genealogy.epub',
    philosopher: 'Friedrich Nietzsche',
    philosopherId: 'nietzsche',
    title: 'On the Genealogy of Morals',
    year: 1887,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent('Friedrich Nietzsche - Human, All Too Human-Global Grey (2021).epub'),
    filename: 'nietzsche-human-all-too-human.epub',
    philosopher: 'Friedrich Nietzsche',
    philosopherId: 'nietzsche',
    title: 'Human, All Too Human',
    year: 1878,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent('The Gay Science With a Prelude in Rhymes and an Appendix of Songs (Friedrich Nietzsche) (Z-Library).epub'),
    filename: 'nietzsche-gay-science.epub',
    philosopher: 'Friedrich Nietzsche',
    philosopherId: 'nietzsche',
    title: 'The Gay Science',
    year: 1882,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent('Fyodor Dostoyevsky, trans. David McDuff - Crime and Punishment-ePenguin (2003).epub'),
    filename: 'dostoevsky-crime-punishment.epub',
    philosopher: 'Fyodor Dostoevsky',
    philosopherId: 'dostoevsky',
    title: 'Crime and Punishment',
    year: 1866,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent("Fyodor Dostoevsky, Richard Pevear, Larissa Volokhonsky - Notes from Underground (Everyman's Library)-Everyman's Library (2004).epub"),
    filename: 'dostoevsky-notes-underground.epub',
    philosopher: 'Fyodor Dostoevsky',
    philosopherId: 'dostoevsky',
    title: 'Notes from Underground',
    year: 1864,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent('Fyodor Dostoevsky_ David McDuff - The Idiot-Penguin Group (2004).epub'),
    filename: 'dostoevsky-idiot.epub',
    philosopher: 'Fyodor Dostoevsky',
    philosopherId: 'dostoevsky',
    title: 'The Idiot',
    year: 1869,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent('Demons (Fyodor Dostoevsky) (Z-Library).epub'),
    filename: 'dostoevsky-demons.epub',
    philosopher: 'Fyodor Dostoevsky',
    philosopherId: 'dostoevsky',
    title: 'Demons (The Possessed)',
    year: 1872,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent('The Double (Fyodor Dostoevsky [Dostoevsky, Fyodor]) (Z-Library).epub'),
    filename: 'dostoevsky-double.epub',
    philosopher: 'Fyodor Dostoevsky',
    philosopherId: 'dostoevsky',
    title: 'The Double',
    year: 1846,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent('The Gospel in Dostoyevsky (Fyodor Dostoyevsky [Dostoyevsky, Fyodor]) (z-library.sk, 1lib.sk, z-lib.sk).epub'),
    filename: 'dostoevsky-gospel.epub',
    philosopher: 'Fyodor Dostoevsky',
    philosopherId: 'dostoevsky',
    title: 'The Gospel in Dostoevsky',
    year: 1988,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent('War And Peace (Penguin Classics) (Leo Tolstoy) (z-library.sk, 1lib.sk, z-lib.sk).epub'),
    filename: 'tolstoy-war-and-peace.epub',
    philosopher: 'Leo Tolstoy',
    philosopherId: 'tolstoy',
    title: 'War and Peace',
    year: 1869,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent('The Book of Disquiet (Fernando Pessoa) (z-library.sk, 1lib.sk, z-lib.sk).epub'),
    filename: 'pessoa-book-of-disquiet.epub',
    philosopher: 'Fernando Pessoa',
    philosopherId: 'pessoa',
    title: 'The Book of Disquiet',
    year: 1982,
    type: 'epub'
  },
  {
    url: BASE + encodeURIComponent('ASHTAVAKRA GITA - SONG OF SELF - REALISATION (Swami Chinmayananda) (z-library.sk, 1lib.sk, z-lib.sk).epub'),
    filename: 'ashtavakra-gita.epub',
    philosopher: 'Ashtavakra',
    philosopherId: 'ashtavakra',
    title: 'Ashtavakra Gita',
    year: -400,
    type: 'epub'
  }
]

// ── Topic keyword scoring ─────────────────────────────────────────────────────
const TOPIC_KEYWORDS = {
  suffering: ['suffer','pain','agony','torment','anguish','endure','misery','grief',
    'afflict','wound','sorrow','distress','lament','weep','wretched','despair'],
  death:     ['death','die','dying','mortal','immortal','grave','end','perish',
    'expire','eternal','finitude','corpse','funeral','dead','beyond'],
  meaning:   ['meaning','purpose','why','life','exist','sense','value','goal',
    'aim','worth','significance','reason','will','point','intention'],
  love:      ['love','passion','desire','longing','heart','beloved','affection',
    'tenderness','devotion','attraction','eros','romantic','soul'],
  freedom:   ['freedom','free','will','choice','liberation','slave','master',
    'bound','constraint','determination','necessity','autonomy'],
  truth:     ['truth','lie','false','deception','honest','real','illusion',
    'appearance','knowledge','fact','error','genuine','certainty'],
  god:       ['God','divine','holy','sacred','soul','heaven','faith','belief',
    'religion','spirit','eternal','prayer','deity','transcend'],
  beauty:    ['beautiful','beauty','art','aesthetic','sublime','elegant',
    'form','harmony','grace','wonder','ugliness','poetry','music']
}

function scoreSentence(text) {
  const lower = text.toLowerCase()
  let score = 0
  // Presence of philosophical terms
  for (const words of Object.values(TOPIC_KEYWORDS)) {
    for (const w of words) {
      if (lower.includes(w)) score++
    }
  }
  // Prefer standalone aphoristic length (60–250 chars)
  const len = text.length
  if (len >= 60 && len <= 180) score += 3
  else if (len > 180 && len <= 300) score += 1
  // Starts with capital (complete thought)
  if (/^[A-Z]/.test(text)) score++
  // Has first person philosophical voice
  if (/\b(I |we |one |man |life |soul )/i.test(text)) score++
  // Penalise HTML artefacts, chapter headers, footnote markers
  if (/[<>]|^\d+$|^[A-Z\s]{10,}$|\[|\]/.test(text)) score -= 10
  return score
}

function bestTopicForSentence(text) {
  const lower = text.toLowerCase()
  let best = 'meaning', bestScore = 0
  for (const [topic, words] of Object.entries(TOPIC_KEYWORDS)) {
    let s = 0
    for (const w of words) if (lower.includes(w)) s++
    if (s > bestScore) { bestScore = s; best = topic }
  }
  return best
}

function extractPassages(rawText, title, year, maxPerTopic = 12) {
  // Split on sentence boundaries
  const candidates = rawText
    .replace(/\r\n/g, '\n')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.replace(/\s+/g, ' ').trim())
    .filter(s => s.length >= 55 && s.length <= 350)
    .filter(s => !/^(chapter|part|book|section|\d)/i.test(s))
    .filter(s => !/[<>{}\[\]]/.test(s))

  // Score and sort
  const scored = candidates
    .map(text => ({ text, score: scoreSentence(text) }))
    .filter(s => s.score >= 3)
    .sort((a, b) => b.score - a.score)

  // Distribute across topics, up to maxPerTopic each
  const quotes = {}
  const seen = new Set()

  for (const { text } of scored) {
    const key = text.slice(0, 50)
    if (seen.has(key)) continue
    seen.add(key)
    const topic = bestTopicForSentence(text)
    if (!quotes[topic]) quotes[topic] = []
    if (quotes[topic].length < maxPerTopic) {
      quotes[topic].push({ text: text.replace(/\s+/g, ' ').trim(), source: title, year })
    }
  }

  return quotes
}

// ── EPUB text extraction ───────────────────────────────────────────────────────
async function extractEpubText(filePath) {
  const epubMod = require('../server/node_modules/epub2/lib/epub.js')
  const EPub = epubMod.EPub
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath)
    epub.on('end', () => {
      const ids = epub.flow.map(c => c.id)
      if (!ids.length) return resolve('')
      const texts = []
      let done = 0
      ids.forEach(id => {
        epub.getChapter(id, (err, text) => {
          if (!err && text) {
            texts.push(text.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' '))
          }
          done++
          if (done === ids.length) resolve(texts.join('\n'))
        })
      })
    })
    epub.on('error', reject)
    epub.parse()
  })
}

// ── Download helper ───────────────────────────────────────────────────────────
function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(dest); return }
    const file = fs.createWriteStream(dest)
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(dest)
        download(res.headers.location, dest).then(resolve).catch(reject)
        return
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        reject(new Error(`HTTP ${res.statusCode} for ${url}`))
        return
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve(dest)))
    })
    req.on('error', err => { fs.existsSync(dest) && fs.unlinkSync(dest); reject(err) })
  })
}

// ── Library persistence ────────────────────────────────────────────────────────
function loadLibrary() {
  try { return JSON.parse(fs.readFileSync(LIBRARY_PATH, 'utf8')) }
  catch { return { books: [] } }
}
function saveLibrary(lib) {
  fs.writeFileSync(LIBRARY_PATH, JSON.stringify(lib, null, 2))
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function processBook(book) {
  const dest = path.join(UPLOADS_DIR, book.filename)
  process.stdout.write(`\n📥 [${book.title}] Downloading…`)
  try {
    await download(book.url, dest)
    process.stdout.write(' ✓\n')
  } catch (e) {
    console.error(`   ✗ Download failed: ${e.message}`)
    return null
  }

  process.stdout.write(`   Extracting text…`)
  let rawText
  try {
    rawText = await extractEpubText(dest)
    process.stdout.write(` ${rawText.length.toLocaleString()} chars ✓\n`)
  } catch (e) {
    console.error(`   ✗ Extraction failed: ${e.message}`)
    return null
  }

  process.stdout.write(`   Finding passages…`)
  const quotes = extractPassages(rawText, book.title, book.year)
  const total = Object.values(quotes).reduce((s, a) => s + a.length, 0)
  process.stdout.write(` ${total} quotes across ${Object.keys(quotes).length} topics ✓\n`)

  return {
    id: uuidv4(),
    filename: book.filename,
    philosopher: book.philosopher,
    philosopherId: book.philosopherId,
    title: book.title,
    year: book.year,
    charCount: rawText.length,
    processedAt: new Date().toISOString(),
    quoteCount: total,
    quotes
  }
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Philosopher World — Book Ingestion Script')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const lib = loadLibrary()

  for (const book of BOOKS) {
    const result = await processBook(book)
    if (!result) continue

    // Replace existing entry for same title or append
    const idx = lib.books.findIndex(b => b.title === book.title && b.philosopherId === book.philosopherId)
    if (idx >= 0) lib.books[idx] = result
    else lib.books.push(result)

    saveLibrary(lib)  // save after each book so partial progress is kept
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  DONE — Library summary:')
  const byPhil = {}
  lib.books.forEach(b => {
    if (!byPhil[b.philosopher]) byPhil[b.philosopher] = { books: 0, quotes: 0 }
    byPhil[b.philosopher].books++
    byPhil[b.philosopher].quotes += b.quoteCount || 0
  })
  for (const [p, s] of Object.entries(byPhil)) {
    console.log(`  ${p.padEnd(22)} ${s.books} books  ${String(s.quotes).padStart(4)} quotes`)
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`\n  Saved → ${LIBRARY_PATH}`)
}

main().catch(console.error)
