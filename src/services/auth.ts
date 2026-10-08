import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

const BOOTSTRAP_ADMIN_EMAIL = 'janucyberpack@gmail.com';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function syncUserProfile(user: User): Promise<UserProfile> {
  const path = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    const isBootstrapAdmin = user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

    if (!docSnap.exists()) {
      const initialProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Mindful Thinker',
        photoURL: user.photoURL || '',
        role: isBootstrapAdmin ? 'admin' : 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(userDocRef, initialProfile);
      return initialProfile;
    } else {
      const existingData = docSnap.data() as UserProfile;
      // If user is bootstrap admin but role isn't admin yet, update it
      if (isBootstrapAdmin && existingData.role !== 'admin') {
        await updateDoc(userDocRef, {
          role: 'admin',
          updatedAt: serverTimestamp()
        });
        return { ...existingData, role: 'admin' };
      }
      return existingData;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function registerWithEmail(email: string, pass: string, displayName: string): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const user = userCredential.user;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  return await syncUserProfile(user);
}

export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return await syncUserProfile(userCredential.user);
}

export async function loginWithGoogle(): Promise<UserProfile> {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return await syncUserProfile(userCredential.user);
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function updateUserProfileBio(uid: string, data: { displayName?: string; bio?: string; photoURL?: string }): Promise<void> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: serverTimestamp()
    });

    if (auth.currentUser && (data.displayName || data.photoURL)) {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName || auth.currentUser.displayName,
        photoURL: data.photoURL || auth.currentUser.photoURL
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
