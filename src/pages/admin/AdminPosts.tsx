import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, Globe, EyeOff, Search, ExternalLink, Filter, Sparkles } from 'lucide-react';
import { getAllPostsAdmin, deletePost, updatePost } from '../../services/posts';
import { Post, PostStatus } from '../../types';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useToast } from '../../components/Toast';
import { SEO } from '../../components/SEO';

const CATEGORIES = [
  'All',
  'Mindfulness',
  'Rest & Renewal',
  'Emotional Agility',
  'Neuroscience',
  'Daily Rituals'
];

export const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPostsAdmin();
      setPosts(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load articles from Firestore.', 'error');
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
      showToast(`Article status updated to ${nextStatus}.`, 'success');
    } catch (err) {
      showToast('Unable to update article status.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
      setDeleteModalId(null);
      showToast('Article permanently deleted.', 'info');
    } catch (err) {
      showToast('Failed to delete article.', 'error');
    }
  };

  const filtered = posts.filter(post => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || (
      post.title.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query) ||
      (post.authorName && post.authorName.toLowerCase().includes(query))
    );
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="py-10 md:py-14">
        <SEO title="Articles & Essays — Mental Tactic CMS" description="Manage all journal entries, publication states, and drafts." />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DC]">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal tracking-tight">
                Journal Articles
              </h1>
              <p className="text-xs text-[#122B22]/70 font-sans mt-1">
                Manage, edit, publish, or archive your contemplative reflections.
              </p>
            </div>

            <Link
              to="/admin/articles/new"
              className="px-6 py-3 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </Link>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-3xl p-5 border border-[#EBE6DC] shadow-sm flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA595]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, slug, category, or author..."
                className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-full pl-11 pr-4 py-2.5 text-xs text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
              />
            </div>

            {/* Category Dropdown & Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#EBE6DC] rounded-full px-3.5 py-2 text-xs font-medium text-[#122B22] focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>

              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-full border border-[#EBE6DC]">
                {(['all', 'published', 'draft', 'archived'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors capitalize ${
                      statusFilter === status
                        ? 'bg-[#122B22] text-[#FAF7F2] shadow-xs'
                        : 'text-[#122B22]/70 hover:text-[#122B22]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE6DC] shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-xs text-[#8EA595] animate-pulse">
                Fetching journal collection from Firestore...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <p className="text-sm font-serif text-[#122B22]">No articles found matching your criteria.</p>
                <button
                  onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('All'); }}
                  className="px-4 py-2 rounded-full border border-[#EBE6DC] text-xs font-semibold text-[#122B22] hover:bg-[#FAF7F2]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#F2ECE4] text-[11px] uppercase tracking-wider text-[#8EA595]">
                      <th className="pb-4 font-semibold">Article</th>
                      <th className="pb-4 font-semibold">Category</th>
                      <th className="pb-4 font-semibold">Status</th>
                      <th className="pb-4 font-semibold">Reading Time</th>
                      <th className="pb-4 font-semibold">Author</th>
                      <th className="pb-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE4]">
                    {filtered.map(post => (
                      <tr key={post.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            {post.coverImage && (
                              <img
                                src={post.coverImage}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#EBE6DC]"
                              />
                            )}
                            <div className="min-w-0">
                              <div className="font-medium text-[#122B22] truncate max-w-sm sm:max-w-md">
                                {post.title}
                              </div>
                              <div className="text-[11px] text-[#8EA595] truncate">
                                /journal/{post.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-[#FAF7F2] border border-[#EBE6DC] text-[#6F8A77]">
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
                            title="Click to toggle status"
                          >
                            {post.status === 'published' ? (
                              <Globe className="w-3 h-3 text-emerald-700" />
                            ) : (
                              <EyeOff className="w-3 h-3 text-amber-700" />
                            )}
                            <span>{post.status}</span>
                          </button>
                        </td>
                        <td className="py-4 pr-4 text-xs text-[#6F8A77]">
                          {post.readingTime} min
                        </td>
                        <td className="py-4 pr-4 text-xs text-[#6F8A77] truncate max-w-[120px]">
                          {post.authorName || 'Elena Vance'}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <Link
                              to={`/journal/${post.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#6F8A77] hover:text-[#122B22]"
                              title="View Live Article"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/admin/articles/${post.id}/edit`}
                              className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#122B22]"
                              title="Edit Article"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteModalId(post.id)}
                              className="p-1.5 rounded-full hover:bg-red-50 text-red-600"
                              title="Delete Article"
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
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteModalId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#EBE6DC] shadow-2xl space-y-4">
                <h3 className="font-serif text-2xl text-[#122B22]">Delete Reflection?</h3>
                <p className="text-xs text-[#122B22]/70 leading-relaxed font-sans">
                  This will permanently delete this article from your Cloud Firestore database. This action cannot be reversed.
                </p>
                <div className="flex items-center justify-end gap-3 pt-3">
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
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
