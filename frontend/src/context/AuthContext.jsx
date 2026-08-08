import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchCurrentUser,
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial session restore

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('foodbridge_token');
    const cached = localStorage.getItem('foodbridge_user');

    if (cached) {
      try { setUser(JSON.parse(cached)); } catch (_) { /* ignore */ }
    }

    if (token) {
      fetchCurrentUser().then((res) => {
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const result = await apiLogin(credentials);
    if (result.success && result.data?.user) {
      setUser(result.data.user);
    }
    return result;
  };

  const register = async (formData) => {
    const result = await apiRegister(formData);
    if (result.success && result.data?.user) {
      setUser(result.data.user);
    }
    return result;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
