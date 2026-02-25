import axios from 'axios';

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Create an axios instance with default config
const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Plain axios instance used exclusively for token refresh requests.
 * This avoids the interceptor loop where a 401 on refresh would trigger another refresh.
 */
const refreshClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Shared promise to deduplicate concurrent refresh attempts.
 * If multiple requests fail with 401 simultaneously, only one refresh call is made.
 */
let refreshPromise = null;

/**
 * Attempt to refresh the auth token using the stored refresh token.
 * - Uses a plain axios instance (no interceptors) to avoid infinite loops.
 * - Deduplicates: concurrent callers share the same in-flight promise.
 * - On success, stores the new tokens in localStorage and returns the new access token.
 * - On failure, clears all tokens from localStorage and throws.
 */
export async function refreshAuthToken() {
  // If a refresh is already in-flight, piggyback on it
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      if (typeof window === 'undefined') throw new Error('Not in browser');

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await refreshClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const data = response.data;
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      return data.access_token;
    } catch (error) {
      // Refresh failed — clear all auth state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Request interceptor - Add auth token to all requests
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
axiosClient.interceptors.response.use(
  (response) => {
    // Return just the data for successful responses
    return response.data;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      console.debug('Network error or server not running');
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    }

    // Handle HTTP errors
    const { status, data } = error.response;

    // Create a structured error object
    const apiError = {
      message: data?.message || error.message || 'An error occurred',
      status,
      data: data || {},
    };

    // ── 401 Handling: attempt token refresh before giving up ──
    if (status === 401) {
      const originalRequest = error.config;

      // Don't attempt refresh for auth endpoints themselves or already-retried requests
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh');

      if (!originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshAuthToken();
          // Update the header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed — fall through to clear & redirect below
        }
      }

      // If we reach here, refresh was not possible or failed
      console.error('Unauthorized - clearing auth token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        // Only redirect if not already on login/register pages or viewing public content
        const isPublicRoute = window.location.pathname.includes('/event') ||
          window.location.pathname.includes('/media') ||
          window.location.pathname.includes('/programs') ||
          window.location.pathname === '/';
        if (!window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register') &&
          !isPublicRoute) {
          window.location.href = '/login';
        }
      }
      apiError.message = 'Session expired. Please login again.';
      return Promise.reject(apiError);
    }

    // Handle other specific status codes
    switch (status) {

      case 403:
        apiError.message = data?.message || 'Access forbidden';
        break;

      case 404:
        apiError.message = data?.message || 'Resource not found';
        break;

      case 409:
        apiError.message = data?.message || 'Resource already exists';
        break;

      case 422:
        apiError.message = data?.message || 'Validation error';
        break;

      case 500:
        apiError.message = 'Server error. Please try again later.';
        break;

      case 503:
        apiError.message = 'Service unavailable. Please try again later.';
        break;

      default:
        apiError.message = data?.message || 'An unexpected error occurred';
    }

    return Promise.reject(apiError);
  }
);

export default axiosClient;
