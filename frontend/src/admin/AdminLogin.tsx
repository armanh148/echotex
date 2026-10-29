'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Building2
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface AdminLoginProps {
  onSuccess?: () => void;
  onNavigateHome?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ 
  onSuccess, 
  onNavigateHome 
}) => {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password, rememberMe);
      if (res.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          window.history.pushState({}, '', '/admin');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      } else {
        setError(res.error || 'Invalid credentials. Access denied.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication service error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToSite = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf9f4] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-[#0f172a] selection:bg-[#B2E2C5]/40 selection:text-[#4E9F76] relative overflow-hidden">
      
      {/* Subtle brand ambient glow */}
      <div className="absolute top-0 right-1/4 -z-0 w-[500px] h-[500px] bg-[#B2E2C5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-0 w-[500px] h-[500px] bg-[#86C59E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 relative z-10 gap-2 flex-wrap sm:flex-nowrap">
        <button
          onClick={handleReturnToSite}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4E9F76] hover:text-[#006e17] bg-white border border-[#B2E2C5]/40 hover:border-[#86C59E] px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#4E9F76] bg-[#B2E2C5]/20 px-4 py-1.5 rounded-full border border-[#B2E2C5]/50">
          <span className="w-2 h-2 rounded-full bg-[#86C59E] animate-pulse" />
          <span>Ecotex Central Console</span>
        </div>
      </header>

      {/* Main Glassmorphic Login Card */}
      <main className="w-full max-w-md my-auto relative z-10 animate-fadeInUp">
        <div className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_25px_60px_rgba(78, 159, 118,0.08)] border-2 border-[#B2E2C5]/30 overflow-hidden">
          
          {/* Top Brand Accent Bar */}
          <div className="h-2.5 w-full bg-gradient-to-r from-[#4E9F76] via-[#86C59E] to-[#B2E2C5]" />

          <div className="p-5 sm:p-10">
            {/* Header Badge & Brand */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#D8F3DC] border border-[#B2E2C5]/50 text-[#4E9F76] flex items-center justify-center mx-auto mb-4 shadow-xs">
                <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight uppercase">
                ECO<span className="text-[#4E9F76]">TEX</span> CMS
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">
                Enterprise Content & B2B Operations
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  {error}
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-2 flex items-center justify-between">
                  <span>Work Email / Username</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-[#4E9F76]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email or username"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-[#fbfdfb] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#86C59E] focus:ring-2 focus:ring-[#B2E2C5]/30 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-2 flex items-center justify-between">
                  <span>Security Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-[#4E9F76]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-3.5 rounded-xl border border-slate-200 bg-[#fbfdfb] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#86C59E] focus:ring-2 focus:ring-[#B2E2C5]/30 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4E9F76] focus:ring-[#86C59E] border-slate-300 cursor-pointer accent-[#4E9F76]"
                  />
                  <span className="font-medium">Remember this workstation</span>
                </label>

                <span className="text-[11px] text-[#4E9F76] font-bold font-mono">
                  AES-256 Auth
                </span>
              </div>

              {/* Submit Button (Vibrant Leaf Green #86C59E with Deep Forest Hover) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest bg-[#86C59E] hover:bg-[#4E9F76] text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Master Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Access Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Corporate Compliance Notice */}
            <div className="mt-8 pt-6 border-t border-slate-100 bg-[#f9fdf9] -mx-8 -mb-8 sm:-mx-10 sm:-mb-10 p-5 text-center text-xs text-slate-500 rounded-b-[30px]">
              <div className="flex items-center justify-center gap-1.5 text-[#4E9F76] font-bold text-[11px] mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Restricted Corporate Portal</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                Authorized access only. All changes published directly update the live customer storefront in real time.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Footer Credentials */}
      <footer className="w-full max-w-5xl py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-[#B2E2C5]/30 mt-6 relative z-10">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#4E9F76]" />
          <span>Ecotex Inc. Headquarters · Corona, California 92881</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span>TLS 1.3 / 256-Bit SSL Encrypted</span>
          <span>•</span>
          <span>Sanity-Style CMS v4.0</span>
        </div>
      </footer>

    </div>
  );
};

export default AdminLogin;
