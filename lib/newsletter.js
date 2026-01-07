'use client'

import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';

// Subscribe to newsletter with better error handling
export const subscribeToNewsletter = async (email) => {
  console.log('Subscribing email:', email);
  console.log('Firebase configured:', firebaseConfigured);
  console.log('DB available:', !!db);
  
  if (!firebaseConfigured) {
    console.error('Firebase not configured');
    return { success: false, error: 'Firebase not configured. Please check .env.local' };
  }
  
  if (!db) {
    console.error('Firestore DB not available');
    return { success: false, error: 'Database not available. Please refresh the page.' };
  }

  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    // Check if already subscribed
    console.log('Checking existing subscription...');
    const existingQuery = query(
      collection(db, 'newsletter_subscribers'),
      where('email', '==', normalizedEmail)
    );
    const existing = await getDocs(existingQuery);
    
    if (!existing.empty) {
      console.log('Email already subscribed');
      return { success: false, error: 'This email is already subscribed!' };
    }

    // Add new subscriber
    console.log('Adding new subscriber...');
    const docRef = await addDoc(collection(db, 'newsletter_subscribers'), {
      email: normalizedEmail,
      subscribedAt: serverTimestamp(),
      active: true,
      source: 'website'
    });

    console.log('Subscriber added with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Check for specific Firebase errors
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Database permission denied. Please set up Firestore rules.' };
    }
    if (error.code === 'unavailable') {
      return { success: false, error: 'Database unavailable. Please try again.' };
    }
    
    return { success: false, error: error.message || 'Failed to subscribe. Please try again.' };
  }
};

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = async (email) => {
  if (!firebaseConfigured || !db) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const q = query(
      collection(db, 'newsletter_subscribers'),
      where('email', '==', email.toLowerCase().trim())
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: 'Email not found' };
    }

    await deleteDoc(doc(db, 'newsletter_subscribers', snapshot.docs[0].id));
    return { success: true };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return { success: false, error: error.message };
  }
};

// Get all subscribers (admin only) - simplified query
export const getSubscribers = async () => {
  if (!firebaseConfigured || !db) {
    console.warn('Cannot get subscribers - DB not configured');
    return [];
  }

  try {
    const snapshot = await getDocs(collection(db, 'newsletter_subscribers'));
    console.log('Found subscribers:', snapshot.size);
    
    const subs = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        subscribedAt: doc.data().subscribedAt?.toDate?.() || new Date()
      }))
      .filter(sub => sub.active !== false)
      .sort((a, b) => b.subscribedAt - a.subscribedAt);
    
    return subs;
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
};

// Get subscriber count - simplified
export const getSubscriberCount = async () => {
  if (!firebaseConfigured || !db) {
    return 0;
  }

  try {
    const snapshot = await getDocs(collection(db, 'newsletter_subscribers'));
    return snapshot.docs.filter(doc => doc.data().active !== false).length;
  } catch (error) {
    console.error('Error counting subscribers:', error);
    return 0;
  }
};

// Send newsletter email via API route
export const sendNewsletterEmail = async (to) => {
  try {
    const response = await fetch('/api/newsletter/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_test', email: to })
    });
    return await response.json();
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send test email to admin
export const sendTestNewsletter = async () => {
  return sendNewsletterEmail('018kpmanoj@gmail.com');
};

// Generate newsletter content (for admin preview)
export const generateNewsletterContent = (articles) => {
  const safeArticles = articles || [];
  return safeArticles.slice(0, 5).map(a => `- ${a.title}`).join('\n');
};
