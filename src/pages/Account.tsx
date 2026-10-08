import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Bookmark, Shield, LogOut, Check, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfileBio } from '../services/auth';
import { getSavedPosts } from '../services/posts';
import { useToast } from '../components/Toast';
import { SEO } from '../components/SEO';

export const Account: React.FC = () => {
  const { user, profile, isAdmin, logout, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [savedCount, setSavedCount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
    }

    const fetchSaved = async () => {
      try {
        const saved = await getSavedPosts(user.uid);
        setSavedCount(saved.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSaved();
  }, [user, profile, navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfileBio(user.uid, {
        displayName: displayName.trim(),
        bio: bio.trim()
      });
      await refreshProfile();
      showToast('Profile updated smoothly.', 'success');
    } catch (err) {
      showToast('Unable to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 md:py-24 text-[#122B22]">
      <SEO title="Account Profile" description="Your quiet account sanctuary." />

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6F8A77]">
            Sanctuary Profile
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#122B22] font-normal">
            Your Account
          </h1>
          <p className="text-sm text-[#122B22]/70 leading-relaxed font-sans">
            Manage your personal reflection space and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Quick Stats & Role */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#E5ECE7] text-[#122B22] text-2xl font-serif font-bold flex items-center justify-center mx-auto shadow-inner">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  profile.displayName?.charAt(0) || 'U'
                )}
              </div>

              <div>
                <h3 className="font-serif text-xl text-[#122B22]">{profile.displayName}</h3>
                <p className="text-xs text-[#6F8A77] truncate">{profile.email}</p>
              </div>

              <div className="pt-2 flex justify-center">
                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-[#122B22] text-[#B8E0D2]'
                    : 'bg-[#B8E0D2]/40 text-[#122B22]'
                }`}>
                  {isAdmin ? 'Administrator' : 'Mindful Reader'}
                </span>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#8EA595] mb-2">
                Sanctuary Links
              </h4>

              <Link
                to="/saved"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE4] text-xs font-semibold text-[#122B22] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#6F8A77]" />
                  <span>Saved Reflections</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white text-[11px] font-bold text-[#122B22]">
                  {savedCount}
                </span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#122B22] hover:bg-[#1A3B2F] text-xs font-semibold text-[#FAF7F2] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#B8E0D2]" />
                    <span>Admin Studio</span>
                  </div>
                  <span className="text-[11px] text-[#B8E0D2]">Open</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-3 rounded-2xl text-xs font-semibold text-[#A33] hover:bg-[#FFF5F5] transition-colors mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Column: Edit Profile Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-8 border border-[#EBE6DC] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl text-[#122B22] font-normal">
                Personal Details
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl px-4 py-3 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email || ''}
                    className="w-full bg-[#F5F2EC] border border-[#EBE6DC] rounded-2xl px-4 py-3 text-sm text-[#122B22]/60 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-[#8EA595]">
                    Email address is tied to your Firebase authentication credentials.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                    Contemplative Bio / Notes
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="A quiet note on your focus or current practices..."
                    className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl p-4 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{saving ? 'Updating...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
