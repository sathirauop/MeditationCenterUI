import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query keys
export const eventKeys = {
  all: ['events'],
  lists: () => [...eventKeys.all, 'list'],
  list: (filters) => [...eventKeys.lists(), filters],
  details: () => [...eventKeys.all, 'detail'],
  detail: (id) => [...eventKeys.details(), id],
};

/**
 * Fetch all events
 */
export function useEvents(filters = {}) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      return api.get(`/events${params ? `?${params}` : ''}`);
    },
  });
}

/**
 * Fetch single event by ID
 */
export function useEvent(eventId) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => api.get(`/events/${eventId}`),
    enabled: !!eventId, // Only run if eventId is provided
  });
}

/**
 * Create new event (admin only)
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newEvent) => api.post('/events', newEvent),
    onSuccess: () => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

/**
 * Update event (admin only)
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/events/${id}`, data),
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
    mutationFn: (eventId) => api.delete(`/events/${eventId}`),
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
      api.post(`/events/${eventId}/register`, registrationData),
    onSuccess: (_, variables) => {
      // Refresh event details to show updated registration count
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.eventId) });
    },
  });
}
