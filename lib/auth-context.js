'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser, logoutUser, getCurrentUser } from './api/auth';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const userData = await getCurrentUser();
        setUser(userData);
      }
    } catch (err) {
      // Token might be invalid or expired
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await loginUser(credentials);

      // Store tokens
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
      }
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }

      // Get user info from token
      const userData = await getCurrentUser();
      setUser(userData);

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await signupUser(userData);

      // Store tokens if provided
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
      }
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }

      // Get user info from token
      const userInfo = await getCurrentUser();
      setUser(userInfo);

      return userInfo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth, // Expose for manual revalidation
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
