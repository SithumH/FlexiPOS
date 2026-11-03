import React, { useState } from 'react';
import { POSCustomer } from '../types/pos.js';
import { formatLKR } from '../utils/formatters.js';
import { BookOpen, Search, UserPlus, Phone, Check, ArrowDownCircle, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-3 select-none font-sans">
      <div className="bg-white border-2 border-slate-700 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Title Bar */}
        <div className="bg-amber-800 text-white px-4 py-2.5 flex items-center justify-between border-b border-amber-900">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-sm tracking-wide uppercase">
              ඩිජිටල් ණය පොත (CUSTOMER CREDIT LEDGER) [F4]
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white hover:bg-amber-900 p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ledger Summary Strip */}
        <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between font-mono text-xs border-b border-slate-800">
          <span className="text-slate-400">මුළු ණය ගැතියන්: {customers.length}</span>
          <div className="text-right">
            <span className="text-[10px] text-amber-400 uppercase font-bold mr-2">
              කඩේ මුළු ණය එකතුව:
            </span>
            <span className="text-base font-black text-amber-400 font-mono">
              {formatLKR(totalShopCredit)}
            </span>
          </div>
        </div>

        {/* Traditional Folder Tabs */}
        <div className="flex border-b border-slate-300 bg-slate-200 px-2 pt-1.5 space-x-1">
          <button
            onClick={() => setActiveTab('LIST')}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition border-t border-l border-r ${
              activeTab === 'LIST'
                ? 'bg-white text-slate-900 border-slate-400 shadow-sm'
                : 'bg-slate-300 text-slate-700 border-transparent hover:bg-slate-100'
            }`}
          >
            ණය ගනුදෙනුකරුවන් ({customers.length})
          </button>

          <button
            onClick={() => setActiveTab('ADD_CUSTOMER')}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition border-t border-l border-r flex items-center gap-1 ${
              activeTab === 'ADD_CUSTOMER'
                ? 'bg-white text-slate-900 border-slate-400 shadow-sm'
                : 'bg-slate-300 text-slate-700 border-transparent hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ නව පාරිභෝගිකයෙකු ඇතුළත් කිරීම</span>
          </button>
        </div>

        {/* Body Content Area */}
        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {activeTab === 'LIST' && (
            <div className="space-y-2">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="පාරිභෝගිකයාගේ නම හෝ දුරකථන අංකය සොයන්න..."
                  className="w-full pl-8 pr-3 py-1.5 border-2 border-slate-300 text-xs font-semibold focus:outline-none focus:border-amber-600 bg-white"
                  autoFocus
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
              </div>

              {/* Traditional Tabular Ledger List */}
              <div className="border border-slate-300 bg-white overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800 text-slate-200 text-[11px] font-bold uppercase">
                    <tr>
                      <th className="p-2 border-r border-slate-700">නම (Customer Name)</th>
                      <th className="p-2 border-r border-slate-700">දුරකථන අංකය</th>
                      <th className="p-2 border-r border-slate-700 text-right">ණය සීමාව</th>
                      <th className="p-2 border-r border-slate-700 text-right">ණය ශේෂය (Balance)</th>
                      <th className="p-2 text-center">ක්‍රියාමාර්ග</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400 font-bold text-xs">
                          කිසිදු පාරිභෝගිකයෙකු හමු නොවීය
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-amber-50/70 even:bg-slate-50">
                          <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                            {c.name}
                          </td>
                          <td className="p-2 border-r border-slate-200 font-mono text-slate-600">
                            {c.phone}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-right font-mono text-slate-500">
                            {formatLKR(c.creditLimit)}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-right font-mono font-bold text-rose-700">
                            {formatLKR(c.currentBalance)}
                          </td>
                          <td className="p-1.5 text-center space-x-1">
                            <button
                              onClick={() => {
                                onSelectCustomer(c);
                                onClose();
                              }}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white px-2 py-1 text-[11px] font-bold uppercase"
                              title="Select for current bill"
                            >
                              තෝරන්න
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCustForPayment(c);
                                setActiveTab('PAY_CREDIT');
                              }}
                              className="bg-amber-700 hover:bg-amber-800 text-white px-2 py-1 text-[11px] font-bold uppercase"
                              title="Repay credit balance"
                            >
                              ගෙවීම් භාරගැනීම
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ADD_CUSTOMER' && (
            <form onSubmit={handleAddSubmit} className="space-y-3 bg-white p-4 border border-slate-300">
              <h4 className="font-bold text-xs text-slate-800 uppercase border-b border-slate-200 pb-1.5">
                නව ණය පාරිභෝගික විස්තර
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">සම්පූර්ණ නම *:</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. කේ. සුනිල් පෙරේරා"
                    className="w-full px-2.5 py-1.5 border border-slate-300 font-semibold focus:outline-none focus:border-amber-600"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">දුරකථන අංකය *:</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="0771234567"
                    className="w-full px-2.5 py-1.5 border border-slate-300 font-mono font-semibold focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ණය සීමාව (Credit Limit LKR):</label>
                  <input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 font-mono font-semibold focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('LIST')}
                  className="px-3 py-1.5 border border-slate-400 text-slate-700 font-bold text-xs uppercase"
                >
                  ආපසු
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-800 text-white font-bold text-xs uppercase hover:bg-amber-900"
                >
                  සුරකින්න (Save Customer)
                </button>
              </div>
            </form>
          )}

          {activeTab === 'PAY_CREDIT' && selectedCustForPayment && (
            <form onSubmit={handlePaySubmit} className="space-y-3 bg-white p-4 border border-slate-300">
              <h4 className="font-bold text-xs text-amber-900 uppercase border-b border-amber-200 pb-1.5">
                ණය පියවීම / මුදල් භාරගැනීම (Credit Repayment)
              </h4>

              <div className="bg-amber-50 p-2.5 border border-amber-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">පාරිභෝගිකයා:</span>
                  <span className="font-bold text-slate-900">{selectedCustForPayment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">දැනට පවතින ණය:</span>
                  <span className="font-mono font-bold text-rose-600">
                    {formatLKR(selectedCustForPayment.currentBalance)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ගෙවන මුදල (Amount Received LKR) *:
                  </label>
                  <input
                    type="number"
                    required
                    step="10"
                    min="1"
                    max={selectedCustForPayment.currentBalance}
                    value={payAmountStr}
                    onChange={(e) => setPayAmountStr(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border-2 border-slate-400 text-base font-mono font-bold focus:outline-none focus:border-amber-600"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">සටහන (Notes / Receipt No):</label>
                  <input
                    type="text"
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    placeholder="e.g. මුදලින් ගෙවන ලදී"
                    className="w-full px-2.5 py-1.5 border border-slate-300 text-xs focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('LIST')}
                  className="px-3 py-1.5 border border-slate-400 text-slate-700 font-bold text-xs uppercase"
                >
                  අවලංගුයි
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 text-white font-bold text-xs uppercase hover:bg-emerald-800"
                >
                  ගෙවීම සටහන් කරන්න (Confirm Repayment)
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-200 border-t border-slate-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white font-bold text-xs uppercase hover:bg-slate-900"
          >
            වසන්න (Close / ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
