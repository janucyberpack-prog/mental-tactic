import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { syncUserProfile, getUserProfile, logoutUser } from '../services/auth';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isEditor: false,
  refreshProfile: async () => {},
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (firebaseUser: User) => {
    try {
      const userProfile = await syncUserProfile(firebaseUser);
      setProfile(userProfile);
    } catch (err) {
      console.warn('Profile sync fallback:', err);
      // Fallback in-memory profile if Firestore is inaccessible
      const isBootstrapAdmin = firebaseUser.email?.toLowerCase() === 'janucyberpack@gmail.com';
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Mindful Thinker',
        photoURL: firebaseUser.photoURL || '',
        role: isBootstrapAdmin ? 'admin' : 'user'
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  };

  const isBootstrapAdmin = user?.email?.toLowerCase() === 'janucyberpack@gmail.com';
  const isAdmin = profile?.role === 'admin' || isBootstrapAdmin;
  const isEditor = isAdmin || profile?.role === 'editor';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        isEditor,
        refreshProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
