import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, Globe, EyeOff, ArrowLeft, Search } from 'lucide-react';
import { getAllPostsAdmin, deletePost, updatePost } from '../../services/posts';
import { Post, PostStatus } from '../../types';
import { useToast } from '../../components/Toast';
import { SEO } from '../../components/SEO';

export const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPostsAdmin();
      setPosts(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load posts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTogglePublish = async (post: Post) => {
    const nextStatus: PostStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await updatePost(post.id, { status: nextStatus });
      setPosts(posts.map(p => p.id === post.id ? { ...p, status: nextStatus } : p));
      showToast(`Post is now ${nextStatus}.`, 'success');
    } catch (err) {
      showToast('Unable to update post status.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
      setDeleteModalId(null);
      showToast('Post removed successfully.', 'info');
    } catch (err) {
      showToast('Failed to delete post.', 'error');
    }
  };

  const filtered = posts.filter(post => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || (
      post.title.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query)
    );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 md:py-20 text-[#122B22]">
      <SEO title="Manage Articles" description="Editorial management for Mental Tactic." />

      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6F8A77] hover:text-[#122B22]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal">
              Posts
            </h1>
          </div>

          <Link
            to="/admin/posts/new"
            className="px-6 py-3 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </Link>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA595]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category..."
              className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-full pl-11 pr-4 py-2.5 text-xs text-[#122B22] focus:outline-none focus:border-[#8EA595]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {(['all', 'published', 'draft', 'archived'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-[#122B22] text-[#FAF7F2]'
                    : 'bg-[#FAF7F2] text-[#122B22]/70 hover:bg-[#EAE5DB]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-3xl p-8 border border-[#EBE6DC] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F2ECE4] text-xs uppercase tracking-wider text-[#8EA595]">
                  <th className="pb-4 font-semibold">Post Details</th>
                  <th className="pb-4 font-semibold">Category</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Reading Time</th>
                  <th className="pb-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4]">
                {filtered.map(post => (
                  <tr key={post.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="font-semibold text-[#122B22] max-w-md truncate">{post.title}</div>
                      <div className="text-xs text-[#8EA595] truncate">/journal/{post.slug}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-[#FAF7F2] border border-[#EBE6DC] text-[#6F8A77]">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                          post.status === 'published'
                            ? 'bg-[#B8E0D2]/50 text-[#122B22] hover:bg-[#B8E0D2]'
                            : 'bg-[#FAF7F2] text-[#8EA595] hover:bg-[#EAE5DB]'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {post.status === 'published' ? <Globe className="w-3 h-3 text-emerald-700" /> : <EyeOff className="w-3 h-3 text-amber-700" />}
                        <span>{post.status}</span>
                      </button>
                    </td>
                    <td className="py-4 pr-4 text-xs text-[#6F8A77]">
                      {post.readingTime} min
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/journal/${post.slug}`}
                          target="_blank"
                          className="text-xs text-[#6F8A77] hover:text-[#122B22]"
                          title="View live article"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/posts/${post.id}/edit`}
                          className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#122B22]"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModalId(post.id)}
                          className="p-1.5 rounded-full hover:bg-red-50 text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#EBE6DC] shadow-2xl space-y-4">
              <h3 className="font-serif text-2xl text-[#122B22]">Delete Reflection?</h3>
              <p className="text-xs text-[#122B22]/70 leading-relaxed">
                This will permanently delete this article from your Firestore database. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#122B22] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModalId)}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
