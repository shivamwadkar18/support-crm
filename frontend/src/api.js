import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

// Base URL of our backend API
// In development: localhost
// In production: will be replaced with deployed URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});


// ============================================
// REQUEST INTERCEPTOR - logs every request
// ============================================
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);


// ============================================
// RESPONSE INTERCEPTOR - handles errors globally
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    if (error.response) {
      console.error('❌ API Error:', error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server. Is backend running?');
    } else {
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);


// ============================================
// TICKET API FUNCTIONS
// ============================================

/**
 * Create a new support ticket
 * @param {Object} ticketData - { customer_name, customer_email, subject, description }
 * @returns Promise with created ticket info
 */
export const createTicket = async (ticketData) => {
  const response = await api.post('/api/tickets', ticketData);
  return response.data;
};


/**
 * Get all tickets - with optional status filter and search
 * @param {Object} params - { status, search }
 * @returns Promise with array of tickets
 */
export const getTickets = async (params = {}) => {
  // Build query string from non-empty params
  const queryParams = {};
  if (params.status) queryParams.status = params.status;
  if (params.search) queryParams.search = params.search;

  const response = await api.get('/api/tickets', { params: queryParams });
  return response.data;
};


/**
 * Get a single ticket by ID (includes all notes)
 * @param {string} ticketId - e.g. "TKT-A1B2"
 * @returns Promise with ticket details + notes
 */
export const getTicketById = async (ticketId) => {
  const response = await api.get(`/api/tickets/${ticketId}`);
  return response.data;
};


/**
 * Update a ticket - change status and/or add a note
 * @param {string} ticketId - e.g. "TKT-A1B2"
 * @param {Object} updateData - { status, note_text }
 * @returns Promise with success status
 */
export const updateTicket = async (ticketId, updateData) => {
  const response = await api.put(`/api/tickets/${ticketId}`, updateData);
  return response.data;
};


/**
 * Delete a ticket
 * @param {string} ticketId - e.g. "TKT-A1B2"
 * @returns Promise with success message
 */
export const deleteTicket = async (ticketId) => {
  const response = await api.delete(`/api/tickets/${ticketId}`);
  return response.data;
};


// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format an ISO date string to a readable format
 * @param {string} isoDate - "2024-01-15T10:30:00"
 * @returns "Jan 15, 2024, 10:30 AM"
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};


/**
 * Get a relative time string like "2 hours ago"
 * @param {string} isoDate
 * @returns "2 hours ago" or "Just now"
 */
export const getRelativeTime = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(isoDate);
};


export default api;