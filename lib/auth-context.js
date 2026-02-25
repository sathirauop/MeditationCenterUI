'use client';

import { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser, useLogin, useRegister, useLogout } from './hooks/use-auth';
import { queryKeys } from './query-keys';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  // Use React Query hooks for all auth operations
  const { data: user, isLoading: loading, error: queryError } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  // When an auth error occurs (e.g., token expired + refresh failed),
  // React Query may retain stale cached user data. Clear it explicitly
  // so the UI transitions to a clean "logged out" state immediately.
  useEffect(() => {
    if (queryError) {
      queryClient.setQueryData(queryKeys.auth.currentUser(), null);
    }
  }, [queryError, queryClient]);

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
    // Also check for queryError: if the auth query errored (e.g., expired session),
    // the user should not be considered authenticated even if stale data lingers.
    isAuthenticated: !!user && !queryError,
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
