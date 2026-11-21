import axios from 'axios';

// Normalize API base URL: defaults to local proxy or environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Extract clean error message from API response or network failure
 */
export const formatErrorMessage = (error) => {
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map((e) => e.message).join(' | ');
  }
  return (
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred while communicating with the server'
  );
};

// API Methods
export const leadApi = {
  // Fetch leads with optional search, filter, sorting, and pagination
  getLeads: async ({
    search = '',
    status = 'All',
    source = 'All',
    sort = '-createdAt',
    page = 1,
    limit = 10,
  } = {}) => {
    const params = {};
    if (search && search.trim()) params.search = search.trim();
    if (status && status !== 'All') params.status = status;
    if (source && source !== 'All') params.source = source;
    if (sort) params.sort = sort;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await apiClient.get('/leads', { params });
    return response.data;
  },

  // Fetch dashboard statistics
  getStats: async () => {
    const response = await apiClient.get('/leads/stats');
    return response.data;
  },

  // Fetch single lead
  getLeadById: async (id) => {
    const response = await apiClient.get(`/leads/${id}`);
    return response.data;
  },

  // Create a new lead
  createLead: async (leadData) => {
    const response = await apiClient.post('/leads', leadData);
    return response.data;
  },

  // Update lead
  updateLead: async (id, leadData) => {
    const response = await apiClient.put(`/leads/${id}`, leadData);
    return response.data;
  },

  // Delete lead
  deleteLead: async (id) => {
    const response = await apiClient.delete(`/leads/${id}`);
    return response.data;
  },
};

export default leadApi;
