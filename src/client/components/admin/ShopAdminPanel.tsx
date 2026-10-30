import React, { useState } from 'react';
import { POSProduct, POSCustomer, OfflineOrderQueueItem } from '../../types/pos.js';
import { ShopSettings } from '../../types/settings.js';
import { translations, Language } from '../../i18n/translations.js';
import { formatLKR, formatQty } from '../../utils/formatters.js';
import {
  TrendingUp,
  Banknote,
  BookOpen,
  AlertTriangle,
  Package,
  Plus,
  Search,
  Printer,
  Users,
  Settings,
  Calendar,
  Save,
  CheckCircle2
} from 'lucide-react';

interface ShopAdminPanelProps {
  lang: Language;
  settings: ShopSettings;
  onSaveSettings: (newSettings: ShopSettings) => void;
  products: POSProduct[];
  onAddProduct: (prod: Omit<POSProduct, 'id'>) => void;
  customers: POSCustomer[];
  onAddCustomer: (cust: Omit<POSCustomer, 'id' | 'currentBalance'>) => void;
  onRecordCreditPayment: (customerId: string, amount: number) => void;
  orders: OfflineOrderQueueItem[];
}

export const ShopAdminPanel: React.FC<ShopAdminPanelProps> = ({
  lang,
  settings,
  onSaveSettings,
  products,
  onAddProduct,
  customers,
  onAddCustomer,
  onRecordCreditPayment,
  orders
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'PRODUCTS' | 'CREDIT' | 'SALES' | 'STAFF' | 'SETTINGS'
  >('OVERVIEW');

  // Form states
  const [productSearch, setProductSearch] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameSi, setNewProdNameSi] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdUnit, setNewProdUnit] = useState<any>('UNIT');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCost, setNewProdCost] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdQuick, setNewProdQuick] = useState(false);

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState<ShopSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Credit repayment state
  const [repayCustomerId, setRepayCustomerId] = useState<string | null>(null);
  const [repayAmount, setRepayAmount] = useState('');

  // Calculations
  const todayTotalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const todayCashSales = orders
    .filter((o) => o.paymentMethod === 'CASH')
    .reduce((sum, o) => sum + o.amountPaid - o.changeGiven, 0);
  const totalShopCredit = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const lowStockCount = products.filter((p) => p.currentStock <= 5).length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    onAddProduct({
      name: newProdName,
      nameSi: newProdNameSi || undefined,
      barcode: newProdBarcode || undefined,
      unit: newProdUnit,
      sellingPrice: parseFloat(newProdPrice) || 0,
      costPrice: parseFloat(newProdCost) || 0,
      currentStock: parseFloat(newProdStock) || 0,
      isQuickItem: newProdQuick
    });
    setNewProdName('');
    setNewProdNameSi('');
    setNewProdBarcode('');
    setNewProdPrice('');
    setNewProdCost('');
    setNewProdStock('10');
    setNewProdQuick(false);
    setShowAddProductModal(false);
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.nameSi && p.nameSi.includes(productSearch)) ||
      (p.barcode && p.barcode.includes(productSearch))
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-0 overflow-hidden">
      {/* Admin Secondary Sub-Navbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'OVERVIEW'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.tabDashboard}
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'PRODUCTS'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.tabProducts}
          </button>
          <button
            onClick={() => setActiveTab('CREDIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'CREDIT'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.tabCredit}
          </button>
          <button
            onClick={() => setActiveTab('SALES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'SALES'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.tabSalesHistory}
          </button>
          <button
            onClick={() => setActiveTab('STAFF')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'STAFF'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.tabStaff}
          </button>
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'SETTINGS'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.tabSettings}
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date().toLocaleDateString(lang === 'si' ? 'si-LK' : 'en-US', { dateStyle: 'full' })}</span>
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Tab 1: OVERVIEW DASHBOARD */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Top 4 Clean Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase">{t.todaySales}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {formatLKR(todayTotalSales)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{orders.length} බිල්පත් නිකුත් කෙරිණි</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase">{t.cashInHand}</span>
                  <Banknote className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {formatLKR(todayCashSales)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">ලාච්චුවේ සටහන් වූ මුදල්</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase">{t.totalCreditOut}</span>
                  <BookOpen className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-amber-700">
                  {formatLKR(totalShopCredit)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{customers.length} පාරිභෝගිකයින්</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase">{t.lowStockItems}</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-bold text-rose-700">
                  {lowStockCount} Items
                </div>
                <p className="text-[11px] text-slate-400 mt-1">තොග නැවත ඇණවුම් කළ යුතුය</p>
              </div>
            </div>

            {/* Split: Recent Sales Table + Low Stock Alert Box */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Recent Bills */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">අද දවසේ අවසන් බිල්පත් (Recent Sales)</h3>
                  <button
                    onClick={() => setActiveTab('SALES')}
                    className="text-xs text-emerald-700 hover:underline font-semibold"
                  >
                    සියල්ල බලන්න →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">Invoice</th>
                        <th className="p-3">වේලාව</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">ගෙවූ ක්‍රමය</th>
                        <th className="p-3 text-right">මුදල</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400">
                            අද දවසේ තවමත් බිල්පත් නිකුත් කර නැත
                          </td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-semibold text-slate-800">
                              {ord.id.slice(0, 8).toUpperCase()}
                            </td>
                            <td className="p-3 text-slate-500">
                              {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-3 text-slate-700">
                              {ord.customerName || 'Cash Customer'}
                            </td>
                            <td className="p-3">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">
                                {ord.paymentMethod}
                              </span>
                            </td>
                            <td className="p-3 text-right font-bold text-slate-900">
                              {formatLKR(ord.total)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Col: Low Stock Warnings */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
                <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>අඩු තොග අනතුරු ඇඟවීම්</span>
                </h3>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {products
                    .filter((p) => p.currentStock <= 5)
                    .map((p) => (
                      <div key={p.id} className="p-2.5 rounded-lg border border-rose-100 bg-rose-50/50 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          {p.nameSi && <p className="text-[11px] text-slate-500">{p.nameSi}</p>}
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-rose-600 font-bold block">
                            Stock: {formatQty(p.currentStock, p.unit)}
                          </span>
                          <span className="text-[10px] text-slate-400">Min: 5</span>
                        </div>
                      </div>
                    ))}
                  {products.filter((p) => p.currentStock <= 5).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">
                      සියලුම භාණ්ඩවල ප්‍රමාණවත් තොග පවතී 👍
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PRODUCTS & STOCK MANAGEMENT */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="භාණ්ඩයේ නම හෝ Barcode එකෙන් සොයන්න..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addProduct}</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Barcode</th>
                    <th className="p-3">භාණ්ඩයේ නම</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3 text-right">විකුණුම් මිල</th>
                    <th className="p-3 text-right">ගැණුම් මිල</th>
                    <th className="p-3 text-center">තොගය (Stock)</th>
                    <th className="p-3 text-center">Quick Tile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-500">{p.barcode || '-'}</td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800 block">{p.name}</span>
                        {p.nameSi && <span className="text-[11px] text-slate-400">{p.nameSi}</span>}
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600">
                          {p.unit}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        {formatLKR(p.sellingPrice)}
                      </td>
                      <td className="p-3 text-right text-slate-500">
                        {formatLKR(p.costPrice || 0)}
                      </td>
                      <td className="p-3 text-center font-semibold">
                        <span className={p.currentStock <= 5 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                          {formatQty(p.currentStock, p.unit)}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {p.isQuickItem ? (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            Yes
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: CREDIT BOOK (ණය පොත) MANAGEMENT */}
        {activeTab === 'CREDIT' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-amber-950">ණය පොත සාරාංශය</h3>
                <p className="text-xs text-amber-800">
                  කඩේ පාරිභෝගිකයින්ගෙන් ලැබීමට ඇති මුළු ණය: <strong>{formatLKR(totalShopCredit)}</strong>
                </p>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3 text-right">ණය සීමාව (Limit)</th>
                    <th className="p-3 text-right">දැනට ණය ශේෂය</th>
                    <th className="p-3 text-center">ක්‍රියාකාරකම්</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">{c.name}</td>
                      <td className="p-3 text-slate-500">{c.phone}</td>
                      <td className="p-3 text-right text-slate-500">{formatLKR(c.creditLimit)}</td>
                      <td className="p-3 text-right font-bold text-amber-700">
                        {formatLKR(c.currentBalance)}
                      </td>
                      <td className="p-3 text-center">
                        {c.currentBalance > 0 && (
                          <button
                            onClick={() => {
                              setRepayCustomerId(c.id);
                              setRepayAmount(c.currentBalance.toString());
                            }}
                            className="bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 px-3 py-1 rounded text-xs font-semibold"
                          >
                            ණය පියවීම
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Repayment Mini Modal */}
            {repayCustomerId && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white p-5 rounded-2xl max-w-sm w-full space-y-3">
                  <h4 className="font-bold text-sm text-slate-800">ණය පියවීම සටහන් කිරීම</h4>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">ගෙවන මුදල (Amount):</label>
                    <input
                      type="number"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm font-bold"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setRepayCustomerId(null)}
                      className="px-3 py-1.5 text-xs text-slate-600 border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onRecordCreditPayment(repayCustomerId, parseFloat(repayAmount) || 0);
                        setRepayCustomerId(null);
                      }}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
                    >
                      Confirm Payment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: SALES HISTORY */}
        {activeTab === 'SALES' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <h3 className="font-bold text-sm text-slate-800">විකුණුම් ඉතිහාසය (Sales History)</h3>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">දිනය සහ වේලාව</th>
                    <th className="p-3">පාරිභෝගිකයා</th>
                    <th className="p-3">ගෙවීම් ක්‍රමය</th>
                    <th className="p-3 text-right">මුදල</th>
                    <th className="p-3 text-center">Sync Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-semibold text-slate-800">
                        {o.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="p-3 text-slate-500">
                        {new Date(o.createdAt).toLocaleString('si-LK')}
                      </td>
                      <td className="p-3 text-slate-700">{o.customerName || 'Cash Customer'}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-700">
                          {o.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        {formatLKR(o.total)}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.syncStatus === 'SYNCED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.syncStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: STAFF & CASHIERS */}
        {activeTab === 'STAFF' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <h3 className="font-bold text-sm text-slate-800">කඩේ සේවකයින් (Cashier Accounts)</h3>
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
                <div>
                  <h4 className="font-bold text-xs text-slate-800">බණ්ඩාර මුදලාලි (Owner)</h4>
                  <p className="text-[11px] text-slate-500">Role: ADMIN • Username: @owner</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
                <div>
                  <h4 className="font-bold text-xs text-slate-800">සුපුන් බණ්ඩාර</h4>
                  <p className="text-[11px] text-slate-500">Role: CASHIER • Username: @cashier1</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: STORE SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <form onSubmit={handleSaveSettingsSubmit} className="space-y-5 max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 border-b pb-2">කඩේ සැකසුම් (Store Settings)</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">සාප්පුවේ නම (English):</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">සාප්පුවේ නම (සිංහලෙන්):</label>
                <input
                  type="text"
                  value={settingsForm.storeNameSi}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeNameSi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">දුරකථන අංක:</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ලිපිනය:</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">බිල්පතේ පහළ සටහන (Footer):</label>
              <input
                type="text"
                value={settingsForm.receiptFooter}
                onChange={(e) => setSettingsForm({ ...settingsForm, receiptFooter: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 border-t space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.receiptPaperSize === '58mm'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, receiptPaperSize: e.target.checked ? '58mm' : '80mm' })}
                  className="rounded text-emerald-600"
                />
                <span>පොඩි 58mm Thermal Printer එකක් භාවිතා කරයි (Default: 80mm)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.showLankaQROnReceipt}
                  onChange={(e) => setSettingsForm({ ...settingsForm, showLankaQROnReceipt: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span>LankaQR Code එක බිල්පතේ මුද්‍රණය කරන්න</span>
              </label>
            </div>

            <div className="pt-3 flex justify-between items-center border-t">
              {saveSuccess ? (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  සැකසුම් සාර්ථකව සුරැකිණි!
                </span>
              ) : <span />}
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Store Settings</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-2xl max-w-md w-full space-y-3">
            <h4 className="font-bold text-sm text-slate-900 border-b pb-2">අලුත් භාණ්ඩයක් ඇතුළත් කරන්න</h4>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">භාණ්ඩයේ නම (English):</label>
              <input
                type="text"
                required
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="w-full px-3 py-1.5 border rounded-lg text-xs"
                placeholder="උදා: Maliban Marie 80g"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">භාණ්ඩයේ නම (සිංහලෙන්):</label>
              <input
                type="text"
                value={newProdNameSi}
                onChange={(e) => setNewProdNameSi(e.target.value)}
                className="w-full px-3 py-1.5 border rounded-lg text-xs"
                placeholder="උදා: මැලිබන් මාරි 80g"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Barcode:</label>
                <input
                  type="text"
                  value={newProdBarcode}
                  onChange={(e) => setNewProdBarcode(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs"
                  placeholder="Scan or leave blank"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit:</label>
                <select
                  value={newProdUnit}
                  onChange={(e) => setNewProdUnit(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs"
                >
                  <option value="UNIT">UNIT</option>
                  <option value="KG">KG</option>
                  <option value="G">G</option>
                  <option value="PACKET">PACKET</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">විකුණුම් මිල (රු.):</label>
                <input
                  type="number"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs font-bold"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ගැණුම් මිල (Cost):</label>
                <input
                  type="number"
                  value={newProdCost}
                  onChange={(e) => setNewProdCost(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ආරම්භක තොගය (Initial Stock):</label>
              <input
                type="number"
                value={newProdStock}
                onChange={(e) => setNewProdStock(e.target.value)}
                className="w-full px-3 py-1.5 border rounded-lg text-xs"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={newProdQuick}
                onChange={(e) => setNewProdQuick(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span>කවුන්ටරේ Quick Touch Tiles වලට එකතු කරන්න</span>
            </label>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

