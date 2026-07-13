import api from '../api/api';

export const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - Order payload (orderItems, shippingAddress)
   * @returns {Promise<Object>} The created order object from backend
   */
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data.data;
  },

  /**
   * Fetch authenticated user's order history
   * @returns {Promise<Array>} List of past orders
   */
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data.data;
  },

  /**
   * Fetch order details by ID
   * @param {string} id - The order ID
   * @returns {Promise<Object>} The order details
   */
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },
};
