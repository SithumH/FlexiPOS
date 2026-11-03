import React from 'react';
import { OfflineOrderQueueItem } from '../types/pos.js';
import { ShopSettings } from '../types/settings.js';
import { formatLKR } from '../utils/formatters.js';
import { Printer, X, CheckCircle2, QrCode } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OfflineOrderQueueItem | null;
  settings: ShopSettings;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
  settings
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = async () => {
    if (typeof window !== 'undefined' && window.electronAPI?.isDesktop) {
      await window.electronAPI.printReceipt({
        silent: settings.autoPrintReceipt ?? false,
        paperSize: settings.receiptPaperSize
      });
    } else {
      window.print();
    }
  };

  const is58mm = settings.receiptPaperSize === '58mm';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] ${
          is58mm ? 'max-w-xs' : 'max-w-sm'
        } w-full`}
      >
        {/* Header */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>බිල්පත සාර්ථකයි (Sale Completed)</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thermal Receipt Paper Simulation */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100 flex justify-center">
          <div
            className={`bg-white p-3 shadow-sm border border-slate-200 w-full text-slate-800 font-mono ${
              is58mm ? 'text-[10px]' : 'text-[11px]'
            } leading-tight space-y-2`}
          >
            {/* Store Branding */}
            <div className="text-center space-y-0.5">
              {settings.showSinhalaOnReceipt && settings.storeNameSi && (
                <h3 className="font-bold text-sm tracking-tight">{settings.storeNameSi}</h3>
              )}
              <h4 className="font-semibold text-xs tracking-tight">{settings.storeName}</h4>
              <p className="text-[10px] text-slate-500">{settings.address}</p>
              <p className="text-[10px] text-slate-500">Tel: {settings.phone}</p>
            </div>

            <div className="border-t border-dashed border-slate-300 my-1"></div>

            {/* Bill Meta */}
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Invoice: {order.id.slice(0, 8).toUpperCase()}</span>
              <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Date: {new Date(order.createdAt).toLocaleDateString('si-LK')}
            </div>

            {order.customerName && (
              <div className="text-[10px] bg-slate-50 p-1 border border-slate-200 rounded">
                <strong>Customer:</strong> {order.customerName}
                {order.isCreditSale && <span className="text-amber-700 font-bold ml-1">(ණය බිලකි)</span>}
              </div>
            )}

            <div className="border-t border-dashed border-slate-300 my-1"></div>

            {/* Items Table */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase">
                <span>Item</span>
                <span>Qty x Price</span>
                <span>Total</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-[10px]">
                  <span className="truncate max-w-[110px]">{item.productName}</span>
                  <span className="text-slate-500">
                    {item.quantity} x {item.unitPrice}
                  </span>
                  <span className="font-semibold">{formatLKR(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-slate-300 my-1"></div>

            {/* Financial Summary */}
            <div className="space-y-0.5 text-right text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatLKR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Discount:</span>
                  <span>- {formatLKR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs pt-0.5 border-t border-slate-300">
                <span>NET TOTAL:</span>
                <span>{formatLKR(order.total)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-600 pt-0.5">
                <span>Method ({order.paymentMethod}):</span>
                <span>{formatLKR(order.amountPaid)}</span>
              </div>
              {order.changeGiven > 0 && (
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>Change:</span>
                  <span>{formatLKR(order.changeGiven)}</span>
                </div>
              )}
            </div>

            {/* LankaQR on receipt footer if enabled */}
            {settings.showLankaQROnReceipt && (
              <div className="border-t border-dashed border-slate-300 pt-2 text-center flex flex-col items-center">
                <QrCode className="w-16 h-16 text-slate-800" />
                <span className="text-[9px] text-slate-500 mt-0.5">Scan to Pay via LankaQR</span>
              </div>
            )}

            <div className="border-t border-dashed border-slate-300 my-1"></div>

            {/* Footer */}
            <div className="text-center text-[9px] text-slate-400 space-y-0.5 pt-1">
              <p>{settings.receiptFooter}</p>
              <p>Powered by FlexiPOS Sri Lanka</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-between gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            නව බිලක් (New Sale)
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
