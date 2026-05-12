// Shared browser API helper for auth headers, JSON requests, and admin checks.
const API_BASE = '/api';
const TOKEN_KEY = 'dscts_token';
const USER_KEY = 'dscts_user';

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function getStoredUser() {
  const rawUser = sessionStorage.getItem(USER_KEY);
  return rawUser ? JSON.parse(rawUser) : null;
}

function setSession(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

function hasAdminAccess(user) {
  const permissions = user?.permissions || [];
  return user?.role === 'admin' || permissions.includes('ALL_ACCESS') || permissions.includes('ADMIN_ACCESS');
}

function authHeaders(extraHeaders = {}) {
  const token = getToken();
  return token ? { ...extraHeaders, Authorization: `Bearer ${token}` } : extraHeaders;
}

async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const requestOptions = { ...options, headers };

  if (options.body && !(options.body instanceof FormData)) {
    requestOptions.body = JSON.stringify(options.body);
    requestOptions.headers = { 'Content-Type': 'application/json', ...headers };
  }

  const response = await fetch(`${API_BASE}${path}`, requestOptions);
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

async function getCurrentUser() {
  const data = await apiRequest('/auth/me', {
    headers: authHeaders(),
  });

  sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

window.API = {
  apiRequest,
  authHeaders,
  clearSession,
  getCurrentUser,
  getStoredUser,
  getToken,
  hasAdminAccess,
  setSession,
};
