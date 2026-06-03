import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { processBook, getLibrary } from '../agents/BookProcessor.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '../../uploads')

// Ensure uploads dir exists
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    const unique = `${Date.now()}-${safe}`
    cb(null, unique)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.epub']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error(`Only .pdf and .epub files are accepted (got ${ext})`))
  }
})

export const uploadRoute = Router()

// ── GET /api/library — list processed books ──────────────────────────────────
uploadRoute.get('/library', (_req, res) => {
  const lib = getLibrary()
  res.json(lib)
})

// ── POST /api/upload — upload + process a book ───────────────────────────────
// Uses SSE so the UI gets real-time progress without polling
uploadRoute.post('/upload', (req, res) => {
  // Set up SSE before multer runs so we can stream errors too
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const emit = (msg) => {
    res.write(`data: ${JSON.stringify({ msg })}\n\n`)
  }

  const done = (payload) => {
    res.write(`data: ${JSON.stringify({ done: true, ...payload })}\n\n`)
    res.end()
  }

  const fail = (error) => {
    res.write(`data: ${JSON.stringify({ error })}\n\n`)
    res.end()
  }

  // Run multer manually so we can keep the SSE connection
  upload.single('file')(req, res, async (err) => {
    if (err) return fail(err.message)
    if (!req.file) return fail('No file received')

    const { path: filePath, originalname, mimetype } = req.file
    const philosopherHint = req.body.philosopher || null

    emit(`📥 Received: ${originalname} (${(req.file.size / 1024).toFixed(1)} KB)`)

    try {
      const result = await processBook(
        { filePath, originalName: originalname, mimeType: mimetype, philosopherHint },
        emit
      )
      done({
        philosopher: result.philosopher,
        philosopherId: result.philosopherId,
        title: result.title,
        quoteCount: result.quoteCount,
        topics: Object.keys(result.quotes || {})
      })
    } catch (e) {
      fail(`Processing error: ${e.message}`)
    }
  })
})

// ── DELETE /api/library/:id — remove a book ──────────────────────────────────
uploadRoute.delete('/library/:id', (req, res) => {
  const lib = getLibrary()
  const before = lib.books.length
  lib.books = lib.books.filter(b => b.id !== req.params.id)
  if (lib.books.length === before) return res.status(404).json({ error: 'Book not found' })

  const { writeFileSync } = fs
  const libPath = path.join(__dirname, '../../processed/library.json')
  writeFileSync(libPath, JSON.stringify(lib, null, 2))
  res.json({ ok: true, remaining: lib.books.length })
})
