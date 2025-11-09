import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { OrderService } from '@/services/order.service';
import { sendSuccess, sendError } from '@/utils/response';

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', ['User not authenticated'], 401);
        return;
      }

      const order = await orderService.createOrder(req.user.userId, req.body);
      sendSuccess(res, 'Order placed successfully', order, 201);
    } catch (error) {
      const err = error as Error;
      // handle specific business logic errors
      if (err.message.includes('not found')) {
        sendError(res, err.message, [err.message], 404);
        return;
      }
      if (err.message.includes('Insufficient stock')) {
        sendError(res, err.message, [err.message], 400);
        return;
      }
      next(error);
    }
  }

  async getUserOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', ['User not authenticated'], 401);
        return;
      }

      const orders = await orderService.getUserOrders(req.user.userId);
      sendSuccess(res, 'Orders retrieved successfully', orders, 200);
    } catch (error) {
      next(error);
    }
  }
}