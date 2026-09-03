import { motion } from 'framer-motion'

export default function HauntedMessage() {
  return (
    <motion.div
      className="haunted-message-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="haunted-message-bg" />

      <motion.h1
        className="haunted-message-text"
        animate={{ x: [0, -10, 8, -6, 4, 0], skewX: [0, 4, -3, 2, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatType: 'mirror' }}
      >
        YOU CAN'T ESCAPE
      </motion.h1>

      <motion.h1
        className="haunted-message-text haunted-message-text--ghost"
        animate={{ opacity: [0, 0.6, 0, 0.4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        YOU CAN'T ESCAPE
      </motion.h1>

      <motion.p
        className="haunted-message-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 1] }}
        transition={{ duration: 1.8, delay: 0.4 }}
      >
        it's already got your number
      </motion.p>
    </motion.div>
  )
}
