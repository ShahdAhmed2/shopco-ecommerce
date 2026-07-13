import api from '../api/api';

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data (name, email, password)
   * @returns {Promise<Object>} The registered user profile data
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data.data;
  },

  /**
   * Log in user
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise<Object>} The logged in user profile data and JWT
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data.data;
  },

  /**
   * Get user profile details
   * @returns {Promise<Object>} User details
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  /**
   * Log out user
   */
  logout: () => {
    localStorage.removeItem('token');
  },
};
