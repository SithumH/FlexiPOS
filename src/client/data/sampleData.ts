import { POSProduct, POSCustomer } from '../types/pos.js';

export const INITIAL_PRODUCTS: POSProduct[] = [
  {
    id: 'p-101',
    name: 'White Bread (පාන්)',
    nameSi: 'සුදු පාන් ගෙඩිය',
    barcode: 'QUICK-BREAD',
    unit: 'UNIT',
    sellingPrice: 150.0,
    costPrice: 120.0,
    currentStock: 45,
    isQuickItem: true,
    categoryName: 'Bakery'
  },
  {
    id: 'p-102',
    name: 'Brown Sugar 1kg (සීනි)',
    nameSi: 'රතු සීනි 1kg',
    barcode: 'QUICK-SUGAR',
    unit: 'KG',
    sellingPrice: 280.0,
    costPrice: 245.0,
    currentStock: 120,
    isQuickItem: true,
    categoryName: 'Grains & Essentials'
  },
  {
    id: 'p-103',
    name: 'Red Raw Rice (කැකුළු සහල් 1kg)',
    nameSi: 'රතු කැකුළු 1kg',
    barcode: 'QUICK-RICE',
    unit: 'KG',
    sellingPrice: 220.0,
    costPrice: 195.0,
    currentStock: 250,
    isQuickItem: true,
    categoryName: 'Grains & Essentials'
  },
  {
    id: 'p-104',
    name: 'Fresh Egg (බිත්තර)',
    nameSi: 'නැවුම් බිත්තර 1ක්',
    barcode: 'QUICK-EGG',
    unit: 'UNIT',
    sellingPrice: 42.0,
    costPrice: 35.0,
    currentStock: 180,
    isQuickItem: true,
    categoryName: 'Daily Essentials'
  },
  {
    id: 'p-105',
    name: 'Dhal Mysoor (මයිසූර් පරිප්පු 1kg)',
    nameSi: 'පරිප්පු 1kg',
    barcode: 'QUICK-DHAL',
    unit: 'KG',
    sellingPrice: 320.0,
    costPrice: 285.0,
    currentStock: 90,
    isQuickItem: true,
    categoryName: 'Grains & Essentials'
  },
  {
    id: 'p-106',
    name: 'Munchee Super Cream Cracker 490g',
    nameSi: 'මන්චි ක්‍රීම් ක්‍රැකර් 490g',
    barcode: '4791001000105',
    unit: 'PACKET',
    sellingPrice: 450.0,
    costPrice: 395.0,
    currentStock: 35,
    isQuickItem: false,
    categoryName: 'Biscuits'
  },
  {
    id: 'p-107',
    name: 'Anchor Milk Powder 400g',
    nameSi: 'ඇන්කර් කිරිපිටි 400g',
    barcode: '9414514001011',
    unit: 'PACKET',
    sellingPrice: 1040.0,
    costPrice: 960.0,
    currentStock: 28,
    isQuickItem: false,
    categoryName: 'Dairy'
  },
  {
    id: 'p-108',
    name: 'Sunlight Soap 115g',
    nameSi: 'සන්ලයිට් සබන් කැටය',
    barcode: '8901030381014',
    unit: 'UNIT',
    sellingPrice: 140.0,
    costPrice: 118.0,
    currentStock: 80,
    isQuickItem: false,
    categoryName: 'Household'
  },
  {
    id: 'p-109',
    name: 'Coconut Fresh (පොල් ගෙඩිය)',
    nameSi: 'පොල් ගෙඩිය',
    barcode: 'QUICK-COCO',
    unit: 'UNIT',
    sellingPrice: 120.0,
    costPrice: 95.0,
    currentStock: 60,
    isQuickItem: true,
    categoryName: 'Daily Essentials'
  },
  {
    id: 'p-110',
    name: 'Ceylon Tea B.O.P 100g',
    nameSi: 'තේ කොළ 100g',
    barcode: '4792002000201',
    unit: 'PACKET',
    sellingPrice: 230.0,
    costPrice: 190.0,
    currentStock: 50,
    isQuickItem: false,
    categoryName: 'Beverages'
  }
];

export const INITIAL_CUSTOMERS: POSCustomer[] = [
  {
    id: 'c-001',
    name: 'සුනිල් ශාන්ත (ගුරු මහතා)',
    phone: '0771234567',
    creditLimit: 25000.0,
    currentBalance: 7850.0 // Has 7,850 debt
  },
  {
    id: 'c-002',
    name: 'කමල් පෙරේරා (හන්දියේ ගරාජය)',
    phone: '0719876543',
    creditLimit: 40000.0,
    currentBalance: 14200.0 // Has 14,200 debt
  },
  {
    id: 'c-003',
    name: 'අනුලා ද සිල්වා මිය',
    phone: '0784561230',
    creditLimit: 15000.0,
    currentBalance: 2400.0 // Has 2,400 debt
  },
  {
    id: 'c-004',
    name: 'නිහාල් ජයසිංහ',
    phone: '0751122334',
    creditLimit: 20000.0,
    currentBalance: 0.0
  }
];

