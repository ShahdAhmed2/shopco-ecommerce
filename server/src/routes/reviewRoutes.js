import express from 'express';
import {
  getProductReviews,
  createOrUpdateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:productId')
  .get(getProductReviews)
  .post(protect, createOrUpdateReview);

router.route('/:productId/:reviewId')
  .delete(protect, deleteReview);

export default router;
