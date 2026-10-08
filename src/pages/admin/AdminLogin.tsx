import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { loginWithEmail, BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_PASSWORD } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { SEO } from '../../components/SEO';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const from = (location.state as any)?.from || '/admin';

  // If already logged in as admin, redirect to admin immediately
  React.useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleFillDemoAdmin = () => {
    setEmail(BOOTSTRAP_ADMIN_EMAIL);
    setPassword(BOOTSTRAP_ADMIN_PASSWORD);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const profile = await loginWithEmail(email, password);
      await refreshProfile();

      if (profile.role !== 'admin' && profile.email.toLowerCase() !== BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
        setErrorMsg('Authentication successful, but this account does not possess administrator privileges.');
        showToast('Administrator privileges required.', 'error');
        setLoading(false);
        return;
      }

      showToast('Welcome to Mental Tactic CMS Studio.', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      let message = 'Unable to sign in. Please verify your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'Administrator account not registered yet.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please wait a few moments before trying again.';
      }
      setErrorMsg(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 px-6 flex flex-col justify-center items-center text-[#122B22]">
      <SEO title="Admin Sign In — Mental Tactic" description="Sign in to the Mental Tactic editorial CMS studio." />

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#6F8A77] hover:text-[#122B22] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Sanctuary</span>
          </Link>

          <div className="w-14 h-14 rounded-2xl bg-[#122B22] text-[#B8E0D2] flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-7 h-7" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal tracking-tight">
            CMS Studio Access
          </h1>
          <p className="text-xs text-[#122B22]/70 font-sans max-w-xs mx-auto leading-relaxed">
            Authorized administrator credentials required for publication management and platform settings.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EBE6DC] shadow-sm space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs leading-relaxed font-sans">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#122B22]/80">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8EA595] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mentaltactic.com"
                  className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#122B22]/80">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#6F8A77] hover:text-[#122B22] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8EA595] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Enter Admin Studio'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick primary administrator autofill button */}
          <div className="pt-2 border-t border-[#F2ECE4]">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#EAE5DB] border border-[#EBE6DC] text-xs text-[#122B22] flex items-center justify-between transition-colors font-sans"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-[#6F8A77]" />
                <span className="font-semibold text-xs">Primary Admin Credentials</span>
              </div>
              <span className="text-[11px] text-[#6F8A77] font-mono">Autofill</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#122B22]/50 font-sans">
          Protected by Firebase Authentication & Role-Based Access Control
        </p>
      </div>
    </div>
  );
};
