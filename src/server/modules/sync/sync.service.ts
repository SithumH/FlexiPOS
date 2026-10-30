import { OrdersService } from '../orders/orders.service.js';

export class SyncService {
  static async syncOfflineOrders(
    businessId: string,
    cashierId: string,
    orders: Array<any>
  ) {
    const syncedIds: string[] = [];
    const errors: Array<{ orderId?: string; error: string }> = [];

    for (const orderData of orders) {
      try {
        const saved = await OrdersService.createOrder(businessId, cashierId, orderData);
        syncedIds.push(saved.id);
      } catch (err: any) {
        errors.push({
          orderId: orderData.id || orderData.localClientId,
          error: err.message || 'Failed to sync offline order'
        });
      }
    }

    return {
      syncedCount: syncedIds.length,
      syncedIds,
      errorsCount: errors.length,
      errors,
      serverTime: new Date().toISOString()
    };
  }
}

