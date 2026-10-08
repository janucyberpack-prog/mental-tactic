import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { Cursor } from './components/Cursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToAnchor } from './components/ScrollToAnchor';

// Public & User Pages
import { Home } from './pages/Home';
import { Journal } from './pages/Journal';
import { ArticleDetail } from './pages/ArticleDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Account } from './pages/Account';
import { SavedArticles } from './pages/SavedArticles';
import { NotFound } from './pages/NotFound';

// Admin CMS Studio Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminPosts } from './pages/admin/AdminPosts';
import { AdminPostEditor } from './pages/admin/AdminPostEditor';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSubscribers } from './pages/admin/AdminSubscribers';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminLogin } from './pages/admin/AdminLogin';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#122B22] selection:bg-[#B8E0D2] selection:text-[#0D1F18]">
      <Cursor />
      
      {/* Show public Navbar only when outside admin studio */}
      {!isAdminPath && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<ArticleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* User Account Routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedArticles />
              </ProtectedRoute>
            }
          />

          {/* Admin Authentication Screen */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin CMS Studio Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles/new"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPostEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles/:id/edit"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPostEditor />
              </ProtectedRoute>
            }
          />

          {/* Admin Post Aliases for backwards-compatibility */}
          <Route
            path="/admin/posts"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts/new"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPostEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts/:id/edit"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPostEditor />
              </ProtectedRoute>
            }
          />

          {/* Community & RBAC */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* Subscribers Management */}
          <Route
            path="/admin/subscribers"
            element={
              <ProtectedRoute requireAdmin>
                <AdminSubscribers />
              </ProtectedRoute>
            }
          />

          {/* Reader Inquiries */}
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute requireAdmin>
                <AdminMessages />
              </ProtectedRoute>
            }
          />

          {/* Platform Settings & Password Flow */}
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requireAdmin>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Show public Footer only when outside admin studio */}
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToAnchor />
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
