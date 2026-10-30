import { Response, NextFunction } from 'express';
import { SyncService } from './sync.service.js';
import { syncOrdersBatchSchema } from '../../../../shared/schemas.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export class SyncController {
  static async syncBatch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const businessId = req.user!.businessId;
      const cashierId = req.user!.userId;
      const { orders } = syncOrdersBatchSchema.parse(req.body);

      const result = await SyncService.syncOfflineOrders(businessId, cashierId, orders);
      res.json({
        success: true,
        message: `Offline synchronization completed: ${result.syncedCount} synced, ${result.errorsCount} errors`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

