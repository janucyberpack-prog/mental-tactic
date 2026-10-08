import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { savePost, removeSavedPost } from '../services/posts';
import { useToast } from './Toast';

interface ArticleCardProps {
  post: Post;
  isInitiallySaved?: boolean;
  onSavedChange?: (postId: string, saved: boolean) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  post,
  isInitiallySaved = false,
  onSavedChange
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [savingLoading, setSavingLoading] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('Please sign in to bookmark stories.', 'info');
      return;
    }

    setSavingLoading(true);
    try {
      if (isSaved) {
        await removeSavedPost(user.uid, post.id);
        setIsSaved(false);
        showToast('Removed from saved.', 'info');
        onSavedChange?.(post.id, false);
      } else {
        await savePost(user.uid, post);
        setIsSaved(true);
        showToast('Saved to sanctuary.', 'success');
        onSavedChange?.(post.id, true);
      }
    } catch (err) {
      console.error(err);
      showToast('Unable to update bookmark.', 'error');
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <article className="card group relative flex flex-col justify-between" style={{ color: 'var(--ink)' }}>
      <div>
        {/* Cover image container */}
        <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--paper)' }}>
          <img
            src={post.coverImage}
            alt={post.title}
            style={{
              width: '100%',
              aspectRatio: '1 / 0.84',
              objectFit: 'cover',
              display: 'block',
              filter: 'saturate(0.72)',
              transition: 'transform 0.5s ease, filter 0.5s ease'
            }}
            className="group-hover:scale-105 group-hover:saturate-100"
            loading="lazy"
          />

          {/* Bookmark Button */}
          <button
            onClick={handleToggleSave}
            disabled={savingLoading}
            aria-label={isSaved ? 'Remove from saved' : 'Save article'}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isSaved ? 'var(--ink)' : 'rgba(255, 253, 248, 0.9)',
              color: isSaved ? 'var(--white)' : 'var(--ink)',
              border: 0,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              transition: 'all 0.2s ease'
            }}
          >
            <Bookmark style={{ width: '15px', height: '15px', fill: isSaved ? 'currentColor' : 'none' }} />
          </button>
        </div>

        {/* Metadata */}
        <div
          className="meta"
          style={{
            color: 'var(--dark)',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: '20px 0 12px'
          }}
        >
          {post.category} · {post.readingTime} min read
        </div>

        {/* Title */}
        <Link to={`/journal/${post.slug}`} className="block">
          <h3
            className="serif"
            style={{
              fontSize: 'clamp(26px, 2.3vw, 36px)',
              lineHeight: 1.08,
              margin: '0 0 12px',
              color: 'var(--ink)'
            }}
          >
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p style={{ color: 'rgba(24, 34, 29, 0.7)', lineHeight: 1.6, fontSize: '14px', margin: '0 0 16px' }}>
          {post.excerpt}
        </p>
      </div>

      {/* Action link */}
      <div>
        <Link
          to={`/journal/${post.slug}`}
          className="read"
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            borderBottom: '1px solid currentColor',
            paddingBottom: '4px',
            display: 'inline-block',
            color: 'var(--ink)'
          }}
        >
          Read story →
        </Link>
      </div>
    </article>
  );
};
