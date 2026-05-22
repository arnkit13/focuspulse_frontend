import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const quotes = [
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future depends on what you do today.",
    "Focus is a matter of deciding what things you're not going to do."
  ];

  const [quote, setQuote] = useState(quotes[0]);

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])

    try {
      const data = await api.login({ email, password })
      localStorage.setItem('token', data.token)
      
      // Fetch the complete profile to get the profile picture and other details
      const profileData = await api.getProfile()
      localStorage.setItem('user', JSON.stringify(profileData))
      if (profileData.role === 'ADMIN' || data.role === 'ADMIN') {
        navigate('/admin-dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <h2 className="loading-title">Starting your day...</h2>
          <p className="loading-quote">"{quote}"</p>
        </div>
      ) : (
        <div className="auth-card">
          <h1 className="auth-title">FocusPulse</h1>
          <p className="auth-subtitle">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-btn">
              Sign in
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      )}
    </div>
  )
}
