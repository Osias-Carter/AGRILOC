const API_URL = import.meta.env.VITE_API_URL || '/api';

let authToken = localStorage.getItem('agriloc_token') || '';

export function setAuthToken(token) {
  authToken = token || '';
  if (authToken) {
    localStorage.setItem('agriloc_token', authToken);
  } else {
    localStorage.removeItem('agriloc_token');
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Erreur API ${response.status}`);
  }

  return response.json();
}

export const api = {
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  me: () => request('/auth/me'),
  testAccounts: () => request('/test-accounts'),
  bootstrap: (userId) => request(userId ? `/bootstrap?userId=${encodeURIComponent(userId)}` : '/bootstrap'),
  createBooking: (booking) => request('/bookings', {
    method: 'POST',
    body: JSON.stringify(booking)
  }),
  updateBookingStatus: (id, status, payment) => request(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, payment })
  }),
  createMachine: (machine) => request('/machines', {
    method: 'POST',
    body: JSON.stringify(machine)
  }),
  createNotification: (notification) => request('/notifications', {
    method: 'POST',
    body: JSON.stringify(notification)
  }),
  markNotificationsAsRead: () => request('/notifications/read', {
    method: 'PATCH'
  })
};
