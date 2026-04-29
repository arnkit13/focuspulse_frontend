import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { toast } from '../lib/toast.js';
import './Userlist.css';

export default function Userlist() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast('Failed to load user list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (userEmail, userStatus, actionType) => {
    if (userStatus === 'Admin') {
      toast("You cannot modify another admin account.", "error");
      return;
    }
    // Mock action since we don't have ban backend setup yet
    toast(`Successfully applied '${actionType}' to ${userEmail}`, "success");
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="userlist-page">
      <header className="userlist-header">
        <button className="back-btn" onClick={() => navigate('/admin-dashboard')}>← Back to Admin Home</button>
        <h2>User Management</h2>
      </header>

      <main className="userlist-main">
        <div className="userlist-controls">
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="user-count">Showing {filteredUsers.length} users</span>
        </div>

        <div className="table-container">
          {loading ? (
            <p className="loading-text">Loading users...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role / Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="user-name">
                        <div className="avatar-placeholder">{user.name.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}</div>
                        {user.name.trim() ? user.name : 'No Name Set'}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status-badge ${user.status === 'Admin' ? 'admin' : 'active'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="date-col">
                        {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td>
                        {user.status !== 'Admin' && (
                          <div className="action-buttons">
                            <button className="btn-warn" onClick={() => handleAction(user.email, user.status, 'Warn')}>Warn</button>
                            <button className="btn-danger" onClick={() => handleAction(user.email, user.status, 'Ban')}>Ban</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
