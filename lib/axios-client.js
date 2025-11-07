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
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error or server not running');
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

    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        console.error('Unauthorized - clearing auth token');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          // Only redirect if not already on login/register pages
          if (!window.location.pathname.includes('/login') &&
              !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
        }
        apiError.message = 'Session expired. Please login again.';
        break;

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
