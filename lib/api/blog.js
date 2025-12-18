import axiosClient from '../axios-client';

/**
 * Blog API functions
 * Functions for creating and managing blog posts and tags
 */

const API_BASE = '/admin/blog';
const PUBLIC_API = '/blog';

// ============================================================================
// PUBLIC ENDPOINTS (No authentication required)
// ============================================================================

/**
 * Get published blog posts (public)
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Items per page (1-100, default: 20)
 * @param {number} params.offset - Pagination offset (0-based)
 * @param {number[]} params.tagIds - Filter by tag IDs
 * @param {string} params.search - Search in title/content
 * @param {string} params.startDate - Filter from date (ISO format)
 * @param {string} params.endDate - Filter to date (ISO format)
 * @param {'NEWEST'|'OLDEST'|'MOST_VIEWED'} params.sortBy - Sort order
 * @returns {Promise<{data: Array, currentOffset: number, maxOffset: number}>}
 */
export const getPublicBlogPosts = async (params = {}) => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        const query = new URLSearchParams();

        if (params.limit) query.set('limit', params.limit.toString());
        if (params.offset) query.set('offset', params.offset.toString());
        if (params.tagIds?.length) query.set('tagIds', params.tagIds.join(','));
        if (params.search) query.set('search', params.search);
        if (params.startDate) query.set('startDate', params.startDate);
        if (params.endDate) query.set('endDate', params.endDate);
        if (params.sortBy) query.set('sortBy', params.sortBy);

        const response = await fetch(`${API_URL}${PUBLIC_API}?${query}`);

        if (!response.ok) {
            if (response.status === 404) {
                return { data: [], currentOffset: 0, maxOffset: 0 };
            }
            throw new Error('Failed to fetch blog posts');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching public blog posts:', error);
        throw new Error(error.message || 'Failed to fetch blog posts');
    }
};

/**
 * Get single published blog post by slug (public)
 * @param {string} slug - URL-friendly post identifier
 * @returns {Promise<Object>} Blog post with full content
 */
export const getPublicBlogPost = async (slug) => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        const response = await fetch(`${API_URL}${PUBLIC_API}/${slug}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Blog post not found');
            }
            throw new Error('Failed to fetch blog post');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching blog post:', error);
        throw error;
    }
};

/**
 * Get public blog tags
 * @returns {Promise<Array>} List of tags with post counts
 */
export const getPublicBlogTags = async () => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        const response = await fetch(`${API_URL}${PUBLIC_API}/tags`);

        if (!response.ok) {
            throw new Error('Failed to fetch tags');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching public tags:', error);
        throw new Error(error.message || 'Failed to fetch tags');
    }
};

// ============================================================================
// ADMIN ENDPOINTS (Authentication required)
// ============================================================================

/**
 * Get all blog posts (admin)
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Items per page (1-100, default: 20)
 * @param {number} params.offset - Pagination offset (0-based)
 * @param {'DRAFT'|'PUBLISHED'} params.status - Filter by status
 * @param {number} params.authorId - Filter by author
 * @param {number[]} params.tagIds - Filter by tags
 * @param {string} params.search - Search in title/content
 * @returns {Promise<{data: Array, currentOffset: number, maxOffset: number}>}
 */
export const getAdminBlogPosts = async (params = {}) => {
    try {
        const query = new URLSearchParams();

        if (params.limit) query.set('limit', params.limit.toString());
        if (params.offset) query.set('offset', params.offset.toString());
        if (params.status) query.set('status', params.status);
        if (params.authorId) query.set('authorId', params.authorId.toString());
        if (params.tagIds?.length) query.set('tagIds', params.tagIds.join(','));
        if (params.search) query.set('search', params.search);

        const queryString = query.toString();
        const response = await axiosClient.get(`${API_BASE}${queryString ? `?${queryString}` : ''}`);
        return response;
    } catch (error) {
        if (error.status === 401) {
            throw new Error('Please login to view blog posts');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to view blog posts');
        }
        throw new Error(error.message || 'Failed to fetch blog posts');
    }
};

/**
 * Get single blog post for editing (admin)
 * @param {number} postId - Blog post ID
 * @returns {Promise<Object>} Blog post with all fields including image keys
 */
export const getAdminBlogPost = async (postId) => {
    try {
        const response = await axiosClient.get(`${API_BASE}/${postId}`);
        return response;
    } catch (error) {
        if (error.status === 404) {
            throw new Error('Blog post not found');
        }
        throw new Error(error.message || 'Failed to fetch blog post');
    }
};

/**
 * Create a new blog post (multipart)
 * @param {Object} request - Blog post data
 * @param {string} request.title - Required, 1-500 chars
 * @param {string} request.content - Required, min 10 chars (Markdown)
 * @param {string} request.excerpt - Optional, max 500 chars
 * @param {string} request.titleSi - Optional, Sinhala title
 * @param {string} request.excerptSi - Optional, Sinhala excerpt
 * @param {string} request.contentSi - Optional, Sinhala content
 * @param {string} request.slug - Optional, auto-generated if not provided
 * @param {string} request.metaTitle - Optional, max 255 chars
 * @param {string} request.metaDescription - Optional, max 500 chars
 * @param {number[]} request.tagIds - Optional, array of tag IDs
 * @param {'DRAFT'|'PUBLISHED'} request.status - Optional, defaults to DRAFT
 * @param {File} coverImage - Optional cover image file
 * @param {File[]} galleryImages - Optional array of gallery image files
 * @param {Function} onUploadProgress - Optional progress callback (0-100)
 * @returns {Promise<Object>} Created blog post
 */
export const createBlogPost = async (request, coverImage = null, galleryImages = [], onUploadProgress = null) => {
    try {
        const formData = new FormData();

        // Add request JSON as blob
        formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));

        // Add cover image if provided
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        // Add gallery images if provided
        if (galleryImages?.length) {
            galleryImages.forEach(file => {
                formData.append('galleryImages', file);
            });
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 300000, // 5 minutes for large uploads
        };

        if (onUploadProgress) {
            config.onUploadProgress = (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onUploadProgress(percentCompleted);
            };
        }

        const response = await axiosClient.post(API_BASE, formData, config);
        return response;
    } catch (error) {
        if (error.status === 400) {
            throw new Error(error.message || 'Invalid blog post data');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to create blog posts');
        } else if (error.status === 409) {
            throw new Error(error.message || 'A post with this slug already exists');
        }
        throw new Error(error.message || 'Failed to create blog post');
    }
};

/**
 * Publish a blog post
 * @param {number} postId - Blog post ID
 * @returns {Promise<void>}
 */
export const publishBlogPost = async (postId) => {
    try {
        await axiosClient.post(`${API_BASE}/${postId}/publish`);
    } catch (error) {
        if (error.status === 400) {
            throw new Error(error.message || 'Cannot publish this post');
        } else if (error.status === 404) {
            throw new Error('Blog post not found');
        }
        throw new Error(error.message || 'Failed to publish blog post');
    }
};

/**
 * Unpublish a blog post
 * @param {number} postId - Blog post ID
 * @returns {Promise<void>}
 */
export const unpublishBlogPost = async (postId) => {
    try {
        await axiosClient.post(`${API_BASE}/${postId}/unpublish`);
    } catch (error) {
        if (error.status === 404) {
            throw new Error('Blog post not found');
        }
        throw new Error(error.message || 'Failed to unpublish blog post');
    }
};

/**
 * Delete a blog post (soft delete)
 * @param {number} postId - Blog post ID
 * @returns {Promise<void>}
 */
export const deleteBlogPost = async (postId) => {
    try {
        await axiosClient.delete(`${API_BASE}/${postId}`);
    } catch (error) {
        if (error.status === 404) {
            throw new Error('Blog post not found');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to delete blog posts');
        }
        throw new Error(error.message || 'Failed to delete blog post');
    }
};

// ============================================================================
// TAG MANAGEMENT ENDPOINTS (Admin only)
// ============================================================================

/**
 * Get all tags (admin)
 * @returns {Promise<Array>} List of tags with post counts (includes drafts)
 */
export const getAdminBlogTags = async () => {
    try {
        const response = await axiosClient.get(`${API_BASE}/tags`);
        return response;
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch tags');
    }
};

/**
 * Create a new tag
 * @param {Object} data - Tag data
 * @param {string} data.name - Required, 2-50 chars
 * @param {string} data.nameSi - Optional, Sinhala name, 2-50 chars
 * @param {string} data.slug - Optional, auto-generated if not provided
 * @returns {Promise<Object>} Created tag
 */
export const createBlogTag = async (data) => {
    try {
        const response = await axiosClient.post(`${API_BASE}/tags`, data);
        return response;
    } catch (error) {
        if (error.status === 400) {
            throw new Error(error.message || 'Invalid tag data');
        } else if (error.status === 409) {
            throw new Error('A tag with this name or slug already exists');
        }
        throw new Error(error.message || 'Failed to create tag');
    }
};

/**
 * Update a tag (partial update)
 * @param {number} tagId - Tag ID
 * @param {Object} data - Fields to update
 * @param {string} data.name - Optional, new name
 * @param {string} data.nameSi - Optional, new Sinhala name
 * @param {string} data.slug - Optional, new slug
 * @returns {Promise<Object>} Updated tag
 */
export const updateBlogTag = async (tagId, data) => {
    try {
        const response = await axiosClient.patch(`${API_BASE}/tags/${tagId}`, data);
        return response;
    } catch (error) {
        if (error.status === 400) {
            throw new Error(error.message || 'Invalid tag data');
        } else if (error.status === 404) {
            throw new Error('Tag not found');
        } else if (error.status === 409) {
            throw new Error('A tag with this name or slug already exists');
        }
        throw new Error(error.message || 'Failed to update tag');
    }
};

/**
 * Delete a tag (hard delete)
 * @param {number} tagId - Tag ID
 * @returns {Promise<void>}
 */
export const deleteBlogTag = async (tagId) => {
    try {
        await axiosClient.delete(`${API_BASE}/tags/${tagId}`);
    } catch (error) {
        if (error.status === 404) {
            throw new Error('Tag not found');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to delete tags');
        }
        throw new Error(error.message || 'Failed to delete tag');
    }
};
