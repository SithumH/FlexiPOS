import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { registerBusinessSchema, loginSchema } from '../../../../shared/schemas.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export class AuthController {
  static async registerBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerBusinessSchema.parse(req.body);
      const result = await AuthService.registerBusiness(validatedData);

      res.status(201).json({
        success: true,
        message: 'Business registered successfully with administrative account',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const result = await AuthService.login(username, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await AuthService.getMe(req.user.userId);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

