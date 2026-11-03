import React from 'react';
import {
  Store,
  Globe,
  ShoppingCart,
  UserCheck,
  Shield,
  LogOut,
  Monitor,
  Minus,
  Square,
  X,
  Maximize2,
  RefreshCw,
  BookOpen
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
  onOpenCreditBook,
  storeName,
  storeNameSi,
  currentUser,
  onLogout
}) => {
  const t = translations[lang];
  const isDesktop = typeof window !== 'undefined' && Boolean(window.electronAPI?.isDesktop);

  const canAccessAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN';
  const canAccessSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const handleMinimize = () => {
    if (window.electronAPI?.minimizeWindow) window.electronAPI.minimizeWindow();
  };

  const handleMaximize = () => {
    if (window.electronAPI?.maximizeWindow) window.electronAPI.maximizeWindow();
  };

  const handleClose = () => {
    if (window.electronAPI?.closeWindow) window.electronAPI.closeWindow();
  };

  return (
    <header className="bg-slate-900 text-white flex flex-col border-b-2 border-slate-700 shrink-0 select-none font-sans">
      {/* 1. TOP TITLE / DESKTOP WINDOW BAR */}
      <div className="bg-slate-950 px-3 py-1 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 border border-emerald-800 text-[10px]">
            FlexiPOS v1.0
          </span>
          <span className="text-slate-300 font-bold">
            {lang === 'si' && storeNameSi ? storeNameSi : storeName} - [ප්‍රධාන විකුණුම් කවුන්ටරය #01]
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Online / Offline Sync Tag */}
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span
              onClick={onToggleOnline}
              className={`cursor-pointer px-2 py-0.2 font-mono font-bold flex items-center gap-1 ${
                isOnline
                  ? 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                  : 'bg-amber-900 text-amber-300 border border-amber-700'
              }`}
              title="Click to toggle test offline/online"
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span>{isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
            </span>

            {pendingSyncCount > 0 && (
              <button
                onClick={onSyncNow}
                className="bg-amber-600 hover:bg-amber-500 text-white px-1.5 py-0.2 font-mono font-bold flex items-center gap-1 text-[10px]"
                title="Sync pending orders"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>{pendingSyncCount} PENDING</span>
              </button>
            )}
          </div>

          {/* Desktop Windows Action Controls (Minimize, Maximize, Close) */}
          {isDesktop && (
            <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-slate-800">
              <button
                onClick={handleMinimize}
                className="hover:bg-slate-800 text-slate-400 hover:text-white px-2 py-0.5 transition"
                title="Minimize"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleMaximize}
                className="hover:bg-slate-800 text-slate-400 hover:text-white px-2 py-0.5 transition"
                title="Maximize / Restore"
              >
                <Square className="w-3 h-3" />
              </button>
              <button
                onClick={handleClose}
                className="hover:bg-rose-700 text-slate-400 hover:text-white px-2 py-0.5 transition"
                title="Exit POS"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN APPLICATION FUNCTION TOOLBAR */}
      <div className="px-3 py-2 flex items-center justify-between bg-slate-900">
        {/* Left: Traditional Navigation Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onChangePanel('CASHIER')}
            className={`px-3 py-1.5 font-bold text-xs uppercase flex items-center space-x-1.5 border transition ${
              activePanel === 'CASHIER'
                ? 'bg-emerald-700 text-white border-emerald-500 shadow'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span>විකුණුම් කවුන්ටරය (POS F1)</span>
          </button>

          {canAccessAdmin && (
            <button
              onClick={() => onChangePanel('ADMIN')}
              className={`px-3 py-1.5 font-bold text-xs uppercase flex items-center space-x-1.5 border transition ${
                activePanel === 'ADMIN'
                  ? 'bg-emerald-700 text-white border-emerald-500 shadow'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>කඩේ පාලක පුවරුව (ADMIN F10)</span>
            </button>
          )}

          {canAccessSuperAdmin && (
            <button
              onClick={() => onChangePanel('SUPER_ADMIN')}
              className={`px-3 py-1.5 font-bold text-xs uppercase flex items-center space-x-1.5 border transition ${
                activePanel === 'SUPER_ADMIN'
                  ? 'bg-amber-700 text-white border-amber-500 shadow'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Super Admin Master</span>
            </button>
          )}

          <button
            onClick={onOpenCreditBook}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-400 border border-slate-700 font-bold text-xs uppercase flex items-center space-x-1.5 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>ණය පොත (CREDIT F4)</span>
          </button>
        </div>

        {/* Right: Cashier Identity, Language Switcher, Logout */}
        <div className="flex items-center space-x-2">
          {/* Cashier Badge */}
          <div className="bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs flex items-center space-x-1.5">
            <span className="text-slate-400">ක්‍රියාකරු:</span>
            <span className="font-bold text-white">{currentUser.fullName}</span>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-1 font-mono uppercase">
              {currentUser.role}
            </span>
          </div>

          {/* Bilingual Switcher */}
          <button
            onClick={onToggleLang}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2.5 py-1 text-xs font-bold text-white flex items-center space-x-1 transition"
            title="Switch Language (සිංහල / English)"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'si' ? 'ENG' : 'සිංහල'}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="bg-rose-900/80 hover:bg-rose-800 border border-rose-700 text-rose-200 hover:text-white px-2.5 py-1 text-xs font-bold uppercase flex items-center space-x-1 transition"
            title="Sign out of register"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
