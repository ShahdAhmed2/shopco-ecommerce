import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Create a new order from cart details
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  // 1. Validation checks
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.country) {
    res.status(400);
    throw new Error('Please provide complete shipping details');
  }

  // 2. Lookup products in MongoDB to compute totals server-side
  let subtotal = 0;
  const verifiedOrderItems = [];

  for (const item of orderItems) {
    if (!mongoose.Types.ObjectId.isValid(item.product)) {
      res.status(400);
      throw new Error(`Invalid Product ID format: ${item.product}`);
    }

    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    // Compute actual unit price taking discounts into account
    const actualPrice = product.discount
      ? Number((product.price * (1 - product.discount / 100)).toFixed(2))
      : product.price;

    const quantity = Number(item.quantity) || 1;
    subtotal += Number((actualPrice * quantity).toFixed(2));

    verifiedOrderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: actualPrice,
      quantity,
      color: item.color || '',
      size: item.size || '',
    });
  }

  // Set default business rules for fee computations
  const shippingFee = subtotal > 200 ? 0 : 15; // Free shipping over $200, otherwise $15
  const tax = Number((subtotal * 0.08).toFixed(2)); // 8% sales tax
  const totalPrice = Number((subtotal + shippingFee + tax).toFixed(2));

  // 3. Save order
  const order = await Order.create({
    user: req.user._id,
    orderItems: verifiedOrderItems,
    shippingAddress,
    subtotal,
    shippingFee,
    tax,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: orders,
  });
});

/**
 * @desc    Get order details by ID (Owner or Admin only)
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Order ID format');
  }

  const order = await Order.findById(id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Guard access to owner or administrator roles only
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to access this order');
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * @desc    Get all orders in system (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: orders,
  });
});

/**
 * @desc    Update order shipping/delivery status (Admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Order ID format');
  }

  const order = await Order.findById(id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Validate status variable against enum fields
  const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Please provide a valid order status');
  }

  order.status = status;
  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder,
  });
});
