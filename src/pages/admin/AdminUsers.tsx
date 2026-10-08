import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Shield, UserCheck } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { SEO } from '../../components/SEO';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'users'));
        const userList = snap.docs.map(d => ({
          uid: d.id,
          ...d.data()
        })) as UserProfile[];
        setUsers(userList);
      } catch (err) {
        console.warn('Fallback users list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 md:py-20 text-[#122B22]">
      <SEO title="User Management" description="Review registered seekers and contributors." />

      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[#EBE6DC]">
          <div className="space-y-1">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6F8A77] hover:text-[#122B22]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal">
              Community Members & Roles
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#EBE6DC] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F2ECE4] text-xs uppercase tracking-wider text-[#8EA595]">
                  <th className="pb-4 font-semibold">User</th>
                  <th className="pb-4 font-semibold">Email</th>
                  <th className="pb-4 font-semibold">Role</th>
                  <th className="pb-4 font-semibold">UID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4]">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-[#8EA595]">
                      No user records found in collection yet.
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.uid} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E5ECE7] text-[#122B22] flex items-center justify-center font-bold text-xs">
                            {u.displayName?.charAt(0) || 'U'}
                          </div>
                          <span className="font-medium text-[#122B22]">{u.displayName || 'Anonymous Seeker'}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-xs text-[#6F8A77]">{u.email}</td>
                      <td className="py-4 pr-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-[#122B22] text-[#B8E0D2]'
                            : 'bg-[#FAF7F2] text-[#6F8A77] border border-[#EBE6DC]'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-[11px] text-[#8EA595] truncate max-w-[120px]">
                        {u.uid}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
