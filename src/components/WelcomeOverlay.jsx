import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WelcomeOverlay({ onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3200)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <AnimatePresence>
      <motion.div
        className="welcome-overlay"
        onClick={onDismiss}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6 } }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="welcome-overlay__text"
          initial={{ opacity: 0, letterSpacing: '0.4em', filter: 'blur(6px)' }}
          animate={{ opacity: 1, letterSpacing: '0.02em', filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          Welcome. You're going to regret this.
        </motion.p>
        <motion.span
          className="welcome-overlay__hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          tap anywhere
        </motion.span>
      </motion.div>
    </AnimatePresence>
  )
}
