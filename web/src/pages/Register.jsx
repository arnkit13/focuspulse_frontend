import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { toast } from '../lib/toast'
import './Auth.css'

export default function Register() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('USER')
  const [adminCode, setAdminCode] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    if (role === 'ADMIN' && !email.endsWith('@admin.com')) {
      setError('Administrator emails must end with "@admin.com"')
      return
    }

    setLoading(true)

    try {
      await api.register({ firstName, lastName, email, password, role, adminCode })
      toast('Account created! Please sign in.', 'success')
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">FocusPulse</h1>
        <p className="auth-subtitle">Create your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              required
              autoComplete="given-name"
            />
          </div>

          <div className="field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
              autoComplete="family-name"
            />
          </div>

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
              minLength={6}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="field">
            <label>Account Type</label>
            <div className="role-selector" style={{ display: 'flex', gap: '15px', marginTop: '5px', marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="role" 
                  value="USER" 
                  checked={role === 'USER'} 
                  onChange={() => setRole('USER')} 
                /> 
                Standard User
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="role" 
                  value="ADMIN" 
                  checked={role === 'ADMIN'} 
                  onChange={() => setRole('ADMIN')} 
                /> 
                Administrator
              </label>
            </div>
          </div>

          {role === 'ADMIN' && (
            <div className="field">
              <label htmlFor="adminCode">Admin Registration Code</label>
              <input
                id="adminCode"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter secret code"
                required={role === 'ADMIN'}
              />
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
