import api from '../api/axios';

export const productService = {
  /**
   * Fetch all products from the mock database
   * @returns {Promise<Array>} List of products
   */
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  /**
   * Fetch products filtered by section
   * @param {string} section - The section type (e.g. 'new-arrivals', 'top-selling')
   * @returns {Promise<Array>} List of products belonging to the section
   */
  getProductsBySection: async (section) => {
    const products = await productService.getAllProducts();
    return products.filter((product) => product.section === section);
  },

  /**
   * Create a new product record
   * @param {Object} productData - New product details
   * @returns {Promise<Object>} The created product details
   */
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Update an existing product record
   * @param {string|number} id - Product ID
   * @param {Object} productData - Updated fields
   * @returns {Promise<Object>} The updated product details
   */
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete a product record by ID
   * @param {string|number} id - Product ID
   * @returns {Promise<Object>} Delete response status
   */
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
