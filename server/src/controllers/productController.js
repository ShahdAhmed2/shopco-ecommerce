import mongoose from 'mongoose';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all products (with optional search, filtering, and sorting)
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
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
  } = req.query;

  // Build filter query object
  const query = {};

  // Search keyword match (case-insensitive name match)
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  // Category filter
  if (category) {
    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  // Dress style filter
  if (dressStyle) {
    query.dressStyle = { $regex: new RegExp(`^${dressStyle}$`, 'i') };
  }

  // Section filter (e.g. new-arrivals, top-selling)
  if (section) {
    query.section = section;
  }

  // Color filter (matches element in array or direct match)
  if (color) {
    query.colors = { $regex: new RegExp(`^${color}$`, 'i') };
  }

  // Size filter
  if (size) {
    query.sizes = { $regex: new RegExp(`^${size}$`, 'i') };
  }

  // Rating filter
  if (rating) {
    query.rating = { $gte: Number(rating) };
  }

  // Price range filters
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Build sorting option
  let sortBy = { createdAt: -1 }; // Default sort
  if (sort) {
    if (sort === 'price-asc') sortBy = { price: 1 };
    else if (sort === 'price-desc') sortBy = { price: -1 };
    else if (sort === 'rating-desc') sortBy = { rating: -1 };
  }

  const products = await Product.find(query).sort(sortBy);

  res.status(200).json({
    success: true,
    data: products,
  });
});

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Product ID format');
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Public
 */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Public
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Product ID format');
  }

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Public
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Product ID format');
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: {},
  });
});
