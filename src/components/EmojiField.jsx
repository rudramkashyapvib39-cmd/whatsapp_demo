import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const EMOJI_LAYOUT = [
  { emoji: '😂', radius: 2.6, speed: 0.35, height: 0.6, phaseOffset: 0 },
  { emoji: '🔥', radius: 2.9, speed: -0.28, height: -0.4, phaseOffset: 1.1 },
  { emoji: '👀', radius: 2.3, speed: 0.42, height: 1.1, phaseOffset: 2.4 },
  { emoji: '❤️', radius: 3.1, speed: -0.22, height: -0.9, phaseOffset: 3.6 },
  { emoji: '💀', radius: 2.5, speed: 0.3, height: -1.3, phaseOffset: 4.8 },
]

function OrbitingEmoji({ emoji, radius, speed, height, phaseOffset, breakSignal }) {
  const groupRef = useRef()
  const angleRef = useRef(phaseOffset * 10)
  const velocity = useRef(new THREE.Vector3())
  const spin = useRef(new THREE.Vector3())
  const lastSignal = useRef(0)
  const [dead, setDead] = useState(false)
  const [fading, setFading] = useState(false)

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (breakSignal !== lastSignal.current) {
      lastSignal.current = breakSignal
      setDead(true)
      // violent, wide scatter with an upward "shock" kick before gravity wins
      velocity.current.set((Math.random() - 0.5) * 6, Math.random() * 3.5 + 2, (Math.random() - 0.5) * 6)
      spin.current.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12)
      setTimeout(() => setFading(true), 320)
    }

    if (!groupRef.current) return

    if (!dead) {
      angleRef.current += delta * speed
      groupRef.current.position.x = Math.cos(angleRef.current) * radius
      groupRef.current.position.z = Math.sin(angleRef.current) * radius
      groupRef.current.position.y = height + Math.sin(t * 1.3 + phaseOffset) * 0.25
    } else {
      const gravity = 6.5
      velocity.current.y -= gravity * delta
      groupRef.current.position.x += velocity.current.x * delta
      groupRef.current.position.y += velocity.current.y * delta
      groupRef.current.position.z += velocity.current.z * delta
      groupRef.current.rotation.x += spin.current.x * delta
      groupRef.current.rotation.y += spin.current.y * delta
      groupRef.current.rotation.z += spin.current.z * delta
    }
  })

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={9} style={{ pointerEvents: 'none' }}>
        <div
          className={`floating-emoji${fading ? ' floating-emoji--fading' : ''}${dead ? ' floating-emoji--dead' : ''}`}
          style={{ fontSize: '2.1rem' }}
        >
          {dead ? '💀' : emoji}
        </div>
      </Html>
    </group>
  )
}

export default function EmojiField({ phase, breakSignal }) {
  return (
    <group>
      {EMOJI_LAYOUT.map((cfg, i) => (
        <OrbitingEmoji key={i} {...cfg} phase={phase} breakSignal={breakSignal} />
      ))}
    </group>
  )
}