import React, { useState } from 'react';
import { POSCartItem, POSCustomer } from '../types/pos.js';
import { formatLKR, formatQty } from '../utils/formatters.js';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  UserCheck,
  CreditCard,
  QrCode,
  BookOpen,
  Banknote,
  Percent,
  XCircle
} from 'lucide-react';

interface CartTableProps {
  cart: POSCartItem[];
  selectedCustomer: POSCustomer | null;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCreditCustomerModal: () => void;
  onOpenCheckout: () => void;
  discount: number;
  onSetDiscount?: (discount: number) => void;
  onQuickPayMethod?: (method: 'CASH' | 'CARD' | 'LANKAQR' | 'CREDIT') => void;
}

export const CartTable: React.FC<CartTableProps> = ({
  cart,
  selectedCustomer,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenCreditCustomerModal,
  onOpenCheckout,
  discount,
  onSetDiscount,
  onQuickPayMethod
}) => {
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountVal, setDiscountVal] = useState(discount.toString());

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = Math.max(0, subtotal - discount);
  const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseFloat(discountVal) || 0;
    if (onSetDiscount) {
      onSetDiscount(d);
    }
    setShowDiscountInput(false);
  };

  return (
    <div className="bg-slate-100 border-2 border-slate-700 flex flex-col h-full shadow-md select-none overflow-hidden font-sans">
      {/* 1. REAL POS CUSTOMER/VFD DIGITAL TOTAL DISPLAY */}
      <div className="bg-slate-950 border-b-2 border-slate-800 p-3 text-white flex items-center justify-between font-mono shadow-inner">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-600/70 px-1.5 py-0.5 font-bold uppercase tracking-widest">
              REGISTER #01
            </span>
            <span className="text-[11px] text-slate-300 font-semibold uppercase">
              {cart.length} ITEMS | {totalQty} UNITS
            </span>
          </div>
          <span className="text-xs text-slate-400 block mt-0.5">
            අවසාන ගෙවිය යුතු එකතුව (NET AMOUNT)
          </span>
        </div>

        <div className="text-right">
          <div className="text-3xl lg:text-4xl font-black tracking-tight text-emerald-400 font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
            {formatLKR(total)}
          </div>
        </div>
      </div>

      {/* 2. Customer / ණය පොත Status Strip */}
      <div className="bg-slate-200 border-b border-slate-300 px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-bold text-slate-700 uppercase">පාරිභෝගිකයා:</span>
          {selectedCustomer ? (
            <span className="font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 truncate">
              {selectedCustomer.name} (ණය ශේෂය: {formatLKR(selectedCustomer.currentBalance)})
            </span>
          ) : (
            <span className="text-slate-600 italic">සාමාන්‍ය මුදල් පාරිභෝගිකයා (Walk-in Customer)</span>
          )}
        </div>

        <button
          onClick={onOpenCreditCustomerModal}
          className="bg-white border border-slate-400 hover:bg-slate-50 text-slate-800 px-2 py-0.5 font-bold text-[11px] shadow-sm transition uppercase"
        >
          {selectedCustomer ? 'මාරු කරන්න' : '+ ණය පොත (F4)'}
        </button>
      </div>

      {/* 3. TRADITIONAL TABULAR BILL GRID */}
      <div className="flex-1 overflow-y-auto bg-white border-b border-slate-300">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-slate-800 text-slate-100 font-bold sticky top-0 z-10 shadow-sm text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-2 px-2 border-r border-slate-700 w-8 text-center">#</th>
              <th className="py-2 px-2 border-r border-slate-700">භාණ්ඩය (Item Description)</th>
              <th className="py-2 px-2 border-r border-slate-700 text-right w-20">මිල (Rate)</th>
              <th className="py-2 px-2 border-r border-slate-700 text-center w-28">ප්‍රමාණය (Qty)</th>
              <th className="py-2 px-2 border-r border-slate-700 text-right w-24">එකතුව (Total)</th>
              <th className="py-2 px-1 text-center w-8">ඉවත්</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-sans">
            {cart.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400 bg-slate-50">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                  <p className="font-bold text-sm text-slate-600">බිල්පත හිස්ව පවතී (Bill is Empty)</p>
                  <p className="text-xs text-slate-400 mt-1">
                    භාණ්ඩ Barcode ස්කෑන් කරන්න [F2] හෝ වම්පස Tiles ඔබන්න
                  </p>
                </td>
              </tr>
            ) : (
              cart.map((item, index) => (
                <tr
                  key={item.product.id}
                  className="hover:bg-amber-50/70 transition even:bg-slate-50/60 font-medium"
                >
                  <td className="py-2 px-2 border-r border-slate-200 text-center font-bold text-slate-500 text-[11px]">
                    {index + 1}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-200">
                    <div className="font-bold text-slate-900 leading-tight">
                      {item.product.name}
                    </div>
                    {item.product.nameSi && (
                      <div className="text-[11px] text-slate-600">{item.product.nameSi}</div>
                    )}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-200 text-right font-mono font-semibold text-slate-700">
                    {formatLKR(item.unitPrice)}
                  </td>
                  <td className="py-1 px-1 border-r border-slate-200 text-center">
                    <div className="inline-flex items-center border border-slate-300 bg-white shadow-sm">
                      <button
                        onClick={() => onUpdateQty(item.product.id, -1)}
                        className="p-1 hover:bg-slate-100 text-slate-700 transition"
                        title="Minus"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono font-bold text-slate-900 min-w-[32px] text-center text-xs">
                        {formatQty(item.quantity, item.product.unit)}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, 1)}
                        className="p-1 hover:bg-slate-100 text-slate-700 transition"
                        title="Plus"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-2 border-r border-slate-200 text-right font-mono font-bold text-slate-900 text-xs">
                    {formatLKR(item.totalPrice)}
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. BILL SUMMARY & DISCOUNT STRIP */}
      <div className="bg-slate-200 border-b border-slate-300 p-2.5">
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-700">
          <div className="bg-white p-2 border border-slate-300">
            <span className="text-[10px] uppercase text-slate-500 block">උප එකතුව (Subtotal)</span>
            <span className="text-base font-black font-mono text-slate-800">{formatLKR(subtotal)}</span>
          </div>

          <div className="bg-white p-2 border border-slate-300 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">වට්ටම් (Discount)</span>
              <span className="text-base font-black font-mono text-rose-600">
                - {formatLKR(discount)}
              </span>
            </div>
            {onSetDiscount && (
              <button
                onClick={() => setShowDiscountInput(!showDiscountInput)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 p-1 text-slate-700 text-[10px] font-bold"
              >
                වෙනස්
              </button>
            )}
          </div>

          <div className="bg-emerald-100 border border-emerald-300 p-2">
            <span className="text-[10px] uppercase text-emerald-800 font-bold block">ගෙවිය යුතුයි (Net)</span>
            <span className="text-base font-black font-mono text-emerald-800">{formatLKR(total)}</span>
          </div>
        </div>

        {/* Discount Inline Form */}
        {showDiscountInput && (
          <form onSubmit={handleApplyDiscount} className="mt-2 flex items-center space-x-2 bg-white p-2 border border-slate-300">
            <span className="text-xs font-bold text-slate-700">වට්ටම් මුදල (LKR):</span>
            <input
              type="number"
              min="0"
              value={discountVal}
              onChange={(e) => setDiscountVal(e.target.value)}
              className="px-2 py-1 border border-slate-300 text-xs font-mono font-bold w-24"
              autoFocus
            />
            <button
              type="submit"
              className="bg-slate-800 text-white px-3 py-1 font-bold text-xs uppercase"
            >
              යොදන්න
            </button>
            <button
              type="button"
              onClick={() => setShowDiscountInput(false)}
              className="text-slate-500 hover:text-slate-800 text-xs"
            >
              අවලංගුයි
            </button>
          </form>
        )}
      </div>

      {/* 5. PHYSICAL POS BUTTON KEYPAD (BIG ACTION KEYS) */}
      <div className="p-2.5 bg-slate-300 border-t border-slate-400 space-y-2">
        <div className="grid grid-cols-4 gap-1.5">
          {/* F9 CASH PAY (BIG PRIMARY GREEN KEY) */}
          <button
            onClick={onOpenCheckout}
            disabled={cart.length === 0}
            className={`col-span-2 py-3 px-3 border-2 border-emerald-800 text-white font-black text-sm uppercase flex items-center justify-center space-x-2 shadow-md transition ${
              cart.length === 0
                ? 'bg-slate-400 border-slate-500 cursor-not-allowed opacity-60'
                : 'bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800'
            }`}
          >
            <Banknote className="w-5 h-5" />
            <span className="tracking-wide">මුදල් ගෙවීම [F9 / PAY]</span>
          </button>

          {/* F10 CARD */}
          <button
            onClick={() => onQuickPayMethod ? onQuickPayMethod('CARD') : onOpenCheckout()}
            disabled={cart.length === 0}
            className={`py-2 px-2 border-2 border-sky-800 text-white font-bold text-xs uppercase flex flex-col items-center justify-center space-y-0.5 shadow transition ${
              cart.length === 0
                ? 'bg-slate-400 border-slate-500 cursor-not-allowed opacity-60'
                : 'bg-sky-700 hover:bg-sky-600 active:bg-sky-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>කාඩ්පත් (CARD)</span>
          </button>

          {/* F11 LankaQR */}
          <button
            onClick={() => onQuickPayMethod ? onQuickPayMethod('LANKAQR') : onOpenCheckout()}
            disabled={cart.length === 0}
            className={`py-2 px-2 border-2 border-purple-800 text-white font-bold text-xs uppercase flex flex-col items-center justify-center space-y-0.5 shadow transition ${
              cart.length === 0
                ? 'bg-slate-400 border-slate-500 cursor-not-allowed opacity-60'
                : 'bg-purple-700 hover:bg-purple-600 active:bg-purple-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>LankaQR</span>
          </button>
        </div>

        {/* Second Row: CREDIT & CLEAR */}
        <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
          <button
            onClick={() => onQuickPayMethod ? onQuickPayMethod('CREDIT') : onOpenCheckout()}
            disabled={cart.length === 0}
            className={`col-span-2 py-2 px-2 border-2 border-amber-800 text-white uppercase flex items-center justify-center space-x-1.5 shadow transition ${
              cart.length === 0
                ? 'bg-slate-400 border-slate-500 cursor-not-allowed opacity-60'
                : 'bg-amber-700 hover:bg-amber-600 active:bg-amber-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>ණයට විකිණීම (CREDIT / F4)</span>
          </button>

          <button
            onClick={onClearCart}
            disabled={cart.length === 0}
            className={`col-span-2 py-2 px-2 border-2 border-rose-800 text-white uppercase flex items-center justify-center space-x-1.5 shadow transition ${
              cart.length === 0
                ? 'bg-slate-400 border-slate-500 cursor-not-allowed opacity-60'
                : 'bg-rose-700 hover:bg-rose-600 active:bg-rose-800'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>බිල අවලංගුයි (CLEAR / ESC)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
