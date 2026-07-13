import mongoose from 'mongoose';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Helper to fetch a wishlist, populate products, and sort items in-memory by addedAt descending (newest first)
 */
const findPopulateAndSortWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('items.product');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }

  // Sort items in-memory descending by addedAt (newest first)
  if (wishlist.items && wishlist.items.length > 0) {
    wishlist.items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  }
  return wishlist;
};

/**
 * @desc    Get logged in user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await findPopulateAndSortWishlist(req.user._id);

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});

/**
 * @desc    Add a product to the user's wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
export const addToWishlist = asyncHandler(async (req, res) => {
  const { product: productId } = req.body;

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

  const wishlist = await findPopulateAndSortWishlist(req.user._id);

  // Check if product already exists in the wishlist
  const alreadyExists = wishlist.items.some(
    (item) => item.product._id.toString() === productId.toString()
  );

  if (!alreadyExists) {
    wishlist.items.push({
      product: productId,
      addedAt: new Date(),
    });
    await wishlist.save();
  }

  // Populate product info and sort before returning
  const updatedWishlist = await findPopulateAndSortWishlist(req.user._id);

  res.status(200).json({
    success: true,
    data: updatedWishlist,
  });
});

/**
 * @desc    Remove a product from the user's wishlist by Product ID
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error('Please provide a valid product ID');
  }

  const wishlist = await findPopulateAndSortWishlist(req.user._id);

  // Pull items matching product ID
  const itemIndex = wishlist.items.findIndex(
    (item) => item.product._id.toString() === productId.toString()
  );

  if (itemIndex !== -1) {
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();
  }

  // Populate product info and sort before returning
  const updatedWishlist = await findPopulateAndSortWishlist(req.user._id);

  res.status(200).json({
    success: true,
    data: updatedWishlist,
  });
});

/**
 * @desc    Clear entire wishlist
 * @route   DELETE /api/wishlist
 * @access  Private
 */
export const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await findPopulateAndSortWishlist(req.user._id);

  wishlist.items = [];
  await wishlist.save();

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});
