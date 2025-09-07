// API utility functions for centralized API management
const API_BASE_URL = 'https://mama-two-lime.vercel.app/api';
// const API_BASE_URL ='http://localhost:8080/api';
// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, defaultOptions);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Phone API functions
export const phoneAPI = {
  // Get all phones
  getAll: async () => {
    return apiRequest('/Phone');
  },

  // Get single phone by ID
  getById: async (id) => {
    return apiRequest(`/Phone/${id}`);
  },
  update: async (id, phoneData) => {
    return apiRequest(`/Phone/${id}`, {
      method: 'PUT',
      body: JSON.stringify(phoneData),
    });
  },
  // Create new phone
  create: async (phoneData) => {
    return apiRequest('/Phone', {
      method: 'POST',
      body: JSON.stringify(phoneData),
    });
  },

  // Update phone
  update: async (id, phoneData) => {
    return apiRequest(`/Phone/${id}`, {
      method: 'PUT',
      body: JSON.stringify(phoneData),
    });
  },

  // Delete phone (sell)
  delete: async (deleteData) => {
    return apiRequest('/delete', {
      method: 'POST',
      body: JSON.stringify(deleteData),
    });
  },

  // Get threshold data
  getThreshold: async () => {
    return apiRequest('/threehold');
  },
};

// Auth API functions
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token if provided
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user || {}));
    }
    
    return response;
  },

  // Register
  register: async (userData) => {
    const response = await apiRequest('/user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Auto-login after registration if token is provided
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user || {}));
    }
    
    return response;
  },

  // Logout
  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  // Verify token
  verifyToken: async () => {
    return apiRequest('/verify-token');
  },

};

// Inventory API functions (if needed for other operations)
export const inventoryAPI = {
  // Get inventory stats
  getStats: async () => {
    return apiRequest('/inventory/stats');
  },

  // Get low stock items
  getLowStock: async (threshold = 10) => {
    return apiRequest(`/inventory/low-stock?threshold=${threshold}`);
  },
};

// Export all APIs
const api = {
  phone: phoneAPI,
  auth: authAPI,
  inventory: inventoryAPI,
};

export default api;