export interface POSProduct {
  id: string;
  name: string;
  nameSi?: string;
  barcode?: string;
  unit: 'UNIT' | 'KG' | 'G' | 'L' | 'ML' | 'PACKET';
  sellingPrice: number;
  costPrice?: number;
  currentStock: number;
  isQuickItem?: boolean;
  categoryName?: string;
}

export interface POSCartItem {
  product: POSProduct;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface POSCustomer {
  id: string;
  name: string;
  phone: string;
  creditLimit: number;
  currentBalance: number;
}

export interface OfflineOrderQueueItem {
  id: string;
  customerId?: string;
  customerName?: string;
  paymentMethod: 'CASH' | 'CARD' | 'LANKAQR' | 'CREDIT' | 'SPLIT';
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  changeGiven: number;
  isCreditSale: boolean;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  createdAt: string;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
}

