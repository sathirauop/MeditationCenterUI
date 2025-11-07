/**
 * API Module
 * Uses Axios client with interceptors for automatic token injection and error handling
 */

import axiosClient from './axios-client';

/**
 * Generic CRUD operations using axios
 * All requests automatically include auth token from localStorage
 */
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Optional axios config
   * @returns {Promise<any>} Response data
   */
  get: (endpoint, config = {}) => axiosClient.get(endpoint, config),

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Optional axios config
   * @returns {Promise<any>} Response data
   */
  post: (endpoint, data, config = {}) => axiosClient.post(endpoint, data, config),

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Optional axios config
   * @returns {Promise<any>} Response data
   */
  put: (endpoint, data, config = {}) => axiosClient.put(endpoint, data, config),

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Optional axios config
   * @returns {Promise<any>} Response data
   */
  patch: (endpoint, data, config = {}) => axiosClient.patch(endpoint, data, config),

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Optional axios config
   * @returns {Promise<any>} Response data
   */
  delete: (endpoint, config = {}) => axiosClient.delete(endpoint, config),
};

// Export the axios client for advanced usage
export { axiosClient };

// Re-export auth API functions for convenience
export * from './api/auth';
