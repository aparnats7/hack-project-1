import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
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

// Example API functions
// export const testConnection = () => api.get('/test');

// User related functions
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const forgotPassword = (email) => api.post('/users/forgot-password', { email });
export const resetPassword = (token, password) => api.post(`/users/reset-password/${token}`, { password });
export const getCurrentUser = () => api.get('/users/profile');
export const updateUserProfile = (userData) => api.put('/users/profile', userData);

// Document related functions
export const uploadDocument = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return api.post('/documents', formData, config);
};

export const getDocuments = (query = '') => api.get(`/documents?search=${query}`);

export const getDocumentById = (id) => api.get(`/documents/${id}`);

export const updateDocument = (id, data) => api.put(`/documents/${id}`, data);

export const deleteDocument = (id) => api.delete(`/documents/${id}`);

export const downloadDocument = (id) => api.get(`/documents/${id}/download`, {
  responseType: 'blob',
});

// Verification related functions
export const verifyDocument = (documentId, verificationData) =>
  api.post(`/verifications`, { documentId, ...verificationData });

export const getVerifications = (documentId) =>
  api.get(`/verifications/${documentId}`);

export default api;
