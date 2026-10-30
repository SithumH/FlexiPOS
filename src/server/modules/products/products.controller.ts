import { Response, NextFunction } from 'express';
import { ProductsService } from './products.service.js';
import { createProductSchema } from '../../../../shared/schemas.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export class ProductsController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const search = req.query.search as string | undefined;
      const isQuick = req.query.quick === 'true' ? true : undefined;

      const products = await ProductsService.listProducts(businessId, search, isQuick);
      res.json({ success: true, count: products.length, data: products });
    } catch (error) {
      next(error);
    }
  }

  static async getQuickTiles(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const items = await ProductsService.getQuickItems(businessId);
      res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const validated = createProductSchema.parse(req.body);

      const product = await ProductsService.createProduct(businessId, validated);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  static async listCategories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const categories = await ProductsService.getCategories(businessId);
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }
}

