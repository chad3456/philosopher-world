import React, { useState } from 'react'

export function TopBar({ speed, onSpeedChange, activeCount }) {
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <span className="quill-icon">✒️</span>
          <span>Philosopher's Village</span>
        </div>

        <div className="top-bar-controls">
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
