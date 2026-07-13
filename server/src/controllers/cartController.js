import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Helper to fetch a cart and populate product details
 */
const findAndPopulateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

/**
 * @desc    Get active user's cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = asyncHandler(async (req, res) => {
  const cart = await findAndPopulateCart(req.user._id);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

/**
 * @desc    Add an item to the cart
 * @route   POST /api/cart
 * @access  Private
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { product: productId, quantity = 1, color = '', size = '' } = req.body;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error('Please provide a valid product ID');
  }

  // 1. Verify product existence
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const requestedQty = Number(quantity);
  if (isNaN(requestedQty) || requestedQty <= 0) {
    res.status(400);
    throw new Error('Please provide a valid quantity');
  }

  // Find or create cart
  const cart = await findAndPopulateCart(req.user._id);

  // Check if item already exists in the cart (same product, color, and size)
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.product._id.toString() === productId.toString() &&
      item.color === color &&
      item.size === size
  );

  let targetQuantity = requestedQty;
  if (existingItemIndex !== -1) {
    targetQuantity += cart.items[existingItemIndex].quantity;
  }

  // 2. Stock validation
  if (targetQuantity > product.stock) {
    res.status(400);
    throw new Error('Requested quantity exceeds available stock');
  }

  // Update or insert item
  if (existingItemIndex !== -1) {
    cart.items[existingItemIndex].quantity = targetQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity: requestedQty,
      color,
      size,
    });
  }

  await cart.save();
  
  // Re-fetch populated cart
  const updatedCart = await findAndPopulateCart(req.user._id);

  res.status(200).json({
    success: true,
    data: updatedCart,
  });
});

/**
 * @desc    Update quantity of a specific cart item
 * @route   PUT /api/cart/:itemId
 * @access  Private
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400);
    throw new Error('Invalid Item ID format');
  }

  const requestedQty = Number(quantity);
  if (isNaN(requestedQty) || requestedQty <= 0) {
    res.status(400);
    throw new Error('Please provide a valid quantity');
  }

  const cart = await findAndPopulateCart(req.user._id);

  // Find item by its subdocument _id
  const item = cart.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  // Fetch product to validate stock availability
  const product = await Product.findById(item.product._id || item.product);
  if (!product) {
    res.status(404);
    throw new Error('Product associated with this item no longer exists');
  }

  // Stock check
  if (requestedQty > product.stock) {
    res.status(400);
    throw new Error('Requested quantity exceeds available stock');
  }

  item.quantity = requestedQty;
  await cart.save();

  // Re-fetch populated cart
  const updatedCart = await findAndPopulateCart(req.user._id);

  res.status(200).json({
    success: true,
    data: updatedCart,
  });
});

/**
 * @desc    Remove an item from the cart
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400);
    throw new Error('Invalid Item ID format');
  }

  const cart = await findAndPopulateCart(req.user._id);

  const item = cart.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  cart.items.pull(itemId);
  await cart.save();

  // Re-fetch populated cart
  const updatedCart = await findAndPopulateCart(req.user._id);

  res.status(200).json({
    success: true,
    data: updatedCart,
  });
});

/**
 * @desc    Clear entire cart items list
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await findAndPopulateCart(req.user._id);

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
  });
});
