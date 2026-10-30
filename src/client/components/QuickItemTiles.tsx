import React from 'react';
import { POSProduct } from '../types/pos.js';
import { formatLKR } from '../utils/formatters.js';
import { Zap } from 'lucide-react';

interface QuickItemTilesProps {
  items: POSProduct[];
  onSelectItem: (product: POSProduct) => void;
}

export const QuickItemTiles: React.FC<QuickItemTilesProps> = ({ items, onSelectItem }) => {
  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Quick Touch Tiles (Barcode නැති භාණ්ඩ)</span>
        </h2>
        <span className="text-[11px] text-slate-400">1-Touch Add to Bill</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="flex flex-col justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition group active:scale-95 shadow-sm min-h-[72px]"
          >
            <div>
              <p className="font-semibold text-xs text-slate-800 line-clamp-1 group-hover:text-emerald-700">
                {item.name}
              </p>
              {item.nameSi && (
                <p className="text-[11px] text-slate-500 line-clamp-1">{item.nameSi}</p>
              )}
            </div>
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-200/70 px-1 rounded">
                {item.unit}
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {formatLKR(item.sellingPrice)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

