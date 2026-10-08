import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSavedPosts, removeSavedPost } from '../services/posts';
import { SavedPost } from '../types';
import { useToast } from '../components/Toast';
import { SEO } from '../components/SEO';
import { CardSkeleton } from '../components/Skeletons';

export const SavedArticles: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSaved = async () => {
      setLoading(true);
      try {
        const data = await getSavedPosts(user.uid);
        setSavedPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [user, navigate]);

  const handleRemove = async (postId: string, title: string) => {
    if (!user) return;
    try {
      await removeSavedPost(user.uid, postId);
      setSavedPosts(savedPosts.filter((p) => p.postId !== postId));
      showToast(`Removed "${title}" from your saved reflections.`, 'info');
    } catch (err) {
      showToast('Unable to remove article.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 md:py-24 text-[#122B22]">
      <SEO title="Saved Sanctuary" description="Your saved articles and quiet meditations." />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6F8A77]">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Collection</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#122B22] font-normal">
            Saved Sanctuary
          </h1>
          <p className="text-sm text-[#122B22]/70 leading-relaxed font-sans">
            Reflections you have bookmarked to return to in moments of contemplation.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="text-center py-24 bg-white/70 rounded-3xl border border-[#EBE6DC] max-w-xl mx-auto p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center mx-auto text-[#6F8A77]">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#122B22]">
              No saved articles yet.
            </h3>
            <p className="text-xs text-[#122B22]/70 leading-relaxed max-w-sm mx-auto">
              Take your time exploring our journal. When an essay or somatic protocol speaks to you, tap the bookmark icon to keep it here.
            </p>
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#122B22] text-[#FAF7F2] hover:bg-[#1A3B2F] transition-colors mt-2"
            >
              <span>Explore Journal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedPosts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 bg-[#FAF7F2]">
                    <img
                      src={item.postCoverImage}
                      alt={item.postTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2]/90 backdrop-blur-md text-[#122B22]">
                      {item.postCategory}
                    </span>
                    <button
                      onClick={() => handleRemove(item.postId, item.postTitle)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-[#FAF7F2]/90 hover:bg-white text-red-600 shadow-sm transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link to={`/journal/${item.postSlug}`}>
                    <h3 className="font-serif text-2xl text-[#122B22] mb-3 group-hover:text-[#6F8A77] transition-colors leading-snug">
                      {item.postTitle}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#122B22]/70 leading-relaxed line-clamp-3 mb-6">
                    {item.postExcerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F2ECE4] flex items-center justify-between">
                  <span className="text-[11px] text-[#8EA595]">Saved Reflection</span>
                  <Link
                    to={`/journal/${item.postSlug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#122B22] group-hover:text-[#6F8A77]"
                  >
                    <span>Read Reflection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
