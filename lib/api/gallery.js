import axiosClient from '../axios-client';

/**
 * Gallery API functions
 * Functions for managing gallery groups and photos
 */

const API_BASE = '/admin/gallery';
const PUBLIC_API = '/gallery';

// ============================================================================
// PUBLIC ENDPOINTS (No authentication required)
// ============================================================================

/**
 * Get all active gallery groups with photos (public)
 * @returns {Promise<Array>} List of gallery groups with photos
 */
export const getPublicGallery = async () => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        const response = await fetch(`${API_URL}${PUBLIC_API}`);

        if (!response.ok) {
            throw new Error('Failed to fetch gallery');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching public gallery:', error);
        throw new Error(error.message || 'Failed to fetch gallery');
    }
};

// ============================================================================
// ADMIN ENDPOINTS (Authentication required)
// ============================================================================

/**
 * Get all gallery groups (admin)
 * @returns {Promise<Array>} List of gallery groups with photo counts
 */
export const getAdminGalleryGroups = async () => {
    try {
        const response = await axiosClient.get(API_BASE);
        return response;
    } catch (error) {
        if (error.status === 401) {
            throw new Error('Please login to manage gallery');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to manage gallery');
        }
        throw new Error(error.message || 'Failed to fetch gallery groups');
    }
};

/**
 * Get single gallery group with photos (admin)
 * @param {number} groupId - Gallery group ID
 * @returns {Promise<Object>} Gallery group with photos
 */
export const getAdminGalleryGroup = async (groupId) => {
    try {
        const response = await axiosClient.get(`${API_BASE}/${groupId}`);
        return response;
    } catch (error) {
        if (error.status === 404) {
            throw new Error('Gallery group not found');
        }
        throw new Error(error.message || 'Failed to fetch gallery group');
    }
};

/**
 * Create a new gallery group
 * @param {Object} data - Group data
 * @param {string} data.name - Required, group name
 * @param {string} data.nameSi - Optional, Sinhala name
 * @param {number} data.sortOrder - Optional, display order
 * @returns {Promise<Object>} Created gallery group
 */
export const createGalleryGroup = async (data) => {
    try {
        const response = await axiosClient.post(API_BASE, data);
        return response;
    } catch (error) {
        if (error.status === 400) {
            throw new Error(error.message || 'Invalid gallery group data');
        }
        throw new Error(error.message || 'Failed to create gallery group');
    }
};

/**
 * Update a gallery group
 * @param {number} groupId - Gallery group ID
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export const updateGalleryGroup = async (groupId, data) => {
    try {
        await axiosClient.patch(`${API_BASE}/${groupId}`, data);
    } catch (error) {
        if (error.status === 404) {
            throw new Error('Gallery group not found');
        }
        throw new Error(error.message || 'Failed to update gallery group');
    }
};

/**
 * Delete a gallery group
 * @param {number} groupId - Gallery group ID
 * @returns {Promise<void>}
 */
export const deleteGalleryGroup = async (groupId) => {
    try {
        await axiosClient.delete(`${API_BASE}/${groupId}`);
    } catch (error) {
        if (error.status === 404) {
            throw new Error('Gallery group not found');
        }
        throw new Error(error.message || 'Failed to delete gallery group');
    }
};

/**
 * Add photos to a gallery group
 * @param {number} groupId - Gallery group ID
 * @param {File[]} files - Photo files to upload
 * @param {Function} onUploadProgress - Optional progress callback (0-100)
 * @returns {Promise<Object>} Response with added photos
 */
export const addGalleryPhotos = async (groupId, files, onUploadProgress = null) => {
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('photos', file);
        });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 300000,
        };

        if (onUploadProgress) {
            config.onUploadProgress = (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onUploadProgress(percentCompleted);
            };
        }

        const response = await axiosClient.post(`${API_BASE}/${groupId}/photos`, formData, config);
        return response;
    } catch (error) {
        if (error.status === 404) {
            throw new Error('Gallery group not found');
        }
        throw new Error(error.message || 'Failed to upload photos');
    }
};

/**
 * Delete a single photo from a gallery group
 * @param {number} groupId - Gallery group ID
 * @param {number} photoId - Photo ID
 * @returns {Promise<void>}
 */
export const deleteGalleryPhoto = async (groupId, photoId) => {
    try {
        await axiosClient.delete(`${API_BASE}/${groupId}/photos/${photoId}`);
    } catch (error) {
        if (error.status === 404) {
            throw new Error('Photo not found');
        }
        throw new Error(error.message || 'Failed to delete photo');
    }
};
