import express, { Request } from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderStatus,
} from '../controllers/orderController';
import { verifyToken } from '../utils/tokenManager';

const router = express.Router();

router
  .route('/')
  .post(verifyToken, createOrder as any)
  .get(verifyToken, getOrders as any);

router.route('/myorders').get(verifyToken, getMyOrders as any);
router.route('/:id').get(verifyToken, getOrderById as any);
router.route('/:id/pay').put(verifyToken, updateOrderToPaid as any);
router.route('/:id/status').put(verifyToken, updateOrderStatus as any);

export default router; 