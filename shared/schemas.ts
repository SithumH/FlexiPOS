import { z } from 'zod';

export const registerBusinessSchema = z.object({
  businessName: z.string().min(2, 'Business name must have at least 2 characters'),
  tradeName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  currency: z.string().default('LKR'),
  adminFullName: z.string().min(2, 'Admin full name is required'),
  adminUsername: z.string().min(3, 'Username must have at least 3 characters'),
  adminPassword: z.string().min(6, 'Password must have at least 6 characters')
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  nameSi: z.string().optional(),
  barcode: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  unit: z.enum(['UNIT', 'KG', 'G', 'L', 'ML', 'PACKET']).default('UNIT'),
  costPrice: z.number().min(0).default(0),
  sellingPrice: z.number().min(0, 'Selling price must be greater than or equal to 0'),
  currentStock: z.number().default(0),
  minStockAlert: z.number().default(5),
  isQuickItem: z.boolean().default(false)
});

export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Customer name is required'),
  phone: z.string().min(9, 'Phone number must have at least 9 digits'),
  address: z.string().optional(),
  creditLimit: z.number().min(0).default(10000)
});

export const payCreditSchema = z.object({
  amount: z.number().positive('Payment amount must be positive'),
  notes: z.string().optional()
});

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  totalPrice: z.number().min(0)
});

export const createOrderSchema = z.object({
  id: z.string().uuid().optional(), // Can be supplied by offline client
  customerId: z.string().uuid().optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'LANKAQR', 'CREDIT', 'SPLIT']),
  subtotal: z.number().min(0),
  discount: z.number().min(0).default(0),
  total: z.number().min(0),
  amountPaid: z.number().min(0),
  changeGiven: z.number().min(0).default(0),
  isCreditSale: z.boolean().default(false),
  localClientId: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item')
});

export const syncOrdersBatchSchema = z.object({
  orders: z.array(createOrderSchema)
});

