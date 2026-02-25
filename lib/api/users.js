import axiosClient from '../axios-client';

/**
 * Admin Users API functions
 * All endpoints require ADMIN role authorization
 */

const API_BASE = '/admin/users';

/**
 * Get paginated list of users with optional filters
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=20] - Results per page (max 100)
 * @param {number} [params.offset=0] - Pagination offset
 * @param {string} [params.role] - Filter by role: USER or ADMIN
 * @param {boolean} [params.isActive] - Filter by active status
 * @param {string} [params.search] - Search by name or email (partial match)
 * @returns {Promise<Object>} { data: User[], total, limit, offset, max_offset }
 */
export const getAdminUsers = async ({ limit = 20, offset = 0, role, isActive, search } = {}) => {
    try {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        params.set('offset', String(offset));
        if (role) params.set('role', role);
        if (isActive !== undefined && isActive !== '') params.set('isActive', String(isActive));
        if (search) params.set('search', search);

        const response = await axiosClient.get(`${API_BASE}?${params.toString()}`);
        return response;
    } catch (error) {
        if (error.status === 401) {
            throw new Error('Please login to view users');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to view users');
        }
        throw new Error(error.message || 'Failed to fetch users');
    }
};

/**
 * Get a single user by ID (includes statistics)
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User object with statistics
 */
export const getAdminUser = async (userId) => {
    try {
        const response = await axiosClient.get(`${API_BASE}/${userId}`);
        return response;
    } catch (error) {
        if (error.status === 404) {
            throw new Error('User not found');
        } else if (error.status === 401) {
            throw new Error('Please login to view user details');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to view user details');
        }
        throw new Error(error.message || 'Failed to fetch user');
    }
};

/**
 * Create a new user (admin)
 * @param {Object} userData - User data
 * @param {string} userData.email - Required, valid email
 * @param {string} userData.password - Required, min 8 chars
 * @param {string} userData.name - Required
 * @param {string} [userData.mobile_number] - Optional, E.164 format
 * @param {string} userData.role - Required: USER or ADMIN
 * @param {boolean} [userData.is_active=true] - Optional
 * @param {boolean} [userData.email_verified=false] - Optional
 * @returns {Promise<Object>} Created user
 */
export const createAdminUser = async (userData) => {
    try {
        const response = await axiosClient.post(API_BASE, userData);
        return response;
    } catch (error) {
        if (error.status === 400) {
            throw new Error(error.message || 'Invalid user data');
        } else if (error.status === 409) {
            throw new Error(error.message || 'A user with this email already exists');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to create users');
        }
        throw new Error(error.message || 'Failed to create user');
    }
};

/**
 * Update an existing user (admin) — PATCH, only send changed fields
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update (all optional)
 * @param {string} [updates.email] - Valid email
 * @param {string} [updates.password] - Min 8 chars
 * @param {string} [updates.name] - User name
 * @param {string} [updates.mobile_number] - E.164 format
 * @returns {Promise<Object>} Updated user
 */
export const updateAdminUser = async (userId, updates) => {
    try {
        const response = await axiosClient.patch(`${API_BASE}/${userId}`, updates);
        return response;
    } catch (error) {
        if (error.status === 400) {
            throw new Error(error.message || 'Invalid update data');
        } else if (error.status === 404) {
            throw new Error('User not found');
        } else if (error.status === 409) {
            throw new Error(error.message || 'A user with this email already exists');
        } else if (error.status === 403) {
            throw new Error('You do not have permission to update users');
        }
        throw new Error(error.message || 'Failed to update user');
    }
};
