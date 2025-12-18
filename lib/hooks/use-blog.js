import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPublicBlogPosts,
  getPublicBlogPost,
  getPublicBlogTags,
  getAdminBlogPosts,
  getAdminBlogPost,
  createBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  deleteBlogPost,
  getAdminBlogTags,
  createBlogTag,
  updateBlogTag,
  deleteBlogTag
} from '@/lib/api/blog';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const blogKeys = {
  all: ['blog'],
  // Public keys
  public: () => [...blogKeys.all, 'public'],
  publicLists: () => [...blogKeys.public(), 'list'],
  publicList: (params) => [...blogKeys.publicLists(), params],
  publicDetails: () => [...blogKeys.public(), 'detail'],
  publicDetail: (slug) => [...blogKeys.publicDetails(), slug],
  publicTags: () => [...blogKeys.public(), 'tags'],
  // Admin keys
  admin: () => [...blogKeys.all, 'admin'],
  adminLists: () => [...blogKeys.admin(), 'list'],
  adminList: (params) => [...blogKeys.adminLists(), params],
  adminDetails: () => [...blogKeys.admin(), 'detail'],
  adminDetail: (postId) => [...blogKeys.adminDetails(), postId],
  adminTags: () => [...blogKeys.admin(), 'tags'],
};

// ============================================================================
// PUBLIC HOOKS
// ============================================================================

/**
 * Fetch published blog posts (public)
 * @param {Object} params - Query parameters (limit, offset, tagIds, search, sortBy, etc.)
 * @param {Object} options - React Query options
 */
export function usePublicBlogPosts(params = {}, options = {}) {
  return useQuery({
    queryKey: blogKeys.publicList(params),
    queryFn: () => getPublicBlogPosts(params),
    ...options,
  });
}

/**
 * Fetch single published blog post by slug
 * @param {string} slug - Post slug
 * @param {Object} options - React Query options
 */
export function usePublicBlogPost(slug, options = {}) {
  return useQuery({
    queryKey: blogKeys.publicDetail(slug),
    queryFn: () => getPublicBlogPost(slug),
    enabled: !!slug,
    ...options,
  });
}

/**
 * Fetch public blog tags
 * @param {Object} options - React Query options
 */
export function usePublicBlogTags(options = {}) {
  return useQuery({
    queryKey: blogKeys.publicTags(),
    queryFn: getPublicBlogTags,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    ...options,
  });
}

// ============================================================================
// ADMIN HOOKS
// ============================================================================

/**
 * Fetch all blog posts (admin)
 * @param {Object} params - Query parameters (limit, offset, status, authorId, tagIds, search)
 * @param {Object} options - React Query options
 */
export function useAdminBlogPosts(params = {}, options = {}) {
  return useQuery({
    queryKey: blogKeys.adminList(params),
    queryFn: () => getAdminBlogPosts(params),
    ...options,
  });
}

/**
 * Fetch single blog post for editing (admin)
 * @param {number} postId - Post ID
 * @param {Object} options - React Query options
 */
export function useAdminBlogPost(postId, options = {}) {
  return useQuery({
    queryKey: blogKeys.adminDetail(postId),
    queryFn: () => getAdminBlogPost(postId),
    enabled: !!postId,
    ...options,
  });
}

/**
 * Create a new blog post
 * Returns mutation with: mutate({ request, coverImage, galleryImages, onUploadProgress })
 */
export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ request, coverImage, galleryImages, onUploadProgress }) =>
      createBlogPost(request, coverImage, galleryImages, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

/**
 * Publish a blog post
 * Returns mutation with: mutate(postId)
 */
export function usePublishBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => publishBlogPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

/**
 * Unpublish a blog post
 * Returns mutation with: mutate(postId)
 */
export function useUnpublishBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => unpublishBlogPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

/**
 * Delete a blog post
 * Returns mutation with: mutate(postId)
 */
export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => deleteBlogPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

// ============================================================================
// TAG HOOKS
// ============================================================================

/**
 * Fetch all tags (admin)
 * @param {Object} options - React Query options
 */
export function useAdminBlogTags(options = {}) {
  return useQuery({
    queryKey: blogKeys.adminTags(),
    queryFn: getAdminBlogTags,
    ...options,
  });
}

/**
 * Create a new tag
 * Returns mutation with: mutate({ name, nameSi, slug })
 */
export function useCreateBlogTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createBlogTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.adminTags() });
      queryClient.invalidateQueries({ queryKey: blogKeys.publicTags() });
    },
  });
}

/**
 * Update a tag
 * Returns mutation with: mutate({ tagId, data })
 */
export function useUpdateBlogTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId, data }) => updateBlogTag(tagId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.adminTags() });
      queryClient.invalidateQueries({ queryKey: blogKeys.publicTags() });
    },
  });
}

/**
 * Delete a tag
 * Returns mutation with: mutate(tagId)
 */
export function useDeleteBlogTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagId) => deleteBlogTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.adminTags() });
      queryClient.invalidateQueries({ queryKey: blogKeys.publicTags() });
    },
  });
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

/**
 * Fetch latest blog posts (convenience hook)
 * @param {number} limit - Number of posts to fetch
 */
export function useLatestBlogPosts(limit = 3) {
  return usePublicBlogPosts({ limit, sortBy: 'NEWEST' });
}

/**
 * Fetch blog posts by tag
 * @param {number} tagId - Tag ID to filter by
 * @param {number} limit - Number of posts to fetch
 */
export function useBlogPostsByTag(tagId, limit = 10) {
  return usePublicBlogPosts({
    tagIds: [tagId],
    limit,
    sortBy: 'NEWEST'
  }, {
    enabled: !!tagId,
  });
}
