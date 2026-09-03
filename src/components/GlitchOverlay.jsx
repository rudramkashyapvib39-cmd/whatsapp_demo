import { useMemo } from 'react'
import { motion } from 'framer-motion'

const jitterX = [0, -28, 22, -14, 32, -6, 18, -22, 10, 0]
const jitterOpacity = [0, 1, 0.85, 1, 0.7, 1, 0.9, 1, 0.8, 0]

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

export default function GlitchOverlay() {
  const tearBands = useMemo(
    () =>
      Array.from({ length: 7 }, () => ({
        top: randomBetween(0, 92),
        height: randomBetween(2, 9),
        distance: randomBetween(-140, 140),
        duration: randomBetween(0.06, 0.16),
        delay: randomBetween(0, 0.7),
      })),
    []
  )

  const glitchBlocks = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        top: randomBetween(0, 90),
        left: randomBetween(0, 85),
        width: randomBetween(6, 26),
        height: randomBetween(2, 10),
        color: ['#ff2e55', '#25d366', '#00e5ff', '#ffffff'][Math.floor(Math.random() * 4)],
        delay: randomBetween(0, 0.85),
        duration: randomBetween(0.05, 0.13),
      })),
    []
  )

  return (
    <motion.div
      className="glitch-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <motion.div
        className="glitch-layer glitch-layer--red"
        animate={{ x: jitterX, opacity: jitterOpacity }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      <motion.div
        className="glitch-layer glitch-layer--cyan"
        animate={{ x: jitterX.map((v) => -v), opacity: jitterOpacity }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />

      {tearBands.map((band, i) => (
        <motion.div
          key={`tear-${i}`}
          className="glitch-tear"
          style={{ top: `${band.top}%`, height: `${band.height}%` }}
          animate={{ x: [0, band.distance, band.distance * -0.6, 0] }}
          transition={{ duration: band.duration, delay: band.delay, repeat: 3, repeatType: 'mirror' }}
        />
      ))}

      {glitchBlocks.map((block, i) => (
        <motion.div
          key={`block-${i}`}
          className="glitch-block"
          style={{
            top: `${block.top}%`,
            left: `${block.left}%`,
            width: `${block.width}%`,
            height: `${block.height}%`,
            background: block.color,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: block.duration, delay: block.delay, repeat: 2, repeatDelay: randomBetween(0.05, 0.3) }}
        />
      ))}

      <motion.div
        className="glitch-scanlines"
        animate={{ backgroundPositionY: ['0px', '400px'] }}
        transition={{ duration: 0.35, repeat: 3, ease: 'linear' }}
      />

      <motion.div
        className="glitch-invert"
        animate={{ opacity: [0, 0.8, 0, 0.5, 0, 0.7, 0] }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />

      <motion.div
        className="glitch-flash"
        animate={{ opacity: [0, 1, 0, 0.8, 0, 0.6, 0] }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}