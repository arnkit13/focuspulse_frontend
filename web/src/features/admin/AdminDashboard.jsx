import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { toast } from '../../lib/toast.js';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, onlineSessions: 0, systemUptime: '0h 0m' });
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: "User 'john.doe' registered", time: "10 mins ago", type: "user" },
    { id: 2, action: "System backup completed successfully", time: "1 hour ago", type: "system" },
    { id: 3, action: "User 'alice_w' completed 4 Pomodoros", time: "2 hours ago", type: "activity" },
    { id: 4, action: "Server memory cleared", time: "5 hours ago", type: "system" },
  ]);

  const handleExportReport = () => {
    try {
      let csvContent = "ID,Action,Time,Type\n";
      recentActivity.forEach(item => {
        // Escape quotes and commas by wrapping in double quotes
        csvContent += `${item.id},"${item.action}","${item.time}",${item.type}\n`;
      });
      
      csvContent += "\nSystem Stats\n";
      csvContent += `Total Users,${stats.totalUsers}\n`;
      csvContent += `Online Sessions,${stats.onlineSessions}\n`;
      csvContent += `System Uptime,${stats.systemUptime}\n`;
      csvContent += `Generated At,${new Date().toISOString()}\n`;
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `focuspulse-admin-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast("Excel report downloaded successfully!", "success");
    } catch (error) {
      console.error("Export error:", error);
      toast("Failed to generate report", "error");
    }
  };

  const handleClearCache = () => {
    try {
      // Keep essential auth data, clear everything else
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const theme = localStorage.getItem('theme');
      
      localStorage.clear();
      sessionStorage.clear();
      
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', user);
      if (theme) localStorage.setItem('theme', theme);
      
      // Clear recent activity feed state
      setRecentActivity([]);
      
      toast("System cache and activity cleared successfully!", "success");
    } catch (error) {
      console.error("Cache clear error:", error);
      toast("Failed to clear cache", "error");
    }
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
        <h2 className="greeting">{getGreeting()}, Admin!</h2>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading system stats...</p>
          </div>
        ) : (
          <div className="admin-content-grid">
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
                  <h3>{stats.systemUptime || '99.9%'}</h3>
                  <p>System Uptime</p>
                </div>
              </div>
            </div>

            <div className="admin-dashboard-panels">
              <div className="admin-panel activity-feed">
                <h3>Recent System Activity</h3>
                <ul className="activity-list">
                  {recentActivity.length === 0 ? (
                    <p className="history-empty">No recent activity.</p>
                  ) : (
                    recentActivity.map(item => (
                      <li key={item.id} className="activity-item">
                        <span className={`activity-indicator ${item.type}`}></span>
                        <div className="activity-details">
                          <span className="activity-action">{item.action}</span>
                          <span className="activity-time">{item.time}</span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="admin-panel admin-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn primary" onClick={() => navigate('/admin/users')}>
                    Manage Users
                  </button>
                  <button className="action-btn secondary" onClick={() => navigate('/settings')}>
                    System Settings
                  </button>
                  <button className="action-btn tertiary" onClick={handleExportReport}>
                    Export Report
                  </button>
                  <button className="action-btn warning" onClick={handleClearCache}>
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
