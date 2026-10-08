import React, { useEffect, useState } from 'react';
import { Search, Shield, UserCheck, ShieldAlert, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { getAllUsers, updateUserRole, BOOTSTRAP_ADMIN_EMAIL } from '../../services/auth';
import { UserProfile, UserRole } from '../../types';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useToast } from '../../components/Toast';
import { SEO } from '../../components/SEO';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'editor' | 'user'>('all');
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (err) {
      console.warn('Fallback users fetch:', err);
      showToast('Could not fetch user records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: UserRole, userEmail: string) => {
    if (userEmail.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() && newRole !== 'admin') {
      showToast('Primary administrator role cannot be demoted.', 'error');
      return;
    }

    setUpdatingUid(uid);
    try {
      await updateUserRole(uid, newRole);
      setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
      showToast(`User role updated to ${newRole}.`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Failed to update user role in Firestore.', 'error');
    } finally {
      setUpdatingUid(null);
    }
  };

  const filtered = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || (
      (u.displayName && u.displayName.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      u.uid.toLowerCase().includes(query)
    );
    return matchesRole && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="py-10 md:py-14">
        <SEO title="User Management & RBAC — Mental Tactic CMS" description="Manage user roles, editors, and community seekers." />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DC]">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal tracking-tight">
                Community & Permissions
              </h1>
              <p className="text-xs text-[#122B22]/70 font-sans mt-1">
                Oversee registered seekers, assign editor privileges, and enforce access control.
              </p>
            </div>

            <button
              onClick={fetchUsers}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#EBE6DC] bg-white text-xs font-semibold text-[#122B22] hover:bg-[#FAF7F2] transition-colors self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Roster</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-[#EBE6DC] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA595]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search seekers by name, email, or UID..."
                className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-full pl-11 pr-4 py-2.5 text-xs text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-full border border-[#EBE6DC] w-full md:w-auto overflow-x-auto">
              {(['all', 'admin', 'editor', 'user'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                    roleFilter === role
                      ? 'bg-[#122B22] text-[#FAF7F2]'
                      : 'text-[#122B22]/70 hover:text-[#122B22]'
                  }`}
                >
                  {role === 'all' ? 'All Roles' : role}
                </button>
              ))}
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE6DC] shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-xs text-[#8EA595] animate-pulse">
                Loading community members from Firestore...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <p className="text-sm font-serif text-[#122B22]">No seeker profiles found.</p>
                <p className="text-xs text-[#8EA595]">New users will appear here once they create accounts.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#F2ECE4] text-[11px] uppercase tracking-wider text-[#8EA595]">
                      <th className="pb-4 font-semibold">User Profile</th>
                      <th className="pb-4 font-semibold">Email</th>
                      <th className="pb-4 font-semibold">Assigned Role</th>
                      <th className="pb-4 font-semibold">Account UID</th>
                      <th className="pb-4 font-semibold text-right">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE4]">
                    {filtered.map(u => {
                      const isPrimaryAdmin = u.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

                      return (
                        <tr key={u.uid} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              {u.photoURL ? (
                                <img
                                  src={u.photoURL}
                                  alt=""
                                  className="w-9 h-9 rounded-full object-cover border border-[#EBE6DC]"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-[#122B22] text-[#B8E0D2] flex items-center justify-center font-serif font-bold text-sm">
                                  {u.displayName?.charAt(0) || u.email?.charAt(0) || 'U'}
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-[#122B22] flex items-center gap-1.5">
                                  <span>{u.displayName || 'Mindful Seeker'}</span>
                                  {isPrimaryAdmin && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                                      Primary
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#8EA595]">
                                  {u.bio || 'Seeker of stillness & clarity'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 pr-4 text-xs font-mono text-[#6F8A77]">
                            {u.email}
                          </td>

                          <td className="py-4 pr-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 ${
                              u.role === 'admin'
                                ? 'bg-[#122B22] text-[#B8E0D2]'
                                : u.role === 'editor'
                                ? 'bg-[#FAF7F2] text-[#6F8A77] border border-[#EBE6DC]'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {u.role === 'admin' ? <Shield className="w-3 h-3 text-[#B8E0D2]" /> : <UserCheck className="w-3 h-3 text-[#6F8A77]" />}
                              <span>{u.role || 'user'}</span>
                            </span>
                          </td>

                          <td className="py-4 pr-4 font-mono text-[11px] text-[#8EA595] truncate max-w-[130px]">
                            {u.uid}
                          </td>

                          <td className="py-4 text-right">
                            {isPrimaryAdmin ? (
                              <span className="text-[11px] text-[#8EA595] italic font-sans pr-2">
                                Protected Primary Admin
                              </span>
                            ) : (
                              <select
                                value={u.role || 'user'}
                                disabled={updatingUid === u.uid}
                                onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole, u.email)}
                                className="bg-[#FAF7F2] border border-[#EBE6DC] rounded-xl px-3 py-1.5 text-xs text-[#122B22] font-semibold focus:outline-none focus:border-[#8EA595] disabled:opacity-50"
                              >
                                <option value="user">Seeker (User)</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Administrator</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
