import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db/prisma.js';
import { config } from '../../config/env.js';
import { AuthUserPayload } from '../../../../shared/types.js';

export class AuthService {
  static async registerBusiness(input: {
    businessName: string;
    tradeName?: string;
    phone?: string;
    address?: string;
    currency?: string;
    adminFullName: string;
    adminUsername: string;
    adminPassword: string;
  }) {
    const passwordHash = await bcrypt.hash(input.adminPassword, 10);

    // Atomic transaction: create business, default categories, and admin user
    const result = await prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name: input.businessName,
          tradeName: input.tradeName || input.businessName,
          phone: input.phone,
          address: input.address,
          currency: input.currency || 'LKR'
        }
      });

      // Default Sri Lankan grocery categories
      await tx.category.createMany({
        data: [
          { businessId: business.id, name: 'Dry Rations & Grains', nameSi: 'සහල් සහ ධාන්‍ය', colorCode: '#F59E0B', sortOrder: 1 },
          { businessId: business.id, name: 'Dairy & Beverages', nameSi: 'කිරි සහ පාන වර්ග', colorCode: '#3B82F6', sortOrder: 2 },
          { businessId: business.id, name: 'Spices & Essentials', nameSi: 'කුළුබඩු සහ මූලික ද්‍රව්‍ය', colorCode: '#10B981', sortOrder: 3 },
          { businessId: business.id, name: 'Snacks & Biscuits', nameSi: 'කෙටි කෑම සහ බිස්කට්', colorCode: '#EC4899', sortOrder: 4 },
          { businessId: business.id, name: 'Household & Cleaning', nameSi: 'ගෘහ උපකරණ සහ පිරිසිදුකාරක', colorCode: '#8B5CF6', sortOrder: 5 }
        ]
      });

      const user = await tx.user.create({
        data: {
          businessId: business.id,
          fullName: input.adminFullName,
          username: input.adminUsername.toLowerCase().trim(),
          passwordHash,
          role: 'ADMIN'
        }
      });

      return { business, user };
    });

    const tokenPayload: AuthUserPayload = {
      userId: result.user.id,
      businessId: result.business.id,
      role: 'ADMIN',
      fullName: result.user.fullName
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '7d' });

    return {
      token,
      business: {
        id: result.business.id,
        name: result.business.name,
        tradeName: result.business.tradeName,
        currency: result.business.currency
      },
      user: {
        id: result.user.id,
        fullName: result.user.fullName,
        username: result.user.username,
        role: result.user.role
      }
    };
  }

  static async login(username: string, passwordPlain: string) {
    const cleanUsername = username.toLowerCase().trim();

    // Find active user
    const user = await prisma.user.findFirst({
      where: {
        username: cleanUsername,
        isActive: true
      },
      include: {
        business: true
      }
    });

    if (!user) {
      throw new Error('Invalid username or credentials');
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid username or credentials');
    }

    const tokenPayload: AuthUserPayload = {
      userId: user.id,
      businessId: user.businessId,
      role: user.role as any,
      fullName: user.fullName
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '7d' });

    return {
      token,
      business: {
        id: user.business.id,
        name: user.business.name,
        tradeName: user.business.tradeName,
        currency: user.business.currency
      },
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        role: user.role
      }
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        business: {
          select: {
            id: true,
            name: true,
            tradeName: true,
            phone: true,
            address: true,
            currency: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

