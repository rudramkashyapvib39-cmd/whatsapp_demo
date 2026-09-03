import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import Logo3D from './Logo3D'
import { CameraShake } from "@react-three/drei";
export default function Scene3D({ phase, breakSignal }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#060907']} />
      <fog attach="fog" args={['#060907', 8, 16]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#eafff2" />
      <pointLight position={[-4, -2, 2]} intensity={0.6} color="#25d366" />

      <CameraShake phase={phase} />

      <Suspense fallback={null}>
        <Logo3D phase={phase} breakSignal={breakSignal} />
        <Sparkles count={110} scale={[9, 6, 6]} size={2} speed={0.25} opacity={0.5} color="#7cf7ac" />
        <Sparkles count={60} scale={[10, 7, 7]} size={1.2} speed={0.12} opacity={0.25} color="#ffffff" />
      </Suspense>
    </Canvas>
  )
}