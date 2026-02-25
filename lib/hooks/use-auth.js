import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { loginUser, signupUser, getCurrentUser, logoutUser } from '../api/auth';
import { queryKeys } from '../query-keys';

/**
 * Hook to get current authenticated user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: getCurrentUser,
    staleTime: 2 * 60 * 1000, // 2 minutes — shorter so expiry is caught faster
    retry: false,
    // Don't fetch if no token exists
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'),
    // Proactively re-check token validity every 60 seconds.
    // getCurrentUser() now detects expiry and attempts refresh automatically.
    refetchInterval: 60 * 1000,
    // Re-check when the user returns to the tab (e.g., after being away for a while)
    refetchOnWindowFocus: 'always',
  });
}

/**
 * Hook for login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      // Store tokens (backend returns access_token and refresh_token with underscores)
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }

      // Fetch and cache current user
      try {
        const user = await getCurrentUser();
        queryClient.setQueryData(queryKeys.auth.currentUser(), user);

        // Redirect based on role
        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching user after login:', error);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}

/**
 * Hook for registration mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: signupUser,
    onSuccess: async (data) => {
      // Store tokens (backend returns access_token and refresh_token with underscores)
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }

      // Fetch and cache current user
      try {
        const user = await getCurrentUser();
        queryClient.setQueryData(queryKeys.auth.currentUser(), user);

        // Redirect based on role
        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching user after registration:', error);
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');

      // Clear all queries
      queryClient.clear();

      // Redirect to home
      router.push('/');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Still clear local data even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      queryClient.clear();
      router.push('/');
    },
  });
}
