import { useState } from 'react'
import { motion } from 'framer-motion'

const HAUNTED_ERRORS = [
  "It already knows your number.",
  "Something is holding the line.",
  "Try again. It's listening.",
  "Wrong. Or maybe not. Try again.",
  "The signal isn't yours anymore.",
  "It doesn't want you to leave.",
  "That number belongs to someone else now.",
]

function randomOffset(range) {
  return (Math.random() - 0.5) * range
}

export default function HauntedLoginCard({ onLogin }) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [shake, setShake] = useState(false)
  const [flicker, setFlicker] = useState(false)
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 })

  function triggerFlicker() {
    setFlicker(true)
    setTimeout(() => setFlicker(false), 160)
  }

  function handleChange(e) {
    let next = e.target.value
    // haunted flip: the digits you just typed occasionally reverse on you
    if (Math.random() < 0.22) {
      next = next.split('').reverse().join('')
    }
    if (Math.random() < 0.12) triggerFlicker()
    setPhone(next)
  }

  function handleBtnHover() {
    // the submit button teleports away as you reach for it
    setBtnOffset({ x: randomOffset(90), y: randomOffset(36) })
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (phone.trim().length < 6) {
      setError('It needs more digits to find you.')
      triggerFlicker()
      return
    }

    // trouble-causing gate: mostly fails at first, gets slightly more mercy each attempt
    const failChance = Math.max(0.15, 0.62 - attempts * 0.12)
    if (Math.random() < failChance) {
      setAttempts((a) => a + 1)
      setError(HAUNTED_ERRORS[Math.floor(Math.random() * HAUNTED_ERRORS.length)])
      setShake(true)
      triggerFlicker()
      setBtnOffset({ x: randomOffset(110), y: randomOffset(46) })
      setTimeout(() => setShake(false), 400)
      return
    }

    setError('')
    onLogin()
  }

  return (
    <div className="haunted-login-perspective">
      <motion.form
        onSubmit={handleSubmit}
        className={
          'haunted-login-card' +
          (shake ? ' haunted-login-card--shake' : '') +
          (flicker ? ' haunted-login-card--flicker' : '')
        }
        initial={{ opacity: 0, rotateX: -18, y: 40 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="haunted-login-eyebrow">it remembers your number</div>
        <h1 className="haunted-login-title">LOG IN TO WHATSAPP</h1>
        <p className="haunted-login-subtitle">
          Enter the phone number linked to whatever's left of your account.
        </p>

        <label className="haunted-login-field">
          <span className="haunted-login-label">Phone number</span>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="haunted-login-input"
          />
        </label>

        {error && <div className="haunted-login-error">{error}</div>}

        <motion.button
          type="submit"
          className="haunted-login-submit"
          onMouseEnter={handleBtnHover}
          animate={{ x: btnOffset.x, y: btnOffset.y }}
          transition={{ type: 'spring', stiffness: 300, damping: 12 }}
        >
          Log in
        </motion.button>

        {attempts > 0 && (
          <div className="haunted-login-attempts">
            attempt {attempts + 1} of... does it matter?
          </div>
        )}
      </motion.form>
    </div>
  )
}
