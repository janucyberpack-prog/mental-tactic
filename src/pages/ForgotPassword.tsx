import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '../services/auth';
import { useToast } from '../components/Toast';
import { SEO } from '../components/SEO';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
      showToast('Password reset link sent to your inbox.', 'success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to send reset email. Please verify your address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-6 bg-[#FAF7F2]">
      <SEO title="Reset Password" description="Recover your Mental Tactic access." />

      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-[#EBE6DC] shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#122B22] text-[#FAF7F2] font-serif font-bold text-base flex items-center justify-center mx-auto mb-3">
            M
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#122B22]">
            Reset Password
          </h1>
          <p className="text-xs text-[#6F8A77] font-medium">
            Enter your email to receive a secure link to reset your credentials.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FFF0F0] border border-[#E27D60]/30 text-xs text-[#992222] font-medium leading-relaxed">
            {error}
          </div>
        )}

        {sent ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#B8E0D2]/40 text-[#122B22] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-[#6F8A77]" />
            </div>
            <h3 className="font-serif text-2xl text-[#122B22]">
              Check Your Inbox
            </h3>
            <p className="text-xs text-[#122B22]/70 leading-relaxed max-w-xs mx-auto">
              If an account is associated with <span className="font-semibold text-[#122B22]">{email}</span>, you will receive password reset instructions shortly.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
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
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md mt-2"
            >
              <span>{loading ? 'Sending link...' : 'Send Reset Link'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#6F8A77] hover:text-[#122B22] font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
