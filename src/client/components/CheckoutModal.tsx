import React, { useState } from 'react';
import { POSCustomer } from '../types/pos.js';
import { formatLKR } from '../utils/formatters.js';
import { Banknote, CreditCard, QrCode, BookOpen, X, CheckCircle, AlertTriangle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  selectedCustomer: POSCustomer | null;
  onConfirmPayment: (paymentMethod: 'CASH' | 'CARD' | 'LANKAQR' | 'CREDIT', amountPaid: number, changeGiven: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  total,
  selectedCustomer,
  onConfirmPayment
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'LANKAQR' | 'CREDIT'>('CASH');
  const [amountPaidStr, setAmountPaidStr] = useState<string>(total.toString());

  const amountPaid = parseFloat(amountPaidStr) || 0;
  const changeGiven = Math.max(0, amountPaid - total);
  const isExactOrMore = amountPaid >= total;

  const handleQuickCash = (cashVal: number) => {
    setAmountPaidStr(cashVal.toString());
  };

  const handleConfirm = () => {
    if (paymentMethod === 'CREDIT' && !selectedCustomer) {
      alert('ණයට දීම සඳහා පළමුව ගනුදෙනුකරුවෙකු (Customer) තෝරන්න!');
      return;
    }
    if (paymentMethod === 'CASH' && !isExactOrMore) {
      alert('ලැබුණු මුදල බිල්පතේ මුළු එකතුවට වඩා අඩු විය නොහැක!');
      return;
    }

    onConfirmPayment(
      paymentMethod,
      paymentMethod === 'CREDIT' ? 0 : amountPaid,
      paymentMethod === 'CASH' ? changeGiven : 0
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">ගෙවීම් බේරුම්කරණය (Checkout)</h3>
            <p className="text-xs text-slate-400">ක්‍රමය තෝරා මුදල් ලබාගන්න</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill Total Banner */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            ගෙවිය යුතු මුළු මුදල (Net Total)
          </span>
          <span className="text-2xl font-black text-emerald-700">{formatLKR(total)}</span>
        </div>

        {/* Payment Method Tabs */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => {
                setPaymentMethod('CASH');
                setAmountPaidStr(total.toString());
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition ${
                paymentMethod === 'CASH'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Banknote className="w-5 h-5" />
              <span className="text-xs">CASH (මුදල්)</span>
            </button>

            <button
              onClick={() => {
                setPaymentMethod('CARD');
                setAmountPaidStr(total.toString());
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition ${
                paymentMethod === 'CARD'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">CARD</span>
            </button>

            <button
              onClick={() => {
                setPaymentMethod('LANKAQR');
                setAmountPaidStr(total.toString());
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition ${
                paymentMethod === 'LANKAQR'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span className="text-xs">LankaQR</span>
            </button>

            <button
              onClick={() => {
                setPaymentMethod('CREDIT');
                setAmountPaidStr('0');
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition ${
                paymentMethod === 'CREDIT'
                  ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span className="text-xs">ණයට (Credit)</span>
            </button>
          </div>

          {/* Tab 1: CASH Specific Interface */}
          {paymentMethod === 'CASH' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ලැබුණු මුදල (Cash Received):
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400">
                    රු.
                  </span>
                  <input
                    type="number"
                    value={amountPaidStr}
                    onChange={(e) => setAmountPaidStr(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => handleQuickCash(total)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded text-slate-700 whitespace-nowrap"
                >
                  Exact (නියම ගාණ)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(500)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded text-slate-700"
                >
                  500
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(1000)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded text-slate-700"
                >
                  1,000
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(2000)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded text-slate-700"
                >
                  2,000
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(5000)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded text-slate-700"
                >
                  5,000
                </button>
              </div>

              {/* Change calculation */}
              <div className="p-3 rounded-xl bg-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">ඉතිරි දිය යුතු මුදල (Change):</span>
                <span className={`text-xl font-black ${changeGiven > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {formatLKR(changeGiven)}
                </span>
              </div>
            </div>
          )}

          {/* Tab 2: LankaQR Dynamic QR display */}
          {paymentMethod === 'LANKAQR' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <p className="text-xs font-semibold text-slate-700">LankaQR ගෙවීම් ස්කෑන් කරන්න</p>
              <p className="text-[11px] text-slate-500">
                Commercial Bank, BOC, Sampath, Frimi, Genie, iPay මඟින් ගෙවිය හැක.
              </p>
            </div>
          )}

          {/* Tab 3: CREDIT / ණය පොත Warning */}
          {paymentMethod === 'CREDIT' && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-amber-900">ණය පොතට සටහන් කිරීම</h4>
                  {selectedCustomer ? (
                    <div className="mt-1 text-xs text-amber-800 space-y-0.5">
                      <p>ගනුදෙනුකරු: <strong>{selectedCustomer.name}</strong></p>
                      <p>දැනට ණය ශේෂය: <strong>{formatLKR(selectedCustomer.currentBalance)}</strong></p>
                      <p className="text-amber-950 font-bold pt-1 border-t border-amber-200">
                        නව ණය එකතුව: {formatLKR(selectedCustomer.currentBalance + total)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-rose-600 font-semibold mt-1">
                      ⚠️ කරුණාකර පළමුව ගනුදෙනුකරුවෙකු තෝරන්න!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition active:scale-98"
          >
            <CheckCircle className="w-4 h-4" />
            <span>බිල අවසන් කරන්න (Complete Sale)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

