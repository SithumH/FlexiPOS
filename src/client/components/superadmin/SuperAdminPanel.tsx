import React, { useState } from 'react';
import { Language, translations } from '../../i18n/translations.js';
import { formatLKR } from '../../utils/formatters.js';
import {
  ShieldAlert,
  Store,
  Users,
  CreditCard,
  CheckCircle,
  Plus,
  Activity,
  Layers
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

interface SuperAdminPanelProps {
  lang: Language;
}

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({ lang }) => {
  const t = translations[lang];

  const [tenants, setTenants] = useState<TenantShop[]>(INITIAL_TENANTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPlan, setNewPlan] = useState<'BASIC' | 'STANDARD' | 'CUSTOM'>('STANDARD');

  const totalMRR = tenants.reduce((sum, shop) => sum + shop.monthlyFee, 0);

  const handleAddShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName || !newOwner) return;
    const newShop: TenantShop = {
      id: `t-${Date.now()}`,
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
    setNewShopName('');
    setNewOwner('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const handleTogglePlan = (shopId: string) => {
    setTenants((prev) =>
      prev.map((s) => {
        if (s.id === shopId) {
          const nextPlan = s.plan === 'BASIC' ? 'STANDARD' : s.plan === 'STANDARD' ? 'CUSTOM' : 'BASIC';
          const nextFee = nextPlan === 'BASIC' ? 1500 : nextPlan === 'STANDARD' ? 3500 : 7500;
          return { ...s, plan: nextPlan, monthlyFee: nextFee };
        }
        return s;
      })
    );
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
              <p className="text-xs text-slate-400">{t.superAdminSubtitle}</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNewShop}</span>
          </button>
        </div>

        {/* 3 Key SaaS Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.totalShops}</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{tenants.length} Shops</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Retention Rate</p>
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
              <span className="text-xs font-semibold text-slate-500 uppercase">System Sync Health</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">100% Online</div>
              <p className="text-[11px] text-slate-400 mt-0.5">PostgreSQL Multi-tenant OK</p>
            </div>
            <Activity className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <span>ලියාපදිංචි වෙළඳසැල් නාමාවලිය (Registered Stores)</span>
            </h3>
            <span className="text-xs text-slate-500">{tenants.length} Active Tenants</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">{t.shopNameCol}</th>
                <th className="p-3">{t.ownerCol}</th>
                <th className="p-3">{t.planCol}</th>
                <th className="p-3 text-right">මාසික ගාස්තුව</th>
                <th className="p-3 text-center">Modules</th>
                <th className="p-3 text-center">{t.statusCol}</th>
                <th className="p-3 text-center">{t.actionsCol}</th>
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
                        <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-semibold" title="ණය පොත Enabled">
                          ණය
                        </span>
                      )}
                      {shop.multiCashierEnabled && (
                        <span className="bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded font-semibold" title="Multi-Cashier Enabled">
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
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleTogglePlan(shop.id)}
                      className="text-xs text-slate-600 hover:text-slate-900 underline font-semibold"
                    >
                      Change Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  );
};
