import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { CardSkeleton } from '../components/Skeletons';
import { SEO } from '../components/SEO';
import { getPublishedPosts, seedInitialPostsIfEmpty } from '../services/posts';
import { subscribeNewsletter } from '../services/interactions';
import { useToast } from '../components/Toast';
import { Post } from '../types';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | string>('all');
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadContent = async () => {
      try {
        await seedInitialPostsIfEmpty();
        const data = await getPublishedPosts();
        setPosts(data);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    try {
      const res = await subscribeNewsletter(email);
      showToast(res.message, 'success');
      setEmail('');
    } catch (err: any) {
      showToast(err.message || "You're on the list.", 'info');
    } finally {
      setSubscribing(false);
    }
  };

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts;
    return posts.filter(p => {
      const cat = p.category.toLowerCase();
      if (activeFilter === 'anxiety') return cat.includes('anxiety') || cat.includes('emotional') || p.tags?.some(t => t.toLowerCase().includes('anxiety'));
      if (activeFilter === 'rest') return cat.includes('rest') || cat.includes('sleep') || cat.includes('mindful');
      if (activeFilter === 'growth') return cat.includes('growth') || cat.includes('ritual') || cat.includes('neuroscience') || cat.includes('clarity');
      return cat.includes(activeFilter.toLowerCase());
    });
  }, [posts, activeFilter]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
      <SEO
        title="Mental Tactic — Make space for your mind"
        description="A quieter corner of the internet. Thoughtful tools, lived experiences, and small shifts for navigating the beautifully complicated work of being human."
      />

      {/* HERO SECTION */}
      <header
        className="hero"
        id="home"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--line)',
          background: 'radial-gradient(circle at 87% 75%, rgba(201, 190, 246, 0.6), transparent 26%), radial-gradient(circle at 74% 22%, rgba(185, 210, 190, 0.55), transparent 29%), var(--paper)'
        }}
      >
        <div
          className="hero-grid wrap"
          style={{
            minHeight: 'calc(100vh - 92px)',
            display: 'grid',
            gridTemplateColumns: '1.32fr 0.68fr',
            gap: '50px',
            alignItems: 'center',
            padding: '70px 0'
          }}
        >
          {/* Left Narrative */}
          <div>
            <p
              className="eyebrow"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--dark)',
                margin: '0 0 25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span style={{ display: 'inline-block', width: '28px', height: '1px', backgroundColor: 'currentColor' }} />
              <span>A quieter corner of the internet</span>
            </p>

            <h1
              className="serif"
              style={{
                fontSize: 'clamp(64px, 8.5vw, 136px)',
                lineHeight: 0.84,
                letterSpacing: '-0.06em',
                margin: '0 0 30px',
                fontWeight: 400
              }}
            >
              Make space<br />
              for your <em style={{ color: 'var(--dark)', fontStyle: 'italic' }}>mind.</em>
            </h1>

            <div className="hero-bottom flex items-center gap-6 pt-2">
              <a
                className="circle hover:scale-105"
                href="#stories"
                style={{
                  width: '62px',
                  height: '62px',
                  border: '1px solid var(--ink)',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '24px',
                  color: 'var(--ink)',
                  flexShrink: 0,
                  transition: 'transform 0.3s ease'
                }}
              >
                ↘
              </a>
              <p
                className="hero-copy"
                style={{
                  maxWidth: '430px',
                  lineHeight: 1.65,
                  color: 'rgba(24, 34, 29, 0.72)',
                  fontSize: '15px',
                  margin: 0
                }}
              >
                Thoughtful tools, lived experiences, and small shifts for navigating the beautifully complicated work of being human.
              </p>
            </div>
          </div>

          {/* Right Art Display */}
          <div
            className="art"
            style={{
              height: '520px',
              display: 'grid',
              placeItems: 'center',
              position: 'relative'
            }}
          >
            {/* Spinning Orbit with Peach Dot */}
            <div
              className="orbit"
              style={{
                position: 'absolute',
                border: '1px solid rgba(35, 78, 59, 0.33)',
                borderRadius: '50%',
                aspectRatio: '1',
                width: 'min(38vw, 500px)',
                animation: 'spin 26s linear infinite'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '-7px',
                  width: '14px',
                  height: '14px',
                  backgroundColor: 'var(--peach)',
                  borderRadius: '50%',
                  transform: 'translateX(-50%)'
                }}
              />
            </div>

            {/* Pulsing rings */}
            <div
              className="ring"
              style={{
                position: 'absolute',
                border: '1px solid rgba(35, 78, 59, 0.33)',
                borderRadius: '50%',
                aspectRatio: '1',
                width: 'min(32vw, 420px)',
                animation: 'pulse 4.5s ease-out infinite'
              }}
            />
            <div
              className="ring two"
              style={{
                position: 'absolute',
                border: '1px solid rgba(35, 78, 59, 0.33)',
                borderRadius: '50%',
                aspectRatio: '1',
                width: 'min(32vw, 420px)',
                animation: 'pulse 4.5s ease-out infinite',
                animationDelay: '-2.25s'
              }}
            />

            {/* Organic Shape Artwork */}
            <div
              className="shape"
              style={{
                width: 'min(26vw, 348px)',
                aspectRatio: '0.76',
                borderRadius: '49% 49% 44% 44% / 34% 34% 61% 61%',
                overflow: 'hidden',
                transform: 'rotate(5deg)',
                boxShadow: '18px 22px 0 rgba(185, 210, 190, 0.55)',
                position: 'relative',
                zIndex: 2
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1522075782449-e45a34f1ddfb?auto=format&fit=crop&w=900&q=85"
                alt="Mindful contemplation"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'saturate(0.7)'
                }}
              />
            </div>

            {/* Floating Lilac Pill */}
            <div
              className="pill serif"
              style={{
                position: 'absolute',
                right: '0',
                bottom: '8%',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                padding: '25px',
                textAlign: 'center',
                backgroundColor: 'var(--lilac)',
                fontSize: '20px',
                lineHeight: 1.1,
                color: 'var(--ink)',
                animation: 'float 5s ease-in-out infinite alternate',
                zIndex: 4,
                boxShadow: '0 8px 20px rgba(24,34,29,0.06)'
              }}
            >
              You don't have to hold it all.
            </div>
          </div>
        </div>
      </header>

      {/* MANIFESTO SECTION */}
      <section
        className="manifesto"
        id="about"
        style={{
          minHeight: '85vh',
          backgroundColor: 'var(--ink)',
          color: 'var(--white)',
          display: 'grid',
          placeItems: 'center',
          padding: '120px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          className="orb"
          style={{
            position: 'absolute',
            width: 'min(48vw, 660px)',
            aspectRatio: '1',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #d8cff9, #719783 58%, transparent 71%)',
            opacity: 0.45,
            filter: 'blur(4px)',
            animation: 'breathe 6s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        />
        <h2
          className="serif"
          style={{
            maxWidth: '1050px',
            fontSize: 'clamp(40px, 6vw, 88px)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            margin: 0,
            position: 'relative',
            zIndex: 2,
            fontWeight: 400
          }}
        >
          Mental wellness isn't about fixing yourself. It's about learning to meet yourself with{' '}
          <span style={{ color: 'var(--sage)', fontStyle: 'italic' }}>more curiosity</span> and less judgment.
        </h2>
      </section>

      {/* ROTATED MARQUEE */}
      <div
        className="marquee"
        style={{
          overflow: 'hidden',
          backgroundColor: 'var(--lilac)',
          padding: '36px 0',
          transform: 'rotate(-1.5deg) scale(1.03)',
          whiteSpace: 'nowrap',
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)'
        }}
      >
        <div className="track" style={{ display: 'inline-flex', animation: 'marquee 23s linear infinite' }}>
          {['Pause', 'Feel', 'Notice', 'Begin again', 'Pause', 'Feel', 'Notice', 'Begin again'].map((word, idx) => (
            <span
              key={idx}
              className="serif flex items-center"
              style={{
                fontSize: 'clamp(46px, 6.5vw, 92px)',
                color: 'var(--ink)'
              }}
            >
              <span>{word}</span>
              <span
                style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  margin: '0 34px',
                  backgroundColor: 'var(--peach)',
                  borderRadius: '50%'
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* FLOW / SMALL PRACTICE SECTION */}
      <section
        className="flow"
        id="practice"
        style={{
          minHeight: '110vh',
          backgroundColor: 'var(--paper)',
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          padding: '100px 20px'
        }}
      >
        <div
          className="flow-orbit"
          style={{
            position: 'absolute',
            width: 'min(70vw, 850px)',
            aspectRatio: '1',
            border: '1px solid var(--line)',
            borderRadius: '50%'
          }}
        />

        {/* Orbit Inner Ring 1 */}
        <div
          style={{
            position: 'absolute',
            width: 'min(54vw, 650px)',
            aspectRatio: '1',
            border: '1px solid var(--line)',
            borderRadius: '50%'
          }}
        />
        {/* Orbit Inner Ring 2 */}
        <div
          style={{
            position: 'absolute',
            width: 'min(38vw, 450px)',
            aspectRatio: '1',
            border: '1px solid var(--line)',
            borderRadius: '50%'
          }}
        />

        {/* Center Content */}
        <div className="flow-center" style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
          <p
            className="eyebrow"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--dark)',
              margin: '0 0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <span style={{ display: 'inline-block', width: '28px', height: '1px', backgroundColor: 'currentColor' }} />
            <span>A small practice</span>
            <span style={{ display: 'inline-block', width: '28px', height: '1px', backgroundColor: 'currentColor' }} />
          </p>
          <h2
            className="flow-title serif"
            style={{
              fontSize: 'clamp(55px, 8vw, 120px)',
              lineHeight: 0.88,
              margin: 0,
              letterSpacing: '-0.055em',
              fontWeight: 400
            }}
          >
            Let it move <em style={{ color: 'var(--dark)', fontStyle: 'italic' }}>through.</em>
          </h2>
        </div>

        {/* Four Thought Pills */}
        <div
          className="thought one hidden sm:flex"
          style={{
            position: 'absolute',
            left: '8%',
            top: '20%',
            padding: '13px 20px',
            border: '1px solid var(--ink)',
            borderRadius: '999px',
            backgroundColor: 'var(--white)',
            boxShadow: '6px 7px rgba(24, 34, 29, 0.1)',
            fontSize: '13px',
            alignItems: 'center',
            gap: '9px',
            zIndex: 5
          }}
        >
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--dark)' }} />
          <span>I should be further ahead</span>
        </div>

        <div
          className="thought two hidden sm:flex"
          style={{
            position: 'absolute',
            right: '9%',
            top: '18%',
            padding: '13px 20px',
            border: '1px solid var(--ink)',
            borderRadius: '999px',
            backgroundColor: 'var(--white)',
            boxShadow: '6px 7px rgba(24, 34, 29, 0.1)',
            fontSize: '13px',
            alignItems: 'center',
            gap: '9px',
            zIndex: 5
          }}
        >
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--dark)' }} />
          <span>What if I get it wrong?</span>
        </div>

        <div
          className="thought three hidden sm:flex"
          style={{
            position: 'absolute',
            left: '12%',
            bottom: '18%',
            padding: '13px 20px',
            border: '1px solid var(--ink)',
            borderRadius: '999px',
            backgroundColor: 'var(--white)',
            boxShadow: '6px 7px rgba(24, 34, 29, 0.1)',
            fontSize: '13px',
            alignItems: 'center',
            gap: '9px',
            zIndex: 5
          }}
        >
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--dark)' }} />
          <span>Everyone else has it together</span>
        </div>

        <div
          className="thought four hidden sm:flex"
          style={{
            position: 'absolute',
            right: '11%',
            bottom: '22%',
            padding: '13px 20px',
            border: '1px solid var(--ink)',
            borderRadius: '999px',
            backgroundColor: 'var(--white)',
            boxShadow: '6px 7px rgba(24, 34, 29, 0.1)',
            fontSize: '13px',
            alignItems: 'center',
            gap: '9px',
            zIndex: 5
          }}
        >
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--dark)' }} />
          <span>I can meet this moment</span>
        </div>
      </section>

      {/* POSTS / STORIES SECTION */}
      <section className="posts wrap" id="stories" style={{ padding: '120px 0 140px' }}>
        <div
          className="head flex flex-col sm:flex-row justify-between sm:items-end gap-8 mb-12"
          style={{ marginBottom: '45px' }}
        >
          <h2
            className="serif"
            style={{
              fontSize: 'clamp(50px, 6.5vw, 92px)',
              lineHeight: 0.9,
              margin: 0,
              fontWeight: 400
            }}
          >
            Latest<br />
            <em style={{ color: 'var(--dark)', fontStyle: 'italic' }}>thinking</em>
          </h2>
          <p
            style={{
              maxWidth: '390px',
              lineHeight: 1.6,
              color: 'rgba(24, 34, 29, 0.65)',
              fontSize: '15px',
              margin: 0
            }}
          >
            No quick fixes. Just grounded ideas, honest conversations, and practices you can actually carry into your day.
          </p>
        </div>

        {/* Category Filters */}
        <div className="filters flex gap-2 flex-wrap mb-10">
          {[
            { id: 'all', label: 'All notes' },
            { id: 'anxiety', label: 'Anxiety' },
            { id: 'rest', label: 'Rest' },
            { id: 'growth', label: 'Growth' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                padding: '9px 18px',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                backgroundColor: activeFilter === tab.id ? 'var(--ink)' : 'transparent',
                color: activeFilter === tab.id ? 'var(--white)' : 'var(--ink)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3-Column Stories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            style={{ rowGap: '54px', columnGap: '28px' }}
          >
            {filteredPosts.map(post => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="newsletter wrap" id="newsletter" style={{ paddingBottom: '35px' }}>
        <div
          className="newsletter-box"
          style={{
            minHeight: '480px',
            padding: 'clamp(40px, 6vw, 85px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            alignItems: 'center',
            gap: '50px',
            backgroundColor: 'var(--sage)',
            overflow: 'hidden'
          }}
        >
          <div>
            <p
              className="eyebrow"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--dark)',
                margin: '0 0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span style={{ display: 'inline-block', width: '28px', height: '1px', backgroundColor: 'currentColor' }} />
              <span>A note for your inner world</span>
            </p>
            <h2
              className="serif"
              style={{
                fontSize: 'clamp(46px, 5.5vw, 84px)',
                lineHeight: 0.9,
                margin: '0 0 20px',
                fontWeight: 400
              }}
            >
              Take a softer thought <em style={{ color: 'var(--dark)', fontStyle: 'italic' }}>with you.</em>
            </h2>
            <p style={{ lineHeight: 1.7, fontSize: '15px', color: 'rgba(24, 34, 29, 0.8)', maxWidth: '440px', margin: 0 }}>
              One thoughtful letter every other Sunday. No noise, no life hacks — just something worth sitting with.
            </p>
          </div>

          <form onSubmit={handleSubscribe}>
            <p
              className="eyebrow"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--dark)',
                margin: '0 0 16px'
              }}
            >
              Your email address
            </p>
            <div
              className="input flex items-center"
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--ink)',
                paddingBottom: '4px'
              }}
            >
              <input
                type="email"
                placeholder="you@somewhere.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  border: 0,
                  background: 'none',
                  padding: '18px 5px',
                  outline: 0,
                  fontSize: '16px',
                  color: 'var(--ink)'
                }}
              />
              <button
                type="submit"
                disabled={subscribing}
                style={{
                  width: '48px',
                  height: '48px',
                  border: 0,
                  borderRadius: '50%',
                  backgroundColor: 'var(--ink)',
                  color: 'var(--white)',
                  fontSize: '18px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                ↗
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
