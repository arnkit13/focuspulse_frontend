import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Importing CSS

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true); // Loading state for better UX

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          setEmail(response.data.email); // Initialize with current email
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching profile data:', err);
          setLoading(false);
        });
    } else {
      navigate('/login'); // Redirect if no token is found
    }
  }, [navigate]);

  // If loading, show loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email); // Add the email to FormData

    if (profilePicture) {
      formData.append('profilePicture', profilePicture); // Add profile picture to FormData
    }

    try {
      const token = localStorage.getItem('token'); // Get JWT token from localStorage

      // Send PUT request to backend with the FormData
      await axios.put('/profile', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Ensure Content-Type is set for file uploads
        }
      });

      alert('Profile updated successfully!');
    } catch (err) {
      console.error("Error updating profile:", err); // Log error for debugging
      alert('Error updating profile');
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put('/profile/password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Password updated successfully!');
    } catch (err) {
      console.error('Error changing password:', err); // Log error for debugging
      alert('Error changing password');
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <header className="dash-header">
        <span className="dash-logo">FocusPulse</span>
        <div>
          
          <button className="signout-btn" onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </header>

      <main className="dash-main">
        <h2>Profile</h2>

        {/* Profile Update Form */}
        <form onSubmit={handleProfileUpdate} className="profile-form">
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
            {/* Disable email input since it's already set to the current email */}
          </div>

          <div>
            <label>Profile Picture</label>
            <input
              type="file"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
            {profilePicture && <img src={URL.createObjectURL(profilePicture)} alt="Profile" />}
          </div>

          <button type="submit">Update Profile</button>
        </form>

        {/* Change Password Form */}
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange} className="password-form">
          <div>
            <label>Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit">Change Password</button>
        </form>
      </main>
    </div>
  );
}