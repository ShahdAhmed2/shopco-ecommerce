import api from '../api/api';

export const cartService = {
  /**
   * Fetch user cart from MongoDB
   * @returns {Promise<Object>} The cart object containing items
   */
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data.data;
  },

  /**
   * Add item to user cart
   * @param {Object} itemData - Item details (product, quantity, color, size)
   * @returns {Promise<Object>} The updated cart object
   */
  addToCart: async (itemData) => {
    const response = await api.post('/cart', itemData);
    return response.data.data;
  },

  /**
   * Update quantity of a cart item
   * @param {string} itemId - The cart item subdocument ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} The updated cart object
   */
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data.data;
  },

  /**
   * Remove item from cart
   * @param {string} itemId - The cart item subdocument ID
   * @returns {Promise<Object>} The updated cart object
   */
  removeCartItem: async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data.data;
  },

  /**
   * Clear all items from cart
   * @returns {Promise<Object>} The cleared cart object
   */
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data.data;
  },
};
