import { prisma } from '../../db/prisma.js';
import { Prisma } from '@prisma/client';

export class CustomersService {
  static async listCustomers(businessId: string, search?: string) {
    const where: any = { businessId };

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q } }
      ];
    }

    return prisma.customer.findMany({
      where,
      orderBy: { currentBalance: 'desc' } // Shows customers with outstanding ණය first
    });
  }

  static async createCustomer(
    businessId: string,
    data: {
      name: string;
      phone: string;
      address?: string;
      creditLimit?: number;
    }
  ) {
    return prisma.customer.create({
      data: {
        businessId,
        name: data.name,
        phone: data.phone,
        address: data.address,
        creditLimit: data.creditLimit || 10000,
        currentBalance: 0
      }
    });
  }

  static async recordCreditPayment(
    businessId: string,
    customerId: string,
    amount: number,
    notes?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findFirst({
        where: { id: customerId, businessId }
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      const paymentDecimal = new Prisma.Decimal(amount);
      const newBalance = customer.currentBalance.minus(paymentDecimal);

      // 1. Update customer's outstanding ණය balance
      const updatedCustomer = await tx.customer.update({
        where: { id: customerId },
        data: { currentBalance: newBalance }
      });

      // 2. Append immutable credit ledger record (ණය පොත සටහන)
      const ledgerEntry = await tx.creditTransaction.create({
        data: {
          businessId,
          customerId,
          type: 'CREDIT', // Payment made by customer
          amount: paymentDecimal,
          balanceAfter: newBalance,
          notes: notes || 'Cash repayment for credit book'
        }
      });

      return {
        customer: updatedCustomer,
        transaction: ledgerEntry
      };
    });
  }

  static async getCustomerStatement(businessId: string, customerId: string) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, businessId }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const transactions = await prisma.creditTransaction.findMany({
      where: { businessId, customerId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return {
      customer,
      statement: transactions
    };
  }
}

