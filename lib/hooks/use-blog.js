import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query keys
export const blogKeys = {
  all: ['blog'],
  lists: () => [...blogKeys.all, 'list'],
  list: (filters) => [...blogKeys.lists(), filters],
  details: () => [...blogKeys.all, 'detail'],
  detail: (id) => [...blogKeys.details(), id],
};

/**
 * Fetch blog posts
 */
export function useBlogPosts(filters = {}) {
  return useQuery({
    queryKey: blogKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      return api.get(`/blog${params ? `?${params}` : ''}`);
    },
  });
}

/**
 * Fetch single blog post by ID or slug
 */
export function useBlogPost(identifier) {
  return useQuery({
    queryKey: blogKeys.detail(identifier),
    queryFn: () => api.get(`/blog/${identifier}`),
    enabled: !!identifier,
  });
}

/**
 * Fetch latest blog posts (convenience hook)
 */
export function useLatestBlogPosts(limit = 3) {
  return useBlogPosts({ limit, sort: 'createdAt:desc' });
}
