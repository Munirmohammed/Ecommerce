import { Router } from 'express';
import { OrderController } from '@/controllers/order.controller';
import { authenticate, authorize } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { createOrderSchema } from '@/validators/order.validator';

const router = Router();
const orderController = new OrderController();

// all order routes require authentication
router.use(authenticate);

// user routes
router.post('/', authorize('user', 'admin'), validate(createOrderSchema), orderController.createOrder);
router.get('/', authorize('user', 'admin'), orderController.getUserOrders);

export default router;
