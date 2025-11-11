import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent } from '@/lib/api/events';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

// Re-export query keys for backwards compatibility
export const eventKeys = queryKeys.events;

/**
 * Fetch all events
 */
export function useEvents(filters = {}) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/event${params ? `?${params}` : ''}`);
      // Backend returns { data: [...], currentOffset: 0, maxOffset: 3 }
      // Extract the events array from the response
      return response?.data || [];
    },
  });
}

/**
 * Fetch single event by ID
 */
export function useEvent(eventId) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => api.get(`/event/${eventId}`),
    enabled: !!eventId, // Only run if eventId is provided
  });
}

/**
 * Create new event (admin only)
 * Uses multipart/form-data for file uploads
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventData, coverImage, galleryImages }) =>
      createEvent(eventData, coverImage, galleryImages),
    onSuccess: () => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating event:', error);
    },
  });
}

/**
 * Update event (admin only)
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/event/${id}`, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific event and the list
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

/**
 * Delete event (admin only)
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => api.delete(`/event/${eventId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

/**
 * Register for an event
 */
export function useRegisterForEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, registrationData }) =>
      api.post(`/event/${eventId}/register`, registrationData),
    onSuccess: (_, variables) => {
      // Refresh event details to show updated registration count
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.eventId) });
    },
  });
}
