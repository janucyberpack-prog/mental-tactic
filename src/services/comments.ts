import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Comment, UserProfile } from '../types';

export async function getCommentsForPost(postId: string): Promise<Comment[]> {
  const path = 'comments';
  try {
    const commentsCol = collection(db, 'comments');
    const q = query(
      commentsCol,
      where('postId', '==', postId)
    );
    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];

    // Sort by createdAt client-side to avoid mandatory composite index errors
    comments.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return comments;
  } catch (error) {
    console.warn('Unable to fetch comments from server:', error);
    return [];
  }
}

export async function addComment(postId: string, content: string, profile: UserProfile): Promise<string> {
  const trimmed = content.trim();
  if (trimmed.length < 3 || trimmed.length > 1000) {
    throw new Error('Comment must be between 3 and 1000 characters.');
  }

  const path = 'comments';
  try {
    const commentsCol = collection(db, 'comments');
    const docRef = await addDoc(commentsCol, {
      postId,
      authorId: profile.uid,
      authorName: profile.displayName || 'Reader',
      authorPhoto: profile.photoURL || '',
      content: trimmed,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  const path = `comments/${commentId}`;
  try {
    await deleteDoc(doc(db, 'comments', commentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
