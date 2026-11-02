import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { adminLogin, isSupabaseConfigured } from '../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: (email: string) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        onLoginSuccess(email.trim().toLowerCase());
      } else {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your Gmail and password.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FFF8F9] to-white">
      <div className="w-full max-w-md">
        
        {/* Back to store navigation */}
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#7A5A62] hover:text-[#831843] mb-6 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Storefront</span>
        </button>

        <div className="bg-white rounded-3xl border border-[#FCE7EB] shadow-xl p-6 sm:p-8 space-y-6">
          
          {/* Header & Brand Emblem */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFF0F3] border border-[#F3C5D4] text-[#BE185D] shadow-2xs mb-1">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#BE185D]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Brush n Fabric by Sania</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3D2C2E]">
              Admin Studio Login
            </h2>
            <p className="text-xs text-[#7A5A62] max-w-xs mx-auto leading-relaxed">
              Restricted management portal for Sania. Enter your admin Gmail and password to access the catalog, inquiries, and settings.
            </p>
          </div>

          {/* Error message alert */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block text-red-900">Access Denied</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Gmail / Email Input */}
            <div>
              <label className="block font-bold text-[#831843] mb-1.5">
                Admin Gmail / Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A62]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email address"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#FCE7EB] bg-white text-[#3D2C2E] placeholder-[#7A5A62]/50 focus:border-[#BE185D] focus:ring-2 focus:ring-[#BE185D]/20 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-[#831843]">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#BE185D] hover:underline font-semibold cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A62]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#FCE7EB] bg-white text-[#3D2C2E] placeholder-[#7A5A62]/50 focus:border-[#BE185D] focus:ring-2 focus:ring-[#BE185D]/20 focus:outline-hidden transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7A5A62] hover:text-[#831843] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#BE185D] to-[#831843] text-white font-bold text-sm shadow-md hover:shadow-lg hover:from-[#9D174D] hover:to-[#6B1236] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Log In to Admin Panel</span>
                </>
              )}
            </button>

          </form>

          {/* Supabase Status Footer */}
          <div className="pt-2 text-center text-[10px] text-[#7A5A62] flex items-center justify-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>
              {isSupabaseConfigured
                ? 'Supabase Database Connected & Protected'
                : 'Supabase Offline Mode • Local Cache Active'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
