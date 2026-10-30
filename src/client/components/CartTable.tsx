import React from 'react';
import { POSCartItem, POSCustomer } from '../types/pos.js';
import { formatLKR, formatQty } from '../utils/formatters.js';
import { Trash2, Plus, Minus, ShoppingCart, UserCheck, ArrowRight } from 'lucide-react';

interface CartTableProps {
  cart: POSCartItem[];
  selectedCustomer: POSCustomer | null;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCreditCustomerModal: () => void;
  onOpenCheckout: () => void;
  discount: number;
}

export const CartTable: React.FC<CartTableProps> = ({
  cart,
  selectedCustomer,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenCreditCustomerModal,
  onOpenCheckout,
  discount
}) => {
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Cart Header */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-4 h-4 text-emerald-600" />
          <h2 className="font-bold text-sm text-slate-800">
            දැනට බිල (Current Bill)
          </h2>
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        </div>

        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Customer / ණය පොත Selection Bar */}
      <div className="px-3 py-2 bg-amber-50/60 border-b border-amber-200/50 flex items-center justify-between text-xs">
        {selectedCustomer ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold truncate">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{selectedCustomer.name}</span>
              <span className="text-[11px] text-amber-700 font-normal">
                (ණය: {formatLKR(selectedCustomer.currentBalance)})
              </span>
            </div>
            <button
              onClick={onOpenCreditCustomerModal}
              className="text-[11px] text-amber-800 underline hover:text-amber-950 font-bold shrink-0 ml-2"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-slate-500">ගනුදෙනුකරු (Customer / ණය පොත):</span>
            <button
              onClick={onOpenCreditCustomerModal}
              className="text-amber-700 hover:text-amber-900 font-bold hover:underline"
            >
              + ණය පොතෙන් තෝරන්න (Select Customer)
            </button>
          </div>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-slate-400">
            <ShoppingCart className="w-12 h-12 stroke-[1.2] mb-2 text-slate-300" />
            <p className="text-sm font-medium">බිල හිස්ව පවතී</p>
            <p className="text-xs text-slate-400 text-center mt-1">
              භාණ්ඩ ස්කෑන් කරන්න හෝ Tiles මත ක්ලික් කරන්න
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.product.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50/80 transition">
              <div className="min-w-0 pr-2">
                <p className="font-semibold text-xs text-slate-800 truncate">
                  {item.product.name}
                </p>
                {item.product.nameSi && (
                  <p className="text-[11px] text-slate-500 truncate">{item.product.nameSi}</p>
                )}
                <p className="text-[11px] text-slate-400">
                  {formatLKR(item.unitPrice)} / {item.product.unit}
                </p>
              </div>

              {/* Qty Controls & Total */}
              <div className="flex items-center space-x-3 shrink-0">
                <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => onUpdateQty(item.product.id, -1)}
                    className="p-1 hover:bg-slate-100 text-slate-600 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-bold text-xs text-slate-800 min-w-[28px] text-center">
                    {formatQty(item.quantity, item.product.unit)}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.product.id, 1)}
                    className="p-1 hover:bg-slate-100 text-slate-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="font-bold text-xs text-slate-800 block">
                    {formatLKR(item.totalPrice)}
                  </span>
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="text-slate-300 hover:text-rose-500 transition p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Footer Summary */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
        <div className="space-y-1 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>එකතුව (Subtotal):</span>
            <span className="font-semibold text-slate-800">{formatLKR(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>වට්ටම් (Discount):</span>
              <span className="font-semibold">- {formatLKR(discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-1 border-t border-slate-200">
            <span className="font-bold text-slate-800 text-sm">අවසාන එකතුව (Net Total):</span>
            <span className="font-black text-xl text-emerald-700">{formatLKR(total)}</span>
          </div>
        </div>

        {/* Big Checkout Button */}
        <button
          onClick={onOpenCheckout}
          disabled={cart.length === 0}
          className={`w-full py-3 px-4 rounded-xl font-bold text-base flex items-center justify-center space-x-2 shadow-lg transition ${
            cart.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-98'
          }`}
        >
          <span>ගෙවීම සිදුකරන්න (Pay / F9)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

