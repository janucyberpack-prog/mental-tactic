import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MediaItem } from '../types';
import { optimizeImageForFirestore, validateImageFile } from '../utils/imageOptimizer';
import { logAdminActivity } from './audit';

/**
 * Uploads an image from device storage, optimizes it client-side,
 * and saves it directly to Firestore's media collection.
 */
export async function uploadPostImageToFirestore(
  file: File,
  options?: {
    postId?: string;
    caption?: string;
    userId?: string;
    userEmail?: string;
  }
): Promise<MediaItem> {
  const path = 'media';
  try {
    // 1. Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid image file.');
    }

    // 2. Client-side compress and resize for Firestore document limits
    const optimized = await optimizeImageForFirestore(file, {
      maxWidth: 1400,
      maxHeight: 1400,
      maxSizeBytes: 520 * 1024 // 520KB safe limit for Firestore
    });

    // 3. Save directly into Firestore 'media' collection
    const mediaCol = collection(db, 'media');
    const docData = {
      name: optimized.name,
      dataUrl: optimized.dataUrl,
      mimeType: optimized.mimeType,
      sizeBytes: optimized.sizeBytes,
      width: optimized.width,
      height: optimized.height,
      postId: options?.postId || null,
      caption: options?.caption || '',
      uploadedBy: options?.userId || 'editorial',
      authorEmail: options?.userEmail || '',
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(mediaCol, docData);

    // 4. Audit logging
    try {
      await logAdminActivity({
        adminId: options?.userId || 'editorial',
        adminEmail: options?.userEmail || 'janucyberpack@gmail.com',
        action: 'upload_media',
        targetType: 'media',
        targetId: docRef.id,
        details: `Saved device image "${optimized.name}" to Firestore (${Math.round(optimized.sizeBytes / 1024)} KB)`
      });
    } catch {
      // Non-blocking audit failure
    }

    return {
      id: docRef.id,
      name: optimized.name,
      dataUrl: optimized.dataUrl,
      mimeType: optimized.mimeType,
      sizeBytes: optimized.sizeBytes,
      width: optimized.width,
      height: optimized.height,
      postId: options?.postId,
      caption: options?.caption,
      uploadedBy: options?.userId,
      authorEmail: options?.userEmail,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Retrieves recently uploaded post images stored in Firestore.
 */
export async function getMediaLibrary(maxItems = 36): Promise<MediaItem[]> {
  const path = 'media';
  try {
    const mediaCol = collection(db, 'media');
    let snapshot;

    try {
      const q = query(mediaCol, orderBy('createdAt', 'desc'), limit(maxItems));
      snapshot = await getDocs(q);
    } catch {
      // Fallback if index not established
      snapshot = await getDocs(mediaCol);
    }

    const items: MediaItem[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        name: data.name || 'Untitled Image',
        dataUrl: data.dataUrl || '',
        mimeType: data.mimeType || 'image/jpeg',
        sizeBytes: data.sizeBytes || 0,
        width: data.width,
        height: data.height,
        postId: data.postId,
        caption: data.caption,
        uploadedBy: data.uploadedBy,
        authorEmail: data.authorEmail,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
      });
    });

    // In-memory sort by date descending
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return items;
  } catch (error) {
    console.warn('Failed to load media library from Firestore:', error);
    return [];
  }
}

/**
 * Deletes a media image document from Firestore.
 */
export async function deleteMediaItem(mediaId: string): Promise<void> {
  const path = `media/${mediaId}`;
  try {
    await deleteDoc(doc(db, 'media', mediaId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}
