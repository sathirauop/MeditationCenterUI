import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAdminUsers,
    getAdminUser,
    createAdminUser,
    updateAdminUser,
} from '@/lib/api/users';
import { queryKeys } from '@/lib/query-keys';

// Re-export query keys for convenience
export const adminUserKeys = queryKeys.admin.users;

/**
 * Fetch paginated list of admin users with optional filters
 * @param {Object} filters - { limit, offset, role, isActive, search }
 */
export function useAdminUsers(filters = {}) {
    return useQuery({
        queryKey: adminUserKeys.list(filters),
        queryFn: () => getAdminUsers(filters),
        keepPreviousData: true, // smooth pagination transitions
    });
}

/**
 * Fetch a single user by ID (includes statistics)
 * @param {number} userId
 */
export function useAdminUser(userId) {
    return useQuery({
        queryKey: adminUserKeys.detail(userId),
        queryFn: () => getAdminUser(userId),
        enabled: !!userId, // only run when userId is provided
    });
}

/**
 * Create a new user (admin)
 */
export function useCreateAdminUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData) => createAdminUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
        },
    });
}

/**
 * Update an existing user (admin)
 */
export function useUpdateAdminUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, updates }) => updateAdminUser(userId, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
            queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.userId) });
        },
    });
}
