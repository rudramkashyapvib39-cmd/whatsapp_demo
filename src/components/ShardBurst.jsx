import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SHARD_COUNT = 22
const GRAVITY = 7
const FADE_DURATION = 1.4

function Shard({ origin, vel, angVel, scale, color }) {
  const ref = useRef()
  const startRef = useRef(null)

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    if (startRef.current === null) startRef.current = t
    const elapsed = t - startRef.current

    vel.current.y -= GRAVITY * delta
    ref.current.position.x += vel.current.x * delta
    ref.current.position.y += vel.current.y * delta
    ref.current.position.z += vel.current.z * delta
    ref.current.rotation.x += angVel.current.x * delta
    ref.current.rotation.y += angVel.current.y * delta
    ref.current.rotation.z += angVel.current.z * delta

    if (ref.current.material) {
      ref.current.material.opacity = Math.max(0, 1 - elapsed / FADE_DURATION)
    }
  })

  return (
    <mesh ref={ref} position={origin} scale={scale}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} transparent opacity={1} roughness={0.3} metalness={0.2} />
    </mesh>
  )
}

/**
 * A burst of small flying shards from `origin`, meant to be rendered
 * *inside* an existing <Canvas> (e.g. from Logo3D on break) — this
 * component intentionally does NOT create its own Canvas.
 */
export default function ShardBurst({ origin = [0, 0, 0] }) {
  const shards = useMemo(
    () =>
      Array.from({ length: SHARD_COUNT }, () => ({
        vel: {
          current: new THREE.Vector3(
            (Math.random() - 0.5) * 7,
            Math.random() * 5 + 2,
            (Math.random() - 0.5) * 7
          ),
        },
        angVel: {
          current: new THREE.Vector3(
            (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 14
          ),
        },
        scale: 0.06 + Math.random() * 0.14,
        color: Math.random() > 0.5 ? '#25d366' : '#eafff2',
      })),
    []
  )

  return (
    <group>
      {shards.map((s, i) => (
        <Shard key={i} origin={origin} vel={s.vel} angVel={s.angVel} scale={s.scale} color={s.color} />
      ))}
    </group>
  )
}