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
  XCircle,
  X
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

    // Automatically create initial Shop Admin account for this new shop
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
    setAccounts((prev) => [newAdminAcc, ...prev]);

    setNewShopName('');
    setNewOwner('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccUser) return;
    const assignedShop = tenants.find((s) => s.id === newAccShopId);
    const newAcc: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: newAccName,
      username: newAccUser.toLowerCase().trim(),
      role: newAccRole,
      shopId: newAccShopId,
      shopName: assignedShop ? assignedShop.name : 'Shop',
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
    <div className="flex-1 flex flex-col bg-slate-100 min-h-0 overflow-y-auto p-4 font-sans select-none">
      <div className="max-w-6xl w-full mx-auto space-y-4">
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-3.5 border-2 border-slate-700 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 p-2">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wide">
                FLEXIPOS PLATFORM DEVELOPER MASTER (SUPER ADMIN)
              </h2>
              <p className="text-[11px] text-slate-400">
                සියලුම වෙළඳසැල් (Tenant Stores), පැකේජ (Plans) සහ ගිණුම් කළමනාකරණය
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddAccountModal(true)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 transition"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Add Admin / Cashier</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ නව කඩයක් ලියාපදිංචිය</span>
            </button>
          </div>
        </div>

        {/* 3 Key SaaS Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-white p-3 border-2 border-slate-400 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ලියාපදිංචි කඩවල් ගණන</span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">{tenants.length} SHOPS</div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">{accounts.length} සක්‍රීය ගිණුම්</p>
            </div>
            <Store className="w-8 h-8 text-slate-400 stroke-[1.5]" />
          </div>

          <div className="bg-white p-3 border-2 border-slate-400 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">මාසික Recurring Revenue (MRR)</span>
              <div className="text-2xl font-black font-mono text-emerald-800 mt-0.5">{formatLKR(totalMRR)}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">සම්පූර්ණ මාසික SaaS ආදායම</p>
            </div>
            <CreditCard className="w-8 h-8 text-emerald-600 stroke-[1.5]" />
          </div>

          <div className="bg-white p-3 border-2 border-slate-400 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">POSTGRESQL DATABASE</span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">CONNECTED</div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Port 5432 (ACID Multi-Tenant)</p>
            </div>
            <Activity className="w-8 h-8 text-sky-600 stroke-[1.5]" />
          </div>
        </div>

        {/* Sub-Tabs: SHOPS vs ALL ACCOUNTS */}
        <div className="flex border-b border-slate-300 bg-slate-200 px-2 pt-1.5 space-x-1">
          <button
            onClick={() => setActiveTab('SHOPS')}
            className={`px-4 py-1.5 text-xs font-bold uppercase transition border-t border-l border-r ${
              activeTab === 'SHOPS'
                ? 'bg-white text-slate-900 border-slate-400 shadow-sm'
                : 'bg-slate-300 text-slate-700 border-transparent hover:bg-slate-100'
            }`}
          >
            🏢 ලියාපදිංචි කඩවල් ({tenants.length})
          </button>
          <button
            onClick={() => setActiveTab('ACCOUNTS')}
            className={`px-4 py-1.5 text-xs font-bold uppercase transition border-t border-l border-r ${
              activeTab === 'ACCOUNTS'
                ? 'bg-white text-slate-900 border-slate-400 shadow-sm'
                : 'bg-slate-300 text-slate-700 border-transparent hover:bg-slate-100'
            }`}
          >
            👥 සියලුම Admins & Cashiers ගිණුම් ({accounts.length})
          </button>
        </div>

        {/* Tab 1: TENANT SHOPS */}
        {activeTab === 'SHOPS' && (
          <div className="bg-white border-2 border-slate-400 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-800 text-slate-100 font-bold uppercase text-[11px] border-b border-slate-700">
                <tr>
                  <th className="p-2 border-r border-slate-700">සාප්පුවේ නම (Tenant)</th>
                  <th className="p-2 border-r border-slate-700">හිමිකරු (Owner)</th>
                  <th className="p-2 border-r border-slate-700 text-center">පැකේජය (Plan)</th>
                  <th className="p-2 border-r border-slate-700 text-right">මාසික ගාස්තුව</th>
                  <th className="p-2 border-r border-slate-700 text-center">Modules</th>
                  <th className="p-2 text-center">තත්වය</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {tenants.map((shop) => (
                  <tr key={shop.id} className="hover:bg-amber-50/70 even:bg-slate-50">
                    <td className="p-2 border-r border-slate-200">
                      <span className="font-bold text-slate-900 block">{shop.nameSi || shop.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">ID: {shop.id} • Reg: {shop.registeredDate}</span>
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <span className="font-bold text-slate-800 block">{shop.ownerName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{shop.phone}</span>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center">
                      <span
                        className={`px-2 py-0.5 border font-bold text-[10px] uppercase font-mono ${
                          shop.plan === 'BASIC'
                            ? 'bg-slate-100 text-slate-800 border-slate-300'
                            : shop.plan === 'STANDARD'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-purple-100 text-purple-900 border-purple-300'
                        }`}
                      >
                        {shop.plan}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-right font-mono font-bold text-slate-900">
                      {formatLKR(shop.monthlyFee)}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center">
                      <div className="flex justify-center gap-1 text-[10px] font-bold font-mono">
                        {shop.creditBookEnabled && (
                          <span className="bg-amber-100 text-amber-900 px-1 border border-amber-300">
                            ණය පොත
                          </span>
                        )}
                        {shop.multiCashierEnabled && (
                          <span className="bg-sky-100 text-sky-900 px-1 border border-sky-300">
                            Multi-Counter
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 font-bold text-[10px] uppercase font-mono">
                        {shop.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: ALL ACCOUNTS & LOGINS */}
        {activeTab === 'ACCOUNTS' && (
          <div className="bg-white border-2 border-slate-400 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-800 text-slate-100 font-bold uppercase text-[11px] border-b border-slate-700">
                <tr>
                  <th className="p-2 border-r border-slate-700">නම (Staff Name)</th>
                  <th className="p-2 border-r border-slate-700">Username</th>
                  <th className="p-2 border-r border-slate-700 text-center">භූමිකාව (Role)</th>
                  <th className="p-2 border-r border-slate-700">අයත් සාප්පුව (Store)</th>
                  <th className="p-2 border-r border-slate-700 text-center">තත්වය</th>
                  <th className="p-2 text-center">ක්‍රියාමාර්ග</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-amber-50/70 even:bg-slate-50">
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{acc.fullName}</td>
                    <td className="p-2 border-r border-slate-200 font-mono font-bold text-emerald-800">@{acc.username}</td>
                    <td className="p-2 border-r border-slate-200 text-center">
                      <span
                        className={`px-2 py-0.5 border font-bold text-[10px] uppercase font-mono ${
                          acc.role === 'ADMIN'
                            ? 'bg-sky-100 text-sky-900 border-sky-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {acc.role}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-slate-700">{acc.shopName}</td>
                    <td className="p-2 border-r border-slate-200 text-center">
                      <span
                        className={`px-2 py-0.5 border font-bold text-[10px] uppercase font-mono ${
                          acc.isActive
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}
                      >
                        {acc.isActive ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="p-1.5 text-center space-x-1">
                      <button
                        onClick={() => handleResetPassword(acc.username)}
                        className="bg-slate-700 hover:bg-slate-800 text-white px-2 py-0.5 text-[10px] font-bold uppercase"
                      >
                        Reset PW
                      </button>
                      <button
                        onClick={() => handleToggleAccountStatus(acc.id)}
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase text-white ${
                          acc.isActive ? 'bg-rose-700 hover:bg-rose-800' : 'bg-emerald-700 hover:bg-emerald-800'
                        }`}
                      >
                        {acc.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Tenant Shop */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-3">
          <form onSubmit={handleAddShop} className="bg-white border-2 border-slate-700 shadow-2xl max-w-md w-full overflow-hidden text-xs">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm uppercase">නව සාප්පුවක් ලියාපදිංචි කිරීම (NEW SHOP)</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 bg-slate-50">
              <div>
                <label className="block font-bold text-slate-700 mb-1">සාප්පුවේ නම (Store Name) *:</label>
                <input
                  type="text"
                  required
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                  placeholder="e.g. නිමල් ස්ටෝර්ස්"
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">හිමිකරුගේ නම (Owner Full Name) *:</label>
                <input
                  type="text"
                  required
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="e.g. නිමල් පෙරේරා"
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">දුරකථන අංකය (Phone Number):</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="077..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">තෝරාගත් Plan එක (Subscription Tier):</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold bg-white"
                >
                  <option value="BASIC">Basic (Rs. 1,500/mo) - Single Counter</option>
                  <option value="STANDARD">Standard (Rs. 3,500/mo) - Multi-Counter + ණය පොත</option>
                  <option value="CUSTOM">Custom Enterprise (Rs. 7,500/mo)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-200 border-t border-slate-300 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 border border-slate-400 text-slate-700 font-bold uppercase hover:bg-slate-100"
              >
                අවලංගුයි
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase shadow"
              >
                ලියාපදිංචි කරන්න
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Account */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-3">
          <form onSubmit={handleAddAccount} className="bg-white border-2 border-slate-700 shadow-2xl max-w-md w-full overflow-hidden text-xs">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm uppercase">නව පරිශීලක ගිණුමක් සෑදීම (NEW USER)</h3>
              <button type="button" onClick={() => setShowAddAccountModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 bg-slate-50">
              <div>
                <label className="block font-bold text-slate-700 mb-1">අයත් සාප්පුව (Store) *:</label>
                <select
                  value={newAccShopId}
                  onChange={(e) => setNewAccShopId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold bg-white"
                >
                  {tenants.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.ownerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">සම්පූර්ණ නම (Full Name) *:</label>
                <input
                  type="text"
                  required
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="e.g. කසුන් බණ්ඩාර"
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Username (Login නාමය) *:</label>
                <input
                  type="text"
                  required
                  value={newAccUser}
                  onChange={(e) => setNewAccUser(e.target.value)}
                  placeholder="e.g. cashier2"
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">භූමිකාව (Role) *:</label>
                <select
                  value={newAccRole}
                  onChange={(e) => setNewAccRole(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold bg-white"
                >
                  <option value="CASHIER">CASHIER (කවුන්ටරයේ විකුණුම් පමණි)</option>
                  <option value="ADMIN">ADMIN (කඩේ කළමනාකරු / Owner)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-200 border-t border-slate-300 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddAccountModal(false)}
                className="px-4 py-1.5 border border-slate-400 text-slate-700 font-bold uppercase hover:bg-slate-100"
              >
                අවලංගුයි
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase shadow"
              >
                ගිණුම සකසන්න
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
