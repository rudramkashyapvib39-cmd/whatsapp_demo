import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMouseParallax } from '../hooks/useMouseParallax'
import ShardBurst from './ShardBurst'

// Builds the rounded speech-bubble silhouette (with tail) as a 2D shape,
// later extruded into a 3D piece.
function buildBubbleShape() {
  const shape = new THREE.Shape()
  const w = 1.6
  const h = 1.6
  const r = 0.45

  shape.moveTo(-w / 2 + r, -h / 2)
  shape.lineTo(w / 2 - r, -h / 2)
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  shape.lineTo(w / 2, h / 2 - r)
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  shape.lineTo(-w / 2 + r, h / 2)
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  shape.lineTo(-w / 2, -h / 2 + r * 1.8)
  // little tail notch built into the same silhouette
  shape.lineTo(-w / 2 - 0.28, -h / 2 - 0.22)
  shape.lineTo(-w / 2 + r * 0.9, -h / 2 + r * 0.5)
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)

  return shape
}

const EXTRUDE_SETTINGS = { depth: 0.32, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3 }

function Piece({ pieceRef, geometry, material, homePosition, homeRotation }) {
  return (
    <mesh
      ref={pieceRef}
      geometry={geometry}
      material={material}
      position={homePosition}
      rotation={homeRotation}
      castShadow
    />
  )
}

export default function Logo3D({ phase, breakSignal }) {
  const parallaxGroup = useRef()
  const spinGroup = useRef()
  const pointer = useMouseParallax()

  const bubbleRef = useRef()
  const tailRef = useRef()
  const phoneArcRef = useRef()
  const phoneCapARef = useRef()
  const phoneCapBRef = useRef()
  const impactLightRef = useRef()

  const breakState = useRef(null)
  const [shardsActive, setShardsActive] = useState(false)

  const bubbleGeometry = useMemo(() => {
    const shape = buildBubbleShape()
    const geo = new THREE.ExtrudeGeometry(shape, EXTRUDE_SETTINGS)
    geo.center()
    return geo
  }, [])

  const tailGeometry = useMemo(() => new THREE.ConeGeometry(0.14, 0.32, 3), [])
  const phoneArcGeometry = useMemo(() => new THREE.TorusGeometry(0.36, 0.075, 16, 32, Math.PI * 1.4), [])
  const capGeometry = useMemo(() => new THREE.SphereGeometry(0.1, 16, 16), [])

  const makeGreenMaterial = () =>
    new THREE.MeshStandardMaterial({
      color: '#25d366',
      roughness: 0.35,
      metalness: 0.15,
      emissive: '#0d3d20',
      emissiveIntensity: 0.4,
      transparent: true,
    })
  const makeCreamMaterial = () =>
    new THREE.MeshStandardMaterial({
      color: '#f5f7f6',
      roughness: 0.3,
      metalness: 0.05,
      transparent: true,
    })

  const bubbleMaterial = useMemo(makeGreenMaterial, [])
  const tailMaterial = useMemo(makeGreenMaterial, [])
  const phoneArcMaterial = useMemo(makeCreamMaterial, [])
  const phoneCapAMaterial = useMemo(makeCreamMaterial, [])
  const phoneCapBMaterial = useMemo(makeCreamMaterial, [])

  const lastSignal = useRef(0)

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (phase === 'idle' || phase === 'breaking') {
      if (phase === 'idle' && spinGroup.current) {
        spinGroup.current.rotation.y += delta * 0.35
      }
      if (parallaxGroup.current) {
        parallaxGroup.current.position.y = Math.sin(t * 0.9) * 0.18
        const targetTiltX = pointer.current.y * -0.18
        const targetTiltZ = pointer.current.x * 0.14
        parallaxGroup.current.rotation.x = THREE.MathUtils.lerp(
          parallaxGroup.current.rotation.x,
          phase === 'idle' ? targetTiltX : parallaxGroup.current.rotation.x,
          0.06
        )
        parallaxGroup.current.rotation.z = THREE.MathUtils.lerp(
          parallaxGroup.current.rotation.z,
          phase === 'idle' ? targetTiltZ : parallaxGroup.current.rotation.z,
          0.06
        )
      }
    }

    // Trigger break simulation once — bigger, angrier velocities than a "gentle" break
    if (breakSignal !== lastSignal.current) {
      lastSignal.current = breakSignal
      setShardsActive(true)
      const pieces = [bubbleRef, tailRef, phoneArcRef, phoneCapARef, phoneCapBRef]
        .filter((r) => r.current)
        .map((r) => ({
          ref: r,
          vel: new THREE.Vector3(
            (Math.random() - 0.5) * 6.5,
            Math.random() * 4.5 + 2.5,
            (Math.random() - 0.5) * 5.5
          ),
          angVel: new THREE.Vector3(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16
          ),
        }))
      breakState.current = { startTime: t, pieces }
    }

    if (breakState.current) {
      const elapsed = t - breakState.current.startTime
      const gravity = 7
      breakState.current.pieces.forEach(({ ref, vel, angVel }) => {
        if (!ref.current) return
        vel.y -= gravity * delta
        ref.current.position.x += vel.x * delta
        ref.current.position.y += vel.y * delta
        ref.current.position.z += vel.z * delta
        ref.current.rotation.x += angVel.x * delta
        ref.current.rotation.y += angVel.y * delta
        ref.current.rotation.z += angVel.z * delta
        if (ref.current.material) {
          ref.current.material.opacity = Math.max(0, ref.current.material.opacity - delta * 1.1)
        }
      })

      // Blinding white flash at the moment of impact, decaying fast
      if (impactLightRef.current) {
        if (elapsed < 0.12) {
          impactLightRef.current.intensity = THREE.MathUtils.lerp(0, 22, elapsed / 0.12)
        } else {
          impactLightRef.current.intensity = Math.max(0, 22 * (1 - (elapsed - 0.12) / 0.35))
        }
      }
    }
  })

  return (
    <group ref={parallaxGroup} position={[0, 0.4, 0]}>
      <pointLight ref={impactLightRef} color="#ffffff" intensity={0} distance={8} decay={2} />
      <group ref={spinGroup}>
        <Piece pieceRef={bubbleRef} geometry={bubbleGeometry} material={bubbleMaterial} homePosition={[0, 0, 0]} homeRotation={[0, 0, 0]} />
        <Piece
          pieceRef={tailRef}
          geometry={tailGeometry}
          material={tailMaterial}
          homePosition={[-0.75, -0.68, 0.05]}
          homeRotation={[0, 0, Math.PI * 0.62]}
        />
        <Piece
          pieceRef={phoneArcRef}
          geometry={phoneArcGeometry}
          material={phoneArcMaterial}
          homePosition={[0, 0.02, 0.2]}
          homeRotation={[0, 0, Math.PI * 0.72]}
        />
        <Piece pieceRef={phoneCapARef} geometry={capGeometry} material={phoneCapAMaterial} homePosition={[-0.32, 0.28, 0.2]} homeRotation={[0, 0, 0]} />
        <Piece pieceRef={phoneCapBRef} geometry={capGeometry} material={phoneCapBMaterial} homePosition={[0.32, -0.24, 0.2]} homeRotation={[0, 0, 0]} />
      </group>
      {shardsActive && <ShardBurst origin={[0, 0, 0]} />}
    </group>
  )
}