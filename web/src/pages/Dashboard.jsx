import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (!token || !stored) {
      navigate('/login')
    } else {
      setUser(JSON.parse(stored))
    }
  }, [navigate])

  function handleSignOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="dashboard">
      <header className="dash-header">
        <span className="dash-logo">FocusPulse</span>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign out
        </button>
      </header>

      <main className="dash-main">
        <h2>Welcome, {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}</h2>
        <p className="dash-hint">You&apos;re signed in. Start building your app here.</p>
      </main>
    </div>
  )
}
