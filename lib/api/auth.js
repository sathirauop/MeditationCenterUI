import axiosClient from '../axios-client';

/**
 * Authentication API functions
 * All functions use axios client with automatic token injection
 */

/**
 * Login user with email and password
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} { access_token, refresh_token, token_type, expires_in }
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axiosClient.post('/auth/login', credentials);
    return response;
  } catch (error) {
    // Enhanced error messages for login
    if (error.status === 401) {
      throw new Error('Invalid email or password');
    } else if (error.status === 403) {
      throw new Error('Account not activated. Please check your email.');
    } else if (error.status === 404) {
      throw new Error('User not found');
    } else {
      throw new Error(error.message || 'Login failed');
    }
  }
};

/**
 * Register new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} { access_token, refresh_token, token_type, expires_in }
 */
export const signupUser = async (userData) => {
  try {
    const response = await axiosClient.post('/auth/register', userData);
    return response;
  } catch (error) {
    // Enhanced error messages for registration
    if (error.status === 400) {
      throw new Error('Invalid data provided. Please check your information.');
    } else if (error.status === 409) {
      throw new Error('Email already exists. Please use a different email.');
    } else {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }
};

/**
 * Get current user profile
 * Requires authentication token
 * @returns {Promise<Object>} User object
 */
export const getCurrentUser = async () => {
  try {
    // Try to get user from token first (client-side decode)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const payload = decodeJwtPayload(token);
          return {
            userId: payload.userId,
            email: payload.email,
            name: payload.name || payload.email,
            role: payload.role,
          };
        } catch (e) {
          // If decode fails, fall through to API call
        }
      }
    }

    // Fallback to API call if needed
    const response = await axiosClient.get('/auth/me');
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to get user profile');
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await axiosClient.post('/auth/logout');
  } catch (error) {
    // Don't throw on logout - always clear local state
    console.error('Logout error:', error);
  }
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New tokens
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axiosClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to refresh token');
  }
};

/**
 * Update user role
 * @param {Object} role - { role: 'user' | 'admin' | 'event_manager' }
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserRole = async (role) => {
  try {
    const response = await axiosClient.post('/auth/select-role', role);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to update role');
  }
};

/**
 * Helper function to decode JWT payload
 * NOTE: This is for display purposes only. Server validates the token.
 */
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}
