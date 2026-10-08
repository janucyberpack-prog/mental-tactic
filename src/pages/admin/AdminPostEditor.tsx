import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Image as ImageIcon,
  Sparkles,
  Check,
  Clock,
  Trash2,
  AlertTriangle,
  Upload,
  HardDrive,
  Loader2,
  Plus
} from 'lucide-react';
import { createPost, updatePost, getPostById, deletePost } from '../../services/posts';
import { uploadPostImageToFirestore } from '../../services/media';
import { Post, PostStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { PostImageUploader } from '../../components/admin/PostImageUploader';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const [isInlineUploading, setIsInlineUploading] = useState(false);

  // Helper to insert markdown image directly into essay content
  const handleInsertIntoContent = (markdownImg: string) => {
    const textarea = contentTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + markdownImg + content.substring(end);
      setContent(newContent);
      const words = newContent.trim().split(/\s+/).length;
      setReadingTime(Math.max(1, Math.ceil(words / 200)));
    } else {
      const newContent = content ? `${content}\n\n${markdownImg}` : markdownImg;
      setContent(newContent);
      const words = newContent.trim().split(/\s+/).length;
      setReadingTime(Math.max(1, Math.ceil(words / 200)));
    }
  };

  const handleInlineDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsInlineUploading(true);
    try {
      const savedMedia = await uploadPostImageToFirestore(file, {
        postId: id,
        caption: file.name.replace(/\.[^/.]+$/, ''),
        userId: user?.uid,
        userEmail: user?.email || undefined
      });

      const markdownImg = `\n\n![${file.name.replace(/\.[^/.]+$/, '')}](${savedMedia.dataUrl})\n\n`;
      handleInsertIntoContent(markdownImg);
      showToast(`Image "${file.name}" saved to Firestore & inserted into essay body!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to upload image.', 'error');
    } finally {
      setIsInlineUploading(false);
      if (inlineFileInputRef.current) {
        inlineFileInputRef.current.value = '';
      }
    }
  };

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
          showToast('Failed to load article for editing.', 'error');
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
      showToast('Please provide a title, URL slug, and article content.', 'error');
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
        showToast('Article updated and saved to Firestore.', 'success');
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
        showToast('New article published to Firestore collection.', 'success');
      }
      navigate('/admin/articles');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error saving article to Firestore.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deletePost(id);
      showToast('Article permanently deleted from Firestore.', 'info');
      navigate('/admin/articles');
    } catch (err: any) {
      console.error('Delete post error:', err);
      showToast('Failed to delete article. Check permissions.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="py-10 md:py-14">
        <SEO title={isEditing ? 'Edit Reflection — CMS' : 'Write Reflection — CMS'} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DC]">
            <div className="space-y-1">
              <Link
                to="/admin/articles"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6F8A77] hover:text-[#122B22]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Articles</span>
              </Link>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal">
                {isEditing ? 'Edit Reflection' : 'Compose Reflection'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2.5 rounded-full border border-red-200 bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="Permanently delete this article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2.5 rounded-full border border-[#EBE6DC] bg-white text-xs font-semibold text-[#122B22] hover:bg-[#FAF7F2] transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-[#6F8A77]" />
                <span>{previewMode ? 'Editor Mode' : 'Live Preview'}</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Article'}</span>
              </button>
            </div>
          </div>

          {/* Live Preview Mode */}
          {previewMode ? (
            <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#EBE6DC] shadow-sm max-w-3xl mx-auto space-y-8">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#B8E0D2]/40 text-[#122B22]">
                  {category}
                </span>
                <span className="text-xs text-[#8EA595] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {readingTime} min read
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#122B22] leading-tight">
                {title || 'Untitled Reflection'}
              </h1>
              {excerpt && (
                <p className="text-lg text-[#122B22]/75 leading-relaxed italic border-l-2 border-[#122B22] pl-4">
                  {excerpt}
                </p>
              )}
              {coverImage && (
                <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#EBE6DC]">
                  <img src={coverImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-6 text-[#122B22]/85 text-base sm:text-lg leading-relaxed font-sans">
                {(content || 'Article content will appear here...').split('\n\n').map((para, idx) => {
                  const imgMatch = para.match(/^!\[(.*?)\]\((.*?)\)$/);
                  if (imgMatch) {
                    return (
                      <figure key={idx} className="my-6 rounded-2xl overflow-hidden border border-[#EBE6DC] bg-white">
                        <img src={imgMatch[2]} alt={imgMatch[1] || ''} className="w-full max-h-96 object-cover" />
                        {imgMatch[1] && (
                          <figcaption className="text-center text-xs text-[#8EA595] py-2 px-4 italic">
                            {imgMatch[1]}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                  if (para.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="font-serif text-2xl text-[#122B22] pt-2">
                        {para.replace('### ', '')}
                      </h3>
                    );
                  }
                  return <p key={idx}>{para}</p>;
                })}
              </div>
            </div>
          ) : (
            /* Form Mode */
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
                        placeholder="e.g. The Architecture of Stillness"
                        className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl px-4 py-3 text-lg text-[#122B22] font-serif focus:outline-none focus:border-[#8EA595]"
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
                        Excerpt / Contemplative Summary
                      </label>
                      <textarea
                        rows={3}
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="A short meditative hook that previews this reflection in cards and feeds..."
                        className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl p-4 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] resize-none leading-relaxed"
                      />
                    </div>

                    {/* Hidden inline device file input */}
                    <input
                      type="file"
                      ref={inlineFileInputRef}
                      onChange={handleInlineDeviceUpload}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                    />

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                          Full Essay Body
                        </label>
                        <button
                          type="button"
                          disabled={isInlineUploading}
                          onClick={() => inlineFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#122B22] bg-[#FAF7F2] hover:bg-[#EBE6DC] px-3 py-1 rounded-full border border-[#EBE6DC] transition-colors"
                          title="Choose an image from device storage and save to Firestore"
                        >
                          {isInlineUploading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#122B22]" />
                              <span>Saving to Firestore...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5 text-[#6F8A77]" />
                              <span>Add Image from Device</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        ref={contentTextareaRef}
                        rows={16}
                        required
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Write your contemplative essay here. Paragraph breaks are formatted automatically for readers..."
                        className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl p-4 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] font-sans leading-relaxed"
                      />
                      <p className="text-[11px] text-[#8EA595] flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        <span>Images uploaded from device storage are compressed and stored directly in Cloud Firestore.</span>
                      </p>
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
                        placeholder="Clarity, Breath, Rest, Stillness"
                        className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl px-4 py-2 text-xs text-[#122B22] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#F2ECE4]">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-[#122B22] focus:ring-0"
                      />
                      <label htmlFor="featured" className="text-xs font-medium text-[#122B22]">
                        Feature on Homepage Hero Grid
                      </label>
                    </div>
                  </div>

                  {/* Device Storage & Firestore Cover Artwork Selector */}
                  <PostImageUploader
                    currentCoverImage={coverImage}
                    onSelectCoverImage={setCoverImage}
                    onInsertIntoContent={handleInsertIntoContent}
                    presetImages={PRESET_IMAGES}
                    postId={id}
                  />
                </div>
              </div>
            </form>
          )}

          {/* Delete Article Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EBE6DC] shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl text-[#122B22]">Delete Reflection?</h3>
                  <p className="text-xs text-[#122B22]/80 leading-relaxed font-sans">
                    Are you sure you want to permanently delete{' '}
                    <span className="font-semibold text-[#122B22]">"{title || 'this reflection'}"</span>?
                  </p>
                </div>

                <p className="text-[11px] text-[#8EA595] leading-relaxed">
                  This will remove the article from your Cloud Firestore database and take down its public URL. This action cannot be reversed.
                </p>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    disabled={isDeleting}
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#122B22] hover:bg-[#FAF7F2] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
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
