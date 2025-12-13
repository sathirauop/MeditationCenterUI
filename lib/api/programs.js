import axiosClient from '@/lib/axios-client';

const API_BASE = '/admin';

/**
 * Get active meditation program for admin management
 * @returns {Promise<Object>} Active program data
 */
export const getActiveProgram = async () => {
    return await axiosClient.get(`${API_BASE}/programs/active`);
};

/**
 * Get active meditation program (Public)
 * @returns {Promise<Object>} Active program data
 */
export const getPublicActiveProgram = async () => {
    return await axiosClient.get('/programs/active');
};

/**
 * Create a new program (JSON only - without images)
 * @param {Object} data - Program data (name, description, maxSeats, isActive)
 * @returns {Promise<Object>} Created program
 */
export const createProgram = async (data) => {
    return await axiosClient.post(`${API_BASE}/programs/json`, data);
};

/**
 * Create a new program with images (multipart)
 * @param {Object} programData - Program JSON data
 * @param {File} coverImage - Optional cover image file
 * @param {File[]} galleryImages - Optional gallery image files
 * @returns {Promise<Object>} Created program
 */
export const createProgramWithImages = async (programData, coverImage, galleryImages) => {
    const formData = new FormData();
    formData.append('program', JSON.stringify(programData));

    if (coverImage) {
        formData.append('coverImage', coverImage);
    }

    if (galleryImages && galleryImages.length > 0) {
        galleryImages.forEach(image => {
            formData.append('galleryImages', image);
        });
    }

    return await axiosClient.post(`${API_BASE}/programs`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Update an existing program (JSON only - text fields),
 * @param {number} programId - Program ID
 * @param {Object} data - Partial program data to update
 * @returns {Promise<Object>} Updated program
 */
export const updateProgram = async (programId, data) => {
    return await axiosClient.patch(`${API_BASE}/programs/${programId}`, data);
};
