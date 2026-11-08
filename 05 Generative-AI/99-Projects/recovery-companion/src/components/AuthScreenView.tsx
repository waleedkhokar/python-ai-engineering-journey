import React, { useState } from 'react';
import { 
  Activity, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Loader2, 
  AlertCircle, 
  KeyRound, 
  LogOut 
} from 'lucide-react';
import { 
  LocalUser, 
  loginLocalUser, 
  registerLocalUser, 
  resetLocalUserPassword 
} from '../lib/firestoreService';

interface AuthScreenViewProps {
  currentUser?: LocalUser | null;
  onLoginSuccess: (user: LocalUser) => void;
  onSignOut?: () => void;
  onOpenLegal?: () => void;
  onTryDemo?: () => void;
}

export const AuthScreenView: React.FC<AuthScreenViewProps> = ({ 
  currentUser, 
  onLoginSuccess, 
  onSignOut,
  onOpenLegal, 
  onTryDemo 
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospitalCode, setHospitalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setResetSuccessMsg(null);

    try {
      if (isResetMode) {
        await resetLocalUserPassword(email);
        setResetSuccessMsg('A password reset link has been sent to your email address! Please check your inbox.');
        setIsResetMode(false);
      } else if (isSignUp) {
        if (!password || password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        const newUser = await registerLocalUser(email, password, undefined, hospitalCode);
        onLoginSuccess(newUser);
      } else {
        if (!password) {
          setErrorMsg('Please enter your password.');
          setLoading(false);
          return;
        }
        const user = await loginLocalUser(email, password);
        onLoginSuccess(user);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4 animate-fadeIn">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30">
            <Activity className="w-8 h-8 stroke-[3]" />
          </div>
          <div className="flex items-center justify-center space-x-1.5 pt-2">
            <span className="heavy-type text-2xl text-slate-950 uppercase tracking-tight">
              DISCHARGECARE
            </span>
            <span className="text-2xl font-black text-blue-600">AI</span>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Enterprise Health Portal & Caregiver SSO
          </p>
        </div>

        {/* Centered Auth Card */}
        <div className="saas-card p-8 bg-white border border-slate-200 shadow-xl space-y-6">
          {currentUser ? (
            /* Logged in state view */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  Authenticated Caregiver Session
                </span>
                <h3 className="font-black text-lg text-slate-900 pt-2">Welcome Back!</h3>
                <p className="text-xs text-slate-500 font-bold">{currentUser.email}</p>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={() => onLoginSuccess(currentUser)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Return to Recovery Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    disabled={loading}
                    className="w-full py-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-700 font-black uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Unauthenticated Login / Signup / Reset Form */
            <>
              {!isResetMode ? (
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMsg(null);
                      setResetSuccessMsg(null);
                    }}
                    className={`font-black uppercase tracking-wider text-xs pb-2 transition-all ${
                      !isSignUp 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setErrorMsg(null);
                      setResetSuccessMsg(null);
                    }}
                    className={`font-black uppercase tracking-wider text-xs pb-2 transition-all ${
                      isSignUp 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Register Account
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <span className="font-black uppercase tracking-wider text-xs text-slate-900">
                      Reset Your Password
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(false);
                      setErrorMsg(null);
                      setResetSuccessMsg(null);
                    }}
                    className="text-[10px] font-black uppercase text-blue-600 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                  {errorMsg.toLowerCase().includes('already exists') && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setIsResetMode(false);
                        setErrorMsg(null);
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-wider rounded-lg transition-colors shadow-xs"
                    >
                      Click Here to Switch to Log In
                    </button>
                  )}
                  {errorMsg.toLowerCase().includes('no account found') && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setIsResetMode(false);
                        setErrorMsg(null);
                      }}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] tracking-wider rounded-lg transition-colors shadow-xs"
                    >
                      Click Here to Register Account Instead
                    </button>
                  )}
                  {errorMsg.toLowerCase().includes('incorrect password') && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setIsSignUp(false);
                        setErrorMsg(null);
                      }}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-[10px] tracking-wider rounded-lg transition-colors shadow-xs"
                    >
                      Click Here to Reset Password
                    </button>
                  )}
                </div>
              )}

              {resetSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{resetSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="patient@hospital.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {!isResetMode && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                        Password
                      </label>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsResetMode(true);
                            setErrorMsg(null);
                            setResetSuccessMsg(null);
                          }}
                          className="text-[10px] font-black uppercase text-blue-600 hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required={!isResetMode}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                {isSignUp && !isResetMode && (
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                      Hospital Referral / Medical Access Code (Optional)
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. MERCY-8902"
                        value={hospitalCode}
                        onChange={(e) => setHospitalCode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                {!isResetMode && !isSignUp && (
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1">
                    <span>Demo login: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">patient@hospital.org</code></span>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('patient@hospital.org');
                        setPassword('password123');
                        setErrorMsg(null);
                      }}
                      className="text-blue-600 hover:underline font-black uppercase text-[10px]"
                    >
                      Auto-fill Credentials
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>
                        {isResetMode 
                          ? 'Send Reset Link' 
                          : isSignUp 
                            ? 'Create Enterprise Account' 
                            : 'Sign In to Care Portal'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between text-[11px] font-bold text-blue-900">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>256-Bit Encrypted Cloud Database Session</span>
                </div>
              </div>

              {onTryDemo && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onTryDemo}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Try a Sample Recovery Plan Without Signing In</span>
                  </button>
                </div>
              )}

              {onOpenLegal && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={onOpenLegal}
                    className="text-[11px] font-bold text-slate-500 hover:text-blue-600 underline"
                  >
                    Privacy Policy & Terms of Service
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
