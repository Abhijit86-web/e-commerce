import React, { useState } from 'react';
import { X, Lock, ShieldAlert, Key, ArrowRight, AlertCircle, Mail, UserCheck } from 'lucide-react';
import { AdminSession } from '../types';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorized: (session: AdminSession) => void;
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  isOpen,
  onClose,
  onAuthorized,
}) => {
  const [authMethod, setAuthMethod] = useState<'key' | 'account'>('key');
  const [masterKey, setMasterKey] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const payload =
      authMethod === 'key'
        ? { masterKey: masterKey.trim() }
        : { email: adminEmail.trim(), password: adminPassword.trim() };

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.authorized && data.token) {
        const session: AdminSession = {
          token: data.token,
          email: data.admin?.email || (authMethod === 'account' ? adminEmail : 'admin@aurajewelry.com'),
          name: data.admin?.name || 'Studio Administrator',
          role: data.admin?.role || 'super_admin',
          loginTime: data.admin?.loginTime || new Date().toLocaleTimeString(),
        };

        try {
          sessionStorage.setItem('aura_admin_session', JSON.stringify(session));
        } catch {
          // ignore
        }

        onAuthorized(session);
        onClose();
      } else {
        setErrorMsg(data.error || 'Access denied. You do not possess administrator credentials.');
      }
    } catch {
      // Offline fallback verification
      const isKeyMatch = masterKey.trim() === 'aura2026' || masterKey.trim() === 'atelier' || masterKey.trim() === 'admin';
      const isAccountMatch =
        (adminEmail.toLowerCase() === 'admin@aurajewelry.com' || adminEmail.toLowerCase() === 'maityabhijit769@gmail.com') &&
        (adminPassword === 'admin' || adminPassword === 'aura2026');

      if (isKeyMatch || isAccountMatch) {
        const session: AdminSession = {
          token: 'aura-master-session-key-2026',
          email: adminEmail || 'admin@aurajewelry.com',
          name: adminEmail.includes('maity') ? 'Abhijit Maity (Admin)' : 'Atelier Director',
          role: 'super_admin',
          loginTime: new Date().toLocaleTimeString(),
        };
        try {
          sessionStorage.setItem('aura_admin_session', JSON.stringify(session));
        } catch {
          // ignore
        }
        onAuthorized(session);
        onClose();
      } else {
        setErrorMsg('Authentication error. Only authenticated administrators may view this panel.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setAuthMethod('account');
    setAdminEmail('admin@aurajewelry.com');
    setAdminPassword('admin');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#191513] text-[#f7f2ea] w-full max-w-md rounded-3xl shadow-2xl border border-[#3d3128] overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Restricted Warning Strip */}
        <div className="bg-[#b91c1c] text-white text-[10px] py-1.5 px-4 font-bold tracking-widest uppercase flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Restricted Access: Administrators Only</span>
          </div>
          <span>Confidential</span>
        </div>

        {/* Header */}
        <div className="p-6 border-b border-[#31261f] bg-[#14100f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#e0a96d]/15 border border-[#e0a96d]/40 rounded-xl text-[#e0a96d]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-white">Administrator Portal Gate</h3>
              <p className="text-[11px] text-[#b8a695]">Authorized personnel verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-[#c7b5a3] leading-relaxed">
            This console gives full administrative control over catalog releases, inventory levels, pricing, and customer fulfillment. Regular customers do not have access to this area.
          </p>

          {/* Auth Method Selector */}
          <div className="grid grid-cols-2 p-1 bg-[#120e0d] rounded-xl border border-[#31261f]">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('key');
                setErrorMsg(null);
              }}
              className={`py-2 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                authMethod === 'key'
                  ? 'bg-[#e0a96d] text-[#241e1b] shadow'
                  : 'text-[#8c7866] hover:text-white'
              }`}
            >
              Master Security Key
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('account');
                setErrorMsg(null);
              }}
              className={`py-2 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                authMethod === 'account'
                  ? 'bg-[#e0a96d] text-[#241e1b] shadow'
                  : 'text-[#8c7866] hover:text-white'
              }`}
            >
              Admin Account
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-700/60 rounded-xl text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            {authMethod === 'key' ? (
              <div>
                <label className="block text-[11px] font-semibold text-[#e0a96d] uppercase tracking-wider mb-1">
                  Atelier Master Key:
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#8c7866] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter master key (e.g. aura2026)"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    className="w-full bg-[#120e0d] border border-[#3d3128] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e0a96d] font-mono tracking-wider"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#8c7866] mt-1.5">
                  <span>Default Key: <strong className="text-[#e0a96d] font-mono">aura2026</strong></span>
                  <button
                    type="button"
                    onClick={() => setMasterKey('aura2026')}
                    className="text-[#e0a96d] hover:underline cursor-pointer"
                  >
                    Use Default
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#e0a96d] uppercase tracking-wider mb-1">
                    Admin Email:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8c7866] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="admin@aurajewelry.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-[#120e0d] border border-[#3d3128] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e0a96d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#e0a96d] uppercase tracking-wider mb-1">
                    Password:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8c7866] absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-[#120e0d] border border-[#3d3128] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e0a96d]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#8c7866]">
                  <span>Authorized admin accounts: admin@aurajewelry.com or maityabhijit769@gmail.com</span>
                  <button
                    type="button"
                    onClick={handleFillDemoAdmin}
                    className="text-[#e0a96d] hover:underline cursor-pointer flex items-center gap-1 shrink-0 ml-2"
                  >
                    <UserCheck className="w-3 h-3" />
                    <span>Auto-fill</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#e0a96d] hover:bg-[#f2bd8b] text-[#241e1b] text-xs font-bold tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating Administrator...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Unlock Administrator Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
