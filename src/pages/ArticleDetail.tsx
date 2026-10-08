import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Bookmark, Share2, ArrowLeft, ArrowRight, MessageSquare, Trash2, Copy, Check, Send } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ArticleSkeleton } from '../components/Skeletons';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getPostBySlug, getPublishedPosts, savePost, removeSavedPost, isPostSaved } from '../services/posts';
import { getCommentsForPost, addComment, deleteComment } from '../services/comments';
import { Post, Comment } from '../types';

export const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, profile, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadArticle = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getPostBySlug(slug);
        setPost(found);

        const list = await getPublishedPosts();
        setAllPosts(list);

        if (found) {
          const coms = await getCommentsForPost(found.id);
          setComments(coms);

          if (user) {
            const hasSaved = await isPostSaved(user.uid, found.id);
            setSaved(hasSaved);
          }
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug, user]);

  const handleToggleSave = async () => {
    if (!user || !post) {
      showToast('Please sign in to bookmark stories.', 'info');
      return;
    }

    try {
      if (saved) {
        await removeSavedPost(user.uid, post.id);
        setSaved(false);
        showToast('Removed from saved.', 'info');
      } else {
        await savePost(user.uid, post);
        setSaved(true);
        showToast('Saved to sanctuary.', 'success');
      }
    } catch (err) {
      showToast('Failed to update bookmark.', 'error');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    showToast('Link copied.', 'success');
    setTimeout(() => setShareCopied(false), 3000);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !post) {
      showToast('Please sign in to leave a reflection.', 'info');
      return;
    }

    if (newComment.trim().length < 3) {
      showToast('Please write a message.', 'error');
      return;
    }

    setCommentSubmitting(true);
    try {
      const commentId = await addComment(post.id, newComment, profile);
      const newCommentObj: Comment = {
        id: commentId,
        postId: post.id,
        authorId: profile.uid,
        authorName: profile.displayName,
        authorPhoto: profile.photoURL,
        content: newComment.trim(),
        createdAt: new Date().toISOString()
      };
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      showToast('Reflection shared.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Unable to post comment.', 'error');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      showToast('Comment removed.', 'info');
    } catch (err) {
      showToast('Unable to remove comment.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16" style={{ backgroundColor: 'var(--paper)' }}>
        <ArticleSkeleton />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
        <div className="max-w-md space-y-4">
          <h2 className="serif text-3xl">Story not found</h2>
          <p className="text-sm opacity-70">
            This note may have moved or does not exist.
          </p>
          <Link
            to="/journal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '999px',
              backgroundColor: 'var(--ink)',
              color: 'var(--white)',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <ArrowLeft style={{ width: '15px', height: '15px' }} /> Return to stories
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = allPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <article className="min-h-screen py-12 md:py-20" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.coverImage}
        type="article"
      />

      <div className="wrap" style={{ maxWidth: '840px' }}>
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/journal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--dark)'
            }}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            <span>Stories</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6 text-center mb-12">
          <div
            style={{
              display: 'inline-block',
              padding: '5px 16px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              backgroundColor: 'var(--sage)',
              color: 'var(--ink)'
            }}
          >
            {post.category}
          </div>

          <h1
            className="serif"
            style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              lineHeight: 1.05,
              fontWeight: 400,
              margin: '0 auto',
              maxWidth: '780px'
            }}
          >
            {post.title}
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.65, color: 'rgba(24, 34, 29, 0.75)', maxWidth: '620px', margin: '0 auto' }}>
            {post.excerpt}
          </p>

          {/* Metadata */}
          <div
            className="flex items-center justify-between pt-6 text-xs"
            style={{ borderTop: '1px solid var(--line)', color: 'var(--dark)', fontWeight: 600 }}
          >
            <div className="flex items-center gap-3">
              <span>{post.authorName}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock style={{ width: '13px', height: '13px' }} />
                {post.readingTime} min read
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSave}
                aria-label="Save reflection"
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  border: '1px solid var(--line)',
                  backgroundColor: saved ? 'var(--ink)' : 'var(--white)',
                  color: saved ? 'var(--white)' : 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                <Bookmark style={{ width: '15px', height: '15px', fill: saved ? 'currentColor' : 'none' }} />
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                aria-label="Share story"
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--white)',
                  color: 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                <Share2 style={{ width: '15px', height: '15px' }} />
              </button>
            </div>
          </div>
        </header>

        {/* Cover Artwork */}
        <div
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '48px',
            border: '1px solid var(--line)',
            maxHeight: '480px'
          }}
        >
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Article Body */}
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '17px', lineHeight: 1.85, color: 'rgba(24, 34, 29, 0.88)' }} className="space-y-6">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="serif" style={{ fontSize: '28px', color: 'var(--ink)', paddingTop: '20px', margin: '0 0 10px' }}>
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('* ') || paragraph.startsWith('1. ')) {
                const lines = paragraph.split('\n');
                return (
                  <ul key={idx} style={{ paddingLeft: '20px', borderLeft: '2px solid var(--sage)', margin: '20px 0' }} className="space-y-2">
                    {lines.map((line, lIdx) => (
                      <li key={lIdx}>{line.replace(/^(\* |\d+\. )/, '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx} style={{ margin: 0 }}>{paragraph}</p>;
            })}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-8 mt-12" style={{ borderTop: '1px solid var(--line)' }}>
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--line)',
                    color: 'var(--dark)'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: '24px',
                padding: '24px',
                maxWidth: '340px',
                width: '100%',
                border: '1px solid var(--line)',
                boxShadow: '0 16px 36px rgba(0,0,0,0.15)'
              }}
            >
              <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: '1px solid var(--line)' }}>
                <h4 className="serif" style={{ fontSize: '18px', margin: 0 }}>Share note</h4>
                <button
                  onClick={() => setShowShareModal(false)}
                  style={{ fontSize: '12px', background: 'none', border: 0, cursor: 'pointer', color: 'var(--dark)' }}
                >
                  Close
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCopyLink}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--paper)',
                    border: 0,
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Copy style={{ width: '15px', height: '15px' }} /> Copy link
                  </span>
                  {shareCopied && <Check style={{ width: '15px', height: '15px', color: 'var(--dark)' }} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prev & Next */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-12 py-8"
          style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}
        >
          {prevPost ? (
            <Link
              to={`/journal/${prevPost.slug}`}
              style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--white)', border: '1px solid var(--line)' }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--dark)' }}>
                ← Previous
              </div>
              <div className="serif text-base line-clamp-1">{prevPost.title}</div>
            </Link>
          ) : <div />}

          {nextPost && (
            <Link
              to={`/journal/${nextPost.slug}`}
              style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--white)', border: '1px solid var(--line)', textAlign: 'right' }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--dark)' }}>
                Next →
              </div>
              <div className="serif text-base line-clamp-1">{nextPost.title}</div>
            </Link>
          )}
        </div>

        {/* Comments */}
        <section className="pt-4 space-y-6" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h3 className="serif text-2xl flex items-center gap-2">
            <MessageSquare style={{ width: '18px', height: '18px', color: 'var(--dark)' }} />
            <span>Reflections ({comments.length})</span>
          </h3>

          {user ? (
            <form onSubmit={handleAddComment} className="p-6 rounded-2xl space-y-4" style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)' }}>
              <textarea
                rows={3}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave a quiet thought..."
                style={{
                  width: '100%',
                  backgroundColor: 'var(--paper)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  outline: 0,
                  resize: 'none'
                }}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={commentSubmitting || !newComment.trim()}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--ink)',
                    color: 'var(--white)',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    border: 0,
                    cursor: 'pointer'
                  }}
                >
                  Post
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)' }}>
              <p className="text-sm opacity-75 mb-3">Sign in to leave a reflection.</p>
              <Link
                to="/login"
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--ink)',
                  color: 'var(--white)',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  display: 'inline-block'
                }}
              >
                Sign in
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  backgroundColor: 'var(--white)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid var(--line)'
                }}
              >
                <div className="flex items-center justify-between mb-2 text-xs font-semibold">
                  <span>{comment.authorName}</span>
                  {(user?.uid === comment.authorId || isAdmin) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{ background: 'none', border: 0, color: '#b3261e', cursor: 'pointer' }}
                    >
                      <Trash2 style={{ width: '13px', height: '13px' }} />
                    </button>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, opacity: 0.85 }}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};
