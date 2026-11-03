import React from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Store,
  Globe,
  ShoppingCart,
  UserCheck,
  Shield,
  LogOut,
  User,
  Monitor,
  Minus,
  Square,
  X,
  Maximize2
} from 'lucide-react';
import { Language, translations } from '../i18n/translations.js';
import { CurrentUserSession } from '../types/auth.js';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  activePanel: 'CASHIER' | 'ADMIN' | 'SUPER_ADMIN';
  onChangePanel: (panel: 'CASHIER' | 'ADMIN' | 'SUPER_ADMIN') => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  onSyncNow: () => void;
  onOpenCreditBook: () => void;
  storeName: string;
  storeNameSi?: string;
  currentUser: CurrentUserSession;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  activePanel,
  onChangePanel,
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  onSyncNow,
  storeName,
  storeNameSi,
  currentUser,
  onLogout
}) => {
  const t = translations[lang];

  const isDesktop = typeof window !== 'undefined' && Boolean(window.electronAPI?.isDesktop);

  // RBAC permissions check for Header buttons
  const canAccessAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN';
  const canAccessSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  return (
    <header className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between border-b border-slate-800 shrink-0">
      {/* 1. Left: Brand, Shop Identity & App Mode */}
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-600 text-white p-1.5 rounded-lg flex items-center font-bold">
          <Store className="w-5 h-5 mr-1" />
          <span className="text-sm tracking-tight font-black">FlexiPOS</span>
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-white">
            <span>{lang === 'si' && storeNameSi ? storeNameSi : storeName}</span>
            {isDesktop ? (
              <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-700/60 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                <span>Desktop App</span>
              </span>
            ) : (
              <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.2 rounded font-semibold">
                Web POS
              </span>
            )}
          </h1>
          <p className="text-[11px] text-slate-400">{t.terminal}</p>
        </div>
      </div>

      {/* 2. Center: Role Navigation Panels */}
      <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
        <button
          onClick={() => onChangePanel('CASHIER')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activePanel === 'CASHIER'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{t.cashierPanel}</span>
        </button>

        {canAccessAdmin && (
          <button
            onClick={() => onChangePanel('ADMIN')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activePanel === 'ADMIN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t.adminPanel}</span>
          </button>
        )}

        {canAccessSuperAdmin && (
          <button
            onClick={() => onChangePanel('SUPER_ADMIN')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activePanel === 'SUPER_ADMIN'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t.superAdminPanel}</span>
          </button>
        )}
      </div>

      {/* 3. Right: Utility Controls (Language, Sync, Online/Offline, User & Window Actions) */}
      <div className="flex items-center space-x-2">
        {/* Offline / Online Button */}
        <button
          onClick={onToggleOnline}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
            isOnline
              ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
              : 'bg-rose-950/80 text-rose-300 border-rose-700/80 hover:bg-rose-900'
          }`}
          title="Click to toggle Network simulation"
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span>{isOnline ? t.online : t.offline}</span>
        </button>

        {/* Pending Sync badge */}
        {pendingSyncCount > 0 && (
          <button
            onClick={onSyncNow}
            className="flex items-center space-x-1 bg-amber-900/60 text-amber-300 border border-amber-600/50 px-2 py-1 rounded-md text-xs font-semibold hover:bg-amber-800"
            title="Click to push offline sales to server"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>{pendingSyncCount}</span>
          </button>
        )}

        {/* 1-Click Bilingual Language Switcher */}
        <button
          onClick={onToggleLang}
          className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-md text-xs font-bold text-slate-200 transition"
          title="Switch Language (සිංහල / English)"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'si' ? 'ENG' : 'සිංහල'}</span>
        </button>

        {/* Current User Badge & Logout */}
        <div className="flex items-center space-x-1.5 pl-1.5 border-l border-slate-800">
          <div className="flex items-center space-x-1 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/80 text-xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-200 truncate max-w-[100px]">{currentUser.fullName}</span>
            <span className="bg-slate-700 text-slate-300 px-1 rounded text-[10px] font-bold uppercase ml-0.5">
              {currentUser.role}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="p-1 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-300 text-slate-400 rounded-md border border-slate-700 transition"
            title="ඉවත්වන්න (Sign Out)"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Native Electron Desktop Window Controls */}
        {isDesktop && (
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
            <button
              onClick={() => window.electronAPI?.toggleFullscreen()}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
              title="Toggle Fullscreen (Kiosk Mode)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => window.electronAPI?.minimizeWindow()}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => window.electronAPI?.maximizeWindow()}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
              title="Maximize"
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              onClick={() => window.electronAPI?.closeWindow()}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/60 rounded transition"
              title="Close Application"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
