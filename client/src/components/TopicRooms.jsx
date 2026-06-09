import React from 'react'
import { TOPICS, TOPIC_LABELS } from '../data/philosophers.js'

const TOPIC_ICONS = {
  technology:    '🤖',
  identity:      '🎭',
  loneliness:    '🪞',
  power:         '⚡',
  consumerism:   '💸',
  truth:         '👁',
  freedom:       '🔓',
  love:          '💔',
  meaning:       '✦',
  consciousness: '🧠',
  society:       '🏛',
  beauty:        '🎨',
}

const TOPIC_COLORS = {
  technology:    '#22d3ee',
  identity:      '#a78bfa',
  loneliness:    '#94a3b8',
  power:         '#f97316',
  consumerism:   '#fbbf24',
  truth:         '#3b82f6',
  freedom:       '#22c55e',
  love:          '#ec4899',
  meaning:       '#8b5cf6',
  consciousness: '#06b6d4',
  society:       '#ef4444',
  beauty:        '#84cc16',
}

export { TOPIC_COLORS, TOPIC_ICONS }

export function TopicRooms({ tunedTopic, onTune, topicStats = {} }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
      background: 'linear-gradient(to top, rgba(3,2,8,0.97) 0%, rgba(3,2,8,0.82) 100%)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(10px)',
      padding: '10px 12px 12px',
    }}>
      <div style={{
        fontSize: 9, letterSpacing: 3, color: '#3a3028', textTransform: 'uppercase',
        marginBottom: 8, paddingLeft: 2
      }}>
        Conversation Rooms
      </div>
      <div style={{
        display: 'flex', gap: 7, overflowX: 'auto',
        paddingBottom: 2,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {/* All Rooms */}
        <RoomCard
          icon="◈" label="All Rooms" color="#6b7280"
          selected={!tunedTopic} active={false} count={null}
          onClick={() => onTune(null)}
        />

        {TOPICS.map(topic => {
          const stats = topicStats[topic] || { count: 0, active: false }
          return (
            <RoomCard
              key={topic}
              icon={TOPIC_ICONS[topic] || '✦'}
              label={TOPIC_LABELS[topic] || topic}
              color={TOPIC_COLORS[topic] || '#6b7280'}
              selected={tunedTopic === topic}
              active={stats.active}
              count={stats.count}
              onClick={() => onTune(tunedTopic === topic ? null : topic)}
            />
          )
        })}
      </div>
    </div>
  )
}

function RoomCard({ icon, label, color, selected, active, count, onClick }) {
  const [hovered, setHovered] = React.useState(false)
  const lit = selected || hovered

  // 2-word max for compact cards
  const shortLabel = label.split('&')[0].split(' ').slice(0, 2).join(' ').replace(/,$/, '')

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0, width: 108,
        background: selected ? `${color}1a` : hovered ? `${color}0d` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${selected ? color : lit ? color + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 10, padding: '7px 9px',
        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4,
        boxShadow: selected ? `0 0 14px ${color}35, inset 0 0 8px ${color}08` : 'none',
        transition: 'all 0.14s', position: 'relative', textAlign: 'left',
      }}
    >
      {/* Live pulse dot */}
      {active && (
        <span style={{
          position: 'absolute', top: 6, right: 6,
          width: 6, height: 6, borderRadius: '50%',
          background: '#22c55e', boxShadow: '0 0 5px #22c55e88',
          display: 'inline-block',
        }} />
      )}

      {/* Icon row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
        {count > 0 && (
          <span style={{
            fontSize: 9, color: selected ? color : '#5a5048',
            background: selected ? `${color}25` : 'rgba(255,255,255,0.05)',
            borderRadius: 8, padding: '1px 5px', marginRight: 10,
          }}>
            {count}
          </span>
        )}
      </div>

      {/* Label */}
      <span style={{
        fontSize: 10, lineHeight: 1.3,
        color: selected ? '#e0d8c8' : lit ? '#b0a890' : '#6a6050',
        fontFamily: 'serif', transition: 'color 0.14s',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {shortLabel}
      </span>

      {selected && (
        <span style={{ fontSize: 8, color, letterSpacing: 0.8, opacity: 0.9 }}>
          🎧 TUNED IN
        </span>
      )}
    </button>
  )
}
