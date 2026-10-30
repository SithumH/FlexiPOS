import { Response, NextFunction } from 'express';
import { CustomersService } from './customers.service.js';
import { createCustomerSchema, payCreditSchema } from '../../../../shared/schemas.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export class CustomersController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const search = req.query.search as string | undefined;

      const customers = await CustomersService.listCustomers(businessId, search);
      res.json({ success: true, count: customers.length, data: customers });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const validated = createCustomerSchema.parse(req.body);

      const customer = await CustomersService.createCustomer(businessId, validated);
      res.status(201).json({
        success: true,
        message: 'Customer added to system successfully',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  static async payCredit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const customerId = req.params.id;
      const { amount, notes } = payCreditSchema.parse(req.body);

      const result = await CustomersService.recordCreditPayment(businessId, customerId, amount, notes);
      res.json({
        success: true,
        message: 'Credit repayment recorded successfully in ණය පොත',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStatement(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const customerId = req.params.id;

      const statement = await CustomersService.getCustomerStatement(businessId, customerId);
      res.json({ success: true, data: statement });
    } catch (error) {
      next(error);
    }
  }
}

