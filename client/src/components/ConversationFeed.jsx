import React, { useEffect, useRef } from 'react'

function timeAgo(timestamp) {
  const now = new Date()
  const diff = Math.floor((now - new Date(timestamp)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function ConversationItem({ conversation }) {
  const { p1, p2, topic, topicLabel, quotes, timestamp, active } = conversation

  const topicColors = {
    suffering: '#ef4444',
    death: '#6b7280',
    meaning: '#8b5cf6',
    love: '#ec4899',
    freedom: '#22c55e',
    truth: '#3b82f6',
    god: '#f59e0b',
    beauty: '#06b6d4'
  }
  const topicColor = topicColors[topic] || '#6b7280'

  return (
    <div
      className={`conversation-item ${active ? 'active' : ''}`}
      style={{ '--speaker-color': p1.color }}
    >
      <div className="conv-header">
        <div className="conv-avatars">
          <div
            className="conv-avatar"
            style={{ background: p1.color }}
            title={p1.name}
          >
            {p1.name.charAt(0)}
          </div>
          <div
            className="conv-avatar"
            style={{ background: p2.color }}
            title={p2.name}
          >
            {p2.name.charAt(0)}
          </div>
        </div>
        <span
          className="conv-topic-badge"
          style={{ background: `${topicColor}22`, color: topicColor, border: `1px solid ${topicColor}44` }}
        >
          {topicLabel}
        </span>
        <span className="conv-time">{timeAgo(timestamp)}</span>
      </div>

      <div className="conv-quotes">
        {quotes.map((quote, i) => {
          const speakerData = quote.speaker === p1.id ? p1 : p2
          return (
            <div
              key={i}
              className="conv-quote"
              style={{ borderLeftColor: speakerData.color }}
            >
              <div className="conv-quote-speaker" style={{ color: speakerData.color }}>
                {speakerData.name.split(' ').pop()}
              </div>
              <div className="conv-quote-text">
                &ldquo;{quote.text}&rdquo;
              </div>
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

export function ConversationFeed({ conversations }) {
  const scrollRef = useRef(null)

  // Auto-scroll to top when new conversation added
  useEffect(() => {
    if (scrollRef.current && conversations.length > 0) {
      scrollRef.current.scrollTop = 0
    }
  }, [conversations.length])

  return (
    <div className="conversation-feed">
      <div className="feed-header">
        ✦ Dialogues
      </div>
      <div className="feed-scroll" ref={scrollRef}>
        {conversations.length === 0 ? (
          <div className="feed-empty">
            <div className="feed-empty-icon">🏛️</div>
            <div>The philosophers are gathering…</div>
          </div>
        ) : (
          conversations.slice(0, 15).map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))
        )}
      </div>
    </div>
  )
}
