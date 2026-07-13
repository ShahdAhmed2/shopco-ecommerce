import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware universally to all orders routes
router.use(protect);

router.route('/')
  .post(createOrder)
  .get(admin, getAllOrders);

router.get('/my-orders', getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.put('/:id/status', admin, updateOrderStatus);

export default router;
