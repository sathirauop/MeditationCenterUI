import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPublicGallery,
    getAdminGalleryGroups,
    getAdminGalleryGroup,
    createGalleryGroup,
    updateGalleryGroup,
    deleteGalleryGroup,
    addGalleryPhotos,
    deleteGalleryPhoto
} from '@/lib/api/gallery';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const galleryKeys = {
    all: ['gallery'],
    // Public keys
    public: () => [...galleryKeys.all, 'public'],
    publicList: () => [...galleryKeys.public(), 'list'],
    // Admin keys
    admin: () => [...galleryKeys.all, 'admin'],
    adminLists: () => [...galleryKeys.admin(), 'list'],
    adminDetails: () => [...galleryKeys.admin(), 'detail'],
    adminDetail: (groupId) => [...galleryKeys.adminDetails(), groupId],
};

// ============================================================================
// PUBLIC HOOKS
// ============================================================================

/**
 * Fetch public gallery (all active groups with photos)
 */
export function usePublicGallery(options = {}) {
    return useQuery({
        queryKey: galleryKeys.publicList(),
        queryFn: getPublicGallery,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

// ============================================================================
// ADMIN HOOKS
// ============================================================================

/**
 * Fetch all gallery groups (admin)
 */
export function useAdminGalleryGroups(options = {}) {
    return useQuery({
        queryKey: galleryKeys.adminLists(),
        queryFn: getAdminGalleryGroups,
        ...options,
    });
}

/**
 * Fetch single gallery group with photos (admin)
 */
export function useAdminGalleryGroup(groupId, options = {}) {
    return useQuery({
        queryKey: galleryKeys.adminDetail(groupId),
        queryFn: () => getAdminGalleryGroup(groupId),
        enabled: !!groupId,
        ...options,
    });
}

/**
 * Create a new gallery group
 */
export function useCreateGalleryGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createGalleryGroup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: galleryKeys.all });
        },
    });
}

/**
 * Update a gallery group
 */
export function useUpdateGalleryGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ groupId, data }) => updateGalleryGroup(groupId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: galleryKeys.all });
        },
    });
}

/**
 * Delete a gallery group
 */
export function useDeleteGalleryGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (groupId) => deleteGalleryGroup(groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: galleryKeys.all });
        },
    });
}

/**
 * Add photos to a gallery group
 */
export function useAddGalleryPhotos() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ groupId, files, onUploadProgress }) =>
            addGalleryPhotos(groupId, files, onUploadProgress),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: galleryKeys.all });
        },
    });
}

/**
 * Delete a photo from a gallery group
 */
export function useDeleteGalleryPhoto() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ groupId, photoId }) => deleteGalleryPhoto(groupId, photoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: galleryKeys.all });
        },
    });
}
