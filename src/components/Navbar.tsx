import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, User as UserIcon, Shield, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Signed out.', 'info');
      setProfileDropdownOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isHome = location.pathname === '/';

  return (
    <nav className="wrap" style={{ height: '92px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', position: 'relative', zIndex: 30 }}>
      {/* Brand */}
      <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '11px', fontWeight: 700, fontSize: '19px', color: 'var(--ink)' }}>
        <span
          className="mark"
          style={{
            width: '34px',
            height: '34px',
            border: '1.5px solid var(--ink)',
            borderRadius: '50% 50% 45% 55%',
            transform: 'rotate(-12deg)',
            position: 'relative',
            display: 'inline-block'
          }}
        >
          <span
            style={{
              position: 'absolute',
              width: '5px',
              height: '5px',
              right: '6px',
              top: '7px',
              backgroundColor: 'var(--lilac)',
              borderRadius: '50%'
            }}
          />
        </span>
        <span>mental tactic</span>
      </Link>

      {/* Desktop Links */}
      <div className="links hidden md:flex" style={{ gap: '34px', alignItems: 'center', fontSize: '14px' }}>
        {isHome ? (
          <>
            <a href="#stories" style={{ color: 'inherit' }}>Stories</a>
            <a href="#practice" style={{ color: 'inherit' }}>Practice</a>
            <a href="#about" style={{ color: 'inherit' }}>Our approach</a>
          </>
        ) : (
          <>
            <Link to="/journal" style={{ color: 'inherit' }}>Stories</Link>
            <Link to="/#practice" style={{ color: 'inherit' }}>Practice</Link>
            <Link to="/about" style={{ color: 'inherit' }}>Our approach</Link>
          </>
        )}

        {/* Authenticated Actions */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/saved"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--line)',
                backgroundColor: location.pathname === '/saved' ? 'var(--ink)' : 'var(--white)',
                color: location.pathname === '/saved' ? 'var(--white)' : 'var(--ink)'
              }}
              title="Saved"
            >
              <Bookmark style={{ width: '15px', height: '15px' }} />
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--dark)',
                  color: 'var(--white)',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <Shield style={{ width: '13px', height: '13px' }} />
                <span>Admin</span>
              </Link>
            )}

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--white)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <UserIcon style={{ width: '14px', height: '14px', color: 'var(--dark)' }} />
                <span className="max-w-[90px] truncate">{profile?.displayName || 'Account'}</span>
              </button>

              {profileDropdownOpen && (
                <div
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '8px',
                    width: '180px',
                    backgroundColor: 'var(--white)',
                    borderRadius: '16px',
                    border: '1px solid var(--line)',
                    padding: '8px 0',
                    boxShadow: '0 10px 25px rgba(24,34,29,0.08)',
                    zIndex: 50
                  }}
                >
                  <Link
                    to="/account"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{ display: 'block', padding: '8px 16px', fontSize: '13px', color: 'var(--ink)' }}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/saved"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{ display: 'block', padding: '8px 16px', fontSize: '13px', color: 'var(--ink)' }}
                  >
                    Saved
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 16px', fontSize: '13px', color: 'var(--dark)', fontWeight: 600 }}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div style={{ borderTop: '1px solid var(--line)', margin: '6px 0' }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      fontSize: '13px',
                      color: '#b3261e',
                      background: 'none',
                      border: 0,
                      cursor: 'pointer'
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', padding: '6px 10px' }}>
              Sign in
            </Link>
            <a
              href="#newsletter"
              className="cta"
              style={{
                backgroundColor: 'var(--ink)',
                color: 'var(--white)',
                border: '1px solid var(--ink)',
                borderRadius: '999px',
                padding: '12px 22px',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              Join the pause
            </a>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden"
        style={{ background: 'none', border: 0, padding: '8px', cursor: 'pointer', color: 'var(--ink)' }}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
      </button>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '92px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--paper)',
            borderBottom: '1px solid var(--line)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 40
          }}
        >
          <Link to="/journal" onClick={() => setMobileMenuOpen(false)}>Stories</Link>
          <a href="#practice" onClick={() => setMobileMenuOpen(false)}>Practice</a>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Our approach</Link>
          {user ? (
            <>
              <Link to="/saved" onClick={() => setMobileMenuOpen(false)}>Saved</Link>
              <Link to="/account" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                style={{ textAlign: 'left', color: '#b3261e', background: 'none', border: 0, padding: 0 }}
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '999px',
                  border: '1px solid var(--ink)',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--ink)',
                  color: 'var(--white)',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                Join the pause
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
