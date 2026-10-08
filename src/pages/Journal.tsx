import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { ArticleCard } from '../components/ArticleCard';
import { CardSkeleton } from '../components/Skeletons';
import { SEO } from '../components/SEO';
import { getPublishedPosts } from '../services/posts';
import { Post } from '../types';

const CATEGORIES = [
  'All notes',
  'Anxiety',
  'Rest',
  'Growth',
  'Mindfulness',
  'Neuroscience'
];

export const Journal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All notes';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPublishedPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All notes' || cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const isAll = selectedCategory === 'All notes' || selectedCategory === 'All';
      const matchesCategory = isAll || (
        post.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        post.tags?.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
      
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(query)))
      );

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen py-16 md:py-24" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
      <SEO
        title="Stories & Reflections"
        description="Browse essays and meditations on anxiety, rest, growth, and living intentionally."
      />

      <div className="wrap">
        {/* Header */}
        <div className="max-w-2xl mb-12 space-y-3">
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--dark)',
              margin: 0
            }}
          >
            Stories & Notes
          </p>
          <h1
            className="serif"
            style={{
              fontSize: 'clamp(45px, 6vw, 84px)',
              lineHeight: 0.92,
              margin: 0,
              letterSpacing: '-0.04em'
            }}
          >
            Latest <em style={{ color: 'var(--dark)', fontStyle: 'italic' }}>thinking.</em>
          </h1>
        </div>

        {/* Filter & Search */}
        <div
          className="mb-12 p-6 rounded-3xl"
          style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--line)'
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
            <div className="relative w-full md:max-w-md">
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--dark)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories..."
                style={{
                  width: '100%',
                  backgroundColor: 'var(--paper)',
                  border: '1px solid var(--line)',
                  borderRadius: '999px',
                  padding: '10px 16px 10px 42px',
                  fontSize: '14px',
                  color: 'var(--ink)',
                  outline: 0
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 0, cursor: 'pointer' }}
                >
                  <X style={{ width: '14px', height: '14px' }} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: '1px solid var(--line)',
                  backgroundColor: selectedCategory.toLowerCase() === cat.toLowerCase() ? 'var(--ink)' : 'transparent',
                  color: selectedCategory.toLowerCase() === cat.toLowerCase() ? 'var(--white)' : 'var(--ink)',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div
            className="text-center py-20 rounded-3xl p-8 max-w-lg mx-auto"
            style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)' }}
          >
            <h3 className="serif" style={{ fontSize: '28px', margin: '0 0 10px' }}>No stories found</h3>
            <p style={{ fontSize: '14px', color: 'rgba(24, 34, 29, 0.7)', margin: '0 0 20px' }}>
              No notes match your filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All notes');
                searchParams.delete('category');
                setSearchParams(searchParams);
              }}
              style={{
                padding: '10px 22px',
                borderRadius: '999px',
                backgroundColor: 'var(--ink)',
                color: 'var(--white)',
                border: 0,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" style={{ rowGap: '54px', columnGap: '28px' }}>
            {filteredPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
