const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const STORAGE_KEY = 'gtaes_customer_auth';

export function getStoredSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getAuthHeaders() {
  const session = getStoredSession();
  if (!session?.token) return {};
  return { Authorization: `Bearer ${session.token}` };
}

export async function authFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function loginCustomer({ email, password }) {
  const res = await fetch(`${API_URL}/api/auth/customer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || 'Login failed');
    error.status = res.status;
    throw error;
  }
  saveSession(data);
  return data;
}

export async function registerCustomer({ email, password, firstName, lastName, phone }) {
  const res = await fetch(`${API_URL}/api/auth/register-customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName, phone }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || 'Registration failed');
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function logoutCustomer() {
  try {
    await authFetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // Clear local session even if API call fails
  }
  clearSession();
}

export async function fetchCurrentUser() {
  return authFetch('/api/auth/me');
}

export async function activateCustomerAccount({ token, password }) {
  return authFetch('/api/auth/customer-activation', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export async function fetchActivationPreview(token) {
  const res = await fetch(`${API_URL}/api/auth/customer-activation/${token}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || 'Invalid activation link');
    error.status = res.status;
    throw error;
  }
  return data;
}
