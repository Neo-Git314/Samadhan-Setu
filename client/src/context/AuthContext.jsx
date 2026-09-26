import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ss_token'));
  const [loading, setLoading] = useState(true);

  // Hydrate user from /api/auth/me on mount if token exists
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axiosInstance.get('/auth/me')
      .then(res => {
        setUser(res.data.user || res.data);
      })
      .catch(() => {
        localStorage.removeItem('ss_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback((userData, jwt) => {
    localStorage.setItem('ss_token', jwt);
    setToken(jwt);
    setUser(userData);
  }, []);

  const register = useCallback((userData, jwt) => {
    if (jwt) {
      localStorage.setItem('ss_token', jwt);
      setToken(jwt);
    }
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ss_token');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    role: user?.role || null,
  }), [user, token, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
