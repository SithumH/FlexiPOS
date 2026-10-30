import { Response, NextFunction } from 'express';
import { OrdersService } from './orders.service.js';
import { createOrderSchema } from '../../../../shared/schemas.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export class OrdersController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const cashierId = req.user!.userId;
      const validated = createOrderSchema.parse(req.body);

      const order = await OrdersService.createOrder(businessId, cashierId, validated);
      res.status(201).json({
        success: true,
        message: 'Order created and processed successfully',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      const orders = await OrdersService.listOrders(businessId, limit);
      res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
      next(error);
    }
  }
}

