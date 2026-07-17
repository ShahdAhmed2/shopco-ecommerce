import api from '../api/api';
import { products as localProducts } from '../data/products';

const mapProduct = (p) => {
  if (!p) return p;
  return {
    ...p,
    id: p._id || p.id,
  };
};

/**
 * Helper to query and filter local products in memory.
 * Portfolio Demo Fallback.
 */
const getProductsLocal = (filters = {}) => {
  let result = [...localProducts];

  const {
    search,
    category,
    dressStyle,
    section,
    color,
    size,
    minPrice,
    maxPrice,
    rating,
    sort,
  } = filters;

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
    );
  }

  // Category filter
  if (category) {
    const catLower = category.toLowerCase();
    result = result.filter((p) => p.category && p.category.toLowerCase() === catLower);
  }

  // Dress style filter
  if (dressStyle) {
    const styleLower = dressStyle.toLowerCase();
    result = result.filter((p) => p.dressStyle && p.dressStyle.toLowerCase() === styleLower);
  }

  // Section filter
  if (section) {
    result = result.filter((p) => p.section === section);
  }

  // Color filter
  if (color) {
    const colorLower = color.toLowerCase();
    result = result.filter((p) => p.colors && p.colors.some((c) => c.toLowerCase() === colorLower));
  }

  // Size filter
  if (size) {
    const sizeLower = size.toLowerCase();
    result = result.filter((p) => p.sizes && p.sizes.some((s) => s.toLowerCase() === sizeLower));
  }

  // Rating filter
  if (rating) {
    result = result.filter((p) => p.rating >= Number(rating));
  }

  // Price filters
  if (minPrice !== undefined && minPrice !== '') {
    result = result.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }

  // Sorting
  if (sort) {
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }
  }

  return result.map(mapProduct);
};

export const productService = {
  /**
   * Fetch all products matching the given filters from MongoDB
   * @param {Object} [filters] - Query filters (search, category, dressStyle, minPrice, maxPrice, rating, sort, section)
   * @returns {Promise<Array>} List of products
   */
  getProducts: async (filters = {}) => {
    try {
      const response = await api.get('/products', { params: filters });
      return (response.data.data || []).map(mapProduct);
    } catch (error) {
      /* Portfolio Demo Fallback */
      console.warn('API request failed. Falling back to local dataset. (Portfolio Demo Fallback)', error);
      return getProductsLocal(filters);
    }
  },

  /**
   * Fetch a single product from MongoDB by its ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} The product details
   */
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return mapProduct(response.data.data);
    } catch (error) {
      /* Portfolio Demo Fallback */
      console.warn(`API request for product ID ${id} failed. Falling back to local dataset. (Portfolio Demo Fallback)`, error);
      const product = localProducts.find(
        (p) =>
          p.id === id ||
          p._id === id ||
          (p.name && p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === id.toLowerCase().replace(/[^a-z0-9]/g, ''))
      );
      if (!product) throw error;
      return mapProduct(product);
    }
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