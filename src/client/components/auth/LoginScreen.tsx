import React, { useState } from 'react';
import { UserRole, SUPER_ADMIN_CREDENTIALS, CurrentUserSession } from '../../types/auth.js';
import { Language } from '../../i18n/translations.js';
import { Store, Shield, UserCheck, ShoppingCart, Lock, KeyRound, Globe, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  lang: Language;
  onToggleLang: () => void;
  onLoginSuccess: (session: CurrentUserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  lang,
  onToggleLang,
  onLoginSuccess
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('CASHIER');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle direct custom login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Super Admin Hardcoded Verification
    if (selectedRole === 'SUPER_ADMIN') {
      if (
        cleanUser === SUPER_ADMIN_CREDENTIALS.username &&
        cleanPass === SUPER_ADMIN_CREDENTIALS.password
      ) {
        onLoginSuccess({
          id: 'sa-001',
          fullName: 'FlexiPOS Platform Developer',
          username: 'superadmin',
          role: 'SUPER_ADMIN',
          shopName: 'FlexiPOS Cloud Platform'
        });
        return;
      } else {
        setErrorMsg(
          lang === 'si'
            ? 'Super Admin Username හෝ Password වැරදියි! (Default: superadmin / admin)'
            : 'Invalid Super Admin credentials! (Default: superadmin / admin)'
        );
        return;
      }
    }

    // 2. Shop Admin Login Verification
    if (selectedRole === 'ADMIN') {
      if (cleanUser === 'owner' && (cleanPass === '1234' || cleanPass === 'admin' || cleanPass === 'owner')) {
        onLoginSuccess({
          id: 'adm-001',
          fullName: 'බණ්ඩාර මුදලාලි (Owner)',
          username: 'owner',
          role: 'ADMIN',
          shopId: 't-1',
          shopName: 'බණ්ඩාර ස්ටෝර්ස් (පිළියන්දල)'
        });
        return;
      } else {
        setErrorMsg(
          lang === 'si'
            ? 'Shop Admin Username හෝ Password වැරදියි! (Demo: owner / 1234)'
            : 'Invalid Shop Admin credentials! (Demo: owner / 1234)'
        );
        return;
      }
    }

    // 3. Cashier Login Verification
    if (selectedRole === 'CASHIER') {
      if (cleanUser === 'cashier1' || cleanPass === '1234') {
        onLoginSuccess({
          id: 'csh-001',
          fullName: 'සුපුන් බණ්ඩාර (Cashier)',
          username: 'cashier1',
          role: 'CASHIER',
          shopId: 't-1',
          shopName: 'බණ්ඩාර ස්ටෝර්ස් (පිළියන්දල)'
        });
        return;
      } else {
        setErrorMsg(
          lang === 'si'
            ? 'Cashier Username හෝ PIN වැරදියි! (Demo: cashier1 / 1234)'
            : 'Invalid Cashier username or PIN! (Demo: cashier1 / 1234)'
        );
        return;
      }
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = (role: UserRole) => {
    if (role === 'SUPER_ADMIN') {
      onLoginSuccess({
        id: 'sa-001',
        fullName: 'FlexiPOS Platform Developer',
        username: 'superadmin',
        role: 'SUPER_ADMIN',
        shopName: 'FlexiPOS Cloud Platform'
      });
    } else if (role === 'ADMIN') {
      onLoginSuccess({
        id: 'adm-001',
        fullName: 'බණ්ඩාර මුදලාලි (Owner)',
        username: 'owner',
        role: 'ADMIN',
        shopId: 't-1',
        shopName: 'බණ්ඩාර ස්ටෝර්ස් (පිළියන්දල)'
      });
    } else {
      onLoginSuccess({
        id: 'csh-001',
        fullName: 'සුපුන් බණ්ඩාර (Cashier)',
        username: 'cashier1',
        role: 'CASHIER',
        shopId: 't-1',
        shopName: 'බණ්ඩාර ස්ටෝර්ස් (පිළියන්දල)'
      });
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-100 flex flex-col justify-between p-4 antialiased select-none">
      {/* Top Bar with Language Switcher */}
      <div className="flex justify-between items-center max-w-4xl w-full mx-auto py-2">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-600 text-white p-1.5 rounded-lg font-bold flex items-center">
            <Store className="w-5 h-5 mr-1" />
            <span className="text-base font-black tracking-tight">FlexiPOS</span>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {lang === 'si' ? 'ශ්‍රී ලංකා සිල්ලර වෙළඳ පද්ධතිය' : 'Sri Lankan Retail POS System'}
          </span>
        </div>

        <button
          onClick={onToggleLang}
          className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm transition"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'si' ? 'ENG' : 'සිංහල'}</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white text-center space-y-1">
          <h2 className="text-lg font-bold">
            {lang === 'si' ? 'පද්ධතියට ඇතුල්වීම' : 'Sign In to FlexiPOS'}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'si'
              ? 'ඔබේ භූමිකාව (Role) තෝරා Login වන්න'
              : 'Select your role to access your assigned panel'}
          </p>
        </div>

        {/* 3 Role Selection Tabs */}
        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-1.5 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('CASHIER');
              setUsername('cashier1');
              setPassword('1234');
              setErrorMsg('');
            }}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition ${
              selectedRole === 'CASHIER'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200 font-bold'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'si' ? 'Cashier' : 'Cashier'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('ADMIN');
              setUsername('owner');
              setPassword('1234');
              setErrorMsg('');
            }}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition ${
              selectedRole === 'ADMIN'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200 font-bold'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'si' ? 'කඩේ Admin' : 'Shop Admin'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('SUPER_ADMIN');
              setUsername(SUPER_ADMIN_CREDENTIALS.username);
              setPassword(SUPER_ADMIN_CREDENTIALS.password);
              setErrorMsg('');
            }}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition ${
              selectedRole === 'SUPER_ADMIN'
                ? 'bg-white text-amber-900 shadow-sm border border-slate-200 font-bold'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-600" />
            <span>{lang === 'si' ? 'Super Admin' : 'Super Admin'}</span>
          </button>
        </div>

        {/* Login Form Body */}
        <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Role Description Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-0.5">
            <span className="font-bold text-slate-800 block">
              {selectedRole === 'CASHIER' && (lang === 'si' ? 'කවුන්ටරයේ බිල්පත් දැමීම' : 'Cashier Billing Counter')}
              {selectedRole === 'ADMIN' && (lang === 'si' ? 'කඩේ මුදලාලි / කළමනාකරු' : 'Shop Owner / Store Admin')}
              {selectedRole === 'SUPER_ADMIN' && (lang === 'si' ? 'Platform Developer Master' : 'SaaS Master Developer')}
            </span>
            <p className="text-[11px] text-slate-500">
              {selectedRole === 'CASHIER' && (lang === 'si' ? 'වේගවත් බිල්පත් දැමීම පමණි. සැකසුම් වෙනස් කළ නොහැක.' : 'Fast checkout only. Cannot alter store settings.')}
              {selectedRole === 'ADMIN' && (lang === 'si' ? 'කඩේ ආදායම්, තොග, ණය පොත සහ Cashiers ලා පාලනය.' : 'Manages store stock, credit book, and cashiers.')}
              {selectedRole === 'SUPER_ADMIN' && (lang === 'si' ? 'සියලුම කඩවල්, Plans සහ Admins/Cashiers පාලනය.' : 'Manages all tenant shops, plans, and all logins.')}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {selectedRole === 'CASHIER' ? (lang === 'si' ? 'PIN අංකය / Password:' : 'PIN / Password:') : 'Password:'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow transition active:scale-98"
          >
            <span>{lang === 'si' ? 'ඇතුල් වන්න (Sign In)' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* 1-Click Fast Login Shortcut Buttons (For Instant Testing) */}
          <div className="pt-2 border-t border-slate-200">
            <p className="text-[10px] text-slate-400 uppercase font-bold text-center mb-2">
              {lang === 'si' ? 'පරීක්ෂා කිරීම සඳහා 1-Click Demo Login' : 'Instant 1-Click Demo Login'}
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('CASHIER')}
                className="p-1.5 border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg text-[10px] font-semibold text-slate-700 text-center transition"
              >
                Cashier (සුපුන්)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className="p-1.5 border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg text-[10px] font-semibold text-slate-700 text-center transition"
              >
                Admin (මුදලාලි)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('SUPER_ADMIN')}
                className="p-1.5 border border-amber-200 bg-amber-50 hover:bg-amber-100 rounded-lg text-[10px] font-semibold text-amber-900 text-center transition"
              >
                Super Admin
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 py-2">
        FlexiPOS Sri Lanka • PostgreSQL Multi-Tenant Retail Platform
      </div>
    </div>
  );
};
