import React, { useState } from 'react'

export function TopBar({ speed, onSpeedChange, activeCount, voiceEnabled, onVoiceToggle, followedPhilosopher, onChangePhilosopher }) {
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <span className="quill-icon">✒️</span>
          <span>Philosopher's Village</span>
        </div>

        <div className="top-bar-controls">
          {followedPhilosopher ? (
            <button
              className="speed-btn active"
              onClick={onChangePhilosopher}
              title="Change philosopher"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                paddingLeft: 8, paddingRight: 10, fontFamily: 'serif'
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: followedPhilosopher.color, flexShrink: 0
              }} />
              {followedPhilosopher.name.split(' ').pop()}
              <span style={{ opacity: 0.6, fontSize: 11 }}>✕</span>
            </button>
          ) : (
            <button
              className="speed-btn"
              onClick={onChangePhilosopher}
              title="Choose a philosopher to follow"
              style={{ fontFamily: 'serif', color: '#a09070' }}
            >
              👁 Follow
            </button>
          )}

          <div className="active-badge">
            <div className="pulse-dot" />
            {activeCount} active {activeCount === 1 ? 'dialogue' : 'dialogues'}
          </div>

          <div className="speed-control">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                className={`speed-btn ${speed === s ? 'active' : ''}`}
                onClick={() => onSpeedChange(s)}
                title={`${s}× speed`}
              >
                {s}×
              </button>
            ))}
          </div>

          {onVoiceToggle && (
            <button
              className={`speed-btn${voiceEnabled ? ' active' : ''}`}
              onClick={onVoiceToggle}
              title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
              style={{ minWidth: '2.2rem' }}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>
          )}

          <button className="about-btn" onClick={() => setShowAbout(true)}>
            About
          </button>
        </div>
      </div>

      {showAbout && (
        <div className="about-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-modal" onClick={(e) => e.stopPropagation()}>
            <button className="about-close" onClick={() => setShowAbout(false)}>×</button>
            <h2>Philosopher's Village</h2>
            <p>
              Ten great thinkers roam a living village, meeting by chance and
              exchanging real quotes from their works — on suffering, freedom,
              meaning, death, and beauty.
            </p>
            <p>
              <strong style={{ color: 'var(--gold)' }}>Click</strong> a philosopher
              to see their profile and wisdom.{' '}
              <strong style={{ color: 'var(--gold)' }}>Drag</strong> to orbit,{' '}
              <strong style={{ color: 'var(--gold)' }}>scroll</strong> to zoom,{' '}
              <strong style={{ color: 'var(--gold)' }}>right-drag</strong> to pan.
            </p>
            <p>
              All quotes are sourced from primary texts. The simulation runs
              autonomously — conversations unfold naturally as philosophers wander
              and cross paths.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
