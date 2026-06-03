import React, { useEffect, useRef, useCallback } from 'react'
import { World } from '../engine/World'
import { SimulationLoop } from '../engine/SimulationLoop'
import { PHILOSOPHERS } from '../data/philosophers.js'

export function VillageCanvas({ onConversationStart, onQuoteDelivered, onConversationEnd, onPhilosopherSelect, speed }) {
  const canvasRef = useRef(null)
  const worldRef = useRef(null)
  const simRef = useRef(null)
  const speedRef = useRef(speed)

  // Keep speed ref current
  useEffect(() => {
    speedRef.current = speed
    if (simRef.current) simRef.current.setSpeed(speed)
  }, [speed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Init world
    const world = new World(canvas)
    worldRef.current = world

    // Build village huts
    world.buildVillage(PHILOSOPHERS)

    // Add philosopher 3D models
    PHILOSOPHERS.forEach((phil) => {
      world.addPhilosopher(phil)
    })

    // Handle philosopher clicks
    world.onPhilosopherClick = (id) => {
      const phil = PHILOSOPHERS.find((p) => p.id === id)
      if (phil && onPhilosopherSelect) onPhilosopherSelect(phil)
    }

    // Init simulation
    const sim = new SimulationLoop({
      onMove: (id, pos, state) => {
        if (worldRef.current) {
          worldRef.current.updatePhilosopher(id, pos, state)
        }
      },
      onConversationStart: (conv) => {
        if (onConversationStart) onConversationStart(conv)
      },
      onQuoteDelivered: (convId, index, quote) => {
        // Show speech bubble for the speaking philosopher
        if (worldRef.current) {
          worldRef.current.showSpeechBubble(quote.speaker, quote.text, 6000)
        }
        if (onQuoteDelivered) onQuoteDelivered(convId, index, quote)
      },
      onConversationEnd: (convId) => {
        if (onConversationEnd) onConversationEnd(convId)
      }
    })

    sim.setSpeed(speedRef.current)
    simRef.current = sim
    sim.start()

    return () => {
      sim.stop()
      world.dispose()
      simRef.current = null
      worldRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        outline: 'none'
      }}
    />
  )
}
