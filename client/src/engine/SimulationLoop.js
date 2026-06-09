import { PHILOSOPHERS, TOPICS, TOPIC_LABELS, TOPIC_FALLBACK } from '../data/philosophers.js'

const WANDER_RADIUS = 8
const CONVERSATION_RANGE = 2.5
const WALK_SPEED = 0.018
const WANDER_INTERVAL = 6000

function terrainHeight(x, z) {
  return Math.sin(x * 0.1) * 3 + Math.sin(z * 0.15) * 2 + Math.sin(x * 0.3 + z * 0.2) * 1 + 2
}

function lerp(a, b, t) { return a + (b - a) * t }
function dist2D(a, b) {
  const dx = a.x - b.x, dz = a.z - b.z
  return Math.sqrt(dx * dx + dz * dz)
}

let convIdCounter = 0

// Local fallback: pick quotes from relevant classic categories
function localQuotes(p1Id, p2Id, topic) {
  function pickQuote(philId) {
    const p = PHILOSOPHERS.find(p => p.id === philId)
    if (!p) return null
    const cats = TOPIC_FALLBACK[topic] || ['meaning', 'suffering']
    for (const cat of cats) {
      const pool = p.quotes[cat]
      if (pool && pool.length > 0) return pool[Math.floor(Math.random() * pool.length)]
    }
    const all = Object.values(p.quotes).flat()
    return all[Math.floor(Math.random() * all.length)] || { text: '...', source: 'Unknown', year: null }
  }
  const q1 = pickQuote(p1Id)
  const q2 = pickQuote(p2Id)
  const q3 = pickQuote(p1Id)
  return [
    { speaker: p1Id, bridge: null, ...q1 },
    { speaker: p2Id, bridge: null, ...q2 },
    ...(q3 ? [{ speaker: p1Id, bridge: null, ...q3 }] : [])
  ]
}

export class SimulationLoop {
  constructor({ onMove, onConversationStart, onQuoteDelivered, onConversationEnd, onConversationRequest }) {
    this.onMove = onMove
    this.onConversationStart = onConversationStart
    this.onQuoteDelivered = onQuoteDelivered
    this.onConversationEnd = onConversationEnd
    this.onConversationRequest = onConversationRequest  // async: (p1Id, p2Id, topic) => quotes[]

    this.speed = 1
    this.running = false
    this.tickTimer = null
    this.wanderTimer = null
    this.activeConversations = new Set()
    this.pendingQuotes = {}
    this.followedId = null
    this.tunedTopic = null
    this.pendingRequests = new Set()  // p1Id:p2Id pairs awaiting server response

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
        conversationId: null
      }
    })
  }

  setFollowedPhilosopher(id) { this.followedId = id }
  setTunedTopic(topic) { this.tunedTopic = topic }

  _isForeground(p1Id, p2Id, topic) {
    if (this.tunedTopic) return topic === this.tunedTopic
    if (this.followedId) return p1Id === this.followedId || p2Id === this.followedId
    return true
  }

  quoteDone(convId, index) {
    const key = `${convId}-${index}`
    const resolve = this.pendingQuotes[key]
    if (resolve) {
      delete this.pendingQuotes[key]
      resolve()
    }
  }

  // Called by VillageCanvas after fetching quotes from server (or local fallback)
  beginConversation(p1Id, p2Id, topic, topicLabel, quotes) {
    const p1 = this.philosophers[p1Id]
    const p2 = this.philosophers[p2Id]
    if (!p1 || !p2) return

    const convId = `conv-${++convIdCounter}`
    p1.state = 'talking'; p2.state = 'talking'
    p1.partner = p2Id; p2.partner = p1Id
    p1.conversationId = convId; p2.conversationId = convId

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
      topic, topicLabel, quotes,
      timestamp: new Date().toISOString(),
      isForeground: this._isForeground(p1Id, p2Id, topic)
    })

    const deliverNext = (quoteIndex) => {
      if (!this.activeConversations.has(convId)) return

      if (quoteIndex >= quotes.length) {
        this._endConversation(convId, p1Id, p2Id)
        return
      }

      const q = quotes[quoteIndex]
      const speakerId = q.speaker
      const listenerId = speakerId === p1Id ? p2Id : p1Id
      // Check dynamically so user can tune in mid-conversation
      const isForeground = this._isForeground(p1Id, p2Id, topic)

      this.onQuoteDelivered(convId, quoteIndex, q, speakerId, listenerId, isForeground)

      this.pendingQuotes[`${convId}-${quoteIndex}`] = () => {
        setTimeout(() => deliverNext(quoteIndex + 1), 800 / Math.max(1, this.speed))
      }

      // Safety fallback so simulation never stalls
      const safetyMs = 28000 / Math.max(1, this.speed)
      setTimeout(() => this.quoteDone(convId, quoteIndex), safetyMs)
    }

    setTimeout(() => deliverNext(0), 800 / Math.max(1, this.speed))
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

  setSpeed(s) { this.speed = s }

  _tick(dt) {
    const ids = Object.keys(this.philosophers)

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

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const p1 = this.philosophers[ids[i]]
        const p2 = this.philosophers[ids[j]]
        if (p1.state !== 'wandering' || p2.state !== 'wandering') continue

        const key = `${p1.id}:${p2.id}`
        if (this.pendingRequests.has(key)) continue

        if (dist2D(p1.pos, p2.pos) < CONVERSATION_RANGE) {
          this._requestConversation(p1.id, p2.id)
        }
      }
    }
  }

  _requestConversation(p1Id, p2Id) {
    const key = `${p1Id}:${p2Id}`
    this.pendingRequests.add(key)

    // Lock both into 'waiting' so they don't walk away
    this.philosophers[p1Id].state = 'talking'
    this.philosophers[p2Id].state = 'talking'

    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]
    const topicLabel = TOPIC_LABELS[topic]

    if (this.onConversationRequest) {
      this.onConversationRequest(p1Id, p2Id, topic, topicLabel)
        .then(quotes => {
          this.pendingRequests.delete(key)
          this.beginConversation(p1Id, p2Id, topic, topicLabel, quotes)
        })
        .catch(() => {
          this.pendingRequests.delete(key)
          const fallback = localQuotes(p1Id, p2Id, topic)
          this.beginConversation(p1Id, p2Id, topic, topicLabel, fallback)
        })
    } else {
      this.pendingRequests.delete(key)
      const fallback = localQuotes(p1Id, p2Id, topic)
      this.beginConversation(p1Id, p2Id, topic, topicLabel, fallback)
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

  _endConversation(convId, p1Id, p2Id) {
    const p1 = this.philosophers[p1Id]
    const p2 = this.philosophers[p2Id]
    if (p1) { p1.state = 'wandering'; p1.partner = null; p1.conversationId = null; p1.target = { ...p1.home } }
    if (p2) { p2.state = 'wandering'; p2.partner = null; p2.conversationId = null; p2.target = { ...p2.home } }
    this.activeConversations.delete(convId)
    this.onConversationEnd(convId)
  }
}
