import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { toast } from '../lib/toast.js';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, onlineSessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'ADMIN') {
      navigate('/dashboard'); // Kick non-admins out
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      toast('Failed to load admin stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="header-left">
          <span className="admin-logo">FocusPulse Admin</span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>Sign Out</button>
      </header>

      <main className="admin-main">
        <h2>Admin Overview</h2>

        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <div className="admin-stats-container">
            <div className="admin-stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Total Registered Users</p>
              </div>
            </div>
            
            <div className="admin-stat-card">
              <div className="stat-icon">🟢</div>
              <div className="stat-info">
                <h3>{stats.onlineSessions}</h3>
                <p>Active Online Sessions</p>
              </div>
            </div>

            <div className="admin-stat-card system-health">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <h3>99.9%</h3>
                <p>System Uptime</p>
              </div>
            </div>
          </div>
        )}

        <div className="admin-actions">
          <button className="action-btn primary" onClick={() => navigate('/admin/users')}>
            Manage Users
          </button>
          <button className="action-btn secondary" onClick={() => toast('System settings is coming soon!', 'info')}>
            System Settings
          </button>
        </div>
      </main>
    </div>
  );
}
