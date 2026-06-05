import React, { useEffect, useRef, useCallback } from 'react'
import { World } from '../engine/World'
import { SimulationLoop } from '../engine/SimulationLoop'
import { VoiceSystem } from '../engine/VoiceSystem'
import { PHILOSOPHERS } from '../data/philosophers.js'

export function VillageCanvas({
  onConversationStart, onQuoteDelivered, onConversationEnd,
  onPhilosopherSelect, speed, voiceEnabled, onVoiceReady, followedId
}) {
  const canvasRef = useRef(null)
  const worldRef = useRef(null)
  const simRef = useRef(null)
  const voiceRef = useRef(null)
  const speedRef = useRef(speed)
  const foregroundConvRef = useRef(null)

  useEffect(() => {
    speedRef.current = speed
    if (simRef.current) simRef.current.setSpeed(speed)
  }, [speed])

  useEffect(() => {
    if (voiceRef.current) {
      voiceRef.current.enabled = voiceEnabled !== false
      if (!voiceRef.current.enabled) voiceRef.current.stop()
    }
  }, [voiceEnabled])

  // Sync followedId → world camera + sim isForeground logic
  useEffect(() => {
    if (!worldRef.current || !simRef.current) return
    if (followedId) {
      worldRef.current.followPhilosopher(followedId)
      simRef.current.setFollowedPhilosopher(followedId)
    } else {
      worldRef.current.unfollowPhilosopher()
      simRef.current.setFollowedPhilosopher(null)
    }
  }, [followedId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const voice = new VoiceSystem()
    voice.init().then(() => {
      voiceRef.current = voice
      if (onVoiceReady) onVoiceReady(voice)
    })

    const world = new World(canvas)
    worldRef.current = world

    world.buildVillage(PHILOSOPHERS)
    PHILOSOPHERS.forEach((phil) => world.addPhilosopher(phil))

    world.onPhilosopherClick = (id) => {
      const phil = PHILOSOPHERS.find((p) => p.id === id)
      if (phil && onPhilosopherSelect) onPhilosopherSelect(phil)
    }

    const sim = new SimulationLoop({
      onMove: (id, pos, state) => {
        worldRef.current?.updatePhilosopher(id, pos, state)
      },

      onConversationStart: (conv) => {
        if (conv.isForeground) {
          foregroundConvRef.current = conv.id
          worldRef.current?.focusConversation(conv.p1.id, conv.p2.id)
        }
        if (onConversationStart) onConversationStart(conv)
      },

      onQuoteDelivered: async (convId, index, quote, speakerId, listenerId, isForeground) => {
        if (onQuoteDelivered) onQuoteDelivered(convId, index, quote, isForeground)

        if (isForeground) {
          worldRef.current?.setCharacterState(speakerId, 'speaking')
          worldRef.current?.setCharacterState(listenerId, 'listening')
          worldRef.current?.faceToward(speakerId, listenerId)
          worldRef.current?.faceToward(listenerId, speakerId)
          worldRef.current?.showSpeechBubble(speakerId, quote.text, 99999)

          if (voiceRef.current) {
            await voiceRef.current.speak(quote.text, speakerId)
          } else {
            await new Promise(r => setTimeout(r, 5000))
          }

          worldRef.current?.clearSpeechBubble(speakerId)
        } else {
          // Background: brief dim bubble, no voice, advance quickly
          worldRef.current?.showSpeechBubble(speakerId, quote.text, 2500)
          await new Promise(r => setTimeout(r, 1800))
        }

        simRef.current?.quoteDone(convId, index)
      },

      onConversationEnd: (convId) => {
        if (foregroundConvRef.current === convId) {
          foregroundConvRef.current = null
          worldRef.current?.endFocusConversation()
        }
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
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'block', outline: 'none'
      }}
    />
  )
}
