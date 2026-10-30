export interface ShopSettings {
  // 1. Store Profile
  storeName: string;
  storeNameSi: string;
  phone: string;
  address: string;
  receiptFooter: string;

  // 2. Receipt & Hardware Settings
  receiptPaperSize: '58mm' | '80mm';
  showSinhalaOnReceipt: boolean;
  showCustomerCreditOnReceipt: boolean;
  showLankaQROnReceipt: boolean;
  autoPrintReceipt: boolean;

  // 3. Payment Methods & Credit Book Rules
  enableCreditBook: boolean;
  enableLankaQR: boolean;
  enableCardPayments: boolean;
  defaultCustomerCreditLimit: number;
  maxCashierDiscountPercent: number;

  // 4. Quick Item Tiles Configuration
  quickItemProductIds: string[];

  // 5. Super Admin / Platform Tier Settings (Developer Controls)
  subscriptionPlan: 'BASIC' | 'STANDARD' | 'CUSTOM';
  enabledModules: {
    inventory: boolean;
    creditBook: boolean;
    multiCashier: boolean;
    reports: boolean;
    stockAlerts: boolean;
  };
}

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  storeName: 'Bandara Stores',
  storeNameSi: 'බණ්ඩාර ස්ටෝර්ස්',
  phone: '011-2612345 / 077-1234567',
  address: 'නො. 45, මඩපාත පාර, පිළියන්දල',
  receiptFooter: 'ස්තූතියි! නැවත එන්න. (Thank You! Come Again)',

  receiptPaperSize: '80mm',
  showSinhalaOnReceipt: true,
  showCustomerCreditOnReceipt: true,
  showLankaQROnReceipt: true,
  autoPrintReceipt: false,

  enableCreditBook: true,
  enableLankaQR: true,
  enableCardPayments: true,
  defaultCustomerCreditLimit: 15000,
  maxCashierDiscountPercent: 10,

  quickItemProductIds: ['p-101', 'p-102', 'p-103', 'p-104', 'p-105', 'p-109'],

  subscriptionPlan: 'STANDARD',
  enabledModules: {
    inventory: true,
    creditBook: true,
    multiCashier: true,
    reports: true,
    stockAlerts: true
  }
};

