import axiosClient from '../axios-client';

/**
 * Books API functions
 * Functions for creating and managing books (PDFs)
 */

const API_BASE = '/admin';

/**
 * Create a new book with PDF and optional cover image (multipart)
 * @param {Object} bookData - Book JSON data { title, author, description }
 * @param {File} pdfFile - Required PDF file (max 50MB)
 * @param {File} coverImage - Optional cover image file (max 5MB)
 * @param {Function} onUploadProgress - Optional callback for upload progress (0-100)
 * @returns {Promise<Object>} Created book with presigned URLs
 */
export const createBook = async (bookData, pdfFile, coverImage = null, onUploadProgress = null) => {
    try {
        const formData = new FormData();

        // Add book metadata as JSON string
        formData.append('book', JSON.stringify(bookData));

        // Add PDF file (required)
        formData.append('pdfFile', pdfFile);

        // Add cover image if provided
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            // Increase timeout for large file uploads (5 minutes)
            timeout: 300000,
        };

        // Add upload progress tracking if callback provided
        if (onUploadProgress) {
            config.onUploadProgress = (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onUploadProgress(percentCompleted);
            };
        }

        const response = await axiosClient.post(`${API_BASE}/book`, formData, config);

        return response;
    } catch (error) {
        if (error.status === 400) {
            throw new Error(error.message || 'Invalid book data or file');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to upload books');
        } else if (error.status === 413) {
            throw new Error('File size exceeds server limits');
        }
        throw new Error(error.message || 'Failed to create book');
    }
};

/**
 * Create a book without files (JSON-only, for testing when R2 is disabled)
 * @param {Object} bookData - Book JSON data { title, author, description }
 * @returns {Promise<Object>} Created book (without file URLs)
 */
export const createBookJson = async (bookData) => {
    try {
        const response = await axiosClient.post(`${API_BASE}/book/json`, bookData);
        return response;
    } catch (error) {
        if (error.status === 400) {
            throw new Error(error.message || 'Invalid book data');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to create books');
        }
        throw new Error(error.message || 'Failed to create book');
    }
};

/**
 * Get public books list (no authentication required)
 * Only returns active books
 * @param {number} limit - Items per page (default: 20, max: 100)
 * @param {number} offset - Page number (0-based)
 * @returns {Promise<Object>} { data: Book[], current_offset, max_offset }
 */
export const getPublicBooks = async (limit = 20, offset = 0) => {
    try {
        // Use plain axios without auth for public endpoint
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        const response = await fetch(`${API_URL}/books?limit=${limit}&offset=${offset}`);

        if (!response.ok) {
            if (response.status === 404) {
                return { data: [], current_offset: 0, max_offset: 0 };
            }
            throw new Error('Failed to fetch books');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching public books:', error);
        throw new Error(error.message || 'Failed to fetch books');
    }
};

/**
 * Get admin books list (requires authentication)
 * Returns all books including inactive ones
 * @param {number} limit - Items per page (default: 20, max: 100)
 * @param {number} offset - Page number (0-based)
 * @returns {Promise<Object>} { data: Book[], current_offset, max_offset }
 */
export const getAdminBooks = async (limit = 20, offset = 0) => {
    try {
        const response = await axiosClient.get(`${API_BASE}/book?limit=${limit}&offset=${offset}`);
        return response;
    } catch (error) {
        if (error.status === 401) {
            throw new Error('Please login to view books');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to view books');
        } else if (error.status === 404) {
            return { data: [], current_offset: 0, max_offset: 0 };
        }
        throw new Error(error.message || 'Failed to fetch books');
    }
};

/**
 * Update book metadata (PATCH endpoint)
 * @param {number} bookId - Book ID to update
 * @param {Object} updates - Fields to update { title?, author?, description?, is_active? }
 * @returns {Promise<Object>} Updated book with fresh presigned URLs
 */
export const updateBook = async (bookId, updates) => {
    try {
        const response = await axiosClient.patch(`${API_BASE}/book/${bookId}`, updates);
        return response;
    } catch (error) {
        if (error.status === 400) {
            throw new Error(error.message || 'Invalid update data');
        } else if (error.status === 401) {
            throw new Error('Please login to update books');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to update books');
        } else if (error.status === 404) {
            throw new Error('Book not found');
        }
        throw new Error(error.message || 'Failed to update book');
    }
};

/**
 * Toggle book active status
 * @param {number} bookId - Book ID to toggle
 * @param {boolean} currentStatus - Current is_active value
 * @returns {Promise<Object>} Updated book
 */
export const toggleBookStatus = async (bookId, currentStatus) => {
    return updateBook(bookId, { is_active: !currentStatus });
};
