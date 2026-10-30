import React, { useState } from 'react';
import { ShopSettings } from '../types/settings.js';
import { POSProduct } from '../types/pos.js';
import {
  Store,
  Printer,
  CreditCard,
  Zap,
  Users,
  ShieldAlert,
  Save,
  X,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ShopSettings;
  onSaveSettings: (newSettings: ShopSettings) => void;
  allProducts: POSProduct[];
  userRole: 'SUPER_ADMIN' | 'ADMIN' | 'CASHIER';
  onSwitchRole: (role: 'SUPER_ADMIN' | 'ADMIN' | 'CASHIER') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  allProducts,
  userRole,
  onSwitchRole
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<
    'PROFILE' | 'RECEIPT' | 'PAYMENTS' | 'QUICK_TILES' | 'STAFF' | 'SUPER_ADMIN'
  >('PROFILE');

  const [formData, setFormData] = useState<ShopSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Staff state simulation
  const [staffList, setStaffList] = useState([
    { id: 'u1', fullName: 'බණ්ඩාර මුදලාලි', username: 'owner', role: 'ADMIN', isActive: true },
    { id: 'u2', fullName: 'සුපුන් බණ්ඩාර', username: 'cashier1', role: 'CASHIER', isActive: true }
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUser, setNewStaffUser] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');

  const handleSave = () => {
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleToggleQuickProduct = (productId: string) => {
    setFormData((prev) => {
      const exists = prev.quickItemProductIds.includes(productId);
      const updated = exists
        ? prev.quickItemProductIds.filter((id) => id !== productId)
        : [...prev.quickItemProductIds, productId];
      return { ...prev, quickItemProductIds: updated };
    });
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffUser) return;
    setStaffList((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        fullName: newStaffName,
        username: newStaffUser.toLowerCase().trim(),
        role: 'CASHIER',
        isActive: true
      }
    ]);
    setNewStaffName('');
    setNewStaffUser('');
    setNewStaffPass('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>කඩේ සැකසුම් සහ Customization පැනලය</span>
                <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                  Role: {userRole}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                සාප්පුවේ සියලුම ක්‍රියාකාරකම් ඔබේ අභිමතය පරිදි සකසන්න
              </p>
            </div>
          </div>

          {/* Quick Role Switcher for Developer Testing */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 text-[10px] px-1.5">View As:</span>
              <button
                onClick={() => onSwitchRole('ADMIN')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  userRole === 'ADMIN' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                කඩේ Admin
              </button>
              <button
                onClick={() => onSwitchRole('SUPER_ADMIN')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  userRole === 'SUPER_ADMIN' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Super Admin (Dev)
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Layout: Left Sidebar Tabs + Right Form Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Tabs */}
          <div className="w-56 bg-slate-50 border-r border-slate-200 p-3 space-y-1 shrink-0 overflow-y-auto">
            <button
              onClick={() => setActiveTab('PROFILE')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'PROFILE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>සාප්පුවේ විස්තර</span>
            </button>

            <button
              onClick={() => setActiveTab('RECEIPT')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'RECEIPT'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>බිල්පත් (Receipt)</span>
            </button>

            <button
              onClick={() => setActiveTab('PAYMENTS')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'PAYMENTS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>ගෙවීම් සහ ණය පොත</span>
            </button>

            <button
              onClick={() => setActiveTab('QUICK_TILES')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'QUICK_TILES'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Quick Touch Tiles</span>
            </button>

            <button
              onClick={() => setActiveTab('STAFF')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'STAFF'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>සේවකයින් (Cashiers)</span>
            </button>

            {/* Super Admin developer controls tab */}
            <div className="pt-3 border-t border-slate-200">
              <button
                onClick={() => setActiveTab('SUPER_ADMIN')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'SUPER_ADMIN'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-800 bg-amber-50/70 hover:bg-amber-100/70'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Super Admin (Dev)</span>
              </button>
            </div>
          </div>

          {/* Right Content Body */}
          <div className="flex-1 p-5 overflow-y-auto">
            {/* Tab 1: Store Profile */}
            {activeTab === 'PROFILE' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">සාප්පුවේ මූලික තොරතුරු (Store Profile)</h4>
                  <p className="text-xs text-slate-500">
                    මෙම තොරතුරු සියලුම බිල්පත්වල (Receipts) සහ Dashboard එකේ සංදර්ශනය වේ.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      සාප්පුවේ නම (English):
                    </label>
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      සාප්පුවේ නම (සිංහලෙන්):
                    </label>
                    <input
                      type="text"
                      value={formData.storeNameSi}
                      onChange={(e) => setFormData({ ...formData, storeNameSi: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    දුරකථන අංක (Phone Numbers):
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ලිපිනය (Shop Address):
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    බිල්පතේ පහළ පණිවිඩය (Receipt Footer Note):
                  </label>
                  <input
                    type="text"
                    value={formData.receiptFooter}
                    onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Receipt & Hardware Settings */}
            {activeTab === 'RECEIPT' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">බිල්පත් සහ මුද්‍රණ සැකසුම් (Receipt & Hardware)</h4>
                  <p className="text-xs text-slate-500">
                    Thermal Printer වර්ගය සහ බිල්පතේ දිස්විය යුතු අංග තෝරන්න.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Thermal Receipt Paper පළල (Width):
                    </label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="receiptPaperSize"
                          value="80mm"
                          checked={formData.receiptPaperSize === '80mm'}
                          onChange={() => setFormData({ ...formData, receiptPaperSize: '80mm' })}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>80mm (Standard Supermarket / 3-inch)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="receiptPaperSize"
                          value="58mm"
                          checked={formData.receiptPaperSize === '58mm'}
                          onChange={() => setFormData({ ...formData, receiptPaperSize: '58mm' })}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>58mm (Small Mini Printer / 2-inch)</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
                      <span>සිංහල නම බිල්පතේ මුද්‍රණය කරන්න (Print Sinhala Name)</span>
                      <input
                        type="checkbox"
                        checked={formData.showSinhalaOnReceipt}
                        onChange={(e) => setFormData({ ...formData, showSinhalaOnReceipt: e.target.checked })}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
                      <span>ණය බිල්වල පාරිභෝගිකයාගේ ඉතිරි ණය ශේෂය බිලේ පෙන්වන්න</span>
                      <input
                        type="checkbox"
                        checked={formData.showCustomerCreditOnReceipt}
                        onChange={(e) => setFormData({ ...formData, showCustomerCreditOnReceipt: e.target.checked })}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
                      <span>LankaQR ගෙවීම් QR කේතය බිල්පතේ මුද්‍රණය කරන්න</span>
                      <input
                        type="checkbox"
                        checked={formData.showLankaQROnReceipt}
                        onChange={(e) => setFormData({ ...formData, showLankaQROnReceipt: e.target.checked })}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Payment & Credit Rules */}
            {activeTab === 'PAYMENTS' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">ගෙවීම් සහ ණය පොතේ නීති (Payment & Credit Rules)</h4>
                  <p className="text-xs text-slate-500">
                    කඩේ අවසර දෙන ගෙවීම් ක්‍රම සහ ණය සීමාවන් මෙතැනින් පාලනය කරන්න.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-800 block">ණය පොත සක්‍රීය කරන්න (Enable ණය පොත)</span>
                      <span className="text-[11px] text-slate-500">පාරිභෝගිකයින්ට ණයට බඩු දීමේ පහසුකම</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableCreditBook}
                      onChange={(e) => setFormData({ ...formData, enableCreditBook: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer pt-2 border-t border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800 block">LankaQR ගෙවීම් සක්‍රීය කරන්න</span>
                      <span className="text-[11px] text-slate-500">බැංකු App හරහා QR ස්කෑන් කර මුදල් ලබාගැනීම</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableLankaQR}
                      onChange={(e) => setFormData({ ...formData, enableLankaQR: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer pt-2 border-t border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800 block">කාඩ්පත් (Card Payments) සක්‍රීය කරන්න</span>
                      <span className="text-[11px] text-slate-500">Visa / Mastercard POS machine ගෙවීම්</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableCardPayments}
                      onChange={(e) => setFormData({ ...formData, enableCardPayments: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      අලුත් පාරිභෝගිකයෙකුගේ Default ණය සීමාව:
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">රු.</span>
                      <input
                        type="number"
                        value={formData.defaultCustomerCreditLimit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            defaultCustomerCreditLimit: parseFloat(e.target.value) || 0
                          })
                        }
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cashier හට දිය හැකි උපරිම Discount %:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.maxCashierDiscountPercent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxCashierDiscountPercent: parseFloat(e.target.value) || 0
                          })
                        }
                        className="w-full pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                      />
                      <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Quick Touch Tiles Customization */}
            {activeTab === 'QUICK_TILES' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Quick Touch Tiles කළමනාකරණය</h4>
                  <p className="text-xs text-slate-500">
                    කවුන්ටරේ Screen එකේ ලොකුවට දිස්විය යුතු භාණ්ඩ (පාන්, බිත්තර, සීනි ආදිය) තෝරන්න.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[350px] overflow-y-auto p-1">
                  {allProducts.map((p) => {
                    const isSelected = formData.quickItemProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleToggleQuickProduct(p.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 pr-1">
                          <p className="text-xs truncate">{p.name}</p>
                          {p.nameSi && <p className="text-[10px] text-slate-500 truncate">{p.nameSi}</p>}
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by parent div
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 5: Staff / Cashier Accounts */}
            {activeTab === 'STAFF' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">කඩේ සේවකයින් (Cashier Accounts)</h4>
                  <p className="text-xs text-slate-500">
                    බිල්පත් දමන සේවකයින්ට වෙනම ගිණුම් සාදා දෙන්න. ඔවුන්ට Settings වෙනස් කිරීමට අවසර නැත.
                  </p>
                </div>

                {/* Staff List */}
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {staffList.map((st) => (
                    <div key={st.id} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{st.fullName}</span>
                        <span className="text-[11px] text-slate-400 ml-2">(@{st.username})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          {st.role}
                        </span>
                        <span className="text-emerald-600 text-[11px] font-semibold">Active</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Cashier Form */}
                <form onSubmit={handleAddStaff} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-slate-700">අලුත් Cashier කෙනෙක් එකතු කරන්න (+ New)</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="නම (Full Name)"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      required
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Username"
                      value={newStaffUser}
                      onChange={(e) => setNewStaffUser(e.target.value)}
                      required
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                    <input
                      type="password"
                      placeholder="PIN / Password"
                      value={newStaffPass}
                      onChange={(e) => setNewStaffPass(e.target.value)}
                      required
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold"
                    >
                      + Add Cashier
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 6: Super Admin / SaaS Master Controls */}
            {activeTab === 'SUPER_ADMIN' && (
              <div className="space-y-4 max-w-xl">
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5">
                  <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      FlexiPOS Platform Developer Controls (Super Admin Level)
                    </h4>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      මෙම සැකසුම් පාලනය කරන්නේ <strong>Software Platform එක හදන Developer (ඔබ)</strong> පමණි. 
                      කඩේ Owner ගන්නා Subscription Plan එක අනුව features සක්‍රීය/අක්‍රීය කරනු ලබන්නේ මෙතැනිනි.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Customer Subscription Plan:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['BASIC', 'STANDARD', 'CUSTOM'] as const).map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setFormData({ ...formData, subscriptionPlan: plan })}
                        className={`p-2 rounded-xl border text-xs font-bold transition text-center ${
                          formData.subscriptionPlan === plan
                            ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {plan === 'BASIC' && 'Basic (රු. 1,500/mo)'}
                        {plan === 'STANDARD' && 'Standard (රු. 3,500/mo)'}
                        {plan === 'CUSTOM' && 'Custom Business'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Module Toggles */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-slate-700 mb-1">Customer Modules Feature Flags:</h5>
                  {Object.entries(formData.enabledModules).map(([modKey, isEnabled]) => (
                    <label
                      key={modKey}
                      className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer"
                    >
                      <span className="capitalize">{modKey.replace(/([A-Z])/g, ' $1')} Module</span>
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enabledModules: {
                              ...formData.enabledModules,
                              [modKey]: e.target.checked
                            }
                          })
                        }
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {saveSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                සැකසුම් සාර්ථකව සුරැකිණි! (Settings Saved)
              </span>
            ) : (
              <span>වෙනස්කම් සිදුකිරීමෙන් පසු Save කරන්න.</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>සැකසුම් සුරකින්න (Save Settings)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

