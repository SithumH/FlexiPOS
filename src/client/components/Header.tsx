import React from 'react';
import { Wifi, WifiOff, RefreshCw, User, Store, BookOpen, Settings } from 'lucide-react';

interface HeaderProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  onSyncNow: () => void;
  onOpenCreditBook: () => void;
  onOpenSettings: () => void;
  cashierName: string;
  storeName: string;
  storeNameSi?: string;
  userRole: 'SUPER_ADMIN' | 'ADMIN' | 'CASHIER';
}

export const Header: React.FC<HeaderProps> = ({
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  onSyncNow,
  onOpenCreditBook,
  onOpenSettings,
  cashierName,
  storeName,
  storeNameSi,
  userRole
}) => {
  return (
    <header className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between shadow-md">
      {/* Left: Shop Branding */}
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-600 text-white p-2 rounded-lg flex items-center justify-center font-bold">
          <Store className="w-5 h-5 mr-1.5" />
          <span>FlexiPOS</span>
        </div>
        <div>
          <h1 className="font-bold text-base tracking-wide flex items-center gap-2">
            <span>{storeNameSi || storeName}</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
              {userRole === 'SUPER_ADMIN' ? 'Platform Master' : 'Grocery V1.0'}
            </span>
          </h1>
          <p className="text-xs text-slate-400">{storeName} • Terminal #01</p>
        </div>
      </div>

      {/* Center: Quick Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* ණය පොත Quick Access Button */}
        <button
          onClick={onOpenCreditBook}
          className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow transition"
          title="F4: ණය පොත විවෘත කරන්න"
        >
          <BookOpen className="w-4 h-4" />
          <span>ණය පොත (F4)</span>
        </button>

        {/* Offline / Online Simulator Switch */}
        <button
          onClick={onToggleOnline}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            isOnline
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-600/50 hover:bg-emerald-900'
              : 'bg-rose-950/80 text-rose-400 border-rose-600/50 hover:bg-rose-900'
          }`}
          title="Click to simulate Internet disconnect / reconnect"
        >
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span>{isOnline ? 'Online (Connected)' : 'Offline Mode (Local Storage)'}</span>
        </button>

        {/* Pending Sync Queue Badge */}
        {pendingSyncCount > 0 && (
          <button
            onClick={onSyncNow}
            className="flex items-center space-x-1.5 bg-sky-900/80 text-sky-300 border border-sky-600/50 hover:bg-sky-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold animate-pulse"
            title="Pending orders ready to sync"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>{pendingSyncCount} Sync Pending</span>
          </button>
        )}
      </div>

      {/* Right: Cashier Info & Settings Button */}
      <div className="flex items-center space-x-2 text-sm">
        <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <User className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-200 font-medium">
            {cashierName} ({userRole})
          </span>
        </div>

        {/* Settings button (Admin / Super Admin) */}
        <button
          onClick={onOpenSettings}
          className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
          title="කඩේ සැකසුම් (Settings & Customization)"
        >
          <Settings className="w-4 h-4 text-slate-300" />
          <span className="text-xs font-semibold">සැකසුම්</span>
        </button>
      </div>
    </header>
  );
};
