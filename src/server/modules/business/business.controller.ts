import { Response, NextFunction } from 'express';
import { BusinessService } from './business.service.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  name: z.string().optional(),
  tradeName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  currency: z.string().optional(),
  taxNumber: z.string().optional(),
  settings: z.record(z.any()).optional()
});

const createStaffSchema = z.object({
  fullName: z.string().min(2),
  username: z.string().min(3),
  password: z.string().min(4),
  role: z.enum(['ADMIN', 'MANAGER', 'CASHIER']),
  phone: z.string().optional()
});

export class BusinessController {
  static async getSettings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const data = await BusinessService.getSettings(businessId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const validated = updateSettingsSchema.parse(req.body);

      const updated = await BusinessService.updateSettings(businessId, validated);
      res.json({
        success: true,
        message: 'Shop configuration updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  static async listStaff(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const staff = await BusinessService.listStaff(businessId);
      res.json({ success: true, count: staff.length, data: staff });
    } catch (error) {
      next(error);
    }
  }

  static async createStaff(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const validated = createStaffSchema.parse(req.body);

      const staff = await BusinessService.createStaff(businessId, {
        fullName: validated.fullName,
        username: validated.username,
        passwordPlain: validated.password,
        role: validated.role,
        phone: validated.phone
      });

      res.status(201).json({
        success: true,
        message: 'Staff member account created',
        data: staff
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleStaffStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const userId = req.params.id;
      const { isActive } = req.body;

      const updated = await BusinessService.updateStaffStatus(businessId, userId, Boolean(isActive));
      res.json({
        success: true,
        message: `User is now ${isActive ? 'Active' : 'Inactive'}`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}

