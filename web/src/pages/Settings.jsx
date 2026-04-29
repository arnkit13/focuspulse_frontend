import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { toast } from '../lib/toast.js';
import './Settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Initialize darkMode from localStorage
  const getInitialDarkMode = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // States for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    // Apply the theme to document
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    // Load user email
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile()
        .then((response) => setEmail(response.email || ''))
        .catch((err) => console.error('Error fetching profile:', err));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);

    try {
      await api.updateProfile(formData);
      toast('Email updated successfully!', 'success');
      
      const response = await api.getProfile();
      localStorage.setItem('user', JSON.stringify(response));
    } catch (err) {
      console.error('Error updating email:', err);
      toast(err.message || 'Error updating email', 'error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.changePassword({ oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      toast('Password updated successfully!', 'success');
    } catch (err) {
      console.error('Error changing password:', err);
      toast(err.message || 'Error changing password', 'error');
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Here you would typically save this preference to the backend or local storage
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      toast('Dark mode enabled', 'success');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      toast('Light mode enabled', 'success');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast('Signed out successfully', 'info');
    navigate('/login');
  };

  return (
    <div className="settings-page">
      <header className="dash-header">
        <span className="dash-logo">FocusPulse</span>
        <div>
          <button className="signout-btn" onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </header>

      <main className="settings-main">
        <h2>Settings</h2>

        {/* Change Email */}
        <section className="settings-section">
          <h3>Account</h3>
          <form onSubmit={handleEmailUpdate} className="settings-form">
            <div>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="settings-btn">Change Email</button>
          </form>
        </section>

        {/* Change Password */}
        <section className="settings-section">
          <h3>Security</h3>
          <form onSubmit={handlePasswordChange} className="settings-form">
            <div>
              <label>Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="settings-btn">Change Password</button>
          </form>
        </section>

        {/* Preferences */}
        <section className="settings-section">
          <h3>Preferences</h3>
          
          <div className="toggle-group">
            <span>Notifications</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={notificationsEnabled} 
                onChange={toggleNotifications} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-group" style={{ marginTop: '20px' }}>
            <span>Dark Mode</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={toggleDarkMode} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="settings-section" style={{ borderBottom: 'none', marginTop: '20px' }}>
          <h3 style={{ color: '#ff4d4d' }}>Danger Zone</h3>
          <button 
            className="settings-btn" 
            style={{ backgroundColor: '#ff4d4d', marginTop: '10px' }}
            onClick={handleSignOut}
          >
            Sign out of FocusPulse
          </button>
        </section>

      </main>
    </div>
  );
}
