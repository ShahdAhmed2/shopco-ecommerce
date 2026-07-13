import api from '../api/api';

const mapProduct = (p) => {
  if (!p) return p;
  return {
    ...p,
    id: p._id || p.id,
  };
};

export const productService = {
  /**
   * Fetch all products matching the given filters from MongoDB
   * @param {Object} [filters] - Query filters (search, category, dressStyle, minPrice, maxPrice, rating, sort, section)
   * @returns {Promise<Array>} List of products
   */
  getProducts: async (filters = {}) => {
    const response = await api.get('/products', { params: filters });
    return (response.data.data || []).map(mapProduct);
  },

  /**
   * Fetch a single product from MongoDB by its ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} The product details
   */
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return mapProduct(response.data.data);
  },

  /**
   * Create a new product in MongoDB (Admin authorized)
   * @param {Object} productData - New product details
   * @returns {Promise<Object>} The created product details
   */
  createProduct: async (productData) => {
    const { _id, id, ...cleanData } = productData;
    const response = await api.post('/products', cleanData);
    return mapProduct(response.data.data);
  },

  /**
   * Update an existing product in MongoDB (Admin authorized)
   * @param {string} id - Product ID
   * @param {Object} productData - Updated fields
   * @returns {Promise<Object>} The updated product details
   */
  updateProduct: async (id, productData) => {
    const { _id, id: tempId, ...cleanData } = productData;
    const response = await api.put(`/products/${id}`, cleanData);
    return mapProduct(response.data.data);
  },

  /**
   * Delete a product from MongoDB (Admin authorized)
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Delete response status
   */
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Backward-compatible alias for fetching all products
   */
  getAllProducts: function () {
    return this.getProducts();
  },

  /**
   * Backward-compatible alias for fetching a product by ID
   */
  getProductById: function (id) {
    return this.getProduct(id);
  },

  /**
   * Backward-compatible alias for fetching products by section
   */
  getProductsBySection: function (section) {
    return this.getProducts({ section });
  },
};
