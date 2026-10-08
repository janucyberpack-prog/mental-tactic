import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, FileText, CheckCircle2, Clock, Users, Shield } from 'lucide-react';
import { getAllPostsAdmin } from '../../services/posts';
import { Post } from '../../types';
import { SEO } from '../../components/SEO';

export const AdminOverview: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAllPostsAdmin();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 md:py-20 text-[#122B22]">
      <SEO title="Admin Studio" description="Editorial management for Mental Tactic." />

      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#EBE6DC]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E27D60] mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Editorial Studio</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal">
              Mental Tactic CMS
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/posts/new"
              className="px-5 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </Link>
            <Link
              to="/admin/posts"
              className="px-5 py-2.5 rounded-full bg-white border border-[#EBE6DC] text-[#122B22] text-xs font-semibold uppercase tracking-wider hover:border-[#8EA595] transition-all"
            >
              Posts
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#122B22] border border-[#EBE6DC]">
              <FileText className="w-5 h-5 text-[#6F8A77]" />
            </div>
            <div className="text-3xl font-serif text-[#122B22]">{posts.length}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8EA595]">Total Articles</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#122B22] border border-[#EBE6DC]">
              <CheckCircle2 className="w-5 h-5 text-[#122B22]" />
            </div>
            <div className="text-3xl font-serif text-[#122B22]">{publishedCount}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8EA595]">Published Online</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#122B22] border border-[#EBE6DC]">
              <Clock className="w-5 h-5 text-[#E27D60]" />
            </div>
            <div className="text-3xl font-serif text-[#122B22]">{draftCount}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8EA595]">Drafts Pending</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#122B22] border border-[#EBE6DC]">
              <Users className="w-5 h-5 text-[#C8B6DB]" />
            </div>
            <div className="text-3xl font-serif text-[#122B22]">
              <Link to="/admin/users" className="hover:underline">
                View
              </Link>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8EA595]">Community Users</div>
          </div>
        </div>

        {/* Recent Articles Table / List */}
        <div className="bg-white rounded-3xl p-8 border border-[#EBE6DC] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-[#122B22]">Recent Journal Entries</h3>
            <Link
              to="/admin/posts"
              className="text-xs font-semibold uppercase tracking-wider text-[#6F8A77] hover:text-[#122B22]"
            >
              View Full Table →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F2ECE4] text-xs uppercase tracking-wider text-[#8EA595]">
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Author</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4]">
                {posts.slice(0, 5).map((post) => (
                  <tr key={post.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="font-medium text-[#122B22]">{post.title}</div>
                      <div className="text-xs text-[#8EA595]">{post.slug}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-[#FAF7F2] border border-[#EBE6DC] text-[#6F8A77]">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        post.status === 'published'
                          ? 'bg-[#B8E0D2]/50 text-[#122B22]'
                          : 'bg-[#FAF7F2] text-[#8EA595]'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-xs text-[#6F8A77]">{post.authorName}</td>
                    <td className="py-4 text-right">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="text-xs font-semibold text-[#122B22] hover:text-[#6F8A77] underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
