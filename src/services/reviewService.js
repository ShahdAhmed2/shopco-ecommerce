import api from '../api/api';

export const reviewService = {
  /**
   * Fetch all reviews for a product
   * @param {string} productId - The product ID
   * @returns {Promise<Array>} List of product reviews
   */
  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/${productId}`);
    return response.data.data;
  },

  /**
   * Create or update a product review
   * @param {string} productId - The product ID
   * @param {Object} reviewData - { rating, comment }
   * @returns {Promise<Object>} The updated product object
   */
  createOrUpdateReview: async (productId, reviewData) => {
    const response = await api.post(`/reviews/${productId}`, reviewData);
    return response.data.data;
  },

  /**
   * Delete a product review
   * @param {string} productId - The product ID
   * @param {string} reviewId - The review ID
   * @returns {Promise<Object>} The updated product object
   */
  deleteReview: async (productId, reviewId) => {
    const response = await api.delete(`/reviews/${productId}/${reviewId}`);
    return response.data.data;
  },
};
