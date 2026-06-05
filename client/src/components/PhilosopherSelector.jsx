import React from 'react'
import { PHILOSOPHERS } from '../data/philosophers.js'

export function PhilosopherSelector({ onSelect }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(4, 3, 10, 0.96)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)',
      fontFamily: 'serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 13, letterSpacing: 6, color: '#b8960a', textTransform: 'uppercase', marginBottom: 12 }}>
          Philosopher's Village
        </div>
        <h1 style={{
          color: '#f5d080', fontSize: '2.2rem', margin: 0,
          textShadow: '0 0 40px rgba(245, 208, 128, 0.35)'
        }}>
          Who will you follow?
        </h1>
        <p style={{ color: '#7a7060', marginTop: 10, fontSize: 14, maxWidth: 460, lineHeight: 1.7 }}>
          Choose a philosopher. The camera follows them through the village.
          When they meet someone, the conversation comes to the foreground —
          all other dialogues continue quietly in the background.
        </p>
      </div>

      {/* Philosopher grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))',
        gap: 10,
        maxWidth: 740,
        width: '100%',
        padding: '0 20px',
        maxHeight: '50vh',
        overflowY: 'auto',
      }}>
        {PHILOSOPHERS.map(p => (
          <PhilosopherCard key={p.id} philosopher={p} onSelect={onSelect} />
        ))}
      </div>

      {/* Spectate button */}
      <button
        onClick={() => onSelect(null)}
        style={{
          marginTop: 28,
          background: 'transparent',
          border: '1px solid #3a3530',
          color: '#6a6055',
          borderRadius: 8,
          padding: '10px 28px',
          cursor: 'pointer',
          fontSize: 13,
          letterSpacing: 1,
          transition: 'all 0.2s',
          fontFamily: 'serif'
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#a09080'; e.currentTarget.style.borderColor = '#6a6055' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#6a6055'; e.currentTarget.style.borderColor = '#3a3530' }}
      >
        👁  Spectate All — Free Camera
      </button>
    </div>
  )
}

function PhilosopherCard({ philosopher: p, onSelect }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      onClick={() => onSelect(p.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${p.color}18` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? p.color : p.color + '33'}`,
        borderRadius: 12,
        padding: '14px 10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.18s',
        color: '#fff',
        boxShadow: hovered ? `0 0 20px ${p.color}30` : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Avatar circle */}
      <div style={{
        width: 46, height: 46, borderRadius: '50%',
        background: p.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, fontWeight: 700, color: '#fff',
        boxShadow: `0 0 ${hovered ? 18 : 8}px ${p.color}88`,
        transition: 'box-shadow 0.18s',
        flexShrink: 0,
      }}>
        {p.name[0]}
      </div>

      {/* Name (last name only) */}
      <span style={{
        fontSize: 12, fontWeight: 600,
        color: hovered ? '#fff' : '#ccc',
        textAlign: 'center', lineHeight: 1.3,
        transition: 'color 0.18s'
      }}>
        {p.name.split(' ').pop()}
      </span>

      {/* Years */}
      <span style={{ fontSize: 10, color: '#5a5048', lineHeight: 1 }}>
        {p.years}
      </span>
    </button>
  )
}
