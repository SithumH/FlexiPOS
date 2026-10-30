import React, { useState, useMemo } from 'react';
import { POSProduct } from '../types/pos.js';
import { formatLKR, formatQty } from '../utils/formatters.js';
import { Search, Barcode, Plus } from 'lucide-react';

interface ProductCatalogProps {
  products: POSProduct[];
  onSelectItem: (product: POSProduct) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectItem,
  searchInputRef
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.categoryName) set.add(p.categoryName);
    });
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        selectedCategory === 'ALL' || p.categoryName === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.nameSi && p.nameSi.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Search Bar & Barcode Indicator */}
      <div className="relative mb-2.5">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Scan barcode or type item name... [F2 to focus]"
          className="w-full pl-9 pr-12 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <Barcode className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex space-x-1.5 overflow-x-auto pb-2 mb-1 shrink-0 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            කිසිදු භාණ්ඩයක් හමු නොවීය (No items found)
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectItem(p)}
              className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer transition group"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-800 group-hover:text-emerald-700 truncate">
                    {p.name}
                  </span>
                  {p.barcode && !p.barcode.startsWith('QUICK') && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                      {p.barcode}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                  {p.nameSi && <span className="text-slate-500">{p.nameSi}</span>}
                  <span>•</span>
                  <span>Stock: {formatQty(p.currentStock, p.unit)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-sm text-slate-800">
                  {formatLKR(p.sellingPrice)}
                </span>
                <button
                  className="bg-emerald-100 text-emerald-700 p-1.5 rounded-md hover:bg-emerald-600 hover:text-white transition"
                  title="Add to Bill"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

