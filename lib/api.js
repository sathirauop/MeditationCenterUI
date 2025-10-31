// API Configuration and utilities

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Generic fetch wrapper with error handling
async function fetchApi(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      'Network error. Please check your connection.',
      0,
      { originalError: error.message }
    );
  }
}

// Helper to decode JWT payload (without verification - only for client-side user info)
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

// Auth API endpoints
export const authApi = {
  login: async (credentials) => {
    const response = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Backend returns: { access_token, refresh_token, token_type, expires_in }
    // Decode JWT to get user info
    const payload = decodeJwtPayload(response.access_token);

    return {
      token: response.access_token,
      refreshToken: response.refresh_token,
      user: payload ? {
        userId: payload.userId,
        email: payload.email,
        name: payload.name || payload.email,
        role: payload.role,
      } : null,
    };
  },

  register: async (userData) => {
    const response = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Backend returns: { access_token, refresh_token, token_type, expires_in }
    // Decode JWT to get user info
    const payload = decodeJwtPayload(response.access_token);

    return {
      token: response.access_token,
      refreshToken: response.refresh_token,
      user: payload ? {
        userId: payload.userId,
        email: payload.email,
        name: payload.name || userData.name,
        role: payload.role,
      } : null,
    };
  },

  logout: async () => {
    return fetchApi('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    // Get user info from stored token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      throw new Error('Invalid token');
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name || payload.email,
      role: payload.role,
    };
  },

  refreshToken: async (refreshToken) => {
    return fetchApi('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },
};

// Generic CRUD operations
export const api = {
  get: (endpoint) => fetchApi(endpoint),
  post: (endpoint, data) => fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => fetchApi(endpoint, {
    method: 'DELETE',
  }),
};

export { ApiError };
