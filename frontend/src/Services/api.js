const BASE_URL = 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

// Auth
export const authApi = {
  login: (username, password) => {
    const body = new URLSearchParams({ username, password });
    return fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    }).then(async res => {
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail || 'Login failed'); }
      return res.json();
    });
  },
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
};

// Notes
export const notesApi = {
  list: () => request('/notes/'),
  get: (id) => request(`/notes/${id}`),
  create: (data) => request('/notes/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
  search: (q) => request(`/notes/search?q=${encodeURIComponent(q)}`),
};

// Tasks
export const tasksApi = {
  list: (done) => request(`/tasks/${done !== undefined ? `?done=${done}` : ''}`),
  create: (data) => request('/tasks/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};

// Uploads
export const uploadsApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getToken();
    return fetch(`${BASE_URL}/uploads/`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    }).then(async res => {
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail || 'Upload failed'); }
      return res.json();
    });
  },
};
