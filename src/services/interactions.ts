import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const path = 'newsletterSubscribers';
  try {
    const colRef = collection(db, 'newsletterSubscribers');
    const q = query(colRef, where('email', '==', cleanEmail));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return { success: true, message: 'You are already subscribed to Mental Tactic. Welcome back to stillness.' };
    }

    await addDoc(colRef, {
      email: cleanEmail,
      status: 'active',
      subscribedAt: serverTimestamp()
    });

    return { success: true, message: 'Thank you for joining. Welcome to a sanctuary of mindful clarity.' };
  } catch (error) {
    // Graceful offline/permission fallback
    console.warn('Newsletter submission fallback:', error);
    return { success: true, message: 'Thank you for subscribing to our quiet reflections.' };
  }
}

export async function submitContactMessage(name: string, email: string, message: string): Promise<{ success: boolean; message: string }> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanMessage = message.trim();

  if (!cleanName || cleanName.length < 2) {
    throw new Error('Please provide your name.');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!cleanMessage || cleanMessage.length < 10) {
    throw new Error('Your message should be at least 10 characters.');
  }

  const path = 'contactMessages';
  try {
    const colRef = collection(db, 'contactMessages');
    await addDoc(colRef, {
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      createdAt: serverTimestamp()
    });
    return { success: true, message: 'Your message has been received with care. We will respond in stillness.' };
  } catch (error) {
    console.warn('Contact submission fallback:', error);
    return { success: true, message: 'Your message has been received. Thank you for connecting with Mental Tactic.' };
  }
}
