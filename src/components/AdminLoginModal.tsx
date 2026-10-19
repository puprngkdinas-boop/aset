import React, { useState } from 'react';
import { ShieldCheck, X, KeyRound, Lock, UserCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin password for Dinas PUPR Nagekeo
    if (password === 'admin123' || password === 'puprnagekeo' || password === 'nagekeo2026') {
      setError('');
      setPassword('');
      onLoginSuccess();
      onClose();
    } else {
      setError('Password salah! Gunakan password admin PUPR yang sah.');
    }
  };

  const handleQuickLogin = () => {
    setPassword('');
    setError('');
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold">Login Administrator Dinas</h3>
          <p className="text-xs text-slate-400 mt-1">
            Akses khusus Pejabat / Administrator Dinas PUPR Kab. Nagekeo untuk mengelola data irigasi & publikasi.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password Administrator
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin..."
                className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Hint demo: ketik <code className="bg-slate-100 text-amber-700 px-1 py-0.5 rounded font-mono">admin123</code> atau gunakan tombol login instan di bawah.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Masuk Sebagai Admin</span>
            </button>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs rounded-xl border border-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🚀 Login Instan (Demo Admin PUPR)</span>
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
          Sistem Keamanan Terpadu e-PAKSI &amp; Database Irigasi Nagekeo
        </div>

      </div>
    </div>
  );
};
