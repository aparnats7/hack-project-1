import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Documents API
export const documentsAPI = {
  uploadDocument: (formData) => api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getDocuments: () => api.get('/documents'),
  getDocument: (id) => api.get(`/documents/${id}`),
  deleteDocument: (id) => api.delete(`/documents/${id}`),
};

// Verification API
export const verificationAPI = {
  verifyDocument: (id) => api.post(`/verification/verify/${id}`),
  getVerificationStatus: (id) => api.get(`/verification/status/${id}`),
  getVerificationHistory: (id) => api.get(`/verification/history/${id}`),
};

// Error handling helper
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data.error || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server',
      status: 0,
    };
  } else {
    // Error in request setup
    return {
      message: error.message,
      status: 0,
    };
  }
};

export default api; 