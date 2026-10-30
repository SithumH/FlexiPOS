export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CASHIER';

export interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
  shopId?: string;
  shopName?: string;
  pinOrPassword?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CurrentUserSession {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
  shopId?: string;
  shopName?: string;
}

// Hardcoded Super Admin Credentials (as requested)
export const SUPER_ADMIN_CREDENTIALS = {
  username: 'superadmin',
  password: 'admin'
};

