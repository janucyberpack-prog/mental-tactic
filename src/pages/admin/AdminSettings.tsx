import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { changeAdminPassword, resetPassword, BOOTSTRAP_ADMIN_EMAIL } from '../../services/auth';
import { seedInitialPostsIfEmpty } from '../../services/posts';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useToast } from '../../components/Toast';
import { SEO } from '../../components/SEO';

export const AdminSettings: React.FC = () => {
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      await changeAdminPassword(newPassword);
      showToast('Administrator password updated successfully via Firebase Auth.', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        showToast('Please re-login to verify identity before updating password.', 'error');
      } else {
        showToast(err.message || 'Failed to update administrator password.', 'error');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      setResetEmailSent(true);
      showToast(`Password reset link dispatched to ${user.email}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to send reset email.', 'error');
    }
  };

  const handleSeedArticles = async () => {
    setSeedLoading(true);
    try {
      await seedInitialPostsIfEmpty();
      showToast('Database verified. Sanctuary reflections active in Firestore.', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Unable to seed articles.', 'error');
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="py-10 md:py-14">
        <SEO title="Admin Settings & Security — Mental Tactic" description="Administrator authentication, password management, and database tools." />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Header */}
          <div className="pb-6 border-b border-[#EBE6DC]">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal tracking-tight">
              Settings & Security
            </h1>
            <p className="text-xs text-[#122B22]/70 font-sans mt-1">
              Manage administrator authentication, credentials, and platform infrastructure.
            </p>
          </div>

          {/* Administrator Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE6DC] shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#122B22] text-[#B8E0D2] flex items-center justify-center shadow-xs">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#122B22]">Administrator Profile</h3>
                <p className="text-xs text-[#8EA595]">Authenticated Firebase Administrator</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE6DC] space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#8EA595] font-semibold">
                  Administrator Email
                </div>
                <div className="font-mono text-xs text-[#122B22] font-semibold truncate">
                  {user?.email || BOOTSTRAP_ADMIN_EMAIL}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE6DC] space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#8EA595] font-semibold">
                  Role Authorization
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#122B22] text-[#B8E0D2]">
                    {profile?.role || 'admin'}
                  </span>
                  <span className="text-xs text-[#6F8A77]">Full Superuser Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Form (Secure Firebase Auth) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE6DC] shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#6F8A77]" />
                <h3 className="font-serif text-xl text-[#122B22]">Change Administrator Password</h3>
              </div>
              <p className="text-xs text-[#122B22]/70 leading-relaxed font-sans">
                Update your administrator password through Firebase Authentication's secure encryption flow.
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#122B22]/80">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8EA595] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-2.5 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#122B22]/80">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8EA595] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-2.5 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{passwordLoading ? 'Updating Password...' : 'Save New Password'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendResetEmail}
                  className="px-4 py-2.5 rounded-full border border-[#EBE6DC] bg-[#FAF7F2] text-xs font-semibold text-[#122B22] hover:bg-[#EAE5DB] transition-colors"
                >
                  Send Reset Link to Email
                </button>
              </div>

              {resetEmailSent && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Password reset email has been dispatched.</span>
                </div>
              )}
            </form>
          </div>

          {/* Database & Seed Operations */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE6DC] shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#6F8A77]" />
                <h3 className="font-serif text-xl text-[#122B22]">Database Maintenance</h3>
              </div>
              <p className="text-xs text-[#122B22]/70 leading-relaxed font-sans">
                Verify Firestore collections, replenish curated sample articles, and synchronize indexes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-xs text-[#122B22]">Verify & Seed Initial Articles</div>
                <div className="text-xs text-[#8EA595] mt-0.5">
                  Populate foundational essays on mindfulness, rest, emotional agility, and neurobiology if collection is empty.
                </div>
              </div>

              <button
                type="button"
                onClick={handleSeedArticles}
                disabled={seedLoading}
                className="px-5 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8E0D2]" />
                <span>{seedLoading ? 'Verifying...' : 'Verify Articles'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
