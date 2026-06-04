import React, { useEffect, useRef, useCallback } from 'react'
import { World } from '../engine/World'
import { SimulationLoop } from '../engine/SimulationLoop'
import { VoiceSystem } from '../engine/VoiceSystem'
import { PHILOSOPHERS } from '../data/philosophers.js'

export function VillageCanvas({ onConversationStart, onQuoteDelivered, onConversationEnd, onPhilosopherSelect, speed, voiceEnabled, onVoiceReady }) {
  const canvasRef = useRef(null)
  const worldRef = useRef(null)
  const simRef = useRef(null)
  const voiceRef = useRef(null)
  const speedRef = useRef(speed)

  // Keep speed ref current
  useEffect(() => {
    speedRef.current = speed
    if (simRef.current) simRef.current.setSpeed(speed)
  }, [speed])

  // Keep voiceEnabled in sync
  useEffect(() => {
    if (voiceRef.current) {
      if (voiceEnabled === false && voiceRef.current.enabled) {
        voiceRef.current.enabled = false
        voiceRef.current.stop()
      } else if (voiceEnabled === true && !voiceRef.current.enabled) {
        voiceRef.current.enabled = true
      }
    }
  }, [voiceEnabled])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Init voice system
    const voice = new VoiceSystem()
    voice.init().then(() => {
      voiceRef.current = voice
      if (onVoiceReady) onVoiceReady(voice)
    })

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
      onQuoteDelivered: async (convId, index, quote, speakerId, listenerId) => {
        // Notify parent feed
        if (onQuoteDelivered) onQuoteDelivered(convId, index, quote)

        // Set animation states — speaker talks, listener listens
        worldRef.current?.setCharacterState(speakerId, 'speaking')
        worldRef.current?.setCharacterState(listenerId, 'listening')

        // Make them face each other
        worldRef.current?.faceToward(speakerId, listenerId)
        worldRef.current?.faceToward(listenerId, speakerId)

        // Show speech bubble (long duration — cleared manually after voice)
        worldRef.current?.showSpeechBubble(quote.speaker, quote.text, 99999)

        // Speak (awaits until TTS finishes or times out)
        if (voiceRef.current) {
          await voiceRef.current.speak(quote.text, speakerId)
        } else {
          await new Promise(r => setTimeout(r, 5000))
        }

        // Clear speech bubble
        worldRef.current?.clearSpeechBubble(speakerId)

        // Signal conversation loop to advance to next quote
        simRef.current?.quoteDone(convId, index)
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
      if (voiceRef.current) voiceRef.current.stop()
      simRef.current = null
      worldRef.current = null
      voiceRef.current = null
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
