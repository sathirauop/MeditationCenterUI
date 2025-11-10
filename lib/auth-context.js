'use client';

import { createContext, useContext } from 'react';
import { useCurrentUser, useLogin, useRegister, useLogout } from './hooks/use-auth';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  // Use React Query hooks for all auth operations
  const { data: user, isLoading: loading, error: queryError } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  // Wrapper functions to maintain API compatibility
  const login = async (credentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  const register = async (userData) => {
    return registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  const value = {
    user,
    loading,
    error: queryError || loginMutation.error || registerMutation.error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    // Expose mutation states for granular control
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
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
