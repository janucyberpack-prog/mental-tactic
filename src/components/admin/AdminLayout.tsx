import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  MessageSquare,
  Settings,
  Plus,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out of Admin Studio.', 'info');
      navigate('/admin/login');
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Articles', path: '/admin/articles', icon: FileText, altPath: '/admin/posts' },
    { label: 'Community', path: '/admin/users', icon: Users },
    { label: 'Subscribers', path: '/admin/subscribers', icon: Mail },
    { label: 'Inquiries', path: '/admin/messages', icon: MessageSquare },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(item.path) || (item.altPath && location.pathname.startsWith(item.altPath));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#122B22] flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EBE6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Brand & Studio Tag */}
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#122B22] text-[#B8E0D2] flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-tight text-[#122B22] font-semibold">
                  MENTAL TACTIC
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6F8A77]">
                  Editorial Studio
                </span>
              </div>
            </Link>

            {/* Admin Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#122B22] text-[#FAF7F2]">
              <Shield className="w-3 h-3 text-[#B8E0D2]" />
              <span>Admin</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'bg-[#122B22] text-[#FAF7F2] shadow-sm'
                      : 'text-[#122B22]/70 hover:text-[#122B22] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-[#EBE6DC] bg-white text-xs font-medium text-[#122B22]/80 hover:text-[#122B22] hover:bg-[#FAF7F2] transition-colors"
              title="View Public Site in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#6F8A77]" />
              <span className="hidden lg:inline">View Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-[#122B22]/60 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Sign Out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin/articles/new"
              className="p-2 rounded-full bg-[#122B22] text-[#FAF7F2]"
              title="New Article"
            >
              <Plus className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#122B22] hover:bg-[#FAF7F2]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EBE6DC] bg-white px-6 py-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
              <div className="text-xs">
                <div className="font-semibold text-[#122B22]">{profile?.displayName || 'Administrator'}</div>
                <div className="text-[#8EA595] text-[11px] truncate max-w-[200px]">{user?.email}</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#122B22] text-[#FAF7F2]">
                Admin
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {navItems.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#122B22] text-[#FAF7F2]'
                        : 'bg-[#FAF7F2] text-[#122B22] hover:bg-[#EAE5DB]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#F2ECE4] flex items-center justify-between">
              <Link
                to="/"
                target="_blank"
                className="text-xs text-[#6F8A77] hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Public Sanctuary</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:underline flex items-center gap-1 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
