import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import AddTask from './features/task/AddTask';  // Import the AddTask component
import Profile from './features/user/Profile'; // Import the Profile component
import Settings from './features/user/Settings';
import Progress from './features/progress/Progress';
import AdminDashboard from './features/admin/AdminDashboard';
import Userlist from './features/admin/Userlist';

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-task" element={<AddTask />} /> {/* Add the route for AddTask */}
        <Route path="/profile" element={<Profile />} /> {/* Add the route for Profile */}
        <Route path="/settings" element={<Settings />} /> {/* Add the route for Settings */}
        <Route path="/progress" element={<Progress />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Userlist />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}