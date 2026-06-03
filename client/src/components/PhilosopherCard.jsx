import React from 'react'
import { TOPICS, TOPIC_LABELS } from '../data/philosophers.js'

export function PhilosopherCard({ philosopher, onClose, recentQuotes }) {
  if (!philosopher) return null

  const { name, years, nationality, bio, color, quotes } = philosopher

  // Count total quotes by topic
  const topicCounts = TOPICS.filter((t) => quotes[t] && quotes[t].length > 0).map((t) => ({
    topic: t,
    label: TOPIC_LABELS[t],
    count: quotes[t].length
  }))

  // Get a few sample quotes
  const sampleQuotes = []
  TOPICS.forEach((topic) => {
    if (quotes[topic] && quotes[topic].length > 0 && sampleQuotes.length < 3) {
      sampleQuotes.push({ ...quotes[topic][0], topicLabel: TOPIC_LABELS[topic] })
    }
  })

  return (
    <div className="philosopher-card-overlay">
      <div className="philosopher-card" style={{ borderTopColor: color, borderTopWidth: 3 }}>
        <button className="card-close-btn" onClick={onClose} aria-label="Close">×</button>

        <div className="card-header">
          <div
            className="card-avatar"
            style={{ background: color }}
          >
            {name.split(' ').pop().charAt(0)}
          </div>
          <div>
            <div className="card-name">{name}</div>
            <div className="card-meta">
              {years} · {nationality}
            </div>
          </div>
        </div>

        <div
          className="card-bio"
          style={{ borderLeftColor: color }}
        >
          {bio}
        </div>

        <div className="card-topics">
          {topicCounts.map(({ topic, label, count }) => (
            <span key={topic} className="topic-chip" title={label}>
              {label.replace('On ', '')} ({count})
            </span>
          ))}
        </div>

        <div className="card-recent-quotes">
          <h4>Selected Wisdom</h4>
          {sampleQuotes.map((q, i) => (
            <div key={i} className="recent-quote-item">
              <div style={{ marginBottom: 2, fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                &ldquo;{q.text.length > 120 ? q.text.slice(0, 117) + '…' : q.text}&rdquo;
              </div>
              <div className="recent-quote-source">
                — {q.source}{q.year ? `, ${q.year < 0 ? Math.abs(q.year) + ' BC' : q.year}` : ''} · <em>{q.topicLabel}</em>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
