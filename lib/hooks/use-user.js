import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query keys
export const userKeys = {
  all: ['user'],
  profile: () => [...userKeys.all, 'profile'],
  bookings: () => [...userKeys.all, 'bookings'],
  enrollments: () => [...userKeys.all, 'enrollments'],
};

/**
 * Fetch current user profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => api.get('/user/profile'),
    // Don't retry on 401 (unauthorized)
    retry: (failureCount, error) => {
      if (error.status === 401) return false;
      return failureCount < 2;
    },
  });
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData) => api.put('/user/profile', profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}

/**
 * Fetch user's bookings/registrations
 */
export function useUserBookings() {
  return useQuery({
    queryKey: userKeys.bookings(),
    queryFn: () => api.get('/user/bookings'),
  });
}

/**
 * Fetch user's program enrollments
 */
export function useUserEnrollments() {
  return useQuery({
    queryKey: userKeys.enrollments(),
    queryFn: () => api.get('/user/enrollments'),
  });
}

/**
 * Cancel a booking
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => api.delete(`/user/bookings/${bookingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.bookings() });
    },
  });
}
