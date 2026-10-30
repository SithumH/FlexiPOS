import React, { useState } from 'react';
import { POSCustomer } from '../types/pos.js';
import { formatLKR } from '../utils/formatters.js';
import { BookOpen, Search, UserPlus, Phone, CheckCircle, ArrowDownCircle, X } from 'lucide-react';

interface CreditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: POSCustomer[];
  onSelectCustomer: (customer: POSCustomer) => void;
  onRecordPayment: (customerId: string, amount: number, notes?: string) => void;
  onAddCustomer: (customer: Omit<POSCustomer, 'id' | 'currentBalance'>) => void;
}

export const CreditBookModal: React.FC<CreditBookModalProps> = ({
  isOpen,
  onClose,
  customers,
  onSelectCustomer,
  onRecordPayment,
  onAddCustomer
}) => {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'LIST' | 'ADD_CUSTOMER' | 'PAY_CREDIT'>('LIST');
  const [selectedCustForPayment, setSelectedCustForPayment] = useState<POSCustomer | null>(null);
  const [payAmountStr, setPayAmountStr] = useState('');
  const [payNotes, setPayNotes] = useState('');

  // New customer form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLimit, setNewLimit] = useState('15000');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const totalShopCredit = customers.reduce((sum, c) => sum + c.currentBalance, 0);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustForPayment) return;
    const amt = parseFloat(payAmountStr);
    if (!amt || amt <= 0) {
      alert('කරුණාකර වලංගු මුදලක් ඇතුළත් කරන්න');
      return;
    }
    onRecordPayment(selectedCustForPayment.id, amt, payNotes);
    setActiveTab('LIST');
    setSelectedCustForPayment(null);
    setPayAmountStr('');
    setPayNotes('');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      alert('නම සහ දුරකථන අංකය අනිවාර්ය වේ');
      return;
    }
    onAddCustomer({
      name: newName,
      phone: newPhone,
      creditLimit: parseFloat(newLimit) || 15000
    });
    setNewName('');
    setNewPhone('');
    setActiveTab('LIST');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-base">ඩිජිටල් ණය පොත (Customer Credit Ledger)</h3>
              <p className="text-xs text-amber-100">කඩේ මුළු ණය එකතුව: {formatLKR(totalShopCredit)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1 rounded-lg hover:bg-amber-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            onClick={() => setActiveTab('LIST')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'LIST'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            ණය ගනුදෙනුකරුවන් ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('ADD_CUSTOMER')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1 ${
              activeTab === 'ADD_CUSTOMER'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>අලුත් කස්ටමර් (+ New)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'LIST' && (
            <div className="space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="නම හෝ දුරකථන අංකයෙන් සොයන්න (Search name or 07...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
              </div>

              {/* Customer List */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {filteredCustomers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    ගනුදෙනුකරුවෙකු හමු නොවීය
                  </div>
                ) : (
                  filteredCustomers.map((cust) => (
                    <div
                      key={cust.id}
                      className="p-3 flex items-center justify-between hover:bg-slate-50 transition"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{cust.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {cust.phone}
                          </span>
                          <span>•</span>
                          <span>සීමාව: {formatLKR(cust.creditLimit)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            දැනට ණය ශේෂය
                          </span>
                          <span
                            className={`font-black text-sm ${
                              cust.currentBalance > 0 ? 'text-amber-700' : 'text-slate-400'
                            }`}
                          >
                            {formatLKR(cust.currentBalance)}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                          {cust.currentBalance > 0 && (
                            <button
                              onClick={() => {
                                setSelectedCustForPayment(cust);
                                setPayAmountStr(cust.currentBalance.toString());
                                setActiveTab('PAY_CREDIT');
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                              title="ණය මුදල් පියවීම"
                            >
                              <ArrowDownCircle className="w-3.5 h-3.5" />
                              <span>ගෙවීම</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onSelectCustomer(cust);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
                            title="බිලට සම්බන්ධ කරන්න"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>තෝරන්න</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'ADD_CUSTOMER' && (
            <form onSubmit={handleAddSubmit} className="space-y-3 max-w-md mx-auto py-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ගනුදෙනුකරුගේ නම (Customer Name):
                </label>
                <input
                  type="text"
                  required
                  placeholder="උදා: සුනිල් පෙරේරා"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  දුරකථන අංකය (Phone Number):
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0771234567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ණය සීමාව (Credit Limit):
                </label>
                <input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('LIST')}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold"
                >
                  පොතට ඇතුළත් කරන්න (Save Customer)
                </button>
              </div>
            </form>
          )}

          {activeTab === 'PAY_CREDIT' && selectedCustForPayment && (
            <form onSubmit={handlePaySubmit} className="space-y-4 max-w-md mx-auto py-2">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-bold text-xs text-amber-900">{selectedCustForPayment.name}</h4>
                <p className="text-xs text-amber-700">
                  දැනට ගෙවිය යුතු මුළු ණය: <strong>{formatLKR(selectedCustForPayment.currentBalance)}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  පියවන මුදල (Repayment Amount):
                </label>
                <input
                  type="number"
                  required
                  value={payAmountStr}
                  onChange={(e) => setPayAmountStr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-base font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  සටහන (Notes / Reason):
                </label>
                <input
                  type="text"
                  placeholder="උදා: Cash repayment for October groceries"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('LIST')}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>ණය පියවීම සටහන් කරන්න (Confirm Payment)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

