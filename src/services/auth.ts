import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL =
  (import.meta.env.VITE_INITIAL_ADMIN_EMAIL as string) || 'janucyberpack@gmail.com';
export const BOOTSTRAP_ADMIN_PASSWORD =
  (import.meta.env.VITE_INITIAL_ADMIN_PASSWORD as string) || 'admin1234';

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
        displayName: user.displayName || user.email?.split('@')[0] || (isBootstrapAdmin ? 'Primary Administrator' : 'Mindful Thinker'),
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
  const cleanEmail = email.trim();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    return await syncUserProfile(userCredential.user);
  } catch (error: any) {
    // Check if this is the bootstrap administrator attempting initial login before account exists in Firebase Auth
    const isBootstrapEmail = cleanEmail.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
    const isBootstrapPass = pass === BOOTSTRAP_ADMIN_PASSWORD;

    if (
      isBootstrapEmail &&
      isBootstrapPass &&
      (error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password')
    ) {
      try {
        // Provision the initial administrator account securely via Firebase Auth
        const newCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        await updateProfile(newCredential.user, { displayName: 'Primary Administrator' });
        return await syncUserProfile(newCredential.user);
      } catch (provisionErr) {
        console.warn('Initial admin provisioning fallback:', provisionErr);
      }
    }
    throw error;
  }
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

export async function changeAdminPassword(newPassword: string): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('No authenticated user session found.');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  await updatePassword(auth.currentUser, newPassword);
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({
      uid: d.id,
      ...d.data()
    })) as UserProfile[];
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

export async function updateUserRole(uid: string, newRole: UserRole): Promise<void> {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      role: newRole,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteUserRecord(uid: string): Promise<void> {
  const path = `users/${uid}`;
  try {
    await deleteDoc(doc(db, 'users', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
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

