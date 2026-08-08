import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to attach Bearer token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('foodbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// System Health Endpoint
export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Backend unreachable',
    };
  }
};

// Auth APIs
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('foodbridge_token', response.data.token);
      localStorage.setItem('foodbridge_user', JSON.stringify(response.data.user));
    }
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed',
    };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('foodbridge_token', response.data.token);
      localStorage.setItem('foodbridge_user', JSON.stringify(response.data.user));
    }
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed',
    };
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    if (response.data.user) {
      localStorage.setItem('foodbridge_user', JSON.stringify(response.data.user));
    }
    return { success: true, user: response.data.user };
  } catch (error) {
    localStorage.removeItem('foodbridge_token');
    localStorage.removeItem('foodbridge_user');
    return { success: false, error: 'Session expired or invalid token' };
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch (err) {
    // Ignore backend logout errors, clear client state anyway
  } finally {
    localStorage.removeItem('foodbridge_token');
    localStorage.removeItem('foodbridge_user');
  }
};

export default api;
