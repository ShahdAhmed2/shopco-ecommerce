import mongoose from 'mongoose';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Helper to sort reviews newest-first (createdAt descending)
 */
const sortReviewsNewestFirst = (reviews) => {
  if (reviews && reviews.length > 0) {
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

/**
 * @desc    Create or update a product review
 * @route   POST /api/reviews/:productId
 * @access  Private
 */
export const createOrUpdateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error('Please provide a valid product ID');
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    res.status(400);
    throw new Error('Rating must be a number between 1 and 5');
  }

  if (!comment || comment.trim() === '') {
    res.status(400);
    throw new Error('Please provide a review comment');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    // Update existing review details and update timestamp to keep ordering accurate
    alreadyReviewed.rating = numericRating;
    alreadyReviewed.comment = comment;
    alreadyReviewed.createdAt = new Date();
  } else {
    // Add new review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: numericRating,
      comment,
      createdAt: new Date(),
    };
    product.reviews.push(review);
  }

  // Recalculate average rating and number of reviews
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  // Populate reviewer details before returning
  const updatedProduct = await Product.findById(productId).populate({
    path: 'reviews.user',
    select: 'name email role avatar',
  });

  sortReviewsNewestFirst(updatedProduct.reviews);

  res.status(200).json({
    success: true,
    data: updatedProduct,
  });
});

/**
 * @desc    Delete a review from a product
 * @route   DELETE /api/reviews/:productId/:reviewId
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error('Please provide a valid product ID');
  }

  if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
    res.status(400);
    throw new Error('Please provide a valid review ID');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Find the review to delete
  const review = product.reviews.id(reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Authorize: only owner of the review or admin can delete
  const isOwner = review.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('You are not authorized to delete this review');
  }

  // Remove the review using Mongoose subdocument pull or splice
  product.reviews.pull(reviewId);

  // Recalculate rating and numReviews
  product.numReviews = product.reviews.length;
  if (product.reviews.length > 0) {
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
  } else {
    product.rating = 0;
  }

  await product.save();

  // Populate and sort reviews before returning
  const updatedProduct = await Product.findById(productId).populate({
    path: 'reviews.user',
    select: 'name email role avatar',
  });

  sortReviewsNewestFirst(updatedProduct.reviews);

  res.status(200).json({
    success: true,
    data: updatedProduct,
  });
});

/**
 * @desc    Get all reviews for a product ordered by newest first
 * @route   GET /api/reviews/:productId
 * @access  Public
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error('Please provide a valid product ID');
  }

  const product = await Product.findById(productId).populate({
    path: 'reviews.user',
    select: 'name email role avatar',
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Extract and sort reviews in-memory descending (newest first)
  const reviews = product.reviews || [];
  sortReviewsNewestFirst(reviews);

  res.status(200).json({
    success: true,
    data: reviews,
  });
});
