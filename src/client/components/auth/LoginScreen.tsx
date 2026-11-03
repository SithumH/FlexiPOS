import React, { useState } from 'react';
import { UserRole, SUPER_ADMIN_USERNAME, CurrentUserSession } from '../../types/auth.js';
import { Language } from '../../i18n/translations.js';
import { Store, Shield, UserCheck, ShoppingCart, Lock, KeyRound, Globe, Check, AlertCircle } from 'lucide-react';

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
  const [username, setUsername] = useState('cashier1');
  const [password, setPassword] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');

  const handleKeypadPress = (val: string) => {
    if (val === 'CLEAR') {
      setPassword('');
    } else if (val === 'ENTER') {
      handleLoginSubmit();
    } else {
      setPassword((prev) => prev + val);
    }
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Super Admin Verification
    if (selectedRole === 'SUPER_ADMIN') {
      if (
        cleanUser === SUPER_ADMIN_USERNAME &&
        (cleanPass === 'admin' || cleanPass === 'admin123')
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
    <div className="min-h-screen w-screen bg-slate-200 flex flex-col justify-between select-none font-sans">
      {/* Top Desktop App Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between border-b-2 border-slate-700">
        <div className="flex items-center space-x-2">
          <Store className="w-5 h-5 text-emerald-400" />
          <span className="font-black text-sm tracking-wide">FlexiPOS Retail Station</span>
          <span className="text-[11px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.2 font-mono">
            COUNTER #01
          </span>
        </div>

        <button
          onClick={onToggleLang}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 text-xs font-bold text-white flex items-center space-x-1"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'si' ? 'English' : 'සිංහල'}</span>
        </button>
      </div>

      {/* Center POS Login Terminal Dialog */}
      <div className="max-w-xl w-full mx-auto my-auto p-4">
        <div className="bg-white border-2 border-slate-700 shadow-2xl overflow-hidden">
          {/* Dialog Title Bar */}
          <div className="bg-slate-850 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-700">
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wide">
                {lang === 'si' ? 'කවුන්ටරයට ඇතුල්වීම (TERMINAL LOGIN)' : 'POS TERMINAL LOGIN'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'si' ? 'භූමිකාව තෝරා PIN හෝ මුරපදය ඇතුළත් කරන්න' : 'Select role and enter Cashier PIN'}
              </p>
            </div>
            <Lock className="w-5 h-5 text-slate-400" />
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 bg-slate-200 border-b border-slate-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('CASHIER');
                setUsername('cashier1');
                setPassword('1234');
                setErrorMsg('');
              }}
              className={`py-2.5 px-2 text-center transition flex items-center justify-center space-x-1.5 ${
                selectedRole === 'CASHIER'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>CASHIER (කවුන්ටරය)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('ADMIN');
                setUsername('owner');
                setPassword('1234');
                setErrorMsg('');
              }}
              className={`py-2.5 px-2 text-center transition flex items-center justify-center space-x-1.5 ${
                selectedRole === 'ADMIN'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>කඩේ ADMIN (Owner)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('SUPER_ADMIN');
                setUsername(SUPER_ADMIN_USERNAME);
                setPassword('admin');
                setErrorMsg('');
              }}
              className={`py-2.5 px-2 text-center transition flex items-center justify-center space-x-1.5 ${
                selectedRole === 'SUPER_ADMIN'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>SUPER ADMIN</span>
            </button>
          </div>

          {/* Form & PIN Keypad */}
          <div className="p-4 bg-slate-50">
            {errorMsg && (
              <div className="mb-3 p-2.5 bg-rose-100 border border-rose-400 text-rose-800 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Inputs */}
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    පරිශීලක නාමය (Username):
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-3 py-2 border-2 border-slate-300 font-bold text-sm bg-white focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    මුරපදය / PIN (Password):
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border-2 border-slate-300 font-mono font-bold text-base bg-white focus:outline-none focus:border-slate-800 tracking-widest"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow"
                  >
                    <Check className="w-4 h-4" />
                    <span>ඇතුල් වන්න (SIGN IN / ENTER)</span>
                  </button>
                </div>
              </form>

              {/* Right Column: Traditional Physical POS Pinpad */}
              <div className="bg-slate-200 p-2.5 border border-slate-300">
                <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1.5 text-center">
                  TOUCH KEYPAD (PIN PAD)
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-sm font-bold font-mono">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLEAR', '0', 'ENTER'].map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleKeypadPress(key)}
                      className={`p-2.5 border text-center transition ${
                        key === 'ENTER'
                          ? 'bg-emerald-700 text-white hover:bg-emerald-800 border-emerald-800 text-xs'
                          : key === 'CLEAR'
                          ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-300 text-xs'
                          : 'bg-white text-slate-900 hover:bg-slate-100 border-slate-300 shadow-sm'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Demo 1-Click Login Bar */}
            <div className="mt-4 pt-3 border-t border-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 text-center">
                පරීක්ෂා කිරීම සඳහා සෘජු ප්‍රවේශය (1-Click Fast Login):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('CASHIER')}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold text-center"
                >
                  🟢 Cashier (සුපුන්)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('ADMIN')}
                  className="p-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 text-xs font-bold text-center"
                >
                  🔵 කඩේ Admin (මුදලාලි)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('SUPER_ADMIN')}
                  className="p-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold text-center"
                >
                  🟠 Super Admin (Master)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Desktop POS Status Bar */}
      <div className="bg-slate-800 text-slate-400 px-4 py-1.5 text-xs flex items-center justify-between border-t border-slate-700 font-mono">
        <div className="flex items-center space-x-3">
          <span>HOST: 127.0.0.1:5432</span>
          <span>•</span>
          <span>ENGINE: SQLite / IndexedDB Offline Ready</span>
          <span>•</span>
          <span>STATUS: NORMAL</span>
        </div>
        <div>
          <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};
