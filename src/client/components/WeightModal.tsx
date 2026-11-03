import React, { useState, useEffect } from 'react';
import { POSProduct } from '../types/pos.js';
import { formatLKR } from '../utils/formatters.js';
import { Scale, X, Check, Calculator } from 'lucide-react';
import { Language } from '../i18n/translations.js';

interface WeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: POSProduct | null;
  onConfirm: (product: POSProduct, quantity: number, customPrice?: number) => void;
  lang: Language;
}

export const WeightModal: React.FC<WeightModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  lang
}) => {
  if (!isOpen || !product) return null;

  const [weightKg, setWeightKg] = useState<string>('0.500');
  const [rupeeAmount, setRupeeAmount] = useState<string>('');
  const [mode, setMode] = useState<'WEIGHT' | 'RUPEES'>('WEIGHT');

  const unitRate = product.sellingPrice; // Price per Kg

  // Calculated values
  const currentKg = parseFloat(weightKg) || 0;
  const calculatedRupees = Math.round(currentKg * unitRate);

  const currentRupees = parseFloat(rupeeAmount) || 0;
  const calculatedWeight = unitRate > 0 ? (currentRupees / unitRate) : 0;

  useEffect(() => {
    setWeightKg('0.500');
    setRupeeAmount((unitRate * 0.5).toFixed(0));
    setMode('WEIGHT');
  }, [product]);

  const handleSelectPresetGrams = (grams: number) => {
    const kg = grams / 1000;
    setWeightKg(kg.toFixed(3));
    setMode('WEIGHT');
  };

  const handleSelectPresetRupees = (rs: number) => {
    setRupeeAmount(rs.toString());
    setMode('RUPEES');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'WEIGHT') {
      const qty = parseFloat(weightKg);
      if (qty > 0) {
        onConfirm(product, qty);
        onClose();
      }
    } else {
      const rs = parseFloat(rupeeAmount);
      if (rs > 0 && unitRate > 0) {
        const qty = parseFloat((rs / unitRate).toFixed(3));
        onConfirm(product, qty);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-3">
      <div className="bg-white border-2 border-slate-700 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Title Bar */}
        <div className="bg-slate-800 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm tracking-wide">
              {lang === 'si' ? 'කිරා මැන බැලීම (Loose Item Weighing)' : 'Loose Item Weight Entry'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-slate-700 p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Details Banner */}
        <div className="bg-slate-100 p-3 border-b border-slate-300 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
            {product.nameSi && <p className="text-xs text-slate-600">{product.nameSi}</p>}
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 uppercase font-bold block">
              1 {product.unit} මිල
            </span>
            <span className="text-base font-black text-slate-900">{formatLKR(unitRate)}</span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 bg-slate-200 border-b border-slate-300 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('WEIGHT')}
            className={`py-2 text-center transition ${
              mode === 'WEIGHT'
                ? 'bg-white text-slate-900 border-b-2 border-emerald-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ⚖️ {lang === 'si' ? 'බර අනුව (Grams / Kg)' : 'By Weight (Grams / Kg)'}
          </button>
          <button
            type="button"
            onClick={() => setMode('RUPEES')}
            className={`py-2 text-center transition ${
              mode === 'RUPEES'
                ? 'bg-white text-slate-900 border-b-2 border-emerald-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            💵 {lang === 'si' ? 'මුදල අනුව (රුපියල් ගණනට)' : 'By Cash Amount (LKR)'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {mode === 'WEIGHT' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === 'si' ? 'බර ප්‍රමාණය (Kilograms):' : 'Enter Weight (Kg):'}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.005"
                    min="0.005"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    autoFocus
                    className="w-full text-2xl font-mono font-bold px-3 py-2 border-2 border-slate-400 bg-white text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-sm font-bold text-slate-700 bg-slate-200 px-3 py-3 border-2 border-slate-300">
                    Kg
                  </span>
                </div>
              </div>

              {/* Quick Gram Presets */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  {lang === 'si' ? 'සුලභ බර ප්‍රමාණ (Quick Presets):' : 'Quick Weight Presets:'}
                </span>
                <div className="grid grid-cols-6 gap-1.5 text-xs font-bold">
                  {[100, 250, 500, 1000, 2000, 5000].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleSelectPresetGrams(g)}
                      className={`p-1.5 border border-slate-300 hover:bg-emerald-50 hover:border-emerald-500 transition text-center ${
                        currentKg === g / 1000 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-50 text-slate-800'
                      }`}
                    >
                      {g >= 1000 ? `${g / 1000} Kg` : `${g}g`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="bg-slate-900 text-emerald-400 p-3 border border-slate-700 font-mono flex items-center justify-between">
                <span className="text-xs uppercase text-slate-400">අයකිරීම (Total Price):</span>
                <span className="text-xl font-black">{formatLKR(calculatedRupees)}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === 'si' ? 'අවශ්‍ය මුදල (Rupees):' : 'Enter Amount (LKR):'}
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-700 bg-slate-200 px-3 py-3 border-2 border-slate-300">
                    රු.
                  </span>
                  <input
                    type="number"
                    step="10"
                    min="10"
                    value={rupeeAmount}
                    onChange={(e) => setRupeeAmount(e.target.value)}
                    autoFocus
                    placeholder="e.g. 100"
                    className="w-full text-2xl font-mono font-bold px-3 py-2 border-2 border-slate-400 bg-white text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Quick Rupee Presets */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  {lang === 'si' ? 'සුලභ මුදල් ප්‍රමාණ (Quick Rupee Presets):' : 'Quick Rupee Presets:'}
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                  {[50, 100, 200, 500].map((rs) => (
                    <button
                      key={rs}
                      type="button"
                      onClick={() => handleSelectPresetRupees(rs)}
                      className={`p-1.5 border border-slate-300 hover:bg-emerald-50 hover:border-emerald-500 transition text-center ${
                        rupeeAmount === rs.toString() ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-50 text-slate-800'
                      }`}
                    >
                      රු. {rs}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Weight Display */}
              <div className="bg-slate-900 text-amber-400 p-3 border border-slate-700 font-mono flex items-center justify-between">
                <span className="text-xs uppercase text-slate-400">ලැබෙන බර (Calculated Weight):</span>
                <span className="text-xl font-black">{calculatedWeight.toFixed(3)} Kg ({Math.round(calculatedWeight * 1000)}g)</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-400 text-slate-700 font-bold text-xs uppercase hover:bg-slate-100 transition"
            >
              {lang === 'si' ? 'අවලංගුයි (Cancel)' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow transition"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'si' ? 'බිලට එක්කරන්න (Enter)' : 'Add to Bill'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
