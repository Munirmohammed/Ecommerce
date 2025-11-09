import { Router } from 'express';
import { OrderController } from '@/controllers/order.controller';
import { authenticate, authorize } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { orderLimiter } from '@/middleware/rateLimiter';
import { createOrderSchema } from '@/validators/order.validator';

const router = Router();
const orderController = new OrderController();

// all order routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Place a new order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - productId
 *                 - quantity
 *               properties:
 *                 productId:
 *                   type: string
 *                   format: uuid
 *                 quantity:
 *                   type: integer
 *                   minimum: 1
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Insufficient stock or validation error
 *       404:
 *         description: Product not found
 */
router.post('/', authorize('user', 'admin'), orderLimiter, validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get user order history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.get('/', authorize('user', 'admin'), orderController.getUserOrders);

export default router;
