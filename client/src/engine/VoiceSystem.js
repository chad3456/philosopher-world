export class VoiceSystem {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null
    this.voices = []
    this.enabled = true
    this.currentUtterance = null
    this._onEnd = null
  }

  async init() {
    if (!this.synth) return

    return new Promise(resolve => {
      const populate = () => {
        this.voices = Array.from(this.synth.getVoices())
        if (this.voices.length > 0) resolve()
      }
      populate()
      this.synth.onvoiceschanged = () => { populate(); resolve() }
      setTimeout(resolve, 3000) // failsafe
    })
  }

  // Per-philosopher voice configs
  // pitch: 0.5-2.0 (1.0 = normal)
  // rate: 0.5-2.0 (1.0 = normal)
  // gender: 'male' | 'female'
  getConfig(philosopherId) {
    const configs = {
      nietzsche:    { pitch: 0.72, rate: 0.76, gender: 'male' },
      camus:        { pitch: 0.88, rate: 0.88, gender: 'male' },
      dostoevsky:   { pitch: 0.80, rate: 0.82, gender: 'male' },
      plato:        { pitch: 0.70, rate: 0.72, gender: 'male' },
      aristotle:    { pitch: 0.78, rate: 0.78, gender: 'male' },
      schopenhauer: { pitch: 0.65, rate: 0.72, gender: 'male' },
      beauvoir:     { pitch: 1.10, rate: 0.92, gender: 'female' },
      sartre:       { pitch: 0.92, rate: 0.98, gender: 'male' },
      marcus:       { pitch: 0.68, rate: 0.70, gender: 'male' },
      kant:         { pitch: 0.74, rate: 0.74, gender: 'male' },
      tolstoy:      { pitch: 0.76, rate: 0.80, gender: 'male' },
      pessoa:       { pitch: 0.88, rate: 0.78, gender: 'male' },
      ashtavakra:   { pitch: 0.84, rate: 0.65, gender: 'male' },
    }
    return configs[philosopherId] || { pitch: 0.85, rate: 0.85, gender: 'male' }
  }

  selectVoice(gender) {
    const preferredMale = ['Google UK English Male', 'Daniel', 'Alex', 'Microsoft David', 'Fred']
    const preferredFemale = ['Google UK English Female', 'Karen', 'Samantha', 'Microsoft Zira', 'Victoria']
    const preferred = gender === 'female' ? preferredFemale : preferredMale

    for (const name of preferred) {
      const v = this.voices.find(v => v.name.includes(name.split(' ')[1] || name))
      if (v) return v
    }
    // Fallback: any English voice
    const eng = this.voices.filter(v => v.lang.startsWith('en'))
    if (gender === 'female') {
      const fem = eng.find(v => /female|woman|girl|karen|samantha|victoria|zira/i.test(v.name))
      if (fem) return fem
    }
    return eng[0] || this.voices[0] || null
  }

  // Adjust rate/pitch based on text emotion
  analyzeEmotion(text) {
    let rateAdj = 0, pitchAdj = 0
    if (text.endsWith('!') || text.endsWith('?!')) { rateAdj += 0.08; pitchAdj += 0.05 }
    if (text.includes('death') || text.includes('nothing') || text.includes('void')) { rateAdj -= 0.05; pitchAdj -= 0.03 }
    if (text.includes('love') || text.includes('joy') || text.includes('beauty')) { rateAdj += 0.03; pitchAdj += 0.03 }
    if (text.includes('suffer') || text.includes('pain') || text.includes('grief')) { rateAdj -= 0.06 }
    return { rateAdj, pitchAdj }
  }

  speak(text, philosopherId) {
    return new Promise(resolve => {
      if (!this.enabled || !this.synth) { resolve(); return }

      this.synth.cancel()

      const config = this.getConfig(philosopherId)
      const { rateAdj, pitchAdj } = this.analyzeEmotion(text)

      const utt = new SpeechSynthesisUtterance(text)
      const voice = this.selectVoice(config.gender)
      if (voice) utt.voice = voice
      utt.pitch = Math.max(0.5, Math.min(2.0, config.pitch + pitchAdj))
      utt.rate = Math.max(0.5, Math.min(2.0, config.rate + rateAdj))
      utt.volume = 1.0

      let resolved = false
      const done = () => {
        if (resolved) return
        resolved = true
        this.currentUtterance = null
        resolve()
      }

      utt.onend = done
      utt.onerror = done

      this.currentUtterance = utt
      this.synth.speak(utt)

      // Safety timeout: max 20 seconds per quote
      setTimeout(done, 20000)
    })
  }

  stop() {
    if (this.synth) this.synth.cancel()
    this.currentUtterance = null
  }

  toggle() {
    this.enabled = !this.enabled
    if (!this.enabled) this.stop()
    return this.enabled
  }
}
