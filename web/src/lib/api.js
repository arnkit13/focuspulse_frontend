// We explicitly hardcode the Render URL so Vercel never uses localhost!
// If your Render URL is different, change the URL below:
const BASE = "https://focuspulse-backend.onrender.com";

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { ...options.headers }
  if (!options.body || !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  register: (body) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  getProfile: () =>
    request('/profile'),

  updateProfile: (formData) =>
    request('/profile', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    }),

  changePassword: (body) =>
    request('/profile/password', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  getTasks: () =>
    request('/api/tasks'),

  createTask: (body) =>
    request('/api/tasks', { method: 'POST', body: JSON.stringify(body) }),

  updateTask: (id, body) =>
    request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  deleteTask: (id) =>
    request(`/api/tasks/${id}`, { method: 'DELETE' }),

  getHistoryTasks: () =>
    request('/api/tasks/history'),

  completeTask: (id) =>
    request(`/api/tasks/${id}/complete`, { method: 'PUT' }),

  deleteAllHistoryTasks: () =>
    request('/api/tasks/history', { method: 'DELETE' }),

  getAdminStats: () =>
    request('/api/admin/stats'),

  getAdminUsers: () =>
    request('/api/admin/users'),
}
