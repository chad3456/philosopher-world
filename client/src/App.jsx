import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { VillageCanvas } from './components/VillageCanvas'
import { ConversationFeed } from './components/ConversationFeed'
import { TopBar } from './components/TopBar'
import { PhilosopherCard } from './components/PhilosopherCard'
import { PhilosopherSelector } from './components/PhilosopherSelector'
import { TopicRooms } from './components/TopicRooms'
import { PHILOSOPHERS, TOPICS } from './data/philosophers.js'

export default function App() {
  const [conversations, setConversations] = useState([])
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null)
  const [speed, setSpeed] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showSelector, setShowSelector] = useState(false)
  const [followedId, setFollowedId] = useState(null)
  const [tunedTopic, setTunedTopic] = useState(null)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const voiceSystemRef = useRef(null)
  const conversationsMapRef = useRef(new Map())

  const followedPhilosopher = followedId ? PHILOSOPHERS.find(p => p.id === followedId) : null

  // Conversation stats per topic: {count, active}
  const topicStats = useMemo(() => {
    const stats = {}
    TOPICS.forEach(t => { stats[t] = { count: 0, active: false } })
    conversations.forEach(c => {
      if (!stats[c.topic]) stats[c.topic] = { count: 0, active: false }
      stats[c.topic].count++
      if (c.active) stats[c.topic].active = true
    })
    return stats
  }, [conversations])

  const handleVoiceToggle = useCallback(() => {
    if (voiceSystemRef.current) {
      const enabled = voiceSystemRef.current.toggle()
      setVoiceEnabled(enabled)
    } else {
      setVoiceEnabled(v => !v)
    }
  }, [])

  const handleVoiceReady = useCallback((voiceSystem) => {
    voiceSystemRef.current = voiceSystem
  }, [])

  useEffect(() => {
    const t = setTimeout(() => { setLoading(false); setShowSelector(true) }, 1200)
    return () => clearTimeout(t)
  }, [])

  const handleSelect = useCallback((id) => {
    setFollowedId(id)
    if (id) setTunedTopic(null)  // entering follow mode clears topic room
    setShowSelector(false)
  }, [])

  const handleTune = useCallback((topic) => {
    setTunedTopic(topic)
    if (topic) setFollowedId(null)  // entering topic room clears follow mode
  }, [])

  const handleConversationStart = useCallback((conv) => {
    const entry = {
      id: conv.id,
      p1: { id: conv.p1.id, name: conv.p1.name, color: conv.p1.color },
      p2: { id: conv.p2.id, name: conv.p2.name, color: conv.p2.color },
      topic: conv.topic,
      topicLabel: conv.topicLabel,
      quotes: [],
      timestamp: conv.timestamp,
      active: true,
      isForeground: conv.isForeground !== false
    }
    conversationsMapRef.current.set(conv.id, entry)
    setConversations(prev => [entry, ...prev].slice(0, 30))
  }, [])

  const handleQuoteDelivered = useCallback((convId, index, quote) => {
    const existing = conversationsMapRef.current.get(convId)
    if (!existing) return
    const speakerPhil = PHILOSOPHERS.find(p => p.id === quote.speaker)
    const richQuote = { ...quote, speakerName: speakerPhil?.name || quote.speaker }
    const updated = { ...existing, quotes: [...existing.quotes, richQuote] }
    conversationsMapRef.current.set(convId, updated)
    setConversations(prev => prev.map(c => c.id === convId ? updated : c))
  }, [])

  const handleConversationEnd = useCallback((convId) => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, active: false } : c))
  }, [])

  const activeCount = conversations.filter(c => c.active).length

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a0a' }}>
      <div className={`loading-overlay${loading ? '' : ' hidden'}`}>
        <div className="loading-title">Philosopher's Village</div>
        <div className="loading-sub">Summoning the great thinkers…</div>
        <div className="loading-dots">
          <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
        </div>
      </div>

      {showSelector && <PhilosopherSelector onSelect={handleSelect} />}

      <TopBar
        speed={speed} onSpeedChange={setSpeed} activeCount={activeCount}
        voiceEnabled={voiceEnabled} onVoiceToggle={handleVoiceToggle}
        followedPhilosopher={followedPhilosopher}
        onChangePhilosopher={() => setShowSelector(true)}
      />

      <VillageCanvas
        speed={speed}
        onConversationStart={handleConversationStart}
        onQuoteDelivered={handleQuoteDelivered}
        onConversationEnd={handleConversationEnd}
        onPhilosopherSelect={setSelectedPhilosopher}
        voiceEnabled={voiceEnabled}
        onVoiceReady={handleVoiceReady}
        followedId={followedId}
        tunedTopic={tunedTopic}
      />

      <ConversationFeed
        conversations={conversations}
        followedId={followedId}
        tunedTopic={tunedTopic}
      />

      <TopicRooms
        tunedTopic={tunedTopic}
        onTune={handleTune}
        topicStats={topicStats}
      />

      {selectedPhilosopher && (
        <PhilosopherCard
          philosopher={selectedPhilosopher}
          onClose={() => setSelectedPhilosopher(null)}
        />
      )}
    </div>
  )
}
