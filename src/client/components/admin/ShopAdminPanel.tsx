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
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Clock,
  DollarSign,
  Scale,
  X,
  Check,
  Receipt
} from 'lucide-react';

interface ShopExpense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface ShopAdminPanelProps {
  lang: Language;
  settings: ShopSettings;
  onSaveSettings: (newSettings: ShopSettings) => void;
  products: POSProduct[];
  onAddProduct: (prod: Omit<POSProduct, 'id'>) => void;
  onAdjustStock?: (productId: string, quantityChange: number, reason: string) => void;
  customers: POSCustomer[];
  onAddCustomer: (cust: Omit<POSCustomer, 'id' | 'currentBalance'>) => void;
  onRecordCreditPayment: (customerId: string, amount: number, notes?: string) => void;
  orders: OfflineOrderQueueItem[];
}

export const ShopAdminPanel: React.FC<ShopAdminPanelProps> = ({
  lang,
  settings,
  onSaveSettings,
  products,
  onAddProduct,
  onAdjustStock,
  customers,
  onAddCustomer,
  onRecordCreditPayment,
  orders
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'PRODUCTS' | 'CREDIT' | 'SALES' | 'ZREPORT' | 'EXPENSES' | 'STAFF' | 'SETTINGS'
  >('OVERVIEW');

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [salesSearch, setSalesSearch] = useState('');

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<POSProduct | null>(null);
  const [adjustQty, setAdjustQty] = useState('10');
  const [adjustReason, setAdjustReason] = useState('නව තොග ලැබීම (New Delivery / GRN)');

  // Product Form states
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

  // Z-Report / Cashier Shift state
  const [actualCashInDrawer, setActualCashInDrawer] = useState('');
  const [zReportNotes, setZReportNotes] = useState('');
  const [isShiftClosed, setIsShiftClosed] = useState(false);

  // Daily Expenses state
  const [expenses, setExpenses] = useState<ShopExpense[]>([
    { id: 'exp-1', category: 'විදුලි බිල', amount: 3500, description: 'මාසික විදුලි බිල ගෙවීම', date: new Date().toISOString() },
    { id: 'exp-2', category: 'තේ සහ කෑම', amount: 450, description: 'සේවක තේ වියදම', date: new Date().toISOString() }
  ]);
  const [expCategory, setExpCategory] = useState('තේ සහ කෑම');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Calculations
  const todayTotalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const todayCashSales = orders
    .filter((o) => o.paymentMethod === 'CASH')
    .reduce((sum, o) => sum + (o.amountPaid - o.changeGiven), 0);
  const todayCardSales = orders
    .filter((o) => o.paymentMethod === 'CARD')
    .reduce((sum, o) => sum + o.total, 0);
  const todayQrSales = orders
    .filter((o) => o.paymentMethod === 'LANKAQR')
    .reduce((sum, o) => sum + o.total, 0);
  const todayCreditSales = orders
    .filter((o) => o.paymentMethod === 'CREDIT' || o.isCreditSale)
    .reduce((sum, o) => sum + o.total, 0);

  const totalShopCredit = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const lowStockCount = products.filter((p) => p.currentStock <= 5).length;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netEstimatedProfit = todayTotalSales - totalExpenses;

  // Expected Cash in Drawer
  const expectedCash = todayCashSales;
  const actualCash = parseFloat(actualCashInDrawer) || 0;
  const cashDifference = actualCash - expectedCash;

  // Create Product handler
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

  // Stock Adjustment handler
  const handleConfirmStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    const delta = parseFloat(adjustQty);
    if (isNaN(delta)) return;
    if (onAdjustStock) {
      onAdjustStock(adjustingProduct.id, delta, adjustReason);
    }
    setAdjustingProduct(null);
    setAdjustQty('10');
  };

  // Add Expense handler
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expAmount);
    if (!amt || amt <= 0) return;
    const newExp: ShopExpense = {
      id: `exp-${Date.now()}`,
      category: expCategory,
      amount: amt,
      description: expDesc || expCategory,
      date: new Date().toISOString()
    };
    setExpenses((prev) => [newExp, ...prev]);
    setExpAmount('');
    setExpDesc('');
  };

  // Save Settings handler
  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Export Products CSV
  const handleExportProductsCSV = () => {
    const headers = ['ID,Barcode,Name,Name_Si,Unit,Selling_Price,Cost_Price,Current_Stock,Is_Quick'];
    const rows = products.map((p) =>
      `"${p.id}","${p.barcode || ''}","${p.name}","${p.nameSi || ''}","${p.unit}",${p.sellingPrice},${p.costPrice || 0},${p.currentStock},${p.isQuickItem ? 'YES' : 'NO'}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FlexiPOS_Products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Sales Report CSV
  const handleExportSalesCSV = () => {
    const headers = ['Invoice_ID,Date,Payment_Method,Subtotal,Discount,Net_Total,Amount_Paid,Change,Customer'];
    const rows = orders.map((o) =>
      `"${o.id}","${o.createdAt}","${o.paymentMethod}",${o.subtotal},${o.discount},${o.total},${o.amountPaid},${o.changeGiven},"${o.customerName || 'Walk-in'}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FlexiPOS_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.nameSi && p.nameSi.includes(productSearch)) ||
      (p.barcode && p.barcode.includes(productSearch))
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(salesSearch.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(salesSearch.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-200 min-h-0 overflow-hidden font-sans select-none">
      {/* Traditional POS Sub-Navbar / Ribbon */}
      <div className="bg-slate-900 text-white px-4 py-1.5 flex items-center justify-between border-b-2 border-slate-700 shrink-0">
        <div className="flex items-center space-x-1">
          {[
            { id: 'OVERVIEW', label: '📊 දළ සාරාංශය (Dashboard)' },
            { id: 'PRODUCTS', label: '📦 භාණ්ඩ හා තොග (Inventory)' },
            { id: 'CREDIT', label: '📖 ණය පොත (Credit Ledger)' },
            { id: 'SALES', label: '🧾 බිල්පත් ඉතිහාසය (Sales)' },
            { id: 'ZREPORT', label: '📋 Z-Report / මාරුව අවසන් කිරීම' },
            { id: 'EXPENSES', label: '💸 වියදම් (Expenses)' },
            { id: 'STAFF', label: '👥 සේවකයින් (Staff)' },
            { id: 'SETTINGS', label: '⚙️ සැකසුම් (Settings)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 font-bold text-xs uppercase border transition ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white border-emerald-500 shadow'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono flex items-center space-x-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date().toLocaleDateString('si-LK', { dateStyle: 'full' })}</span>
        </div>
      </div>

      {/* Main Back-Office Content Area */}
      <div className="flex-1 p-3 overflow-y-auto bg-slate-100">
        {/* Tab 1: OVERVIEW DASHBOARD */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-3 max-w-6xl mx-auto">
            {/* Top 4 Traditional POS Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="bg-white border-2 border-slate-400 p-3 shadow-sm">
                <div className="flex items-center justify-between text-slate-600 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t.todaySales}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-2xl font-black font-mono text-slate-900">
                  {formatLKR(todayTotalSales)}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{orders.length} බිල්පත් නිකුත් කෙරිණි</p>
              </div>

              <div className="bg-white border-2 border-slate-400 p-3 shadow-sm">
                <div className="flex items-center justify-between text-slate-600 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">ලාච්චුවේ මුදල් (Cash Sales)</span>
                  <Banknote className="w-4 h-4 text-slate-700" />
                </div>
                <div className="text-2xl font-black font-mono text-emerald-800">
                  {formatLKR(todayCashSales)}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">CASH මඟින් ලැබුණු මුදල්</p>
              </div>

              <div className="bg-white border-2 border-slate-400 p-3 shadow-sm">
                <div className="flex items-center justify-between text-slate-600 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t.totalCreditOut}</span>
                  <BookOpen className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-2xl font-black font-mono text-amber-800">
                  {formatLKR(totalShopCredit)}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{customers.length} පාරිභෝගිකයින්</p>
              </div>

              <div className="bg-white border-2 border-slate-400 p-3 shadow-sm">
                <div className="flex items-center justify-between text-slate-600 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">අඩු තොග (Low Stock)</span>
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                </div>
                <div className="text-2xl font-black font-mono text-rose-800">
                  {lowStockCount} Items
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">නැවත ඇණවුම් කළ යුතුය</p>
              </div>
            </div>

            {/* Split: Recent Sales Table + Payment Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Left 2 Cols: Recent Bills */}
              <div className="lg:col-span-2 bg-white border-2 border-slate-400 shadow-sm overflow-hidden">
                <div className="p-2.5 bg-slate-800 text-white flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wide">
                    අද දවසේ අවසන් බිල්පත් (Recent Transactions)
                  </h3>
                  <button
                    onClick={() => setActiveTab('SALES')}
                    className="text-xs text-amber-400 hover:underline font-bold"
                  >
                    සියල්ල බලන්න →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px] uppercase">
                      <tr>
                        <th className="p-2 border-r border-slate-200">වේලාව</th>
                        <th className="p-2 border-r border-slate-200">බිල්පත් අංකය</th>
                        <th className="p-2 border-r border-slate-200">ක්‍රමය</th>
                        <th className="p-2 border-r border-slate-200">පාරිභෝගිකයා</th>
                        <th className="p-2 text-right">මුදල (LKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-bold text-xs">
                            අද දින තවම බිල්පත් නිකුත් කර නොමැත
                          </td>
                        </tr>
                      ) : (
                        orders.slice(0, 8).map((o) => (
                          <tr key={o.id} className="hover:bg-amber-50/70 even:bg-slate-50">
                            <td className="p-2 border-r border-slate-200 font-mono text-[11px] text-slate-600">
                              {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-2 border-r border-slate-200 font-mono font-bold text-slate-900">
                              #{o.id.slice(0, 8).toUpperCase()}
                            </td>
                            <td className="p-2 border-r border-slate-200">
                              <span className="font-bold text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 border border-slate-300">
                                {o.paymentMethod}
                              </span>
                            </td>
                            <td className="p-2 border-r border-slate-200 text-slate-700 font-medium">
                              {o.customerName || 'Walk-in Customer'}
                            </td>
                            <td className="p-2 text-right font-mono font-black text-slate-900">
                              {formatLKR(o.total)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right 1 Col: Tender Breakdown Box */}
              <div className="bg-white border-2 border-slate-400 shadow-sm p-3 space-y-3">
                <div className="border-b border-slate-300 pb-2">
                  <h3 className="font-bold text-xs uppercase text-slate-900">
                    ගෙවීම් ක්‍රම අනුව සාරාංශය (Tender Summary)
                  </h3>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center p-2 bg-emerald-50 border border-emerald-300">
                    <span className="font-bold text-emerald-900">💵 CASH (මුදලින්):</span>
                    <span className="font-black text-emerald-900">{formatLKR(todayCashSales)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-sky-50 border border-sky-300">
                    <span className="font-bold text-sky-900">💳 CARD (කාඩ්පත්):</span>
                    <span className="font-black text-sky-900">{formatLKR(todayCardSales)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 border border-purple-300">
                    <span className="font-bold text-purple-900">📱 LankaQR:</span>
                    <span className="font-black text-purple-900">{formatLKR(todayQrSales)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-amber-50 border border-amber-300">
                    <span className="font-bold text-amber-900">📖 ණයට (Credit):</span>
                    <span className="font-black text-amber-900">{formatLKR(todayCreditSales)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-sm font-mono font-black">
                  <span className="text-slate-900">මුළු විකුණුම්:</span>
                  <span className="text-emerald-800">{formatLKR(todayTotalSales)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PRODUCTS & INVENTORY */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-3 max-w-6xl mx-auto">
            {/* Action Bar */}
            <div className="bg-white p-2.5 border-2 border-slate-400 flex items-center justify-between gap-3 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="භාණ්ඩයේ නම හෝ Barcode එකෙන් සොයන්න..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border-2 border-slate-300 text-xs font-semibold focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportProductsCSV}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 border border-slate-700 shadow-sm"
                  title="Export Product List to Excel/CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Excel / CSV Export</span>
                </button>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ නව භාණ්ඩයක් එක්කිරීම</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border-2 border-slate-400 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800 text-slate-100 font-bold uppercase text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-2 border-r border-slate-700">Barcode</th>
                    <th className="p-2 border-r border-slate-700">භාණ්ඩයේ නම (Item Name)</th>
                    <th className="p-2 border-r border-slate-700 text-center">Unit</th>
                    <th className="p-2 border-r border-slate-700 text-right">විකුණුම් මිල (Rate)</th>
                    <th className="p-2 border-r border-slate-700 text-right">ගැණුම් මිල (Cost)</th>
                    <th className="p-2 border-r border-slate-700 text-center">දැනට තොගය (Stock)</th>
                    <th className="p-2 text-center">තොග වෙනස් කිරීම් (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/70 even:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 font-mono text-slate-600">
                        {p.barcode || '-'}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                        {p.name}
                        {p.nameSi && <span className="block text-[11px] text-slate-500 font-normal">{p.nameSi}</span>}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center">
                        <span className="bg-slate-200 text-slate-800 px-1.5 py-0.2 border border-slate-300 font-bold text-[10px] uppercase font-mono">
                          {p.unit}
                        </span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono font-bold text-slate-900">
                        {formatLKR(p.sellingPrice)}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono text-slate-600">
                        {formatLKR(p.costPrice || 0)}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">
                        <span className={p.currentStock <= 5 ? 'text-rose-700 bg-rose-50 px-1.5 py-0.5 border border-rose-300' : 'text-slate-800'}>
                          {formatQty(p.currentStock, p.unit)}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => setAdjustingProduct(p)}
                          className="bg-slate-800 hover:bg-slate-900 text-white px-2.5 py-1 text-[11px] font-bold uppercase border border-slate-700 shadow-sm"
                        >
                          📦 තොග වෙනස් කරන්න (+ / -)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: CREDIT BOOK (ණය පොත) */}
        {activeTab === 'CREDIT' && (
          <div className="space-y-3 max-w-6xl mx-auto">
            <div className="p-3 bg-amber-100 border-2 border-amber-400 flex items-center justify-between text-xs">
              <div>
                <h3 className="font-bold text-sm text-amber-950 uppercase">ඩිජිටල් ණය පොත කළමනාකරණය</h3>
                <p className="text-amber-900 mt-0.5">
                  කඩේ පාරිභෝගිකයින්ගෙන් ලැබීමට ඇති මුළු ණය: <strong className="font-mono text-base">{formatLKR(totalShopCredit)}</strong>
                </p>
              </div>
              <div className="font-bold font-mono text-slate-700">
                පාරිභෝගිකයින් ගණන: {customers.length}
              </div>
            </div>

            <div className="bg-white border-2 border-slate-400 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800 text-slate-100 font-bold uppercase text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-2 border-r border-slate-700">පාරිභෝගිකයා</th>
                    <th className="p-2 border-r border-slate-700">දුරකථන අංකය</th>
                    <th className="p-2 border-r border-slate-700 text-right">ණය සීමාව</th>
                    <th className="p-2 border-r border-slate-700 text-right">දැනට ණය ශේෂය</th>
                    <th className="p-2 text-center">තත්වය</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-amber-50/70 even:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{c.name}</td>
                      <td className="p-2 border-r border-slate-200 font-mono text-slate-600">{c.phone}</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono text-slate-600">{formatLKR(c.creditLimit)}</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono font-black text-rose-700">{formatLKR(c.currentBalance)}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-0.5 font-bold text-[10px] uppercase font-mono ${
                          c.currentBalance > 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {c.currentBalance > 0 ? 'ණය පවතී' : 'පියවා ඇත'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: SALES HISTORY */}
        {activeTab === 'SALES' && (
          <div className="space-y-3 max-w-6xl mx-auto">
            <div className="bg-white p-2.5 border-2 border-slate-400 flex items-center justify-between gap-3 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="බිල්පත් අංකය හෝ පාරිභෝගික නම සොයන්න..."
                  value={salesSearch}
                  onChange={(e) => setSalesSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border-2 border-slate-300 text-xs font-semibold focus:outline-none focus:border-slate-800"
                />
              </div>

              <button
                onClick={handleExportSalesCSV}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 border border-slate-700 shadow-sm"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Sales CSV</span>
              </button>
            </div>

            <div className="bg-white border-2 border-slate-400 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800 text-slate-100 font-bold uppercase text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-2 border-r border-slate-700">දිනය / වේලාව</th>
                    <th className="p-2 border-r border-slate-700">බිල්පත් අංකය</th>
                    <th className="p-2 border-r border-slate-700">පාරිභෝගිකයා</th>
                    <th className="p-2 border-r border-slate-700">ක්‍රමය</th>
                    <th className="p-2 border-r border-slate-700 text-right">භාණ්ඩ ගණන</th>
                    <th className="p-2 border-r border-slate-700 text-right">වට්ටම්</th>
                    <th className="p-2 text-right">මුදල (Total LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-bold text-xs">
                        කිසිදු බිල්පතක් හමු නොවීය
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-amber-50/70 even:bg-slate-50">
                        <td className="p-2 border-r border-slate-200 font-mono text-[11px] text-slate-600">
                          {new Date(o.createdAt).toLocaleString('si-LK')}
                        </td>
                        <td className="p-2 border-r border-slate-200 font-mono font-bold text-slate-900">
                          #{o.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="p-2 border-r border-slate-200 font-medium text-slate-800">
                          {o.customerName || 'Walk-in'}
                        </td>
                        <td className="p-2 border-r border-slate-200">
                          <span className="font-bold text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 border border-slate-300">
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className="p-2 border-r border-slate-200 text-right font-mono font-semibold">
                          {o.items.length}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-right font-mono text-rose-600">
                          {o.discount > 0 ? `- ${formatLKR(o.discount)}` : '-'}
                        </td>
                        <td className="p-2 text-right font-mono font-black text-slate-900">
                          {formatLKR(o.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Z-REPORT / CASHIER SHIFT CLOSING */}
        {activeTab === 'ZREPORT' && (
          <div className="space-y-4 max-w-2xl mx-auto bg-white border-2 border-slate-400 p-4 shadow-sm font-sans">
            <div className="border-b-2 border-slate-800 pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm uppercase text-slate-900 flex items-center gap-1.5">
                  <Receipt className="w-5 h-5 text-emerald-700" />
                  <span>දෛනික Z-REPORT සහ මුදල් ලාච්චුව ගණනය (SHIFT CLOSING)</span>
                </h3>
                <p className="text-[11px] text-slate-500">කවුන්ටරයේ මාරුව අවසන් කර සැබෑ මුදල් සසඳන්න</p>
              </div>
              <span className="bg-slate-900 text-white font-mono font-bold text-xs px-2 py-0.5">
                SHIFT #01
              </span>
            </div>

            {/* Calculated Breakdown */}
            <div className="bg-slate-50 border border-slate-300 p-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600">මුළු බිල්පත් ගණන:</span>
                <span className="font-bold text-slate-900">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">මුළු දෛනික විකුණුම් (Gross Sales):</span>
                <span className="font-bold text-slate-900">{formatLKR(todayTotalSales)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold border-t border-slate-200 pt-1">
                <span>පද්ධතිය අනුව අපේක්ෂිත මුදල් (Expected Cash):</span>
                <span className="text-sm font-black">{formatLKR(expectedCash)}</span>
              </div>
            </div>

            {/* Cash Tally Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  ලාච්චුවේ සැබවින්ම ගණනය කළ මුදල (Physical Cash Counted LKR) *:
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-700 bg-slate-200 px-3 py-2 border-2 border-slate-300">
                    රු.
                  </span>
                  <input
                    type="number"
                    value={actualCashInDrawer}
                    onChange={(e) => setActualCashInDrawer(e.target.value)}
                    placeholder="e.g. 15450"
                    className="w-full text-xl font-mono font-bold px-3 py-1.5 border-2 border-slate-400 bg-white text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {actualCashInDrawer && (
                <div
                  className={`p-3 border-2 font-mono flex items-center justify-between ${
                    cashDifference === 0
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                      : cashDifference > 0
                      ? 'bg-sky-50 text-sky-900 border-sky-400'
                      : 'bg-rose-50 text-rose-900 border-rose-400'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold uppercase block">
                      {cashDifference === 0
                        ? '✅ මුදල් නියමිත පරිදි තුලනය වී ඇත (Balanced)'
                        : cashDifference > 0
                        ? 'ℹ️ ලාච්චුවේ අතිරික්ත මුදලක් පවතී (Excess Cash)'
                        : '⚠️ ලාච්චුවේ මුදල් හිඟයක් පවතී (Cash Shortage)'}
                    </span>
                  </div>
                  <div className="text-xl font-black font-mono">
                    {cashDifference > 0 ? `+ ${formatLKR(cashDifference)}` : formatLKR(cashDifference)}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  මාරුව අවසන් කිරීමේ සටහන (Closing Notes):
                </label>
                <input
                  type="text"
                  value={zReportNotes}
                  onChange={(e) => setZReportNotes(e.target.value)}
                  placeholder="e.g. මාරුව අවසන් කර මුදල් භාරදුනි"
                  className="w-full px-2.5 py-1.5 border border-slate-300 text-xs focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border-2 border-slate-400 text-slate-800 font-bold text-xs uppercase hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Z-Report මුද්‍රණය (Print Slip)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsShiftClosed(true);
                    alert('මාරුව (Shift) සාර්ථකව අවසන් කර Z-Report සටහන් කරන ලදී!');
                  }}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  <Check className="w-4 h-4" />
                  <span>මාරුව අවසන් කරන්න (Close Shift)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: EXPENSES TRACKING */}
        {activeTab === 'EXPENSES' && (
          <div className="space-y-3 max-w-4xl mx-auto">
            {/* Top Cards: Total Expenses & Net Profit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border-2 border-slate-400 p-3 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">අද දවසේ මුළු වියදම් (Total Expenses)</span>
                <span className="text-2xl font-black font-mono text-rose-700">{formatLKR(totalExpenses)}</span>
              </div>
              <div className="bg-white border-2 border-slate-400 p-3 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">ඇස්තමේන්තුගත ශුද්ධ ආදායම (Net Sales)</span>
                <span className="text-2xl font-black font-mono text-emerald-800">{formatLKR(netEstimatedProfit)}</span>
              </div>
            </div>

            {/* Add Expense Form */}
            <form onSubmit={handleAddExpense} className="bg-white border-2 border-slate-400 p-3 shadow-sm flex items-end gap-2 text-xs">
              <div className="flex-1">
                <label className="block font-bold text-slate-700 mb-1">වියදම් වර්ගය (Category):</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 font-semibold bg-white"
                >
                  <option value="තේ සහ කෑම">තේ සහ කෑම (Staff Refreshments)</option>
                  <option value="විදුලි බිල">විදුලි බිල (Electricity)</option>
                  <option value="ජල බිල">ජල බිල (Water Bill)</option>
                  <option value="කඩ කුලිය">කඩ කුලිය (Shop Rent)</option>
                  <option value="ප්‍රවාහන">ප්‍රවාහන ගාස්තු (Transport)</option>
                  <option value="වෙනත්">වෙනත් වියදම් (Other)</option>
                </select>
              </div>

              <div className="w-36">
                <label className="block font-bold text-slate-700 mb-1">මුදල (Amount LKR):</label>
                <input
                  type="number"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full px-2 py-1.5 border border-slate-300 font-mono font-bold"
                />
              </div>

              <div className="flex-1">
                <label className="block font-bold text-slate-700 mb-1">සටහන (Description):</label>
                <input
                  type="text"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="e.g. දහවල් කෑම"
                  className="w-full px-2 py-1.5 border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-1.5 uppercase shrink-0 shadow-sm"
              >
                + එක්කරන්න
              </button>
            </form>

            {/* Expenses List */}
            <div className="bg-white border-2 border-slate-400 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800 text-slate-100 font-bold uppercase text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-2 border-r border-slate-700">දිනය / වේලාව</th>
                    <th className="p-2 border-r border-slate-700">වර්ගය</th>
                    <th className="p-2 border-r border-slate-700">විස්තරය</th>
                    <th className="p-2 text-right">මුදල (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 even:bg-slate-50/50">
                      <td className="p-2 border-r border-slate-200 font-mono text-[11px] text-slate-600">
                        {new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-800">{e.category}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{e.description}</td>
                      <td className="p-2 text-right font-mono font-bold text-rose-700">{formatLKR(e.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: STAFF ACCOUNTS */}
        {activeTab === 'STAFF' && (
          <div className="space-y-3 max-w-2xl mx-auto">
            <h3 className="font-bold text-sm text-slate-800 uppercase">කඩේ සේවක ගිණුම් (Staff & Cashier Logins)</h3>
            <div className="bg-white border-2 border-slate-400 p-3 space-y-2 shadow-sm">
              <div className="flex justify-between items-center p-2.5 border border-slate-300 bg-slate-50">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">බණ්ඩාර මුදලාලි (Owner)</h4>
                  <p className="text-[11px] text-slate-500 font-mono">Role: ADMIN • Username: @owner</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 border border-emerald-300 font-bold uppercase">
                  Active
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 border border-slate-300 bg-slate-50">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">සුපුන් බණ්ඩාර (Counter Staff)</h4>
                  <p className="text-[11px] text-slate-500 font-mono">Role: CASHIER • Username: @cashier1</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 border border-emerald-300 font-bold uppercase">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: STORE SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 max-w-2xl mx-auto bg-white p-4 border-2 border-slate-400 shadow-sm text-xs">
            <h3 className="font-bold text-sm text-slate-900 uppercase border-b-2 border-slate-800 pb-2">
              සාප්පුවේ සැකසුම් (STORE SETTINGS & RECEIPT CONFIG)
            </h3>

            {saveSuccess && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-400 text-emerald-900 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>සැකසුම් සාර්ථකව සුරකින ලදී! (Settings Saved)</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">සාප්පුවේ නම (English):</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">සාප්පුවේ නම (සිංහලෙන්):</label>
                <input
                  type="text"
                  value={settingsForm.storeNameSi || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeNameSi: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">ලිපිනය (Address):</label>
                <input
                  type="text"
                  value={settingsForm.address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">දුරකථන අංකය (Phone):</label>
                <input
                  type="text"
                  value={settingsForm.phone || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-300 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" />
                <span>සැකසුම් සුරකින්න (Save Settings)</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* MODAL 1: ADD NEW PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-3">
          <form onSubmit={handleCreateProduct} className="bg-white border-2 border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden text-xs font-sans">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm uppercase">නව භාණ්ඩයක් ඇතුළත් කිරීම (NEW PRODUCT)</h3>
              <button type="button" onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 bg-slate-50">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">භාණ්ඩයේ නම (English) *:</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Munchee Super Cream Cracker 490g"
                    className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">සිංහල නම (Optional):</label>
                  <input
                    type="text"
                    value={newProdNameSi}
                    onChange={(e) => setNewProdNameSi(e.target.value)}
                    placeholder="e.g. මන්චි සුපර් ක්‍රීම් කැකර්"
                    className="w-full px-2.5 py-1.5 border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barcode:</label>
                  <input
                    type="text"
                    value={newProdBarcode}
                    onChange={(e) => setNewProdBarcode(e.target.value)}
                    placeholder="479..."
                    className="w-full px-2.5 py-1.5 border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">මිනුම් ඒකකය (Unit):</label>
                  <select
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold bg-white"
                  >
                    <option value="UNIT">කෑලි (UNIT)</option>
                    <option value="KG">කිලෝග්‍රෑම් (KG)</option>
                    <option value="G">ග්‍රෑම් (G)</option>
                    <option value="PACKET">පැකට් (PACKET)</option>
                    <option value="L">ලීටර් (L)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">විකුණුම් මිල (Selling Price LKR) *:</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-2.5 py-1.5 border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ගැණුම් මිල (Cost Price LKR):</label>
                  <input
                    type="number"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-2.5 py-1.5 border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ආරම්භක තොගය (Opening Stock):</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 font-mono"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <input
                    type="checkbox"
                    id="quickTile"
                    checked={newProdQuick}
                    onChange={(e) => setNewProdQuick(e.target.checked)}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <label htmlFor="quickTile" className="font-bold text-slate-700 cursor-pointer">
                    කවුන්ටරයේ Quick Tile එකක් ලෙස පෙන්වන්න
                  </label>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-200 border-t border-slate-300 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-1.5 border border-slate-400 text-slate-700 font-bold uppercase hover:bg-slate-100"
              >
                අවලංගුයි
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-wider shadow"
              >
                භාණ්ඩය සුරකින්න
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: STOCK ADJUSTMENT / GRN */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-3">
          <form onSubmit={handleConfirmStockAdjust} className="bg-white border-2 border-slate-700 shadow-2xl max-w-md w-full overflow-hidden text-xs font-sans">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm uppercase">තොග වෙනස් කිරීම (STOCK ADJUSTMENT / GRN)</h3>
              <button type="button" onClick={() => setAdjustingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 bg-slate-50">
              <div className="p-2.5 bg-slate-200 border border-slate-300">
                <span className="font-bold text-slate-900 text-sm block">{adjustingProduct.name}</span>
                <span className="font-mono text-xs text-slate-600">
                  දැනට පවතින තොගය: <strong>{formatQty(adjustingProduct.currentStock, adjustingProduct.unit)}</strong>
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  වෙනස් කරන ප්‍රමාණය (+ එකතු කිරීම් / - අඩු කිරීම්) *:
                </label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="e.g. +20 or -2"
                  className="w-full px-3 py-2 border-2 border-slate-400 font-mono font-bold text-base focus:outline-none focus:border-slate-800"
                  autoFocus
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  නව තොග ලැබුණේ නම් ධන අගයක් (+), හානි වූයේ නම් සෘණ අගයක් (-) යොදන්න.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">හේතුව (Reason):</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 font-semibold bg-white"
                >
                  <option value="නව තොග ලැබීම (New Delivery / GRN)">නව තොග ලැබීම (New Delivery / GRN)</option>
                  <option value="කල් ඉකුත් වීම / හානි වීම (Damage / Spoilage)">කල් ඉකුත් වීම / හානි වීම (Damage / Spoilage)</option>
                  <option value="තොග ගණන් කිරීමේ නිවැරදි කිරීම් (Audit Count)">තොග ගණන් කිරීමේ නිවැරදි කිරීම් (Audit Count)</option>
                  <option value="පාරිභෝගික ආපසු භාරදීම (Customer Return)">පාරිභෝගික ආපසු භාරදීම (Customer Return)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-200 border-t border-slate-300 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setAdjustingProduct(null)}
                className="px-4 py-1.5 border border-slate-400 text-slate-700 font-bold uppercase hover:bg-slate-100"
              >
                අවලංගුයි
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-wider shadow"
              >
                තොගය යාවත්කාලීන කරන්න
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
