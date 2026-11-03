import React, { useState, useMemo } from 'react';
import { POSProduct } from '../types/pos.js';
import { formatLKR, formatQty } from '../utils/formatters.js';
import { Search, Barcode, Plus, Scale } from 'lucide-react';

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

  // Instant Barcode Scanner & Enter Key Handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const clean = searchTerm.trim().toLowerCase();
      if (!clean) return;

      // 1. Exact Barcode Match
      const exactBarcode = products.find(
        (p) => p.barcode && p.barcode.toLowerCase() === clean
      );
      if (exactBarcode) {
        onSelectItem(exactBarcode);
        setSearchTerm('');
        return;
      }

      // 2. Exact Name Match
      const exactName = products.find(
        (p) => p.name.toLowerCase() === clean || (p.nameSi && p.nameSi.toLowerCase() === clean)
      );
      if (exactName) {
        onSelectItem(exactName);
        setSearchTerm('');
        return;
      }

      // 3. Single Search Result
      if (filteredProducts.length === 1) {
        onSelectItem(filteredProducts[0]);
        setSearchTerm('');
        return;
      }
    }
  };

  return (
    <div className="bg-slate-100 border-2 border-slate-400 p-2.5 flex flex-col h-full shadow-sm select-none overflow-hidden font-sans">
      {/* 1. SOLID BARCODE / ITEM SEARCH BAR */}
      <div className="bg-slate-800 p-2 border-b-2 border-slate-700 flex items-center space-x-2 shrink-0">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Barcode ස්කෑන් කරන්න හෝ නම ලියන්න... [Enter to Add | F2 to Focus]"
            className="w-full pl-8 pr-28 py-2 bg-white border-2 border-slate-300 text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:border-amber-400 font-sans"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 border border-emerald-300">
              SCANNER READY
            </span>
          </div>
        </div>

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="bg-slate-700 text-white px-3 py-2 text-xs font-bold hover:bg-slate-600 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* 2. CATEGORY TABS (TRADITIONAL POS FOLDER TABS) */}
      <div className="flex space-x-1 overflow-x-auto py-1.5 shrink-0 bg-slate-200 px-1 border-b border-slate-300">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs font-bold uppercase transition border ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {cat === 'ALL' ? 'සියල්ල (ALL)' : cat}
          </button>
        ))}
      </div>

      {/* 3. PRODUCT LISTING GRID */}
      <div className="flex-1 overflow-y-auto p-1 divide-y divide-slate-200 bg-white border border-slate-300">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-semibold">
            කිසිදු භාණ්ඩයක් හමු නොවීය (No items found for "{searchTerm}")
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isWeighted = p.unit === 'KG' || p.unit === 'G';
            return (
              <div
                key={p.id}
                onClick={() => onSelectItem(p)}
                className="flex items-center justify-between p-2 hover:bg-amber-50 cursor-pointer transition group border-b border-slate-100 last:border-0"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-slate-950 truncate">
                      {p.name}
                    </span>
                    {isWeighted && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1 font-bold border border-amber-300 flex items-center gap-0.5">
                        <Scale className="w-2.5 h-2.5" />
                        <span>කිරා බලන</span>
                      </span>
                    )}
                    {p.barcode && !p.barcode.startsWith('QUICK') && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1 border border-slate-200 font-mono">
                        {p.barcode}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-slate-500">
                    {p.nameSi && <span className="text-slate-700 font-medium">{p.nameSi}</span>}
                    <span>•</span>
                    <span className={`font-mono ${p.currentStock <= 5 ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                      තොග: {formatQty(p.currentStock, p.unit)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="font-bold font-mono text-sm text-slate-900">
                    {formatLKR(p.sellingPrice)}
                  </span>
                  <button
                    className="bg-slate-800 text-white p-1.5 hover:bg-emerald-700 transition"
                    title="Add to Bill"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
