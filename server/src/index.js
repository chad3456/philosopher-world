import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { converseRoute } from './routes/converse.js'
import { uploadRoute } from './routes/upload.js'
import { getPhilosopherResponse } from './agents/PhilosopherAgent.js'
import { PHILOSOPHERS, pickConversationTopic, TOPIC_LABELS } from '../../shared/philosophersData.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

app.use(cors())
app.use(express.json())

// Serve upload UI at /upload
app.use('/upload', express.static(path.join(__dirname, '../public')))
app.get('/upload', (_req, res) => res.sendFile(path.join(__dirname, '../public/upload.html')))

// Routes
app.use('/api', converseRoute)
app.use('/api', uploadRoute)

// Socket.io — track connected clients and support real-time conversations
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Client can request a conversation to be streamed back via socket events
  socket.on('request_conversation', async (data) => {
    const { p1Id, p2Id, topic: requestedTopic } = data || {}

    const p1 = PHILOSOPHERS.find(p => p.id === p1Id)
    const p2 = PHILOSOPHERS.find(p => p.id === p2Id)

    if (!p1 || !p2) {
      socket.emit('conversation_error', { error: 'Invalid philosopher IDs' })
      return
    }

    const topic = requestedTopic || pickConversationTopic(p1Id, p2Id)
    const topicLabel = TOPIC_LABELS[topic]
    const conversationId = `${Date.now()}-${p1Id}-${p2Id}`

    socket.emit('conversation_start', {
      id: conversationId,
      p1: { id: p1.id, name: p1.name, color: p1.color },
      p2: { id: p2.id, name: p2.name, color: p2.color },
      topic,
      topicLabel,
      timestamp: new Date().toISOString()
    })

    try {
      // p1 opens
      const q1 = await getPhilosopherResponse(p1Id, topic, null, [])
      socket.emit('quote_delivered', {
        conversationId,
        speaker: p1Id,
        speakerName: p1.name,
        speakerColor: p1.color,
        index: 0,
        ...q1
      })

      // p2 responds
      const q2 = await getPhilosopherResponse(p2Id, topic, q1.text, [q1])
      socket.emit('quote_delivered', {
        conversationId,
        speaker: p2Id,
        speakerName: p2.name,
        speakerColor: p2.color,
        index: 1,
        ...q2
      })

      // p1 responds again
      const q3 = await getPhilosopherResponse(p1Id, topic, q2.text, [q1, q2])
      socket.emit('quote_delivered', {
        conversationId,
        speaker: p1Id,
        speakerName: p1.name,
        speakerColor: p1.color,
        index: 2,
        ...q3
      })

      socket.emit('conversation_end', {
        conversationId,
        quotes: [
          { speaker: p1Id, speakerName: p1.name, speakerColor: p1.color, ...q1 },
          { speaker: p2Id, speakerName: p2.name, speakerColor: p2.color, ...q2 },
          { speaker: p1Id, speakerName: p1.name, speakerColor: p1.color, ...q3 }
        ]
      })
    } catch (err) {
      console.error('Socket conversation error:', err)
      socket.emit('conversation_error', { conversationId, error: err.message })
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => console.log(`Philosopher server running on :${PORT}`))

export { io }
