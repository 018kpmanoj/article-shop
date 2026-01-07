'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, firebaseConfigured } from '@/lib/firebase';
import { trackActivity } from '@/lib/activityTracker';

const AuthContext = createContext({});

// Admin email - this user has access to admin panel
const ADMIN_EMAIL = '018kpmanoj@gmail.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    // Check if Firebase is configured
    if (!firebaseConfigured || !auth) {
      console.warn('Firebase not configured. Authentication disabled.');
      setLoading(false);
      setFirebaseReady(false);
      return;
    }

    setFirebaseReady(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsAdmin(user.email === ADMIN_EMAIL);
        
        // Update user document in Firestore
        await updateUserDocument(user);
        
        // Track login activity
        trackActivity('login', {
          userId: user.uid,
          email: user.email,
          method: user.providerData[0]?.providerId || 'unknown'
        });
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update or create user document in Firestore
  const updateUserDocument = async (user) => {
    if (!db) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      const userData = {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        lastLogin: serverTimestamp(),
        isAdmin: user.email === ADMIN_EMAIL
      };

      if (!userSnap.exists()) {
        userData.createdAt = serverTimestamp();
        userData.loginCount = 1;
      } else {
        userData.loginCount = (userSnap.data().loginCount || 0) + 1;
      }

      await setDoc(userRef, userData, { merge: true });
    } catch (error) {
      console.error('Error updating user document:', error);
    }
  };

  // Sign in with email and password
  const loginWithEmail = async (email, password) => {
    if (!firebaseReady || !auth) {
      return { success: false, error: 'Firebase not configured. Please set up Firebase credentials.' };
    }
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      trackActivity('email_login', { email });
      return { success: true, user: result.user };
    } catch (error) {
      trackActivity('login_failed', { email, error: error.code });
      return { success: false, error: error.message };
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email, password, displayName) => {
    if (!firebaseReady || !auth) {
      return { success: false, error: 'Firebase not configured. Please set up Firebase credentials.' };
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      trackActivity('signup', { email });
      return { success: true, user: result.user };
    } catch (error) {
      trackActivity('signup_failed', { email, error: error.code });
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    if (!firebaseReady || !auth || !googleProvider) {
      return { success: false, error: 'Firebase not configured. Please set up Firebase credentials.' };
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      trackActivity('google_login', { email: result.user.email });
      return { success: true, user: result.user };
    } catch (error) {
      trackActivity('google_login_failed', { error: error.code });
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const logout = async () => {
    if (!auth) return { success: false, error: 'Firebase not configured' };
    
    try {
      trackActivity('logout', { userId: user?.uid, email: user?.email });
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    if (!firebaseReady || !auth) {
      return { success: false, error: 'Firebase not configured. Please set up Firebase credentials.' };
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      trackActivity('password_reset_requested', { email });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    firebaseReady,
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
    ADMIN_EMAIL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
