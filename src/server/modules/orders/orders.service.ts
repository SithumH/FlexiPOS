import { prisma } from '../../db/prisma.js';
import { Prisma } from '@prisma/client';

export class OrdersService {
  static async createOrder(
    businessId: string,
    cashierId: string,
    data: {
      id?: string;
      customerId?: string;
      paymentMethod: 'CASH' | 'CARD' | 'LANKAQR' | 'CREDIT' | 'SPLIT';
      subtotal: number;
      discount?: number;
      total: number;
      amountPaid: number;
      changeGiven?: number;
      isCreditSale?: boolean;
      localClientId?: string;
      createdAt?: string;
      items: Array<{
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }>;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. If an ID is provided (e.g. from offline sync), check if it was already processed to prevent duplicate billing
      if (data.id) {
        const existing = await tx.order.findUnique({
          where: { id: data.id }
        });
        if (existing) {
          return existing; // Idempotency check: already saved
        }
      }

      // 2. Generate sequential invoice number for this business
      const todayPrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const countToday = await tx.order.count({
        where: {
          businessId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      });
      const invoiceNumber = `INV-${todayPrefix}-${String(countToday + 1).padStart(4, '0')}`;

      // 3. Create the Order
      const order = await tx.order.create({
        data: {
          id: data.id, // Keep client UUID if supplied
          businessId,
          cashierId,
          customerId: data.customerId,
          invoiceNumber,
          paymentMethod: data.paymentMethod,
          subtotal: new Prisma.Decimal(data.subtotal),
          discount: new Prisma.Decimal(data.discount || 0),
          total: new Prisma.Decimal(data.total),
          amountPaid: new Prisma.Decimal(data.amountPaid),
          changeGiven: new Prisma.Decimal(data.changeGiven || 0),
          isCreditSale: data.isCreditSale || data.paymentMethod === 'CREDIT',
          syncStatus: 'SYNCED',
          localClientId: data.localClientId,
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: new Prisma.Decimal(item.quantity),
              unitPrice: new Prisma.Decimal(item.unitPrice),
              totalPrice: new Prisma.Decimal(item.totalPrice)
            }))
          }
        },
        include: {
          items: true
        }
      });

      // 4. Update Stock Movements & Current Stock for each item
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (product) {
          const qtyDec = new Prisma.Decimal(item.quantity);
          const updatedStock = product.currentStock.minus(qtyDec);

          await tx.product.update({
            where: { id: product.id },
            data: { currentStock: updatedStock }
          });

          await tx.stockMovement.create({
            data: {
              businessId,
              productId: product.id,
              movementType: 'SALE',
              quantityChanged: qtyDec.negated(),
              newStockLevel: updatedStock,
              reason: `Sale on Invoice ${invoiceNumber}`
            }
          });
        }
      }

      // 5. If this is a Credit Sale (ණයට දීම), record in ණය පොත
      const isCredit = data.isCreditSale || data.paymentMethod === 'CREDIT';
      if (isCredit && data.customerId) {
        const customer = await tx.customer.findUnique({
          where: { id: data.customerId }
        });

        if (customer) {
          const totalDecimal = new Prisma.Decimal(data.total);
          const newCustomerBalance = customer.currentBalance.plus(totalDecimal);

          await tx.customer.update({
            where: { id: customer.id },
            data: { currentBalance: newCustomerBalance }
          });

          await tx.creditTransaction.create({
            data: {
              businessId,
              customerId: customer.id,
              orderId: order.id,
              type: 'DEBIT', // Customer owes more money
              amount: totalDecimal,
              balanceAfter: newCustomerBalance,
              notes: `Credit purchase on ${invoiceNumber}`
            }
          });
        }
      }

      return order;
    });
  }

  static async listOrders(businessId: string, limit = 50) {
    return prisma.order.findMany({
      where: { businessId },
      include: {
        cashier: { select: { fullName: true, username: true } },
        customer: { select: { name: true, phone: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}

