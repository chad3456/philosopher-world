import * as THREE from 'three'
import { buildCharacter, applyTalkingTick, applyListeningTick, applyIdleTick } from './CharacterBuilder.js'

function terrainHeight(x, z) {
  return Math.sin(x * 0.1) * 3 + Math.sin(z * 0.15) * 2 + Math.sin(x * 0.3 + z * 0.2) * 1 + 2
}

export class World {
  constructor(canvas) {
    this.canvas = canvas
    this.speechBubbles = new Map()
    this.philosopherMeshes = new Map()
    this.philosopherStates = new Map()
    this.clock = new THREE.Clock()
    this.dayTime = 0
    this.fireflies = []
    this.onFrame = null
    this.onPhilosopherClick = null

    this._initRenderer()
    this._initScene()
    this._initCamera()
    this._initLights()
    this._initMouseControls()
    this._initRaycaster()
    this.buildTerrain()
    this.buildPaths()
    this.buildTrees()
    this.buildEnvironmentDetails()
    this.buildFireflies()
    this._startAnimationLoop()
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    window.addEventListener('resize', () => {
      const w = this.canvas.clientWidth
      const h = this.canvas.clientHeight
      this.renderer.setSize(w, h)
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix()
    })
  }

  _initScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0810)
    this.scene.fog = new THREE.FogExp2(0x1a1408, 0.018)
  }

  _initCamera() {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 500)
    this.camera.position.set(0, 22, 32)
    this.camera.lookAt(0, 0, 0)

    // Orbit control state
    this._orbit = {
      theta: 0,
      phi: Math.PI / 4,
      radius: 38,
      target: new THREE.Vector3(0, 0, 0),
      isDragging: false,
      lastX: 0,
      lastY: 0,
      isPanning: false
    }
  }

  _initMouseControls() {
    const canvas = this.canvas

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 2 || e.altKey) {
        this._orbit.isPanning = true
      } else {
        this._orbit.isDragging = true
      }
      this._orbit.lastX = e.clientX
      this._orbit.lastY = e.clientY
    })

    window.addEventListener('mousemove', (e) => {
      const dx = e.clientX - this._orbit.lastX
      const dy = e.clientY - this._orbit.lastY
      this._orbit.lastX = e.clientX
      this._orbit.lastY = e.clientY

      if (this._orbit.isDragging) {
        this._orbit.theta -= dx * 0.008
        this._orbit.phi = Math.max(0.15, Math.min(Math.PI / 2.2, this._orbit.phi + dy * 0.006))
        this._updateCameraFromOrbit()
      } else if (this._orbit.isPanning) {
        const right = new THREE.Vector3()
        const up = new THREE.Vector3(0, 1, 0)
        right.crossVectors(this.camera.getWorldDirection(new THREE.Vector3()), up).normalize()
        const panSpeed = 0.04 * (this._orbit.radius / 30)
        this._orbit.target.addScaledVector(right, -dx * panSpeed)
        this._orbit.target.y = Math.max(0, this._orbit.target.y + dy * panSpeed * 0.5)
        this._updateCameraFromOrbit()
      }
    })

    window.addEventListener('mouseup', () => {
      this._orbit.isDragging = false
      this._orbit.isPanning = false
    })

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault()
      this._orbit.radius = Math.max(8, Math.min(80, this._orbit.radius + e.deltaY * 0.04))
      this._updateCameraFromOrbit()
    }, { passive: false })

    canvas.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  _updateCameraFromOrbit() {
    const { theta, phi, radius, target } = this._orbit
    const x = target.x + radius * Math.sin(phi) * Math.sin(theta)
    const y = target.y + radius * Math.cos(phi)
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta)
    this.camera.position.set(x, y, z)
    this.camera.lookAt(target)
  }

  _initLights() {
    // Ambient
    this.ambientLight = new THREE.AmbientLight(0xfff3d0, 0.4)
    this.scene.add(this.ambientLight)

    // Sun directional
    this.sunLight = new THREE.DirectionalLight(0xfff5c0, 1.2)
    this.sunLight.position.set(30, 50, 20)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.width = 2048
    this.sunLight.shadow.mapSize.height = 2048
    this.sunLight.shadow.camera.near = 0.5
    this.sunLight.shadow.camera.far = 200
    this.sunLight.shadow.camera.left = -60
    this.sunLight.shadow.camera.right = 60
    this.sunLight.shadow.camera.top = 60
    this.sunLight.shadow.camera.bottom = -60
    this.sunLight.shadow.bias = -0.001
    this.scene.add(this.sunLight)

    // Warm fill light from opposite side
    this.fillLight = new THREE.DirectionalLight(0xff9966, 0.3)
    this.fillLight.position.set(-20, 15, -30)
    this.scene.add(this.fillLight)

    // Campfire point lights
    const campfirePositions = [
      [-2, 0, 2], [3, 0, -3], [-5, 0, -1]
    ]
    this.campfireLights = []
    campfirePositions.forEach(([x, _, z]) => {
      const h = terrainHeight(x, z) + 0.8
      const light = new THREE.PointLight(0xff6622, 1.5, 12)
      light.position.set(x, h, z)
      this.scene.add(light)
      this.campfireLights.push(light)
    })
  }

  _initRaycaster() {
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.canvas.addEventListener('click', (e) => {
      if (Math.abs(e.movementX) > 3 || Math.abs(e.movementY) > 3) return
      const rect = this.canvas.getBoundingClientRect()
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)
      const meshes = []
      this.philosopherMeshes.forEach((group) => {
        group.traverse((child) => {
          if (child.isMesh) meshes.push(child)
        })
      })

      const intersects = this.raycaster.intersectObjects(meshes, false)
      if (intersects.length > 0) {
        const hit = intersects[0].object
        const id = hit.userData.philosopherId
        if (id && this.onPhilosopherClick) {
          this.onPhilosopherClick(id)
        }
      }
    })
  }

  buildTerrain() {
    const size = 200
    const segments = 64
    const geo = new THREE.PlaneGeometry(size, size, segments, segments)
    geo.rotateX(-Math.PI / 2)

    const positions = geo.attributes.position
    const colors = []

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const z = positions.getZ(i)
      const h = terrainHeight(x, z)
      positions.setY(i, h)

      // Vertex color: green grass with brown dirt in low spots
      const t = Math.max(0, Math.min(1, (h - 0) / 6))
      const r = 0.18 + t * 0.08 + (Math.random() * 0.04 - 0.02)
      const g = 0.32 + t * 0.15 + (Math.random() * 0.04 - 0.02)
      const b = 0.10 + t * 0.04 + (Math.random() * 0.02 - 0.01)
      colors.push(r, g, b)
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geo.computeVertexNormals()

    const mat = new THREE.MeshLambertMaterial({
      vertexColors: true
    })

    this.terrain = new THREE.Mesh(geo, mat)
    this.terrain.receiveShadow = true
    this.terrain.name = 'terrain'
    this.scene.add(this.terrain)
  }

  buildVillage(philosophersData) {
    philosophersData.forEach((phil) => {
      this._buildHut(phil)
    })
  }

  _buildHut(phil) {
    const group = new THREE.Group()
    const { x, z } = phil.position
    const y = terrainHeight(x, z)
    group.position.set(x, y, z)

    const wallMat = new THREE.MeshLambertMaterial({ color: 0x8b6914 })
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x7a2020 })
    const doorMat = new THREE.MeshLambertMaterial({ color: 0x3d1f0a })
    const chimneyMat = new THREE.MeshLambertMaterial({ color: 0x555555 })
    const labelMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(phil.color) })

    // Walls
    const wallGeo = new THREE.BoxGeometry(1.5, 1.2, 1.5)
    const walls = new THREE.Mesh(wallGeo, wallMat)
    walls.position.set(0, 0.6, 0)
    walls.castShadow = true
    walls.receiveShadow = true
    group.add(walls)

    // Roof
    const roofGeo = new THREE.ConeGeometry(1.2, 1.0, 6)
    const roof = new THREE.Mesh(roofGeo, roofMat)
    roof.position.set(0, 1.7, 0)
    roof.castShadow = true
    group.add(roof)

    // Door
    const doorGeo = new THREE.BoxGeometry(0.35, 0.65, 0.05)
    const door = new THREE.Mesh(doorGeo, doorMat)
    door.position.set(0, 0.33, 0.78)
    group.add(door)

    // Chimney
    const chimneyGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2)
    const chimney = new THREE.Mesh(chimneyGeo, chimneyMat)
    chimney.position.set(0.4, 1.9, 0.4)
    chimney.castShadow = true
    group.add(chimney)

    // Color accent strip on roof
    const accentGeo = new THREE.TorusGeometry(0.65, 0.04, 6, 12)
    const accentMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(phil.color) })
    const accent = new THREE.Mesh(accentGeo, accentMat)
    accent.position.set(0, 1.15, 0)
    accent.rotation.x = Math.PI / 2
    group.add(accent)

    // Name label above hut
    const labelSprite = this._createTextSprite(phil.name.split(' ').pop(), phil.color, 0.9)
    labelSprite.position.set(0, 2.6, 0)
    labelSprite.scale.set(2.2, 0.7, 1)
    group.add(labelSprite)

    this.scene.add(group)
  }

  _createTextSprite(text, color, opacity = 1.0) {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 256, 64)

    // Background pill
    const c = new THREE.Color(color)
    ctx.fillStyle = `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, 0.75)`
    ctx.beginPath()
    ctx.roundRect(4, 4, 248, 56, 12)
    ctx.fill()

    // Text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 128, 32)

    const texture = new THREE.CanvasTexture(canvas)
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity })
    return new THREE.Sprite(mat)
  }

  buildTrees() {
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5c3a1e })
    const leavesMat = new THREE.MeshLambertMaterial({ color: 0x2d6a2d })
    const leavesMat2 = new THREE.MeshLambertMaterial({ color: 0x1f5c1f })

    // Avoid center area (philosopher zone)
    const treePositions = [
      [-35, -30], [-28, -20], [-40, 5], [-32, 15], [-38, -10],
      [35, -30], [28, -20], [40, 5], [32, 15], [38, -10],
      [-20, -40], [0, -45], [20, -40], [-10, -38], [10, -38],
      [-20, 35], [0, 40], [20, 35], [-10, 38], [10, 38],
      [-45, 25], [45, 25], [-45, -25], [45, -25],
      [-25, -15], [25, -15], [-25, 18], [25, 18],
      [-18, 10], [18, 10], [-16, -12], [16, -12],
      [-50, 0], [50, 0], [0, -55], [0, 55],
      [-42, 42], [42, 42], [-42, -42], [42, -42]
    ]

    treePositions.forEach(([tx, tz]) => {
      const h = terrainHeight(tx, tz)
      const treeGroup = new THREE.Group()
      treeGroup.position.set(tx, h, tz)

      const scale = 0.7 + Math.random() * 0.6

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 1.0 * scale, 6)
      const trunk = new THREE.Mesh(trunkGeo, trunkMat)
      trunk.position.y = 0.5 * scale
      trunk.castShadow = true
      treeGroup.add(trunk)

      // Leaves (layered cones for nicer look)
      const leavesColor = Math.random() > 0.5 ? leavesMat : leavesMat2
      for (let i = 0; i < 3; i++) {
        const r = (1.0 - i * 0.2) * scale
        const leavesGeo = new THREE.ConeGeometry(r * 0.7, r * 0.9, 7)
        const leaves = new THREE.Mesh(leavesGeo, leavesColor)
        leaves.position.y = (0.9 + i * 0.55) * scale
        leaves.castShadow = true
        treeGroup.add(leaves)
      }

      this.scene.add(treeGroup)
    })
  }

  buildPaths() {
    // Stone path material
    const pathMat = new THREE.MeshLambertMaterial({ color: 0x8a7e6e })

    // Center gathering point
    const philosopherPositions = [
      [-8, -6], [8, -6], [0, -10], [-12, 2], [12, 2],
      [-6, 6], [6, 6], [0, 8], [-10, -2], [10, -2]
    ]

    // Draw rough paths from each philosopher toward center
    philosopherPositions.forEach(([px, pz]) => {
      const steps = 6
      for (let s = 0; s < steps; s++) {
        const t = s / steps
        const cx = px * (1 - t)
        const cz = pz * (1 - t)
        const cy = terrainHeight(cx, cz) + 0.03
        const stoneGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 6)
        const stone = new THREE.Mesh(stoneGeo, pathMat)
        stone.position.set(
          cx + (Math.random() - 0.5) * 0.4,
          cy,
          cz + (Math.random() - 0.5) * 0.4
        )
        stone.rotation.y = Math.random() * Math.PI
        stone.receiveShadow = true
        this.scene.add(stone)
      }
    })
  }

  buildEnvironmentDetails() {
    // Add some rocks
    const rockMat = new THREE.MeshLambertMaterial({ color: 0x6b6560 })
    const rockPositions = [
      [-3, -4], [4, 2], [-7, 3], [2, -7], [-5, -8], [9, 5], [-11, -5], [7, -9]
    ]
    rockPositions.forEach(([rx, rz]) => {
      const h = terrainHeight(rx, rz)
      const scale = 0.15 + Math.random() * 0.2
      const rockGeo = new THREE.DodecahedronGeometry(scale, 0)
      const rock = new THREE.Mesh(rockGeo, rockMat)
      rock.position.set(rx, h + scale * 0.5, rz)
      rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      rock.castShadow = true
      rock.receiveShadow = true
      this.scene.add(rock)
    })

    // Add a central well/gathering point
    const wellGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.6, 12, 1, true)
    const wellMat = new THREE.MeshLambertMaterial({ color: 0x8a7060, side: THREE.DoubleSide })
    const well = new THREE.Mesh(wellGeo, wellMat)
    const wellH = terrainHeight(0, 0)
    well.position.set(0, wellH + 0.3, 0)
    well.castShadow = true
    this.scene.add(well)

    const wellTopGeo = new THREE.TorusGeometry(0.65, 0.06, 8, 16)
    const wellTop = new THREE.Mesh(wellTopGeo, new THREE.MeshLambertMaterial({ color: 0x7a6555 }))
    wellTop.position.set(0, wellH + 0.62, 0)
    wellTop.rotation.x = Math.PI / 2
    this.scene.add(wellTop)
  }

  buildFireflies() {
    const ffGeo = new THREE.SphereGeometry(0.04, 4, 4)
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 15
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = terrainHeight(x, z) + 0.5 + Math.random() * 2.5

      const brightness = 0.6 + Math.random() * 0.4
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.3 * brightness, 1.0 * brightness, 0.3 * brightness),
        transparent: true,
        opacity: 0.8
      })
      const ff = new THREE.Mesh(ffGeo, mat)
      ff.position.set(x, y, z)
      ff.userData.basePos = { x, y, z }
      ff.userData.phase = Math.random() * Math.PI * 2
      ff.userData.speed = 0.3 + Math.random() * 0.5
      ff.userData.radius = 0.5 + Math.random() * 1.5
      this.scene.add(ff)
      this.fireflies.push(ff)
    }
  }

  addPhilosopher(philosopherData) {
    if (this.philosopherMeshes.has(philosopherData.id)) return

    // Build the detailed chibi character
    const group = buildCharacter(philosopherData)

    // Position on terrain
    const { x, z } = philosopherData.position
    const h = terrainHeight(x, z)
    group.position.set(x, h, z)

    this.philosopherMeshes.set(philosopherData.id, group)
    this.philosopherStates.set(philosopherData.id, {
      state: 'wandering',
      bobPhase: Math.random() * Math.PI * 2
    })
    this.scene.add(group)
  }

  updatePhilosopher(id, position, state) {
    const group = this.philosopherMeshes.get(id)
    if (!group) return

    const terrain_y = terrainHeight(position.x, position.z)
    const stateData = this.philosopherStates.get(id) || { bobPhase: 0 }
    stateData.state = state

    // Smooth position lerp
    group.position.x += (position.x - group.position.x) * 0.1
    group.position.z += (position.z - group.position.z) * 0.1
    group.position.y += (terrain_y - group.position.y) * 0.15

    // Face direction of movement
    const dx = position.x - group.position.x
    const dz = position.z - group.position.z
    if (Math.abs(dx) + Math.abs(dz) > 0.01) {
      const targetAngle = Math.atan2(dx, dz)
      group.rotation.y += (targetAngle - group.rotation.y) * 0.1
    }

    // State-based animations using CharacterBuilder helpers
    const t = this.clock.getElapsedTime()
    if (state === 'wandering') {
      stateData.bobPhase = (stateData.bobPhase || 0) + 0.08
      group.position.y += Math.sin(stateData.bobPhase) * 0.025
      applyIdleTick(group, t)
      applyListeningTick(group, t)
    } else if (state === 'talking') {
      stateData.bobPhase = (stateData.bobPhase || 0) + 0.025
      group.rotation.y += Math.sin(stateData.bobPhase) * 0.004
      applyTalkingTick(group, t)
    }

    this.philosopherStates.set(id, stateData)
  }

  showSpeechBubble(philosopherId, text, duration = 6000) {
    // Remove existing bubble for this philosopher
    this._removeSpeechBubble(philosopherId)

    const group = this.philosopherMeshes.get(philosopherId)
    if (!group) return

    // Create canvas texture
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 200
    const ctx = canvas.getContext('2d')

    // Get philosopher color from mesh
    let color = '#7c3aed'
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const c = child.material.color
        // Take body color (roughly)
        if (child.geometry && child.geometry.type === 'CylinderGeometry') {
          const hex = '#' + c.getHexString()
          if (hex !== '#000000') color = hex
        }
      }
    })

    // Truncate text
    const maxChars = 90
    const displayText = text.length > maxChars ? text.slice(0, maxChars - 3) + '...' : text

    // Draw background
    const colorObj = new THREE.Color(color)
    const r = Math.round(colorObj.r * 255)
    const g = Math.round(colorObj.g * 255)
    const b = Math.round(colorObj.b * 255)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`
    ctx.beginPath()
    ctx.roundRect(8, 8, 496, 160, 16)
    ctx.fill()

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(8, 8, 496, 160, 16)
    ctx.stroke()

    // Pointer triangle at bottom
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`
    ctx.beginPath()
    ctx.moveTo(240, 172)
    ctx.lineTo(256, 192)
    ctx.lineTo(272, 172)
    ctx.fill()

    // Text wrapping
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = '18px serif'
    ctx.textAlign = 'center'

    const words = displayText.split(' ')
    const lines = []
    let currentLine = ''
    const maxWidth = 450

    words.forEach((word) => {
      const testLine = currentLine ? currentLine + ' ' + word : word
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })
    if (currentLine) lines.push(currentLine)

    const lineHeight = 26
    const totalH = lines.length * lineHeight
    const startY = 88 - totalH / 2 + lineHeight / 2

    lines.forEach((line, i) => {
      ctx.fillText(line, 256, startY + i * lineHeight)
    })

    const texture = new THREE.CanvasTexture(canvas)
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    })
    const sprite = new THREE.Sprite(spriteMat)
    sprite.scale.set(3.5, 1.4, 1)
    sprite.position.set(
      group.position.x,
      group.position.y + 2.2,
      group.position.z
    )
    sprite.userData.followId = philosopherId

    this.scene.add(sprite)

    const timer = setTimeout(() => {
      this._removeSpeechBubble(philosopherId)
    }, duration)

    this.speechBubbles.set(philosopherId, { sprite, timer })
  }

  clearSpeechBubble(philosopherId) {
    this._removeSpeechBubble(philosopherId)
  }

  setCharacterState(id, state) {
    const stateData = this.philosopherStates.get(id)
    if (stateData) stateData.state = state
  }

  faceToward(fromId, towardId) {
    const from = this.philosopherMeshes.get(fromId)
    const to = this.philosopherMeshes.get(towardId)
    if (!from || !to) return
    const dx = to.position.x - from.position.x
    const dz = to.position.z - from.position.z
    if (Math.abs(dx) + Math.abs(dz) > 0.01) {
      from.rotation.y = Math.atan2(dx, dz)
    }
  }

  _removeSpeechBubble(philosopherId) {
    const existing = this.speechBubbles.get(philosopherId)
    if (existing) {
      clearTimeout(existing.timer)
      this.scene.remove(existing.sprite)
      existing.sprite.material.map.dispose()
      existing.sprite.material.dispose()
      this.speechBubbles.delete(philosopherId)
    }
  }

  _updateSpeechBubblePositions() {
    this.speechBubbles.forEach((bubble, id) => {
      const group = this.philosopherMeshes.get(id)
      if (group) {
        bubble.sprite.position.set(
          group.position.x,
          group.position.y + 2.2,
          group.position.z
        )
      }
    })
  }

  _updateDayNightCycle(elapsed) {
    // Cycle: 3 minutes = 180 seconds
    this.dayTime = (elapsed % 180) / 180

    // Day: warm yellow, Night: deep blue
    const dayIntensity = 0.5 + 0.5 * Math.cos(this.dayTime * Math.PI * 2 - Math.PI)
    const nightFactor = 1 - dayIntensity

    // Ambient
    const dayAmbient = new THREE.Color(0xfff3d0)
    const nightAmbient = new THREE.Color(0x101830)
    this.ambientLight.color.lerpColors(nightAmbient, dayAmbient, dayIntensity)
    this.ambientLight.intensity = 0.15 + dayIntensity * 0.45

    // Sun
    const dayColor = new THREE.Color(0xfff5c0)
    const sunsetColor = new THREE.Color(0xff8844)
    const nightColor = new THREE.Color(0x1a2040)
    if (dayIntensity > 0.5) {
      this.sunLight.color.lerpColors(sunsetColor, dayColor, (dayIntensity - 0.5) * 2)
    } else {
      this.sunLight.color.lerpColors(nightColor, sunsetColor, dayIntensity * 2)
    }
    this.sunLight.intensity = 0.1 + dayIntensity * 1.4

    // Sky/fog color
    const dayFog = new THREE.Color(0x2a2010)
    const nightFog = new THREE.Color(0x050510)
    this.scene.fog.color.lerpColors(nightFog, dayFog, dayIntensity)
    this.scene.background.copy(this.scene.fog.color)

    // Campfire lights more visible at night
    this.campfireLights.forEach((light, i) => {
      const flicker = Math.sin(elapsed * 3.7 + i * 1.3) * 0.3 + 0.7
      light.intensity = (0.8 + nightFactor * 1.2) * flicker
    })
  }

  _updateFireflies(elapsed) {
    this.fireflies.forEach((ff) => {
      const { basePos, phase, speed, radius } = ff.userData
      ff.position.x = basePos.x + Math.cos(elapsed * speed + phase) * radius
      ff.position.y = basePos.y + Math.sin(elapsed * speed * 0.7 + phase) * 0.5
      ff.position.z = basePos.z + Math.sin(elapsed * speed + phase + 1.5) * radius

      // Blink
      const blink = 0.4 + 0.6 * Math.max(0, Math.sin(elapsed * 2.1 + phase * 3))
      ff.material.opacity = blink * 0.9
    })
  }

  _startAnimationLoop() {
    const animate = () => {
      this.rafId = requestAnimationFrame(animate)
      const elapsed = this.clock.getElapsedTime()

      this._updateDayNightCycle(elapsed)
      this._updateFireflies(elapsed)
      this._updateSpeechBubblePositions()

      if (this.onFrame) this.onFrame(elapsed)

      this.renderer.render(this.scene, this.camera)
    }
    animate()
  }

  dispose() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.renderer.dispose()
    this.scene.clear()
  }
}
