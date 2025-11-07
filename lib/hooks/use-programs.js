import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query keys
export const programKeys = {
  all: ['programs'],
  lists: () => [...programKeys.all, 'list'],
  list: (filters) => [...programKeys.lists(), filters],
  details: () => [...programKeys.all, 'detail'],
  detail: (id) => [...programKeys.details(), id],
};

/**
 * Fetch all meditation programs
 */
export function usePrograms(filters = {}) {
  return useQuery({
    queryKey: programKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      return api.get(`/programs${params ? `?${params}` : ''}`);
    },
  });
}

/**
 * Fetch single program by ID
 */
export function useProgram(programId) {
  return useQuery({
    queryKey: programKeys.detail(programId),
    queryFn: () => api.get(`/programs/${programId}`),
    enabled: !!programId,
  });
}

/**
 * Enroll in a program
 */
export function useEnrollInProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, enrollmentData }) =>
      api.post(`/programs/${programId}/enroll`, enrollmentData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: programKeys.detail(variables.programId) });
    },
  });
}
