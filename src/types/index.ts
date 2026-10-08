export type UserRole = 'user' | 'editor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  createdAt?: any;
  updatedAt?: any;
}

export type PostStatus = 'published' | 'draft' | 'archived';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  status: PostStatus;
  featured: boolean;
  readingTime: number; // in minutes
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: any;
  updatedAt?: any;
}

export interface SavedPost {
  id: string;
  postId: string;
  postTitle: string;
  postSlug: string;
  postExcerpt: string;
  postCoverImage: string;
  postCategory: string;
  savedAt: any;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  subscribedAt: any;
  status: 'active' | 'unsubscribed';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}
