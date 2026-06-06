import { Router } from 'express'
import { getPhilosopherResponse } from '../agents/PhilosopherAgent.js'
import { PHILOSOPHERS, TOPIC_LABELS, pickConversationTopic } from '../../../shared/philosophersData.js'

export const converseRoute = Router()

// POST /api/converse
// Body: { p1Id, p2Id, topic? }
// Returns: full conversation exchange with 3 quotes
converseRoute.post('/converse', async (req, res) => {
  const { p1Id, p2Id, topic: requestedTopic } = req.body

  const p1 = PHILOSOPHERS.find(p => p.id === p1Id)
  const p2 = PHILOSOPHERS.find(p => p.id === p2Id)

  if (!p1 || !p2) {
    return res.status(400).json({ error: 'Invalid philosopher IDs' })
  }

  const topic = requestedTopic || pickConversationTopic(p1Id, p2Id)
  const topicLabel = TOPIC_LABELS[topic]

  try {
    // Generate alternating conversation: p1 opens, p2 responds, p1 responds
    const q1 = await getPhilosopherResponse(p1Id, topic, topicLabel, null, [])
    const q2 = await getPhilosopherResponse(p2Id, topic, topicLabel, q1.text, [q1])
    const q3 = await getPhilosopherResponse(p1Id, topic, topicLabel, q2.text, [q1, q2])

    const conversation = {
      id: `${Date.now()}-${p1Id}-${p2Id}`,
      p1: { id: p1.id, name: p1.name, color: p1.color },
      p2: { id: p2.id, name: p2.name, color: p2.color },
      topic,
      topicLabel,
      timestamp: new Date().toISOString(),
      quotes: [
        { speaker: p1Id, speakerName: p1.name, speakerColor: p1.color, ...q1 },
        { speaker: p2Id, speakerName: p2.name, speakerColor: p2.color, ...q2 },
        { speaker: p1Id, speakerName: p1.name, speakerColor: p1.color, ...q3 }
      ]
    }

    res.json(conversation)
  } catch (err) {
    console.error('Conversation error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/philosophers
converseRoute.get('/philosophers', (req, res) => {
  res.json(
    PHILOSOPHERS.map(p => ({
      id: p.id,
      name: p.name,
      years: p.years,
      nationality: p.nationality,
      color: p.color,
      bio: p.bio,
      position: p.position
    }))
  )
})

// GET /api/health
converseRoute.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    philosophers: PHILOSOPHERS.length,
    hasApiKey: !!process.env.ANTHROPIC_API_KEY
  })
})
