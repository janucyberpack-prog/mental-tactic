import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer wrap" style={{ padding: '75px 0 30px' }}>
      <div className="footer-top flex flex-col md:flex-row justify-between gap-12 pb-16">
        <p
          className="statement serif"
          style={{
            fontSize: 'clamp(42px, 5vw, 68px)',
            lineHeight: 0.98,
            maxWidth: '620px',
            margin: 0,
            color: 'var(--ink)'
          }}
        >
          A place to feel a little more human, together.
        </p>

        <div
          className="footer-links"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px 60px',
            fontSize: '13px',
            color: 'var(--ink)'
          }}
        >
          <Link to="/journal" style={{ color: 'inherit' }}>Stories</Link>
          <Link to="/about" style={{ color: 'inherit' }}>About</Link>
          <a href="/#practice" style={{ color: 'inherit' }}>Practices</a>
          <Link to="/contact" style={{ color: 'inherit' }}>Contact</Link>
          <Link to="/saved" style={{ color: 'inherit' }}>Saved sanctuary</Link>
          <Link to="/account" style={{ color: 'inherit' }}>Profile</Link>
        </div>
      </div>

      <div
        className="bottom flex flex-col sm:flex-row justify-between gap-4 pt-6"
        style={{
          borderTop: '1px solid var(--line)',
          fontSize: '11px',
          color: 'rgba(24, 34, 29, 0.55)'
        }}
      >
        <span style={{ fontWeight: 600 }}>mental tactic</span>
        <span>Not a substitute for professional care.</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};
