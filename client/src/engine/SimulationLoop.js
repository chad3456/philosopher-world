import { PHILOSOPHERS, TOPICS, TOPIC_LABELS } from '../data/philosophers.js'

const WANDER_RADIUS = 8
const CONVERSATION_RANGE = 2.5
const WALK_SPEED = 0.018
const WANDER_INTERVAL = 6000
const QUOTE_DISPLAY_MS = 6500
const QUOTE_GAP_MS = 1200

function terrainHeight(x, z) {
  return Math.sin(x * 0.1) * 3 + Math.sin(z * 0.15) * 2 + Math.sin(x * 0.3 + z * 0.2) * 1 + 2
}

function lerp(a, b, t) { return a + (b - a) * t }
function dist2D(a, b) {
  const dx = a.x - b.x, dz = a.z - b.z
  return Math.sqrt(dx * dx + dz * dz)
}

let convIdCounter = 0
const usedQuotes = {}

function getQuote(philosopherId, topic) {
  const p = PHILOSOPHERS.find(p => p.id === philosopherId)
  if (!p) return null
  const quotes = p.quotes[topic] || p.quotes['meaning'] || p.quotes['suffering']
  if (!quotes || quotes.length === 0) return null

  const key = `${philosopherId}:${topic}`
  if (!usedQuotes[key]) usedQuotes[key] = []
  const used = usedQuotes[key]

  let available = quotes.filter((_, i) => !used.includes(i))
  if (available.length === 0) {
    usedQuotes[key] = []
    available = quotes
  }

  const idx = quotes.indexOf(available[Math.floor(Math.random() * available.length)])
  usedQuotes[key].push(idx)
  return quotes[idx]
}

export class SimulationLoop {
  constructor({ onMove, onConversationStart, onQuoteDelivered, onConversationEnd }) {
    this.onMove = onMove
    this.onConversationStart = onConversationStart
    this.onQuoteDelivered = onQuoteDelivered
    this.onConversationEnd = onConversationEnd

    this.speed = 1
    this.running = false
    this.tickTimer = null
    this.wanderTimer = null
    this.activeConversations = new Set()
    this.pendingQuotes = {}

    this.philosophers = {}
    PHILOSOPHERS.forEach(p => {
      const home = { x: p.position.x, z: p.position.z }
      home.y = terrainHeight(home.x, home.z)
      this.philosophers[p.id] = {
        id: p.id,
        pos: { x: home.x, y: home.y, z: home.z },
        home: { ...home },
        target: { x: home.x, y: home.y, z: home.z },
        state: 'wandering',
        partner: null,
        conversationId: null,
        waitTimer: 0
      }
    })
  }

  // Called by VillageCanvas after each quote's voice/display finishes
  quoteDone(convId, index) {
    const key = `${convId}-${index}`
    const resolve = this.pendingQuotes[key]
    if (resolve) {
      delete this.pendingQuotes[key]
      resolve()
    }
  }

  start() {
    this.running = true
    let last = Date.now()
    const tick = () => {
      if (!this.running) return
      const now = Date.now()
      const dt = Math.min((now - last) / 1000, 0.1) * this.speed
      last = now
      this._tick(dt)
      this.tickTimer = setTimeout(tick, 50)
    }
    tick()

    const wander = () => {
      if (!this.running) return
      this._assignWanderTargets()
      this.wanderTimer = setTimeout(wander, WANDER_INTERVAL / this.speed)
    }
    wander()
  }

  stop() {
    this.running = false
    clearTimeout(this.tickTimer)
    clearTimeout(this.wanderTimer)
  }

  setSpeed(s) {
    this.speed = s
  }

  _tick(dt) {
    const ids = Object.keys(this.philosophers)

    // Move philosophers
    for (const id of ids) {
      const p = this.philosophers[id]
      if (p.state === 'talking') continue

      const dx = p.target.x - p.pos.x
      const dz = p.target.z - p.pos.z
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist > 0.1) {
        const speed = WALK_SPEED * 60 * dt
        const step = Math.min(speed, dist)
        p.pos.x += (dx / dist) * step
        p.pos.z += (dz / dist) * step
        p.pos.y = terrainHeight(p.pos.x, p.pos.z)
        this.onMove(id, { ...p.pos }, p.state)
      }
    }

    // Check for new conversations
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const p1 = this.philosophers[ids[i]]
        const p2 = this.philosophers[ids[j]]
        if (p1.state !== 'wandering' || p2.state !== 'wandering') continue
        if (dist2D(p1.pos, p2.pos) < CONVERSATION_RANGE) {
          this._startConversation(p1.id, p2.id)
        }
      }
    }
  }

  _assignWanderTargets() {
    for (const id of Object.keys(this.philosophers)) {
      const p = this.philosophers[id]
      if (p.state !== 'wandering') continue

      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * WANDER_RADIUS
      const tx = p.home.x + Math.cos(angle) * radius
      const tz = p.home.z + Math.sin(angle) * radius
      p.target = { x: tx, y: terrainHeight(tx, tz), z: tz }
    }
  }

  _startConversation(p1Id, p2Id) {
    const p1 = this.philosophers[p1Id]
    const p2 = this.philosophers[p2Id]

    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]
    const topicLabel = TOPIC_LABELS[topic]

    const q1 = getQuote(p1Id, topic)
    const q2 = getQuote(p2Id, topic)
    const q3 = getQuote(p1Id, topic)

    if (!q1 || !q2) return

    const quotes = [
      { speaker: p1Id, ...q1 },
      { speaker: p2Id, ...q2 },
    ]
    if (q3) quotes.push({ speaker: p1Id, ...q3 })

    const convId = `conv-${++convIdCounter}`
    p1.state = 'talking'
    p2.state = 'talking'
    p1.partner = p2Id
    p2.partner = p1Id
    p1.conversationId = convId
    p2.conversationId = convId

    // Move them close together
    const midX = (p1.pos.x + p2.pos.x) / 2
    const midZ = (p1.pos.z + p2.pos.z) / 2
    const offset = 1.0
    p1.target = { x: midX - offset, y: terrainHeight(midX - offset, midZ), z: midZ }
    p2.target = { x: midX + offset, y: terrainHeight(midX + offset, midZ), z: midZ }

    this.activeConversations.add(convId)

    const p1Data = PHILOSOPHERS.find(p => p.id === p1Id)
    const p2Data = PHILOSOPHERS.find(p => p.id === p2Id)

    this.onConversationStart({
      id: convId,
      p1: { id: p1Id, name: p1Data.name, color: p1Data.color },
      p2: { id: p2Id, name: p2Data.name, color: p2Data.color },
      topic,
      topicLabel,
      quotes,
      timestamp: new Date().toISOString()
    })

    // Sequential turn-based quote delivery
    const deliverNext = (quoteIndex) => {
      if (!this.activeConversations.has(convId)) return

      if (quoteIndex >= quotes.length) {
        this._endConversation(convId, p1Id, p2Id)
        return
      }

      const q = quotes[quoteIndex]
      const speakerId = q.speaker
      const listenerId = speakerId === p1Id ? p2Id : p1Id

      this.onQuoteDelivered(convId, quoteIndex, q, speakerId, listenerId)

      // Store resolver — VillageCanvas calls quoteDone() when voice finishes
      this.pendingQuotes[`${convId}-${quoteIndex}`] = () => {
        setTimeout(() => deliverNext(quoteIndex + 1), 800 / Math.max(1, this.speed))
      }

      // Safety fallback: if quoteDone is never called (no voice system), advance after timeout
      const safetyMs = (QUOTE_DISPLAY_MS + QUOTE_GAP_MS + 20000) / Math.max(1, this.speed)
      setTimeout(() => {
        this.quoteDone(convId, quoteIndex)
      }, safetyMs)
    }

    // Small delay before first quote so philosophers can walk toward each other
    setTimeout(() => deliverNext(0), 800 / Math.max(1, this.speed))
  }

  _endConversation(convId, p1Id, p2Id) {
    const p1 = this.philosophers[p1Id]
    const p2 = this.philosophers[p2Id]
    if (p1) {
      p1.state = 'wandering'
      p1.partner = null
      p1.conversationId = null
      p1.target = { ...p1.home }
    }
    if (p2) {
      p2.state = 'wandering'
      p2.partner = null
      p2.conversationId = null
      p2.target = { ...p2.home }
    }
    this.activeConversations.delete(convId)
    this.onConversationEnd(convId)
  }
}
