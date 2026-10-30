import Dexie, { type Table } from 'dexie';
import { POSProduct, POSCustomer, OfflineOrderQueueItem } from '../types/pos.js';

export class FlexiPOSDatabase extends Dexie {
  products!: Table<POSProduct, string>;
  customers!: Table<POSCustomer, string>;
  pendingOrders!: Table<OfflineOrderQueueItem, string>;

  constructor() {
    super('FlexiPOS_LocalDB');
    this.version(1).stores({
      products: 'id, barcode, name, isQuickItem',
      customers: 'id, phone, name',
      pendingOrders: 'id, syncStatus, createdAt'
    });
  }
}

export const localDb = new FlexiPOSDatabase();

