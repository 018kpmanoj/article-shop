// Firebase Configuration
// =====================================================
// TO SET UP FIREBASE:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Go to Project Settings > General > Your apps
// 4. Click "Add app" > Web (</>)
// 5. Copy the firebaseConfig values below
// 6. Create .env.local file with these values:
//    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
//    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
// =====================================================

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
         process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== '' &&
         !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Demo');
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

// Initialize Firebase only if configured
let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    
    // Configure Google Provider
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('Firebase not configured. Please add your Firebase credentials to .env.local');
}

export { auth, db, googleProvider };
export const firebaseConfigured = isFirebaseConfigured();
export default app;
