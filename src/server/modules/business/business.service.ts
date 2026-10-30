import { prisma } from '../../db/prisma.js';
import bcrypt from 'bcryptjs';

export class BusinessService {
  static async getSettings(businessId: string) {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        tradeName: true,
        phone: true,
        address: true,
        currency: true,
        taxNumber: true,
        settings: true
      }
    });

    if (!business) {
      throw new Error('Business not found');
    }

    return business;
  }

  static async updateSettings(
    businessId: string,
    payload: {
      name?: string;
      tradeName?: string;
      phone?: string;
      address?: string;
      currency?: string;
      taxNumber?: string;
      settings?: any;
    }
  ) {
    return prisma.business.update({
      where: { id: businessId },
      data: {
        name: payload.name,
        tradeName: payload.tradeName,
        phone: payload.phone,
        address: payload.address,
        currency: payload.currency,
        taxNumber: payload.taxNumber,
        settings: payload.settings
      }
    });
  }

  static async listStaff(businessId: string) {
    return prisma.user.findMany({
      where: { businessId },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async createStaff(
    businessId: string,
    data: {
      fullName: string;
      username: string;
      passwordPlain: string;
      role: 'ADMIN' | 'MANAGER' | 'CASHIER';
      phone?: string;
    }
  ) {
    const passwordHash = await bcrypt.hash(data.passwordPlain, 10);

    return prisma.user.create({
      data: {
        businessId,
        fullName: data.fullName,
        username: data.username.toLowerCase().trim(),
        passwordHash,
        role: data.role,
        phone: data.phone,
        isActive: true
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        phone: true,
        isActive: true
      }
    });
  }

  static async updateStaffStatus(businessId: string, userId: string, isActive: boolean) {
    return prisma.user.update({
      where: { id: userId, businessId },
      data: { isActive },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        isActive: true
      }
    });
  }
}

