export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CASHIER';

export interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
  shopId?: string;
  shopName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CurrentUserSession {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
  token?: string;
  shopId?: string;
  shopName?: string;
}

// Client-side default username for master developer convenience
export const SUPER_ADMIN_USERNAME = 'superadmin';
