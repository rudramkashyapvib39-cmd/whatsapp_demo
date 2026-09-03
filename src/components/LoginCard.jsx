import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LoginCard({ onLogin, disabled }) {
  const [phone, setPhone] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = phone.trim().length >= 6

  function handleSubmit(event) {
    event.preventDefault()
    setTouched(true)
    if (!isValid || disabled) return
    onLogin()
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="login-card"
    >
      <div className="login-card__eyebrow">Sign in with your phone</div>
      <h1 className="login-card__title">WhatsApp Web</h1>
      <p className="login-card__subtitle">
        Enter the phone number linked to your account. We'll keep it right here — nowhere else.
      </p>

      <label className="login-card__field">
        <span className="login-card__label">Phone number</span>
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className="login-card__input"
          disabled={disabled}
        />
      </label>

      {touched && !isValid && <div className="login-card__error">Enter a valid phone number to continue.</div>}

      <motion.button
        type="submit"
        className="login-card__submit"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        disabled={disabled}
      >
        Log in
      </motion.button>
    </motion.form>
  )
}
