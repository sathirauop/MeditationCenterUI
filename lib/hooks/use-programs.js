import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getActiveProgram, getPublicActiveProgram, createProgram, createProgramWithImages, updateProgram } from '@/lib/api/programs';

// Query keys
export const programKeys = {
  all: ['programs'],
  lists: () => [...programKeys.all, 'list'],
  list: (filters) => [...programKeys.lists(), filters],
  details: () => [...programKeys.all, 'detail'],
  detail: (id) => [...programKeys.details(), id],
  active: () => [...programKeys.all, 'active'],
  publicActive: () => [...programKeys.all, 'public-active'],
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

/**
 * Fetch the active meditation program (Admin)
 */
export function useActiveProgram() {
  return useQuery({
    queryKey: programKeys.active(),
    queryFn: getActiveProgram,
    retry: false, // Don't retry if no program exists
  });
}

/**
 * Fetch the active meditation program (Public)
 */
export function usePublicActiveProgram() {
  return useQuery({
    queryKey: programKeys.publicActive(),
    queryFn: getPublicActiveProgram,
    retry: false,
  });
}

/**
 * Create a new program (Admin)
 */
export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
}

/**
 * Create a new program with images (Admin)
 */
export function useCreateProgramWithImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programData, coverImage, galleryImages }) =>
      createProgramWithImages(programData, coverImage, galleryImages),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
}

/**
 * Update an existing program (Admin)
 */
export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, data }) => updateProgram(programId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
}
