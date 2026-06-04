import React, { useState, useCallback, useEffect, useRef } from 'react'
import { VillageCanvas } from './components/VillageCanvas'
import { ConversationFeed } from './components/ConversationFeed'
import { TopBar } from './components/TopBar'
import { PhilosopherCard } from './components/PhilosopherCard'
import { PHILOSOPHERS } from './data/philosophers.js'

export default function App() {
  const [conversations, setConversations] = useState([])
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null)
  const [speed, setSpeed] = useState(1)
  const [loading, setLoading] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const voiceSystemRef = useRef(null)

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

  // Map from convId -> conversation object (for updating quotes as they arrive)
  const conversationsMapRef = useRef(new Map())

  useEffect(() => {
    // Hide loading after a short delay
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const handleConversationStart = useCallback((conv) => {
    // Build initial conversation entry with empty visible quotes
    const entry = {
      id: conv.id,
      p1: {
        id: conv.p1.id,
        name: conv.p1.name,
        color: conv.p1.color
      },
      p2: {
        id: conv.p2.id,
        name: conv.p2.name,
        color: conv.p2.color
      },
      topic: conv.topic,
      topicLabel: conv.topicLabel,
      quotes: [],
      allQuotes: conv.quotes,
      timestamp: conv.timestamp,
      active: true
    }

    conversationsMapRef.current.set(conv.id, entry)

    setConversations((prev) => [entry, ...prev].slice(0, 20))
  }, [])

  const handleQuoteDelivered = useCallback((convId, index, quote) => {
    const existing = conversationsMapRef.current.get(convId)
    if (!existing) return

    // Find full philosopher data for the speaker
    const speakerPhil = PHILOSOPHERS.find((p) => p.id === quote.speaker)
    const richQuote = {
      ...quote,
      speakerName: speakerPhil?.name || quote.speaker
    }

    const updated = {
      ...existing,
      quotes: [...existing.quotes, richQuote]
    }
    conversationsMapRef.current.set(convId, updated)

    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? updated : c))
    )
  }, [])

  const handleConversationEnd = useCallback((convId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, active: false } : c))
    )
  }, [])

  const activeCount = conversations.filter((c) => c.active).length

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a0a' }}>
      {/* Loading screen */}
      <div className={`loading-overlay${loading ? '' : ' hidden'}`}>
        <div className="loading-title">Philosopher's Village</div>
        <div className="loading-sub">Summoning the great thinkers…</div>
        <div className="loading-dots">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      </div>

      <TopBar
        speed={speed}
        onSpeedChange={setSpeed}
        activeCount={activeCount}
        voiceEnabled={voiceEnabled}
        onVoiceToggle={handleVoiceToggle}
      />

      <VillageCanvas
        speed={speed}
        onConversationStart={handleConversationStart}
        onQuoteDelivered={handleQuoteDelivered}
        onConversationEnd={handleConversationEnd}
        onPhilosopherSelect={setSelectedPhilosopher}
        voiceEnabled={voiceEnabled}
        onVoiceReady={handleVoiceReady}
      />

      <ConversationFeed conversations={conversations} />

      {selectedPhilosopher && (
        <PhilosopherCard
          philosopher={selectedPhilosopher}
          onClose={() => setSelectedPhilosopher(null)}
        />
      )}
    </div>
  )
}
