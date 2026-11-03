import React, { useState } from 'react';
import { POSCustomer } from '../types/pos.js';
import { formatLKR } from '../utils/formatters.js';
import {
  Banknote,
  CreditCard,
  QrCode,
  BookOpen,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  selectedCustomer: POSCustomer | null;
  onConfirmPayment: (
    paymentMethod: 'CASH' | 'CARD' | 'LANKAQR' | 'CREDIT',
    amountPaid: number,
    changeGiven: number
  ) => void;
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

  const handleNumpadPress = (digit: string) => {
    if (digit === 'C') {
      setAmountPaidStr('');
    } else if (digit === '00') {
      setAmountPaidStr((prev) => (prev ? prev + '00' : '0'));
    } else {
      setAmountPaidStr((prev) => (prev === '0' ? digit : prev + digit));
    }
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
    <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-3 select-none font-sans">
      <div className="bg-white border-2 border-slate-700 shadow-2xl max-w-xl w-full overflow-hidden">
        {/* Title Bar */}
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-emerald-400 font-bold">[F9]</span>
            <h3 className="font-bold text-sm tracking-wide uppercase">
              ගෙවීම් බේරුම්කරණය (SETTLEMENT / CHECKOUT)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill Total Banner */}
        <div className="bg-slate-950 p-3 text-white flex items-center justify-between border-b-2 border-slate-800 font-mono">
          <div>
            <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest block">
              අයවිය යුතු මුළු මුදල (TOTAL DUE)
            </span>
            <span className="text-xs text-slate-400">Sri Lankan Rupees</span>
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {formatLKR(total)}
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="grid grid-cols-4 bg-slate-200 border-b border-slate-300 text-xs font-bold">
          <button
            onClick={() => {
              setPaymentMethod('CASH');
              setAmountPaidStr(total.toString());
            }}
            className={`py-2.5 text-center flex items-center justify-center space-x-1.5 transition ${
              paymentMethod === 'CASH'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>CASH (මුදල්)</span>
          </button>

          <button
            onClick={() => {
              setPaymentMethod('CARD');
              setAmountPaidStr(total.toString());
            }}
            className={`py-2.5 text-center flex items-center justify-center space-x-1.5 transition ${
              paymentMethod === 'CARD'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>CARD</span>
          </button>

          <button
            onClick={() => {
              setPaymentMethod('LANKAQR');
              setAmountPaidStr(total.toString());
            }}
            className={`py-2.5 text-center flex items-center justify-center space-x-1.5 transition ${
              paymentMethod === 'LANKAQR'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>LankaQR</span>
          </button>

          <button
            onClick={() => {
              setPaymentMethod('CREDIT');
              setAmountPaidStr('0');
            }}
            className={`py-2.5 text-center flex items-center justify-center space-x-1.5 transition ${
              paymentMethod === 'CREDIT'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>ණයට (Credit)</span>
          </button>
        </div>

        {/* Payment Content Area */}
        <div className="p-4 space-y-3 bg-slate-50">
          {paymentMethod === 'CASH' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Cash Input & Sri Lanka Currency Notes */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      ලැබුණු මුදල (Cash Tendered):
                    </label>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-bold text-slate-700 bg-slate-200 px-3 py-2 border-2 border-slate-300">
                        රු.
                      </span>
                      <input
                        type="number"
                        value={amountPaidStr}
                        onChange={(e) => setAmountPaidStr(e.target.value)}
                        autoFocus
                        className="w-full text-xl font-mono font-bold px-3 py-1.5 border-2 border-slate-400 bg-white text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Sri Lankan Currency Note Buttons */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      මුදල් නෝට්ටු (Exact Currency Notes):
                    </span>
                    <div className="grid grid-cols-3 gap-1 text-xs font-bold font-mono">
                      <button
                        type="button"
                        onClick={() => handleQuickCash(total)}
                        className="p-1.5 border border-slate-400 bg-white hover:bg-emerald-50 text-slate-900 text-center"
                      >
                        Exact
                      </button>
                      {[100, 500, 1000, 2000, 5000].map((note) => (
                        <button
                          key={note}
                          type="button"
                          onClick={() => handleQuickCash(note)}
                          className="p-1.5 border border-slate-400 bg-white hover:bg-emerald-50 text-slate-900 text-center"
                        >
                          {note}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* POS On-Screen Numpad */}
                <div className="bg-slate-200 p-2 border border-slate-300">
                  <div className="grid grid-cols-3 gap-1 text-sm font-bold font-mono">
                    {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00', 'C'].map((btn) => (
                      <button
                        key={btn}
                        type="button"
                        onClick={() => handleNumpadPress(btn)}
                        className={`p-2 border text-center transition ${
                          btn === 'C'
                            ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300'
                            : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                        }`}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Big Change Display */}
              <div
                className={`p-3 border-2 font-mono flex items-center justify-between ${
                  isExactOrMore
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border-rose-800'
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">
                    {isExactOrMore ? 'පාරිභෝගිකයාට ඉතිරි මුදල (CHANGE DUE)' : 'තවත් ගෙවිය යුතු මුදල (SHORTFALL)'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isExactOrMore ? 'Cash drawer will open' : 'Insufficient cash received'}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono">
                  {formatLKR(isExactOrMore ? changeGiven : total - amountPaid)}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'CARD' && (
            <div className="p-6 bg-sky-50 border border-sky-200 text-center space-y-2">
              <CreditCard className="w-12 h-12 text-sky-700 mx-auto stroke-[1.5]" />
              <h4 className="font-bold text-sm text-sky-950">POS කාඩ්පත් යන්ත්‍රය භාවිතා කරන්න</h4>
              <p className="text-xs text-slate-600">
                ස්වයිප් / ටැප් කර අනුමැතිය ලැබුණු පසු "ගෙවීම තහවුරු කරන්න" ඔබන්න
              </p>
              <div className="font-mono font-black text-2xl text-sky-800 pt-2">
                {formatLKR(total)}
              </div>
            </div>
          )}

          {paymentMethod === 'LANKAQR' && (
            <div className="p-4 bg-purple-50 border border-purple-200 text-center space-y-2">
              <div className="bg-white p-3 border-2 border-purple-300 inline-block">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=FlexiPOS_LANKAQR_DEMO"
                  alt="LankaQR Code"
                  className="w-32 h-32 mx-auto"
                />
              </div>
              <h4 className="font-bold text-xs text-purple-900 uppercase">
                LankaQR මඟින් ඕනෑම බැංකු App එකකින් ස්කෑන් කර ගෙවන්න
              </h4>
              <p className="text-[11px] text-slate-500">Commercial, BOC, Sampath, Frimi, iPay, Genie</p>
              <div className="font-mono font-black text-xl text-purple-800">
                {formatLKR(total)}
              </div>
            </div>
          )}

          {paymentMethod === 'CREDIT' && (
            <div className="p-4 bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <span>ණය පොතට එක්කිරීම (Customer Credit Ledger)</span>
              </div>
              {selectedCustomer ? (
                <div className="bg-white p-3 border border-amber-300 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">පාරිභෝගිකයා:</span>
                    <span className="font-bold text-slate-900">{selectedCustomer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">දුරකථන අංකය:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">දැනට පවතින ණය:</span>
                    <span className="font-mono font-bold text-rose-600">
                      {formatLKR(selectedCustomer.currentBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="font-bold text-amber-900">මෙම බිලෙන් පසු නව ණය ශේෂය:</span>
                    <span className="font-mono font-black text-amber-900">
                      {formatLKR(selectedCustomer.currentBalance + total)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-300 p-3 text-rose-700 text-xs font-bold">
                  ⚠️ ණයට විකිණීම සඳහා කරුණාකර පළමුව පාරිභෝගිකයෙකු තෝරාගෙන සිටින්න!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-200 border-t border-slate-300 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-400 text-slate-700 font-bold text-xs uppercase hover:bg-slate-100 transition"
          >
            අවලංගුයි [ESC]
          </button>

          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition"
          >
            <Check className="w-4 h-4" />
            <span>ගෙවීම සම්පූර්ණ කරන්න (CONFIRM & PRINT) [ENTER]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
