import { prisma } from '../../db/prisma.js';

export class ProductsService {
  static async listProducts(businessId: string, search?: string, isQuickItem?: boolean) {
    const whereClause: any = {
      businessId,
      isActive: true
    };

    if (isQuickItem !== undefined) {
      whereClause.isQuickItem = isQuickItem;
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { nameSi: { contains: q, mode: 'insensitive' } },
        { barcode: { contains: q } }
      ];
    }

    return prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: { id: true, name: true, nameSi: true, colorCode: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  static async getQuickItems(businessId: string) {
    return prisma.product.findMany({
      where: {
        businessId,
        isQuickItem: true,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        nameSi: true,
        unit: true,
        sellingPrice: true,
        currentStock: true,
        barcode: true
      },
      orderBy: { name: 'asc' }
    });
  }

  static async createProduct(
    businessId: string,
    data: {
      name: string;
      nameSi?: string;
      barcode?: string;
      categoryId?: string;
      unit?: any;
      costPrice?: number;
      sellingPrice: number;
      currentStock?: number;
      minStockAlert?: number;
      isQuickItem?: boolean;
    }
  ) {
    return prisma.product.create({
      data: {
        businessId,
        name: data.name,
        nameSi: data.nameSi,
        barcode: data.barcode,
        categoryId: data.categoryId,
        unit: data.unit || 'UNIT',
        costPrice: data.costPrice || 0,
        sellingPrice: data.sellingPrice,
        currentStock: data.currentStock || 0,
        minStockAlert: data.minStockAlert || 5,
        isQuickItem: data.isQuickItem || false
      }
    });
  }

  static async getCategories(businessId: string) {
    return prisma.category.findMany({
      where: { businessId },
      orderBy: { sortOrder: 'asc' }
    });
  }
}

