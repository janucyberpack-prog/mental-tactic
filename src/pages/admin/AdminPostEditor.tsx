import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { createPost, updatePost, getPostById } from '../../services/posts';
import { Post, PostStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { SEO } from '../../components/SEO';

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80"
];

const CATEGORIES = [
  'Mindfulness',
  'Rest & Renewal',
  'Emotional Agility',
  'Neuroscience',
  'Daily Rituals'
];

export const AdminPostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0]);
  const [status, setStatus] = useState<PostStatus>('published');
  const [featured, setFeatured] = useState(false);
  const [readingTime, setReadingTime] = useState(4);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const fetchPost = async () => {
        setLoading(true);
        try {
          const post = await getPostById(id);
          if (post) {
            setTitle(post.title);
            setSlug(post.slug);
            setExcerpt(post.excerpt);
            setContent(post.content);
            setCategory(post.category);
            setTagsInput(post.tags ? post.tags.join(', ') : '');
            setCoverImage(post.coverImage);
            setStatus(post.status);
            setFeatured(post.featured);
            setReadingTime(post.readingTime);
          }
        } catch (err) {
          showToast('Failed to load post for editing.', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditing]);

  // Auto generate slug from title if new
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Recalculate reading time on content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    const words = val.trim().split(/\s+/).length;
    setReadingTime(Math.max(1, Math.ceil(words / 200)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      showToast('Please fill in title, slug, and content.', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    setLoading(true);
    try {
      if (isEditing && id) {
        await updatePost(id, {
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          category,
          tags,
          coverImage,
          status,
          featured,
          readingTime
        });
        showToast('Reflection updated successfully.', 'success');
      } else {
        await createPost({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          category,
          tags,
          coverImage,
          authorId: user?.uid || 'editorial',
          authorName: profile?.displayName || 'Elena Vance',
          authorPhoto: profile?.photoURL || '',
          status,
          featured,
          readingTime
        });
        showToast('Reflection created and preserved.', 'success');
      }
      navigate('/admin/posts');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error saving post.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 md:py-20 text-[#122B22]">
      <SEO title={isEditing ? 'Edit Reflection' : 'Write Reflection'} />

      <div className="max-w-5xl mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DC]">
          <div className="space-y-1">
            <Link
              to="/admin/posts"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6F8A77] hover:text-[#122B22]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Posts
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2.5 rounded-full border border-[#EBE6DC] bg-white text-xs font-semibold text-[#122B22] hover:bg-[#FAF7F2] transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-[#6F8A77]" />
              <span>{previewMode ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Live Preview Mode */}
        {previewMode ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EBE6DC] shadow-sm max-w-3xl mx-auto space-y-8">
            <div className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-[#B8E0D2]/40 text-[#122B22]">
              {category}
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#122B22] leading-tight">
              {title || 'Untitled Reflection'}
            </h1>
            <p className="text-lg text-[#122B22]/70 leading-relaxed italic">
              {excerpt || 'No excerpt written yet.'}
            </p>
            {coverImage && (
              <img src={coverImage} alt="" className="w-full h-80 object-cover rounded-2xl" />
            )}
            <div className="prose text-[#122B22]/85 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {content || 'Article content will appear here...'}
            </div>
          </div>
        ) : (
          /* Form Controls */
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Content Area (2 cols) */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE6DC] shadow-sm space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                      Article Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={handleTitleChange}
                      placeholder="e.g. The Architecture of a Slow Morning"
                      className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl px-4 py-3 text-base text-[#122B22] font-serif focus:outline-none focus:border-[#8EA595]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                      URL Slug
                    </label>
                    <div className="flex items-center bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl px-4 py-3 text-xs text-[#6F8A77]">
                      <span>/journal/</span>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="bg-transparent text-[#122B22] font-medium focus:outline-none w-full ml-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                      Excerpt / Summary
                    </label>
                    <textarea
                      rows={3}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="A short contemplative hook summarizing the reflection..."
                      className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl p-4 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                      Full Article Body
                    </label>
                    <textarea
                      rows={14}
                      required
                      value={content}
                      onChange={handleContentChange}
                      placeholder="Write your long-form essay here. Use ### for subheadings, * for bullet lists..."
                      className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl p-4 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] font-sans leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar Settings (1 col) */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm space-y-5">
                  <h3 className="font-serif text-lg text-[#122B22]">Publication Settings</h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PostStatus)}
                      className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl px-4 py-2.5 text-xs text-[#122B22] focus:outline-none focus:border-[#8EA595]"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl px-4 py-2.5 text-xs text-[#122B22] focus:outline-none focus:border-[#8EA595]"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                      Estimated Reading Time (min)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={readingTime}
                      onChange={(e) => setReadingTime(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl px-4 py-2 text-xs text-[#122B22] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Focus, Clarity, Sleep"
                      className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl px-4 py-2 text-xs text-[#122B22] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#122B22] focus:ring-0"
                    />
                    <label htmlFor="featured" className="text-xs font-medium text-[#122B22]">
                      Feature on Home Page
                    </label>
                  </div>
                </div>

                {/* Cover Image Selector */}
                <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm space-y-4">
                  <h3 className="font-serif text-lg text-[#122B22] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#6F8A77]" />
                    <span>Cover Artwork</span>
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl px-3 py-2 text-xs text-[#122B22] focus:outline-none"
                    />
                  </div>

                  {coverImage && (
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-[#EBE6DC]">
                      <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#8EA595] uppercase tracking-wider">
                      Sanctuary Presets
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_IMAGES.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCoverImage(imgUrl)}
                          className={`h-14 rounded-lg overflow-hidden border-2 transition-all ${
                            coverImage === imgUrl ? 'border-[#122B22] scale-95' : 'border-transparent hover:opacity-80'
                          }`}
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
