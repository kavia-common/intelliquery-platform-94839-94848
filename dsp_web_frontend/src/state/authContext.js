import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';
import { loginRequest, signupRequest } from '../api/auth';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state and actions across the app with localStorage persistence. */
  const [token, setToken] = useState(() => getItem('auth_token'));
  const [user, setUser] = useState(() => {
    const raw = getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) setItem('auth_token', token);
    else removeItem('auth_token');
  }, [token]);

  useEffect(() => {
    if (user) setItem('auth_user', JSON.stringify(user));
    else removeItem('auth_user');
  }, [user]);

  const isAuthenticated = !!token;

  const login = async (username, password) => {
    const resp = await loginRequest(username, password);
    if (!resp?.token) {
      throw new Error('Invalid login response');
    }
    setToken(resp.token);
    setUser({ username: resp.username || username });
    return resp;
  };

  const signup = async (username, password) => {
    const resp = await signupRequest(username, password);
    if (!resp?.token) {
      throw new Error('Invalid signup response');
    }
    setToken(resp.token);
    setUser({ username: resp.username || username });
    return resp;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    token, user, isAuthenticated, login, signup, logout
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
