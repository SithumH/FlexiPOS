import React from 'react';
import { POSProduct } from '../types/pos.js';
import { formatLKR } from '../utils/formatters.js';
import { Zap, Scale } from 'lucide-react';

interface QuickItemTilesProps {
  items: POSProduct[];
  onSelectItem: (product: POSProduct) => void;
}

export const QuickItemTiles: React.FC<QuickItemTilesProps> = ({ items, onSelectItem }) => {
  return (
    <div className="bg-slate-200 border-2 border-slate-400 p-2 flex flex-col h-full shadow-sm select-none">
      <div className="flex items-center justify-between px-1 mb-1.5 pb-1 border-b border-slate-300">
        <div className="flex items-center space-x-1.5">
          <span className="bg-slate-800 text-amber-400 p-0.5 text-xs font-bold">⚡</span>
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-wide">
            කවුන්ටරයේ සුලභ භාණ්ඩ (QUICK TOUCH HOTKEYS)
          </h2>
        </div>
        <span className="text-[10px] text-slate-600 font-bold bg-white px-2 py-0.5 border border-slate-300">
          BARCODE නැති භාණ්ඩ
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 overflow-y-auto pr-1">
        {items.map((item) => {
          const isWeighted = item.unit === 'KG' || item.unit === 'G';
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="flex flex-col justify-between p-2 border-2 border-slate-300 bg-white hover:bg-amber-50 hover:border-slate-800 active:bg-slate-200 text-left transition shadow-sm min-h-[68px] relative group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-slate-950 truncate block">
                    {item.name}
                  </span>
                  {isWeighted && (
                    <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0" title="Weighted item" />
                  )}
                </div>
                {item.nameSi && (
                  <span className="text-[11px] text-slate-600 font-medium truncate block">
                    {item.nameSi}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between mt-1 pt-1 border-t border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-1 border border-slate-200">
                  {item.unit}
                </span>
                <span className="text-xs font-black font-mono text-slate-900">
                  {formatLKR(item.sellingPrice)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
