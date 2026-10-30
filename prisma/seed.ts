import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FlexiPOS database with initial commercial grocery data...');

  // 1. Create Default Tenant Shop: බණ්ඩාර ස්ටෝර්ස්
  const business = await prisma.business.create({
    data: {
      name: 'Bandara Stores',
      tradeName: 'බණ්ඩාර ස්ටෝර්ස් (පිළියන්දල)',
      phone: '011-2612345 / 077-1234567',
      address: 'නො. 45, මඩපාත පාර, පිළියන්දල',
      currency: 'LKR',
      settings: {
        receiptPaperSize: '80mm',
        showSinhalaOnReceipt: true,
        showCustomerCreditOnReceipt: true,
        showLankaQROnReceipt: true,
        enableCreditBook: true,
        enableLankaQR: true,
        enableCardPayments: true,
        defaultCustomerCreditLimit: 15000,
        maxCashierDiscountPercent: 10
      }
    }
  });

  console.log(`✅ Business created: ${business.tradeName} (${business.id})`);

  // 2. Passwords
  const superPass = await bcrypt.hash('admin', 10);
  const ownerPass = await bcrypt.hash('1234', 10);
  const cashierPass = await bcrypt.hash('1234', 10);

  // 3. Create Super Admin (Platform Master)
  await prisma.user.create({
    data: {
      businessId: business.id,
      fullName: 'FlexiPOS Platform Developer',
      username: 'superadmin',
      passwordHash: superPass,
      role: 'SUPER_ADMIN'
    }
  });

  // 4. Create Shop Admin (කඩේ මුදලාලි)
  await prisma.user.create({
    data: {
      businessId: business.id,
      fullName: 'බණ්ඩාර මුදලාලි (Owner)',
      username: 'owner',
      passwordHash: ownerPass,
      role: 'ADMIN'
    }
  });

  // 5. Create Cashier (කවුන්ටරයේ සේවකයා)
  const cashier = await prisma.user.create({
    data: {
      businessId: business.id,
      fullName: 'සුපුන් බණ්ඩාර (Cashier)',
      username: 'cashier1',
      passwordHash: cashierPass,
      role: 'CASHIER'
    }
  });

  console.log('✅ Users created: superadmin (admin), owner (1234), cashier1 (1234)');

  // 6. Create Categories
  const catBakery = await prisma.category.create({
    data: { businessId: business.id, name: 'Bakery', nameSi: 'බේකරි නිෂ්පාදන', colorCode: '#F59E0B' }
  });
  const catGrains = await prisma.category.create({
    data: { businessId: business.id, name: 'Grains & Essentials', nameSi: 'සහල් සහ ධාන්‍ය', colorCode: '#10B981' }
  });
  const catDaily = await prisma.category.create({
    data: { businessId: business.id, name: 'Daily Essentials', nameSi: 'දෛනික අත්‍යවශ්‍ය ද්‍රව්‍ය', colorCode: '#3B82F6' }
  });

  // 7. Create Products
  await prisma.product.createMany({
    data: [
      {
        businessId: business.id,
        categoryId: catBakery.id,
        name: 'White Bread (පාන්)',
        nameSi: 'සුදු පාන් ගෙඩිය',
        barcode: 'QUICK-BREAD',
        unit: 'UNIT',
        sellingPrice: 150.0,
        costPrice: 120.0,
        currentStock: 45,
        isQuickItem: true
      },
      {
        businessId: business.id,
        categoryId: catGrains.id,
        name: 'Brown Sugar 1kg (සීනි)',
        nameSi: 'රතු සීනි 1kg',
        barcode: 'QUICK-SUGAR',
        unit: 'KG',
        sellingPrice: 280.0,
        costPrice: 245.0,
        currentStock: 120,
        isQuickItem: true
      },
      {
        businessId: business.id,
        categoryId: catGrains.id,
        name: 'Red Raw Rice (කැකුළු සහල් 1kg)',
        nameSi: 'රතු කැකුළු 1kg',
        barcode: 'QUICK-RICE',
        unit: 'KG',
        sellingPrice: 220.0,
        costPrice: 195.0,
        currentStock: 250,
        isQuickItem: true
      },
      {
        businessId: business.id,
        categoryId: catDaily.id,
        name: 'Fresh Egg (බිත්තර)',
        nameSi: 'නැවුම් බිත්තර 1ක්',
        barcode: 'QUICK-EGG',
        unit: 'UNIT',
        sellingPrice: 42.0,
        costPrice: 35.0,
        currentStock: 180,
        isQuickItem: true
      },
      {
        businessId: business.id,
        categoryId: catGrains.id,
        name: 'Dhal Mysoor (මයිසූර් පරිප්පු 1kg)',
        nameSi: 'පරිප්පු 1kg',
        barcode: 'QUICK-DHAL',
        unit: 'KG',
        sellingPrice: 320.0,
        costPrice: 285.0,
        currentStock: 90,
        isQuickItem: true
      },
      {
        businessId: business.id,
        categoryId: catDaily.id,
        name: 'Coconut Fresh (පොල් ගෙඩිය)',
        nameSi: 'පොල් ගෙඩිය',
        barcode: 'QUICK-COCO',
        unit: 'UNIT',
        sellingPrice: 120.0,
        costPrice: 95.0,
        currentStock: 60,
        isQuickItem: true
      }
    ]
  });

  // 8. Create Customers with ණය balances
  await prisma.customer.createMany({
    data: [
      {
        businessId: business.id,
        name: 'සුනිල් ශාන්ත (ගුරු මහතා)',
        phone: '0771234567',
        creditLimit: 25000.0,
        currentBalance: 7850.0
      },
      {
        businessId: business.id,
        name: 'කමල් පෙරේරා (හන්දියේ ගරාජය)',
        phone: '0719876543',
        creditLimit: 40000.0,
        currentBalance: 14200.0
      },
      {
        businessId: business.id,
        name: 'අනුලා ද සිල්වා මිය',
        phone: '0784561230',
        creditLimit: 15000.0,
        currentBalance: 2400.0
      }
    ]
  });

  console.log('🎉 Seeding successfully completed! Database is fully initialized.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

