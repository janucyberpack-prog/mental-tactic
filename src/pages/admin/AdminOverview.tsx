import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  Users,
  Mail,
  MessageSquare,
  Plus,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Database,
  ShieldCheck,
  TrendingUp,
  Globe
} from 'lucide-react';
import { getAllPostsAdmin } from '../../services/posts';
import { getAllUsers } from '../../services/auth';
import { getAllSubscribers, getAllContactMessages } from '../../services/interactions';
import { Post, UserProfile, NewsletterSubscription, ContactMessage } from '../../types';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SEO } from '../../components/SEO';

export const AdminOverview: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscription[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [postsData, usersData, subsData, msgsData] = await Promise.all([
          getAllPostsAdmin().catch(() => []),
          getAllUsers().catch(() => []),
          getAllSubscribers().catch(() => []),
          getAllContactMessages().catch(() => [])
        ]);
        setPosts(postsData);
        setUsers(usersData);
        setSubscribers(subsData);
        setMessages(msgsData);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <AdminLayout>
      <div className="py-10 md:py-14">
        <SEO title="Editorial Studio — Dashboard" description="Mental Tactic CMS overview and publishing metrics." />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EBE6DC]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#6F8A77]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sanctuary Command Center</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal tracking-tight">
                Editorial Studio
              </h1>
              <p className="text-xs text-[#122B22]/70 font-sans max-w-xl leading-relaxed">
                Curate stillness, publish contemplative essays, foster community, and oversee reader correspondence.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/articles/new"
                className="px-5 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Write Article</span>
              </Link>
              <Link
                to="/"
                target="_blank"
                className="px-4 py-2.5 rounded-full bg-white border border-[#EBE6DC] text-[#122B22] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#6F8A77]" />
              </Link>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Link
              to="/admin/articles"
              className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm hover:shadow-md hover:border-[#8EA595] transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#122B22] border border-[#EBE6DC]">
                  <FileText className="w-5 h-5 text-[#6F8A77]" />
                </div>
                <span className="text-[11px] text-[#6F8A77] font-semibold group-hover:translate-x-0.5 transition-transform">
                  View →
                </span>
              </div>
              <div>
                <div className="text-3xl font-serif text-[#122B22]">{posts.length}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8EA595]">Total Articles</div>
              </div>
              <div className="text-[11px] text-[#122B22]/60 pt-1 border-t border-[#F2ECE4] flex items-center justify-between">
                <span>{publishedCount} Published</span>
                <span>{draftCount} Drafts</span>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm hover:shadow-md hover:border-[#8EA595] transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#122B22] border border-[#EBE6DC]">
                  <Users className="w-5 h-5 text-[#C9BEF6]" />
                </div>
                <span className="text-[11px] text-[#6F8A77] font-semibold group-hover:translate-x-0.5 transition-transform">
                  View →
                </span>
              </div>
              <div>
                <div className="text-3xl font-serif text-[#122B22]">{users.length}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8EA595]">Seekers & Users</div>
              </div>
              <div className="text-[11px] text-[#122B22]/60 pt-1 border-t border-[#F2ECE4]">
                Registered profiles in Firestore
              </div>
            </Link>

            <Link
              to="/admin/subscribers"
              className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm hover:shadow-md hover:border-[#8EA595] transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#122B22] border border-[#EBE6DC]">
                  <Mail className="w-5 h-5 text-[#F1B995]" />
                </div>
                <span className="text-[11px] text-[#6F8A77] font-semibold group-hover:translate-x-0.5 transition-transform">
                  View →
                </span>
              </div>
              <div>
                <div className="text-3xl font-serif text-[#122B22]">{subscribers.length}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8EA595]">Subscribers</div>
              </div>
              <div className="text-[11px] text-[#122B22]/60 pt-1 border-t border-[#F2ECE4]">
                Newsletter readership
              </div>
            </Link>

            <Link
              to="/admin/messages"
              className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm hover:shadow-md hover:border-[#8EA595] transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#122B22] border border-[#EBE6DC]">
                  <MessageSquare className="w-5 h-5 text-[#6F8A77]" />
                </div>
                {unreadMessagesCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E27D60] text-white">
                    {unreadMessagesCount} New
                  </span>
                ) : (
                  <span className="text-[11px] text-[#6F8A77] font-semibold">View →</span>
                )}
              </div>
              <div>
                <div className="text-3xl font-serif text-[#122B22]">{messages.length}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8EA595]">Inquiries</div>
              </div>
              <div className="text-[11px] text-[#122B22]/60 pt-1 border-t border-[#F2ECE4]">
                {unreadMessagesCount} awaiting response
              </div>
            </Link>
          </div>

          {/* Quick Shortcuts & Database Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE6DC] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-serif text-2xl text-[#122B22]">Recent Journal Entries</h3>
                  <p className="text-xs text-[#8EA595]">Recently published and pending reflections</p>
                </div>
                <Link
                  to="/admin/articles"
                  className="text-xs font-semibold uppercase tracking-wider text-[#6F8A77] hover:text-[#122B22] flex items-center gap-1"
                >
                  <span>All Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-[#8EA595] animate-pulse">
                  Loading editorial data from Firestore...
                </div>
              ) : posts.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <p className="text-xs text-[#8EA595]">No reflections found in Firestore collection.</p>
                  <Link
                    to="/admin/articles/new"
                    className="inline-block px-4 py-2 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider"
                  >
                    Draft First Article
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#F2ECE4] text-[11px] uppercase tracking-wider text-[#8EA595]">
                        <th className="pb-3 font-semibold">Title</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE4]">
                      {posts.slice(0, 5).map((post) => (
                        <tr key={post.id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3.5 pr-4">
                            <div className="font-medium text-[#122B22] max-w-xs truncate">{post.title}</div>
                            <div className="text-[11px] text-[#8EA595] truncate">/journal/{post.slug}</div>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className="px-2.5 py-0.5 rounded-full text-xs bg-[#FAF7F2] border border-[#EBE6DC] text-[#6F8A77]">
                              {post.category}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              post.status === 'published'
                                ? 'bg-[#B8E0D2]/50 text-[#122B22]'
                                : 'bg-[#FAF7F2] text-[#8EA595]'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            <Link
                              to={`/admin/articles/${post.id}/edit`}
                              className="text-xs font-semibold text-[#122B22] hover:text-[#6F8A77] underline"
                            >
                              Edit
                            </Link>
                            <Link
                              to={`/journal/${post.slug}`}
                              target="_blank"
                              className="text-xs text-[#8EA595] hover:text-[#122B22]"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions & System Info */}
            <div className="space-y-6">
              {/* Quick Actions Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm space-y-4">
                <h4 className="font-serif text-lg text-[#122B22]">Editorial Shortcuts</h4>
                <div className="space-y-2">
                  <Link
                    to="/admin/articles/new"
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#EAE5DB] transition-colors text-xs font-semibold text-[#122B22]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Plus className="w-4 h-4 text-[#6F8A77]" />
                      <span>Create New Article</span>
                    </div>
                    <span className="text-[#8EA595]">→</span>
                  </Link>

                  <Link
                    to="/admin/users"
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#EAE5DB] transition-colors text-xs font-semibold text-[#122B22]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#6F8A77]" />
                      <span>Manage Roles & Permissions</span>
                    </div>
                    <span className="text-[#8EA595]">→</span>
                  </Link>

                  <Link
                    to="/admin/subscribers"
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#EAE5DB] transition-colors text-xs font-semibold text-[#122B22]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#6F8A77]" />
                      <span>Export Subscriber List</span>
                    </div>
                    <span className="text-[#8EA595]">→</span>
                  </Link>

                  <Link
                    to="/admin/settings"
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#EAE5DB] transition-colors text-xs font-semibold text-[#122B22]"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#6F8A77]" />
                      <span>Admin Security & Password</span>
                    </div>
                    <span className="text-[#8EA595]">→</span>
                  </Link>
                </div>
              </div>

              {/* Database & Cloud Health */}
              <div className="bg-[#122B22] text-[#FAF7F2] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#B8E0D2]" />
                    <span className="font-serif text-base">Firebase Cloud Status</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#FAF7F2]/75 font-sans">
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-[#8EA595]">Project</span>
                    <span className="font-mono text-[11px] text-[#FAF7F2]">mental-tactic-65c43</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-[#8EA595]">Database</span>
                    <span>Cloud Firestore</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8EA595]">Auth Engine</span>
                    <span>Firebase Auth (RBAC)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
