import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { Cursor } from './components/Cursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToAnchor } from './components/ScrollToAnchor';

// Pages
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

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminPosts } from './pages/admin/AdminPosts';
import { AdminPostEditor } from './pages/admin/AdminPostEditor';
import { AdminUsers } from './pages/admin/AdminUsers';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToAnchor />
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#122B22] selection:bg-[#B8E0D2] selection:text-[#0D1F18]">
            <Cursor />
            <Navbar />
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

                {/* Authenticated User Routes */}
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

                {/* Admin / Editor Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminOverview />
                    </ProtectedRoute>
                  }
                />
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
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
