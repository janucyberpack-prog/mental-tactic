import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { registerWithEmail, loginWithGoogle } from '../services/auth';
import { useToast } from '../components/Toast';
import { SEO } from '../components/SEO';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password, name.trim());
      showToast('Welcome to Mental Tactic. Your account is established.', 'success');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else {
        setError(err.message || 'Unable to register. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      showToast('Welcome to Mental Tactic.', 'success');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed.');
      } else {
        setError(err.message || 'Unable to register with Google.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-6 bg-[#FAF7F2]">
      <SEO title="Create Account" description="Join the Mental Tactic sanctuary." />

      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-[#EBE6DC] shadow-lg space-y-7">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#122B22] text-[#FAF7F2] font-serif font-bold text-base flex items-center justify-center mx-auto mb-3">
            M
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#122B22]">
            Join the Sanctuary
          </h1>
          <p className="text-xs text-[#6F8A77] font-medium">
            Create your account to bookmark essays and contribute reflections.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FFF0F0] border border-[#E27D60]/30 text-xs text-[#992222] font-medium leading-relaxed">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="w-full py-3.5 px-4 rounded-full border border-[#EBE6DC] bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#122B22] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-colors disabled:opacity-50 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? 'Connecting...' : 'Join with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#EBE6DC] w-full" />
          <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-[#8EA595] font-semibold absolute">
            or with email
          </span>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA595]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Vance"
                className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA595]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@sanctuary.com"
                className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA595]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA595]" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md mt-2"
          >
            <span>{loading ? 'Creating Sanctuary...' : 'Create Sanctuary Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#122B22]/70 pt-2">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#122B22] hover:text-[#6F8A77] underline underline-offset-4"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
