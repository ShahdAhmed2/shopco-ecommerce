import api from '../api/api';

export const wishlistService = {
  /**
   * Fetch authenticated user's wishlist
   * @returns {Promise<Object>} The wishlist object from backend
   */
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data.data;
  },

  /**
   * Add a product to user's wishlist
   * @param {string} productId - Product ID to add
   * @returns {Promise<Object>} The updated wishlist
   */
  addToWishlist: async (productId) => {
    const response = await api.post('/wishlist', { product: productId });
    return response.data.data;
  },

  /**
   * Remove a product from user's wishlist
   * @param {string} productId - Product ID to remove
   * @returns {Promise<Object>} The updated wishlist
   */
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data.data;
  },

  /**
   * Clear all products from user's wishlist
   * @returns {Promise<Object>} The cleared wishlist
   */
  clearWishlist: async () => {
    const response = await api.delete('/wishlist');
    return response.data.data;
  },
};
