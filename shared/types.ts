export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CASHIER';

export type UnitType = 'UNIT' | 'KG' | 'G' | 'L' | 'ML' | 'PACKET';

export type PaymentMethod = 'CASH' | 'CARD' | 'LANKAQR' | 'CREDIT' | 'SPLIT';

export type CreditType = 'DEBIT' | 'CREDIT';

export type MovementType = 'SALE' | 'PURCHASE' | 'ADJUSTMENT' | 'RETURN' | 'DAMAGE';

export interface AuthUserPayload {
  userId: string;
  businessId: string;
  role: UserRole;
  fullName: string;
}

export interface BusinessSummary {
  id: string;
  name: string;
  tradeName?: string | null;
  phone?: string | null;
  currency: string;
}

