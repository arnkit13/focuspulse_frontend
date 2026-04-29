import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { toast } from '../lib/toast.js';
import './Profile.css'; // Importing CSS

export default function Profile() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for better UX

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile()
        .then((response) => {
          setFirstName(response.firstName || '');
          setLastName(response.lastName || '');
          setProfilePicturePreview(response.profilePicture || null);
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

  // Handle profile update (email, profile picture)
  const handleProfileUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      // Send PUT request to backend with the FormData
      await api.updateProfile(formData);

      // After successful profile update, refetch the updated profile
      const response = await api.getProfile();
      setFirstName(response.firstName || '');
      setLastName(response.lastName || '');
      
      // Update local storage so the dashboard gets the latest profile picture
      localStorage.setItem('user', JSON.stringify(response));

      toast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error("Error updating profile:", err);
      toast(err.message || 'Error updating profile', 'error');
    }
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
          <div className="profile-pic-section">
            <label>Change Profile Picture</label>
            <div className="profile-pic-preview">
              {profilePicturePreview ? (
                <img src={profilePicturePreview} alt="Profile preview" className="profile-form-img" />
              ) : (
                <div className="profile-pic-placeholder-large">👤</div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProfilePicture(file);
                  setProfilePicturePreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>
          <div className="name-group">
            <div className="input-field">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          
          <button type="submit" className="save-profile-btn">Update Profile</button>
        </form>
      </main>
    </div>
  );
}