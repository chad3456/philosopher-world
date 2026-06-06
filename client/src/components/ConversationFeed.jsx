import React, { useEffect, useRef, useState } from 'react'
import { PHILOSOPHERS } from '../data/philosophers.js'

const TOPIC_COLORS = {
  suffering: '#ef4444',
  death: '#6b7280',
  meaning: '#8b5cf6',
  love: '#ec4899',
  freedom: '#22c55e',
  truth: '#3b82f6',
  god: '#f59e0b',
  beauty: '#06b6d4'
}

function timeAgo(timestamp) {
  const now = new Date()
  const diff = Math.floor((now - new Date(timestamp)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function ConversationItem({ conversation, compact = false }) {
  const { p1, p2, topic, topicLabel, quotes, timestamp, active } = conversation
  const topicColor = TOPIC_COLORS[topic] || '#6b7280'

  if (compact) {
    // Background conversation: minimal one-liner
    return (
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', gap: 8,
        opacity: 0.55
      }}>
        <div style={{ display: 'flex', gap: -4 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: p1.color, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{p1.name[0]}</div>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: p2.color, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, marginLeft: -4 }}>{p2.name[0]}</div>
        </div>
        <span style={{ fontSize: 11, color: '#7a7060', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {p1.name.split(' ').pop()} &amp; {p2.name.split(' ').pop()}
        </span>
        <span style={{ fontSize: 10, color: topicColor, opacity: 0.8 }}>{topicLabel}</span>
        {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />}
      </div>
    )
  }

  return (
    <div
      className={`conversation-item ${active ? 'active' : ''}`}
      style={{ '--speaker-color': p1.color }}
    >
      <div className="conv-header">
        <div className="conv-avatars">
          <div className="conv-avatar" style={{ background: p1.color }} title={p1.name}>{p1.name.charAt(0)}</div>
          <div className="conv-avatar" style={{ background: p2.color }} title={p2.name}>{p2.name.charAt(0)}</div>
        </div>
        <span className="conv-topic-badge" style={{ background: `${topicColor}22`, color: topicColor, border: `1px solid ${topicColor}44` }}>
          {topicLabel}
        </span>
        <span className="conv-time">{timeAgo(timestamp)}</span>
      </div>

      <div className="conv-quotes">
        {quotes.map((quote, i) => {
          const speakerData = quote.speaker === p1.id ? p1 : p2
          return (
            <div key={i} className="conv-quote" style={{ borderLeftColor: speakerData.color }}>
              <div className="conv-quote-speaker" style={{ color: speakerData.color }}>
                {speakerData.name.split(' ').pop()}
              </div>
              {quote.bridge && (
                <div style={{
                  fontSize: 12, color: '#9a8870', fontStyle: 'italic',
                  marginBottom: 4, lineHeight: 1.5
                }}>
                  {quote.bridge}
                </div>
              )}
              <div className="conv-quote-text">&ldquo;{quote.text}&rdquo;</div>
              {quote.source && (
                <div className="conv-quote-source">
                  — {quote.source}{quote.year ? `, ${quote.year < 0 ? Math.abs(quote.year) + ' BC' : quote.year}` : ''}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ConversationFeed({ conversations, followedId }) {
  const scrollRef = useRef(null)
  const [bgCollapsed, setBgCollapsed] = useState(false)

  const followedPhil = followedId ? PHILOSOPHERS.find(p => p.id === followedId) : null

  // Separate foreground and background
  const fgConvs = followedId
    ? conversations.filter(c => c.isForeground)
    : conversations
  const bgConvs = followedId
    ? conversations.filter(c => !c.isForeground)
    : []

  useEffect(() => {
    if (scrollRef.current && fgConvs.length > 0) {
      scrollRef.current.scrollTop = 0
    }
  }, [fgConvs.length])

  const activeFg = fgConvs.find(c => c.active)

  return (
    <div className="conversation-feed">
      <div className="feed-header">
        {followedId && followedPhil ? (
          <span>
            <span style={{ color: followedPhil.color }}>●</span>
            {' '}Following {followedPhil.name.split(' ').pop()}
          </span>
        ) : '✦ Dialogues'}
      </div>

      <div className="feed-scroll" ref={scrollRef}>
        {/* FOREGROUND — full detail */}
        {followedId && !activeFg && (
          <div className="feed-empty" style={{ padding: '24px 16px' }}>
            <div className="feed-empty-icon">🚶</div>
            <div style={{ fontSize: 13 }}>
              {followedPhil?.name.split(' ').pop()} is wandering…<br />
              <span style={{ color: '#5a5048', fontSize: 11 }}>A conversation will begin when they meet someone.</span>
            </div>
          </div>
        )}

        {fgConvs.slice(0, 8).map((conv) => (
          <ConversationItem key={conv.id} conversation={conv} compact={false} />
        ))}

        {/* BACKGROUND conversations — compact list */}
        {bgConvs.length > 0 && (
          <div>
            <button
              onClick={() => setBgCollapsed(v => !v)}
              style={{
                width: '100%', background: 'none', border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderBottom: bgCollapsed ? 'none' : '1px solid rgba(255,255,255,0.06)',
                padding: '8px 12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                color: '#5a5048', fontSize: 11, letterSpacing: 1
              }}
            >
              <span>BACKGROUND DIALOGUES</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  background: '#3a3028', borderRadius: 10, padding: '1px 7px', fontSize: 10, color: '#8a7060'
                }}>{bgConvs.length}</span>
                {bgCollapsed ? '▸' : '▾'}
              </span>
            </button>
            {!bgCollapsed && bgConvs.slice(0, 12).map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} compact={true} />
            ))}
          </div>
        )}

        {/* Spectate mode — all conversations */}
        {!followedId && conversations.length === 0 && (
          <div className="feed-empty">
            <div className="feed-empty-icon">🏛️</div>
            <div>The philosophers are gathering…</div>
          </div>
        )}
      </div>
    </div>
  )
}
