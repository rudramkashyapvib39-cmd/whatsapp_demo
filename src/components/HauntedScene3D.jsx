import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Returns a fn that gives elapsed seconds since `stage` last changed.
 * Lets each figure animate purely off (stage, elapsed) with no external clock plumbing.
 */
function useStageClock(stage) {
  const stageRef = useRef(stage)
  const startRef = useRef(performance.now())
  if (stageRef.current !== stage) {
    stageRef.current = stage
    startRef.current = performance.now()
  }
  return () => (performance.now() - startRef.current) / 1000
}

function SkullFigure({ stage }) {
  const group = useRef()
  const leg = useRef()
  const elapsed = useStageClock(stage)

  useFrame(() => {
    if (!group.current) return
    const t = elapsed()

    if (stage === 'kick') {
      const approach = Math.min(t / 0.7, 1)
      group.current.position.x = THREE.MathUtils.lerp(-3.4, -0.95, easeOutCubic(approach))
      group.current.rotation.y = Math.sin(t * 6) * 0.03

      const kickT = clamp01((t - 0.7) / 0.35)
      if (leg.current) leg.current.rotation.x = Math.sin(kickT * Math.PI) * 1.7
    } else if (stage === 'fall' || stage === 'hell' || stage === 'message') {
      group.current.position.x = -0.95
      if (leg.current) leg.current.rotation.x = 0
      group.current.rotation.y = Math.sin(t * 1.5) * 0.05
    }
  })

  return (
    <group ref={group} position={[-3.4, -0.4, 0]}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.32, 0.4, 1.1, 8]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#e7e2d6" roughness={0.55} />
      </mesh>
      <mesh position={[-0.15, 1.48, 0.34]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff1a1a" emissive="#ff1a1a" emissiveIntensity={2.6} />
      </mesh>
      <mesh position={[0.15, 1.48, 0.34]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff1a1a" emissive="#ff1a1a" emissiveIntensity={2.6} />
      </mesh>
      <mesh position={[-0.15, -0.15, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.9, 6]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
      <group ref={leg} position={[0.15, 0.3, 0]}>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.9, 6]} />
          <meshStandardMaterial color="#0d0d0d" />
        </mesh>
      </group>
    </group>
  )
}

function HumanFigure({ stage }) {
  const group = useRef()
  const elapsed = useStageClock(stage)

  useFrame(() => {
    if (!group.current) return
    const t = elapsed()

    if (stage === 'kick') {
      const impact = Math.max(0, t - 1.02)
      group.current.position.x = THREE.MathUtils.lerp(0, 0.3, clamp01(impact / 0.3))
      group.current.rotation.z = -Math.min(impact * 2.4, 1.1)
    } else if (stage === 'fall') {
      const fallT = clamp01(t / 1.1)
      group.current.position.y = THREE.MathUtils.lerp(0.2, -5.6, fallT)
      group.current.position.x = THREE.MathUtils.lerp(0.3, 1.5, fallT)
      group.current.rotation.z = -1.1 - fallT * 3.6
      group.current.rotation.x = fallT * 2.2
      group.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.3, fallT))
      group.current.visible = true
    } else if (stage === 'hell' || stage === 'message') {
      group.current.visible = false
    } else {
      group.current.visible = true
      group.current.position.set(0, 0.2, 0)
      group.current.rotation.set(0, 0, 0)
      group.current.scale.setScalar(1)
    }
  })

  return (
    <group ref={group} position={[0, 0.2, 0]}>
      <mesh position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.28, 0.7, 4, 8]} />
        <meshStandardMaterial color="#c9b79c" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshStandardMaterial color="#e7c9a9" roughness={0.6} />
      </mesh>
    </group>
  )
}

function HellGlow({ stage }) {
  const light = useRef()
  const elapsed = useStageClock(stage)

  useFrame(() => {
    if (!light.current) return
    const t = elapsed()
    if (stage === 'fall') {
      light.current.intensity = THREE.MathUtils.lerp(0, 3.4, clamp01(t / 1.1))
    } else if (stage === 'hell' || stage === 'message') {
      light.current.intensity = 3.2 + Math.sin(t * 14) * 0.6
    } else {
      light.current.intensity = 0
    }
  })

  return <pointLight ref={light} position={[1, -3.5, 1]} color="#ff5a1f" distance={9} />
}

function ShakyCamera({ stage }) {
  const elapsed = useStageClock(stage)
  useFrame(({ camera }) => {
    const t = elapsed()
    let mag = 0
    if (stage === 'kick' && t > 0.7) mag = 0.05
    if (stage === 'fall') mag = 0.08
    if (stage === 'hell') mag = 0.14
    camera.position.x = Math.sin(t * 40) * mag
    camera.position.y = 0.4 + Math.cos(t * 33) * mag
  })
  return null
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default function HauntedScene3D({ stage }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.4, 6.2], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#050303']} />
      <fog attach="fog" args={['#050303', 7, 15]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 4, 4]} intensity={0.5} color="#d9d9d9" />

      <HellGlow stage={stage} />
      <ShakyCamera stage={stage} />

      <Suspense fallback={null}>
        <SkullFigure stage={stage} />
        <HumanFigure stage={stage} />
        {(stage === 'fall' || stage === 'hell' || stage === 'message') && (
          <Sparkles
            count={140}
            scale={[6, 4, 4]}
            position={[0.8, -3, 0]}
            size={4}
            speed={0.6}
            opacity={0.85}
            color="#ff6a2b"
          />
        )}
      </Suspense>
    </Canvas>
  )
}
