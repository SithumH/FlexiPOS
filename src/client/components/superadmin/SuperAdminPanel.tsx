import React, { useState } from 'react';
import { Language, translations } from '../../i18n/translations.js';
import { formatLKR } from '../../utils/formatters.js';
import { UserAccount } from '../../types/auth.js';
import {
  ShieldAlert,
  Store,
  Users,
  CreditCard,
  Plus,
  Activity,
  Layers,
  KeyRound,
  UserCheck,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface TenantShop {
  id: string;
  name: string;
  nameSi: string;
  ownerName: string;
  phone: string;
  plan: 'BASIC' | 'STANDARD' | 'CUSTOM';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  monthlyFee: number;
  creditBookEnabled: boolean;
  multiCashierEnabled: boolean;
  registeredDate: string;
}

const INITIAL_TENANTS: TenantShop[] = [
  {
    id: 't-1',
    name: 'Bandara Stores',
    nameSi: 'බණ්ඩාර ස්ටෝර්ස් (පිළියන්දල)',
    ownerName: 'බණ්ඩාර මුදලාලි',
    phone: '0771234567',
    plan: 'STANDARD',
    status: 'ACTIVE',
    monthlyFee: 3500,
    creditBookEnabled: true,
    multiCashierEnabled: true,
    registeredDate: '2026-09-15'
  },
  {
    id: 't-2',
    name: 'New Lakmini Mini Mart',
    nameSi: 'නිව් ලක්මිණි Mini Mart (මහරගම)',
    ownerName: 'ලක්මිණි මහතා',
    phone: '0719876543',
    plan: 'STANDARD',
    status: 'ACTIVE',
    monthlyFee: 3500,
    creditBookEnabled: true,
    multiCashierEnabled: true,
    registeredDate: '2026-10-01'
  },
  {
    id: 't-3',
    name: 'Sisil Stores',
    nameSi: 'සිසිල් වෙළඳසැල (කුරුණෑගල)',
    ownerName: 'සරත් මහතා',
    phone: '0751122334',
    plan: 'BASIC',
    status: 'ACTIVE',
    monthlyFee: 1500,
    creditBookEnabled: true,
    multiCashierEnabled: false,
    registeredDate: '2026-10-18'
  }
];

const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-001',
    fullName: 'බණ්ඩාර මුදලාලි',
    username: 'owner',
    role: 'ADMIN',
    shopId: 't-1',
    shopName: 'බණ්ඩාර ස්ටෝර්ස්',
    isActive: true,
    createdAt: '2026-09-15'
  },
  {
    id: 'usr-002',
    fullName: 'සුපුන් බණ්ඩාර',
    username: 'cashier1',
    role: 'CASHIER',
    shopId: 't-1',
    shopName: 'බණ්ඩාර ස්ටෝර්ස්',
    isActive: true,
    createdAt: '2026-09-16'
  },
  {
    id: 'usr-003',
    fullName: 'ලක්මිණි මහතා',
    username: 'lakmini_admin',
    role: 'ADMIN',
    shopId: 't-2',
    shopName: 'නිව් ලක්මිණි Mini Mart',
    isActive: true,
    createdAt: '2026-10-01'
  },
  {
    id: 'usr-004',
    fullName: 'සරත් මහතා',
    username: 'sisil_admin',
    role: 'ADMIN',
    shopId: 't-3',
    shopName: 'සිසිල් වෙළඳසැල',
    isActive: true,
    createdAt: '2026-10-18'
  }
];

interface SuperAdminPanelProps {
  lang: Language;
}

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({ lang }) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'SHOPS' | 'ACCOUNTS'>('SHOPS');
  const [tenants, setTenants] = useState<TenantShop[]>(INITIAL_TENANTS);
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);

  // New Shop form modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPlan, setNewPlan] = useState<'BASIC' | 'STANDARD' | 'CUSTOM'>('STANDARD');

  // New Account form modal
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccUser, setNewAccUser] = useState('');
  const [newAccRole, setNewAccRole] = useState<'ADMIN' | 'CASHIER'>('ADMIN');
  const [newAccShopId, setNewAccShopId] = useState('t-1');
  const [newAccPass, setNewAccPass] = useState('');

  const totalMRR = tenants.reduce((sum, shop) => sum + shop.monthlyFee, 0);

  const handleAddShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName || !newOwner) return;
    const shopId = `t-${Date.now()}`;
    const newShop: TenantShop = {
      id: shopId,
      name: newShopName,
      nameSi: newShopName,
      ownerName: newOwner,
      phone: newPhone,
      plan: newPlan,
      status: 'ACTIVE',
      monthlyFee: newPlan === 'BASIC' ? 1500 : newPlan === 'STANDARD' ? 3500 : 7500,
      creditBookEnabled: true,
      multiCashierEnabled: newPlan !== 'BASIC',
      registeredDate: new Date().toISOString().slice(0, 10)
    };
    setTenants((prev) => [newShop, ...prev]);

    // Automatically create the initial Shop Admin account for this new shop
    const newAdminAcc: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: newOwner,
      username: newShopName.toLowerCase().replace(/\s+/g, '_') + '_admin',
      role: 'ADMIN',
      shopId: shopId,
      shopName: newShopName,
      isActive: true,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setAccounts((prev) => [...prev, newAdminAcc]);

    setNewShopName('');
    setNewOwner('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccUser) return;
    const shop = tenants.find((t) => t.id === newAccShopId);
    const newAcc: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: newAccName,
      username: newAccUser.toLowerCase().trim(),
      role: newAccRole,
      shopId: newAccShopId,
      shopName: shop ? shop.nameSi : 'General',
      isActive: true,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setAccounts((prev) => [newAcc, ...prev]);
    setNewAccName('');
    setNewAccUser('');
    setNewAccPass('');
    setShowAddAccountModal(false);
  };

  const handleToggleAccountStatus = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const handleResetPassword = (username: string) => {
    alert(`@${username} සඳහා නව මුරපදය සාර්ථකව reset කරන ලදී! (Default: 1234)`);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-0 overflow-y-auto p-6">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 p-2.5 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t.superAdminTitle}</h2>
              <p className="text-xs text-slate-400">
                Super Admin Master: සියලුම කඩවල්, Admins සහ Cashiers පාලනය
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddAccountModal(true)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Add Admin / Cashier</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewShop}</span>
            </button>
          </div>
        </div>

        {/* 3 Key SaaS Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.totalShops}</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{tenants.length} Shops</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{accounts.length} Total Users</p>
            </div>
            <Store className="w-8 h-8 text-slate-300" />
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.totalMonthlyRevenue}</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{formatLKR(totalMRR)}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Monthly Recurring Revenue (MRR)</p>
            </div>
            <CreditCard className="w-8 h-8 text-slate-300" />
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">PostgreSQL Database</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">Connected</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Port 5432 (Ready)</p>
            </div>
            <Activity className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        {/* Sub-Tabs: SHOPS vs ALL ACCOUNTS */}
        <div className="flex border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl">
          <button
            onClick={() => setActiveTab('SHOPS')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'SHOPS'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>ලියාපදිංචි කඩවල් ({tenants.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ACCOUNTS')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'ACCOUNTS'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>සියලුම Admins & Cashiers Logins ({accounts.length})</span>
          </button>
        </div>

        {/* Tab 1: TENANT SHOPS */}
        {activeTab === 'SHOPS' && (
          <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">{t.shopNameCol}</th>
                  <th className="p-3">{t.ownerCol}</th>
                  <th className="p-3">{t.planCol}</th>
                  <th className="p-3 text-right">මාසික ගාස්තුව</th>
                  <th className="p-3 text-center">Modules</th>
                  <th className="p-3 text-center">{t.statusCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map((shop) => (
                  <tr key={shop.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{shop.nameSi || shop.name}</span>
                      <span className="text-[11px] text-slate-400">ID: {shop.id} • Reg: {shop.registeredDate}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-800 block">{shop.ownerName}</span>
                      <span className="text-[11px] text-slate-500">{shop.phone}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          shop.plan === 'BASIC'
                            ? 'bg-slate-100 text-slate-700'
                            : shop.plan === 'STANDARD'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {shop.plan}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {formatLKR(shop.monthlyFee)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-1 text-[10px]">
                        {shop.creditBookEnabled && (
                          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-semibold">
                            ණය
                          </span>
                        )}
                        {shop.multiCashierEnabled && (
                          <span className="bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded font-semibold">
                            Multi
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {shop.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: ALL ACCOUNTS MANAGEMENT (Admins & Cashiers) */}
        {activeTab === 'ACCOUNTS' && (
          <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-sm overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">
                Super Admin හට ඕනෑම කඩයක Admin හෝ Cashier ගිණුම් කළමනාකරණය සහ Password Reset කළ හැක.
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">නම සහ Username</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">අයත් සාප්පුව</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{acc.fullName}</span>
                      <span className="font-mono text-slate-500 text-[11px]">@{acc.username}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          acc.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {acc.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      {acc.shopName || '-'}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          acc.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {acc.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => handleResetPassword(acc.username)}
                        className="text-xs text-amber-700 hover:underline font-semibold"
                      >
                        Reset PIN/Pass
                      </button>
                      <button
                        onClick={() => handleToggleAccountStatus(acc.id)}
                        className={`text-xs font-semibold ${
                          acc.isActive ? 'text-rose-600 hover:underline' : 'text-emerald-600 hover:underline'
                        }`}
                      >
                        {acc.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Shop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddShop} className="bg-white p-6 rounded-2xl max-w-md w-full space-y-3">
            <h4 className="font-bold text-sm text-slate-900 border-b pb-2">අලුත් සාප්පුවක් ලියාපදිංචි කිරීම</h4>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">සාප්පුවේ නම:</label>
              <input
                type="text"
                required
                placeholder="උදා: ජයසිරි ග්‍රොසරි"
                value={newShopName}
                onChange={(e) => setNewShopName(e.target.value)}
                className="w-full px-3 py-1.5 border rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">අයිතිකරුගේ නම:</label>
              <input
                type="text"
                required
                placeholder="උදා: කේ. ජයසිරි"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="w-full px-3 py-1.5 border rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">දුරකථන අංකය:</label>
              <input
                type="tel"
                required
                placeholder="0771234567"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3 py-1.5 border rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subscription Plan:</label>
              <select
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value as any)}
                className="w-full px-3 py-1.5 border rounded-lg text-xs font-semibold"
              >
                <option value="BASIC">Basic Plan (රු. 1,500/month)</option>
                <option value="STANDARD">Standard Plan (රු. 3,500/month)</option>
                <option value="CUSTOM">Custom Enterprise (රු. 7,500+/month)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Create Shop Tenant
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New User Account Modal (Super Admin feature) */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddAccount} className="bg-white p-6 rounded-2xl max-w-md w-full space-y-3">
            <h4 className="font-bold text-sm text-slate-900 border-b pb-2">අලුත් User Account එකක් හැදීම</h4>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">සම්පූර්ණ නම (Full Name):</label>
              <input
                type="text"
                required
                value={newAccName}
                onChange={(e) => setNewAccName(e.target.value)}
                placeholder="උදා: අජිත් කුමාර"
                className="w-full px-3 py-1.5 border rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Username:</label>
              <input
                type="text"
                required
                value={newAccUser}
                onChange={(e) => setNewAccUser(e.target.value)}
                placeholder="උදා: ajith"
                className="w-full px-3 py-1.5 border rounded-lg text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role:</label>
                <select
                  value={newAccRole}
                  onChange={(e) => setNewAccRole(e.target.value as any)}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs font-semibold"
                >
                  <option value="ADMIN">Shop Admin (මුදලාලි)</option>
                  <option value="CASHIER">Cashier (කවුන්ටරය)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">සාප්පුව (Shop):</label>
                <select
                  value={newAccShopId}
                  onChange={(e) => setNewAccShopId(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nameSi || t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password / PIN:</label>
              <input
                type="password"
                required
                value={newAccPass}
                onChange={(e) => setNewAccPass(e.target.value)}
                placeholder="••••••"
                className="w-full px-3 py-1.5 border rounded-lg text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowAddAccountModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
