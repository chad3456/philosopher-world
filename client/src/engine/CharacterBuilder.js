import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Material cache — reuse identical-color lambert materials
// ---------------------------------------------------------------------------
const _matCache = {}
function mat(hexColor) {
  if (!_matCache[hexColor]) {
    _matCache[hexColor] = new THREE.MeshLambertMaterial({ color: new THREE.Color(hexColor) })
  }
  return _matCache[hexColor]
}

// Convenience: make a mesh, tag it, and optionally cast shadow
function mkMesh(geo, hexColor, philosopherId) {
  const m = new THREE.Mesh(geo, mat(hexColor))
  m.castShadow = true
  m.receiveShadow = false
  if (philosopherId) m.userData.philosopherId = philosopherId
  return m
}

// ---------------------------------------------------------------------------
// Per-philosopher visual recipes
// ---------------------------------------------------------------------------
const RECIPES = {
  nietzsche: {
    skin: '#c8956c',
    torso: '#1e1e2e',
    pants: '#16162a',
    shoes: '#0a0a0a',
    // Distinctive: THICK dark mustache, dark side-parted hair, no hat
    hair: '#1a0800',
    hairStyle: 'sidePart',
    facialHair: 'thickMustache',
    facialHairColor: '#1a0800',
    shirtFront: true,
  },
  camus: {
    skin: '#d4a373',
    torso: '#2a2a2a',
    pants: '#1a1a1a',
    shoes: '#111111',
    hair: '#0a0800',
    hairStyle: 'wavy',
    facialHair: 'none',
    cigarette: true,
  },
  dostoevsky: {
    skin: '#c8956c',
    torso: '#0a0a0a',
    pants: '#080808',
    shoes: '#0a0a0a',
    hair: '#1a0a00',
    hairStyle: 'medium',
    facialHair: 'fullBeard',
    facialHairColor: '#0a0800',
  },
  plato: {
    skin: '#d4b896',
    torso: '#f5f0e8',
    pants: '#ede8dc',
    shoes: '#b8a070',
    hair: '#e0dcd8',
    hairStyle: 'flowingWhite',
    facialHair: 'longBeard',
    facialHairColor: '#e0dcd8',
    toga: true,
    sandals: true,
  },
  aristotle: {
    skin: '#c8a07a',
    torso: '#b8967a',
    pants: '#a08060',
    shoes: '#7a5040',
    hair: '#4a2800',
    hairStyle: 'short',
    facialHair: 'shortBeard',
    facialHairColor: '#4a2800',
    toga: true,
  },
  schopenhauer: {
    skin: '#c8956c',
    torso: '#0a0a0a',
    pants: '#080808',
    shoes: '#0a0a0a',
    hair: '#e8e8e8',
    hairStyle: 'wildWhite',
    facialHair: 'none',
    bowTie: true,
    shirtFront: true,
  },
  beauvoir: {
    skin: '#e8c4a0',
    torso: '#1a1a2e',
    pants: '#14142a',
    shoes: '#0a0a1a',
    hair: '#1a0a00',
    hairStyle: 'bun',
    facialHair: 'none',
  },
  sartre: {
    skin: '#d4a574',
    torso: '#2d2d2d',
    pants: '#222222',
    shoes: '#111111',
    hair: '#1a1008',
    hairStyle: 'short',
    facialHair: 'none',
    glasses: true,
  },
  marcus: {
    skin: '#c8956c',
    torso: '#f0ebe0',
    pants: '#e8e0d0',
    shoes: '#8b7060',
    hair: '#1a1008',
    hairStyle: 'curlyRoman',
    facialHair: 'shortBeard',
    facialHairColor: '#1a1008',
    toga: true,
    sash: '#8b1a1a',
    laurelWreath: true,
    sandals: true,
  },
  kant: {
    skin: '#d4c0a0',
    torso: '#4a3a2a',
    pants: '#3a2e1e',
    shoes: '#2a1e10',
    hair: '#d0ccc8',
    hairStyle: 'powdered',
    facialHair: 'none',
    cravat: true,
  },
  tolstoy: {
    skin: '#c8956c',
    torso: '#4a5a3a',
    pants: '#3a4a2e',
    shoes: '#2a3020',
    hair: '#7a7a7a',
    hairStyle: 'medium',
    facialHair: 'veryLongBeard',
    facialHairColor: '#8a8a8a',
  },
  pessoa: {
    skin: '#d4a574',
    torso: '#6a6a6a',
    pants: '#555555',
    shoes: '#2a2a2a',
    hair: '#1a1008',
    hairStyle: 'short',
    facialHair: 'none',
    glasses: true,
    fedora: true,
    fedoraColor: '#3a3a3a',
  },
  ashtavakra: {
    skin: '#b87040',
    torso: '#f97316',
    pants: '#ea6a0a',
    shoes: '#8b5a20',
    hair: '#1a0808',
    hairStyle: 'longTied',
    facialHair: 'mediumBeard',
    facialHairColor: '#1a0808',
    tilaka: true,
    toga: true,
  },
}

// ---------------------------------------------------------------------------
// HEAD BUILDER — returns { headGroup, jaw }
// ---------------------------------------------------------------------------
function buildHead(recipe, philosopherId) {
  const pid = philosopherId
  const headGroup = new THREE.Group()

  // --- Skull ---
  const skull = mkMesh(new THREE.SphereGeometry(0.28, 12, 10), recipe.skin, pid)
  headGroup.add(skull)

  // --- Eyes ---
  const eyePositions = [[-0.10, 0.06, 0.24], [0.10, 0.06, 0.24]]
  eyePositions.forEach(([ex, ey, ez]) => {
    const white = mkMesh(new THREE.SphereGeometry(0.065, 8, 8), '#ffffff', pid)
    white.position.set(ex, ey, ez)
    headGroup.add(white)

    const pupil = mkMesh(new THREE.SphereGeometry(0.038, 6, 6), '#1a0a00', pid)
    pupil.position.set(ex, ey, ez + 0.032)
    headGroup.add(pupil)

    // Iris highlight
    const highlight = mkMesh(new THREE.SphereGeometry(0.016, 5, 5), '#ffffff', pid)
    highlight.position.set(ex + 0.018, ey + 0.018, ez + 0.048)
    headGroup.add(highlight)
  })

  // --- Eyebrows ---
  const browColors = {
    plato: '#9a9490', kant: '#9a9490', schopenhauer: '#5a5a5a',
    tolstoy: '#6a6a6a',
  }
  const browColor = browColors[philosopherId] || '#2a1408'
  ;[[-0.10, 0.145, 0.234], [0.10, 0.145, 0.234]].forEach(([bx, by, bz], i) => {
    const brow = mkMesh(new THREE.BoxGeometry(0.10, 0.022, 0.025), browColor, pid)
    brow.position.set(bx, by, bz)
    // Angle slightly: inner end up for worried look, outer down
    brow.rotation.z = (i === 0 ? 1 : -1) * 0.12
    headGroup.add(brow)
  })

  // --- Nose ---
  const nose = mkMesh(new THREE.SphereGeometry(0.030, 6, 5), recipe.skin, pid)
  nose.scale.set(1.1, 0.85, 1.0)
  nose.position.set(0, -0.02, 0.278)
  headGroup.add(nose)

  // --- Mouth / Lips ---
  const mouth = mkMesh(new THREE.BoxGeometry(0.12, 0.028, 0.020), '#7a3030', pid)
  mouth.position.set(0, -0.09, 0.268)
  headGroup.add(mouth)

  // --- JAW (for talking animation) ---
  const jawGeo = new THREE.BoxGeometry(0.20, 0.06, 0.22)
  const jaw = mkMesh(jawGeo, recipe.skin, pid)
  jaw.position.set(0, -0.22, 0.04)
  headGroup.add(jaw)

  // ---------------------------------------------------------------------------
  // HAIR
  // ---------------------------------------------------------------------------
  switch (recipe.hairStyle) {
    case 'sidePart': {
      // Nietzsche: dark brown, close-cropped, side-parted flaps
      const cap = mkMesh(new THREE.SphereGeometry(0.285, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), recipe.hair, pid)
      cap.position.set(0, 0.04, 0)
      headGroup.add(cap)
      // Side flaps
      ;[[-1, 0], [1, 0]].forEach(([sx]) => {
        const flap = mkMesh(new THREE.BoxGeometry(0.10, 0.16, 0.18), recipe.hair, pid)
        flap.position.set(sx * 0.24, -0.06, 0.0)
        headGroup.add(flap)
      })
      break
    }
    case 'wavy': {
      // Camus: dark wavy
      const cap = mkMesh(new THREE.CylinderGeometry(0.26, 0.30, 0.16, 10), recipe.hair, pid)
      cap.position.set(0, 0.20, -0.02)
      headGroup.add(cap)
      // Side curls
      ;[[-1, 1]].forEach((sides) => {
        sides.forEach(sx => {
          const curl = mkMesh(new THREE.SphereGeometry(0.08, 6, 5), recipe.hair, pid)
          curl.scale.set(0.7, 1.1, 0.7)
          curl.position.set(sx * 0.27, 0.04, -0.06)
          headGroup.add(curl)
        })
      })
      break
    }
    case 'medium': {
      // Dostoevsky / Tolstoy: medium length dark/gray
      const cap = mkMesh(new THREE.CylinderGeometry(0.27, 0.30, 0.20, 10), recipe.hair, pid)
      cap.position.set(0, 0.18, -0.02)
      headGroup.add(cap)
      // Back hair drape
      const back = mkMesh(new THREE.BoxGeometry(0.46, 0.22, 0.14), recipe.hair, pid)
      back.position.set(0, -0.04, -0.20)
      headGroup.add(back)
      ;[-1, 1].forEach(sx => {
        const side = mkMesh(new THREE.BoxGeometry(0.10, 0.26, 0.14), recipe.hair, pid)
        side.position.set(sx * 0.25, -0.02, -0.06)
        headGroup.add(side)
      })
      break
    }
    case 'flowingWhite': {
      // Plato: long white flowing
      const cap = mkMesh(new THREE.CylinderGeometry(0.27, 0.24, 0.20, 10), recipe.hair, pid)
      cap.position.set(0, 0.20, -0.01)
      headGroup.add(cap)
      // Side wisps down
      ;[-1, 1].forEach(sx => {
        const wisp = mkMesh(new THREE.BoxGeometry(0.10, 0.38, 0.12), recipe.hair, pid)
        wisp.position.set(sx * 0.26, -0.10, -0.08)
        headGroup.add(wisp)
      })
      // Back hair
      const back = mkMesh(new THREE.BoxGeometry(0.44, 0.38, 0.12), recipe.hair, pid)
      back.position.set(0, -0.08, -0.22)
      headGroup.add(back)
      break
    }
    case 'short': {
      // Generic short: Aristotle, Sartre, Kant, Pessoa
      const cap = mkMesh(new THREE.SphereGeometry(0.285, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.45), recipe.hair, pid)
      cap.position.set(0, 0.05, -0.02)
      headGroup.add(cap)
      break
    }
    case 'wildWhite': {
      // Schopenhauer: wild white puffs around sides/back
      const clusterPositions = [
        [-0.26, 0.04, -0.06], [0.26, 0.04, -0.06],
        [-0.24, -0.04, -0.14], [0.24, -0.04, -0.14],
        [-0.20, -0.12, -0.18], [0.20, -0.12, -0.18],
        [0.00, 0.05, -0.22],
      ]
      clusterPositions.forEach(([cx, cy, cz]) => {
        const puff = mkMesh(new THREE.SphereGeometry(0.085 + Math.random() * 0.025, 6, 5), recipe.hair, pid)
        puff.position.set(cx, cy, cz)
        headGroup.add(puff)
      })
      // Thin top — mostly bald
      const top = mkMesh(new THREE.SphereGeometry(0.18, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.35), recipe.hair, pid)
      top.position.set(0, 0.10, -0.04)
      headGroup.add(top)
      break
    }
    case 'bun': {
      // Beauvoir: dark hair with bun at back-top
      const cap = mkMesh(new THREE.SphereGeometry(0.285, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.48), recipe.hair, pid)
      cap.position.set(0, 0.04, 0)
      headGroup.add(cap)
      // Bun
      const bun = mkMesh(new THREE.SphereGeometry(0.10, 7, 6), recipe.hair, pid)
      bun.position.set(0, 0.22, -0.16)
      headGroup.add(bun)
      break
    }
    case 'curlyRoman': {
      // Marcus Aurelius: short dark curly
      const cap = mkMesh(new THREE.SphereGeometry(0.285, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.50), recipe.hair, pid)
      cap.position.set(0, 0.04, -0.01)
      headGroup.add(cap)
      // Curl bumps at forehead
      for (let i = 0; i < 4; i++) {
        const curl = mkMesh(new THREE.SphereGeometry(0.055, 5, 4), recipe.hair, pid)
        curl.position.set(-0.12 + i * 0.08, 0.18, 0.20)
        headGroup.add(curl)
      }
      break
    }
    case 'powdered': {
      // Kant: neat white/gray powdered formal hair
      const cap = mkMesh(new THREE.CylinderGeometry(0.27, 0.25, 0.22, 10), recipe.hair, pid)
      cap.position.set(0, 0.18, -0.01)
      headGroup.add(cap)
      // Slight side curl near ears
      ;[-1, 1].forEach(sx => {
        const side = mkMesh(new THREE.BoxGeometry(0.08, 0.14, 0.10), recipe.hair, pid)
        side.position.set(sx * 0.27, 0.0, -0.02)
        headGroup.add(side)
      })
      break
    }
    case 'longTied': {
      // Ashtavakra: long dark hair, slightly bunched at back
      const cap = mkMesh(new THREE.SphereGeometry(0.285, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.50), recipe.hair, pid)
      cap.position.set(0, 0.04, 0)
      headGroup.add(cap)
      // Long back
      const back = mkMesh(new THREE.BoxGeometry(0.30, 0.40, 0.12), recipe.hair, pid)
      back.position.set(0, -0.14, -0.22)
      headGroup.add(back)
      // Tie band
      const band = mkMesh(new THREE.BoxGeometry(0.12, 0.05, 0.05), '#2a1818', pid)
      band.position.set(0, -0.28, -0.24)
      headGroup.add(band)
      break
    }
    default:
      break
  }

  // ---------------------------------------------------------------------------
  // FACIAL HAIR
  // ---------------------------------------------------------------------------
  const fhColor = recipe.facialHairColor || '#2a1408'

  switch (recipe.facialHair) {
    case 'thickMustache': {
      // Nietzsche's iconic thick walrus mustache
      const must = mkMesh(new THREE.BoxGeometry(0.28, 0.068, 0.065), fhColor, pid)
      must.position.set(0, -0.065, 0.255)
      headGroup.add(must)
      // Side droop wings
      ;[-1, 1].forEach(sx => {
        const wing = mkMesh(new THREE.BoxGeometry(0.10, 0.05, 0.05), fhColor, pid)
        wing.position.set(sx * 0.16, -0.095, 0.245)
        wing.rotation.z = sx * 0.3
        headGroup.add(wing)
      })
      break
    }
    case 'fullBeard': {
      // Dostoevsky: full rounded beard + mustache
      const beard = mkMesh(new THREE.SphereGeometry(0.22, 8, 7), fhColor, pid)
      beard.scale.set(1.0, 0.72, 0.65)
      beard.position.set(0, -0.175, 0.12)
      headGroup.add(beard)
      const mustache = mkMesh(new THREE.BoxGeometry(0.20, 0.040, 0.048), fhColor, pid)
      mustache.position.set(0, -0.058, 0.260)
      headGroup.add(mustache)
      break
    }
    case 'longBeard': {
      // Plato: long flowing white beard
      const beard = mkMesh(new THREE.SphereGeometry(0.22, 8, 7), fhColor, pid)
      beard.scale.set(0.95, 1.30, 0.60)
      beard.position.set(0, -0.24, 0.10)
      headGroup.add(beard)
      // Tapering extension
      const ext = mkMesh(new THREE.ConeGeometry(0.14, 0.26, 7), fhColor, pid)
      ext.rotation.x = Math.PI
      ext.position.set(0, -0.50, 0.08)
      headGroup.add(ext)
      const mustache = mkMesh(new THREE.BoxGeometry(0.18, 0.036, 0.045), fhColor, pid)
      mustache.position.set(0, -0.055, 0.258)
      headGroup.add(mustache)
      break
    }
    case 'shortBeard': {
      // Aristotle / Marcus: neat short beard
      const beard = mkMesh(new THREE.SphereGeometry(0.20, 8, 6), fhColor, pid)
      beard.scale.set(0.90, 0.52, 0.55)
      beard.position.set(0, -0.18, 0.10)
      headGroup.add(beard)
      const mustache = mkMesh(new THREE.BoxGeometry(0.16, 0.032, 0.040), fhColor, pid)
      mustache.position.set(0, -0.052, 0.262)
      headGroup.add(mustache)
      break
    }
    case 'veryLongBeard': {
      // Tolstoy: very long flowing gray beard reaching chest
      const beard = mkMesh(new THREE.SphereGeometry(0.22, 8, 7), fhColor, pid)
      beard.scale.set(1.0, 0.80, 0.60)
      beard.position.set(0, -0.18, 0.10)
      headGroup.add(beard)
      // Long extension down to chest
      const ext = mkMesh(new THREE.CylinderGeometry(0.13, 0.08, 0.55, 8), fhColor, pid)
      ext.position.set(0, -0.52, 0.06)
      headGroup.add(ext)
      // Tip taper
      const tip = mkMesh(new THREE.ConeGeometry(0.08, 0.15, 7), fhColor, pid)
      tip.rotation.x = Math.PI
      tip.position.set(0, -0.85, 0.04)
      headGroup.add(tip)
      const mustache = mkMesh(new THREE.BoxGeometry(0.19, 0.038, 0.045), fhColor, pid)
      mustache.position.set(0, -0.058, 0.260)
      headGroup.add(mustache)
      break
    }
    case 'mediumBeard': {
      // Ashtavakra
      const beard = mkMesh(new THREE.SphereGeometry(0.21, 8, 6), fhColor, pid)
      beard.scale.set(0.90, 0.70, 0.58)
      beard.position.set(0, -0.20, 0.10)
      headGroup.add(beard)
      const ext = mkMesh(new THREE.ConeGeometry(0.11, 0.20, 7), fhColor, pid)
      ext.rotation.x = Math.PI
      ext.position.set(0, -0.46, 0.06)
      headGroup.add(ext)
      const mustache = mkMesh(new THREE.BoxGeometry(0.16, 0.034, 0.042), fhColor, pid)
      mustache.position.set(0, -0.052, 0.262)
      headGroup.add(mustache)
      break
    }
    case 'none':
    default:
      break
  }

  // ---------------------------------------------------------------------------
  // ACCESSORIES
  // ---------------------------------------------------------------------------

  // Sartre / Pessoa: round glasses
  if (recipe.glasses) {
    const rimColor = '#1a1a1a'
    ;[[-0.10, 0.06, 0.278], [0.10, 0.06, 0.278]].forEach(([gx, gy, gz]) => {
      const rim = mkMesh(new THREE.TorusGeometry(0.062, 0.014, 6, 14), rimColor, pid)
      rim.position.set(gx, gy, gz)
      headGroup.add(rim)
    })
    // Bridge between lenses
    const bridge = mkMesh(new THREE.BoxGeometry(0.056, 0.012, 0.010), rimColor, pid)
    bridge.position.set(0, 0.06, 0.288)
    headGroup.add(bridge)
  }

  // Pessoa: fedora hat
  if (recipe.fedora) {
    const hatColor = recipe.fedoraColor || '#3a3a3a'
    const crown = mkMesh(new THREE.CylinderGeometry(0.22, 0.24, 0.18, 12), hatColor, pid)
    crown.position.set(0, 0.42, 0)
    headGroup.add(crown)
    const brim = mkMesh(new THREE.CylinderGeometry(0.38, 0.38, 0.035, 14), hatColor, pid)
    brim.position.set(0, 0.34, 0)
    headGroup.add(brim)
    // Crease indent on crown top
    const crease = mkMesh(new THREE.CylinderGeometry(0.10, 0.18, 0.06, 10), hatColor, pid)
    crease.position.set(0, 0.49, 0)
    headGroup.add(crease)
  }

  // Marcus: laurel wreath
  if (recipe.laurelWreath) {
    const wreathColor = '#2d5a1b'
    const wreath = mkMesh(new THREE.TorusGeometry(0.30, 0.025, 6, 18), wreathColor, pid)
    wreath.position.set(0, 0.22, 0)
    wreath.rotation.x = Math.PI * 0.12
    headGroup.add(wreath)
    // Leaf clusters on wreath
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const leaf = mkMesh(new THREE.BoxGeometry(0.06, 0.03, 0.02), '#3a7020', pid)
      leaf.position.set(
        Math.cos(angle) * 0.30,
        0.22 + Math.sin(angle) * 0.05,
        Math.sin(angle) * 0.30
      )
      leaf.rotation.y = angle
      headGroup.add(leaf)
    }
  }

  // Camus: cigarette at corner of mouth
  if (recipe.cigarette) {
    const cig = mkMesh(new THREE.CylinderGeometry(0.010, 0.010, 0.12, 5), '#f0f0e8', pid)
    cig.rotation.z = Math.PI * 0.45
    cig.rotation.y = Math.PI * 0.1
    cig.position.set(0.14, -0.096, 0.255)
    headGroup.add(cig)
    // Filter tip (orange-ish)
    const filter = mkMesh(new THREE.CylinderGeometry(0.011, 0.011, 0.028, 5), '#c87040', pid)
    filter.rotation.z = Math.PI * 0.45
    filter.rotation.y = Math.PI * 0.1
    filter.position.set(0.20, -0.135, 0.258)
    headGroup.add(filter)
    // Smoke puff at tip
    const smoke = mkMesh(new THREE.SphereGeometry(0.025, 5, 4), '#b8b8b8', pid)
    smoke.position.set(0.08, -0.065, 0.262)
    headGroup.add(smoke)
  }

  // Ashtavakra: tilaka dot on forehead
  if (recipe.tilaka) {
    const tilaka = mkMesh(new THREE.SphereGeometry(0.022, 5, 4), '#cc1a1a', pid)
    tilaka.position.set(0, 0.12, 0.272)
    headGroup.add(tilaka)
  }

  return { headGroup, jaw }
}

// ---------------------------------------------------------------------------
// BODY BUILDER — returns bodyGroup
// ---------------------------------------------------------------------------
function buildBody(recipe, philosopherId) {
  const pid = philosopherId
  const bodyGroup = new THREE.Group()

  // --- Torso ---
  const torso = mkMesh(new THREE.CylinderGeometry(0.20, 0.18, 0.50, 9), recipe.torso, pid)
  torso.position.set(0, 0.62, 0)
  bodyGroup.add(torso)

  // Toga variant: slightly flared bottom
  if (recipe.toga) {
    const robeLower = mkMesh(new THREE.CylinderGeometry(0.22, 0.26, 0.22, 9), recipe.torso, pid)
    robeLower.position.set(0, 0.37, 0)
    bodyGroup.add(robeLower)
  }

  // Shirt front (white panel on torso)
  if (recipe.shirtFront) {
    const shirt = mkMesh(new THREE.BoxGeometry(0.14, 0.30, 0.04), '#f0f0f0', pid)
    shirt.position.set(0, 0.64, 0.19)
    bodyGroup.add(shirt)
  }

  // Cravat (Kant white neck cloth)
  if (recipe.cravat) {
    const cravat = mkMesh(new THREE.BoxGeometry(0.12, 0.10, 0.05), '#f0f0f0', pid)
    cravat.position.set(0, 0.85, 0.18)
    bodyGroup.add(cravat)
  }

  // Bow tie (Schopenhauer)
  if (recipe.bowTie) {
    const shirt = mkMesh(new THREE.BoxGeometry(0.12, 0.28, 0.04), '#f0f0f0', pid)
    shirt.position.set(0, 0.64, 0.19)
    bodyGroup.add(shirt)
    const bow = mkMesh(new THREE.BoxGeometry(0.14, 0.05, 0.05), '#1a1a1a', pid)
    bow.position.set(0, 0.86, 0.19)
    bodyGroup.add(bow)
    // Bow tie knot center
    const knot = mkMesh(new THREE.BoxGeometry(0.04, 0.04, 0.06), '#0a0a0a', pid)
    knot.position.set(0, 0.86, 0.205)
    bodyGroup.add(knot)
  }

  // Marcus: toga sash / belt
  if (recipe.sash) {
    const sash = mkMesh(new THREE.TorusGeometry(0.21, 0.025, 6, 12), recipe.sash, pid)
    sash.position.set(0, 0.58, 0)
    sash.rotation.x = Math.PI * 0.5
    bodyGroup.add(sash)
    // Sash drape diagonal across torso
    const sashDrape = mkMesh(new THREE.BoxGeometry(0.06, 0.40, 0.025), recipe.sash, pid)
    sashDrape.position.set(-0.08, 0.62, 0.185)
    sashDrape.rotation.z = 0.35
    bodyGroup.add(sashDrape)
  }

  // --- Neck ---
  const neck = mkMesh(new THREE.CylinderGeometry(0.09, 0.09, 0.10, 7), recipe.skin, pid)
  neck.position.set(0, 0.92, 0)
  bodyGroup.add(neck)

  // --- Shoulder caps ---
  ;[-1, 1].forEach(sx => {
    const shoulder = mkMesh(new THREE.SphereGeometry(0.10, 7, 6), recipe.torso, pid)
    shoulder.position.set(sx * 0.24, 0.84, 0)
    bodyGroup.add(shoulder)
  })

  // --- Arms ---
  ;[-1, 1].forEach(sx => {
    // Upper arm (angled outward slightly)
    const upperArm = mkMesh(new THREE.CylinderGeometry(0.07, 0.065, 0.30, 7), recipe.torso, pid)
    upperArm.position.set(sx * 0.32, 0.66, 0)
    upperArm.rotation.z = sx * (-0.22)
    bodyGroup.add(upperArm)

    // Elbow
    const elbow = mkMesh(new THREE.SphereGeometry(0.065, 6, 5), recipe.torso, pid)
    elbow.position.set(sx * 0.38, 0.48, 0.02)
    bodyGroup.add(elbow)

    // Lower arm (skin-toned)
    const lowerArm = mkMesh(new THREE.CylinderGeometry(0.060, 0.055, 0.25, 7), recipe.skin, pid)
    lowerArm.position.set(sx * 0.41, 0.32, 0.04)
    lowerArm.rotation.z = sx * (-0.12)
    lowerArm.rotation.x = 0.10
    bodyGroup.add(lowerArm)

    // Hand
    const hand = mkMesh(new THREE.SphereGeometry(0.055, 6, 5), recipe.skin, pid)
    hand.position.set(sx * 0.44, 0.18, 0.06)
    bodyGroup.add(hand)
  })

  // --- Pelvis / waist connector ---
  const waist = mkMesh(new THREE.CylinderGeometry(0.20, 0.22, 0.12, 9), recipe.pants, pid)
  waist.position.set(0, 0.34, 0)
  bodyGroup.add(waist)

  // Ashtavakra: lower robe cone
  if (recipe.toga && philosopherId === 'ashtavakra') {
    const lowerRobe = mkMesh(new THREE.CylinderGeometry(0.22, 0.28, 0.28, 9), recipe.torso, pid)
    lowerRobe.position.set(0, 0.18, 0)
    bodyGroup.add(lowerRobe)
  }

  // --- Legs ---
  ;[-1, 1].forEach(sx => {
    // Upper leg
    const upperLeg = mkMesh(new THREE.CylinderGeometry(0.09, 0.085, 0.28, 7), recipe.pants, pid)
    upperLeg.position.set(sx * 0.11, 0.14, 0)
    bodyGroup.add(upperLeg)

    // Knee
    const knee = mkMesh(new THREE.SphereGeometry(0.082, 6, 5), recipe.pants, pid)
    knee.position.set(sx * 0.11, -0.02, 0)
    bodyGroup.add(knee)

    // Lower leg
    const lowerLeg = mkMesh(new THREE.CylinderGeometry(0.080, 0.072, 0.24, 7), recipe.pants, pid)
    lowerLeg.position.set(sx * 0.11, -0.15, 0)
    bodyGroup.add(lowerLeg)

    // Foot / shoe
    const shoe = mkMesh(new THREE.BoxGeometry(0.12, 0.065, 0.18), recipe.shoes, pid)
    shoe.position.set(sx * 0.11, -0.30, 0.03)
    bodyGroup.add(shoe)

    // Sandal straps for toga-wearing philosophers
    if (recipe.sandals) {
      const strap = mkMesh(new THREE.BoxGeometry(0.13, 0.014, 0.19), '#4a3020', pid)
      strap.position.set(sx * 0.11, -0.268, 0.03)
      bodyGroup.add(strap)
      const strap2 = mkMesh(new THREE.BoxGeometry(0.014, 0.035, 0.19), '#4a3020', pid)
      strap2.position.set(sx * 0.11, -0.278, 0.03)
      bodyGroup.add(strap2)
    }
  })

  return bodyGroup
}

// ---------------------------------------------------------------------------
// FALLBACK CHARACTER — for any philosopher missing from RECIPES
// ---------------------------------------------------------------------------
function buildFallbackCharacter(philosopher) {
  const group = new THREE.Group()
  group.userData.philosopherId = philosopher.id
  group.userData.philosopherName = philosopher.name

  const bodyColor = philosopher.color || '#7c3aed'
  const skinColor = philosopher.skinColor || '#c8956c'

  const body = mkMesh(new THREE.CylinderGeometry(0.20, 0.18, 0.70, 8), bodyColor, philosopher.id)
  body.position.y = 0.65
  group.add(body)

  const headGeo = new THREE.SphereGeometry(0.28, 10, 8)
  const headMesh = mkMesh(headGeo, skinColor, philosopher.id)
  headMesh.position.y = 1.10
  group.add(headMesh)

  const jawGeo = new THREE.BoxGeometry(0.20, 0.06, 0.22)
  const jaw = mkMesh(jawGeo, skinColor, philosopher.id)
  jaw.position.set(0, 0.88, 0.04)
  group.add(jaw)

  group.userData.jaw = jaw
  group.userData.head = headMesh

  return group
}

// ---------------------------------------------------------------------------
// MAIN EXPORT: buildCharacter
// ---------------------------------------------------------------------------
export function buildCharacter(philosopher) {
  const recipe = RECIPES[philosopher.id]
  if (!recipe) return buildFallbackCharacter(philosopher)

  const root = new THREE.Group()
  root.userData.philosopherId = philosopher.id
  root.userData.philosopherName = philosopher.name
  root.userData.idlePhase = Math.random() * Math.PI * 2

  // Body group — feet sit at y=0, body extends up
  const bodyGroup = buildBody(recipe, philosopher.id)
  // bodyGroup is already positioned: feet at ~y=0, head-base at ~y=0.92
  root.add(bodyGroup)

  // Head group — placed on top of neck
  const { headGroup, jaw } = buildHead(recipe, philosopher.id)
  headGroup.position.y = 1.00   // neck top + head center offset
  root.add(headGroup)

  root.userData.jaw = jaw
  root.userData.head = headGroup

  return root
}

// ---------------------------------------------------------------------------
// ANIMATION TICK HELPERS (called externally from World.js)
// ---------------------------------------------------------------------------

/**
 * Animate jaw for talking — oscillates the jaw mesh up and down
 */
export function applyTalkingTick(root, t) {
  const jaw = root.userData.jaw
  if (jaw) {
    jaw.position.y = -0.06 + Math.abs(Math.sin(t * 9)) * 0.055
  }
}

/**
 * Gentle head-turn for listening
 */
export function applyListeningTick(root, t) {
  const head = root.userData.head
  if (head) {
    head.rotation.y = Math.sin(t * 1.5) * 0.08
  }
}

/**
 * Subtle idle float
 */
export function applyIdleTick(root, t) {
  const phase = root.userData.idlePhase || 0
  root.position.y += Math.sin(t * 1.2 + phase) * 0.0005
}
