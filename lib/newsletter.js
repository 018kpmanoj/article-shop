'use client'

import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';

// Subscribe to newsletter
export const subscribeToNewsletter = async (email) => {
  if (!firebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    // Check if already subscribed
    const existingQuery = query(
      collection(db, 'newsletter_subscribers'),
      where('email', '==', email.toLowerCase())
    );
    const existing = await getDocs(existingQuery);
    
    if (!existing.empty) {
      return { success: false, error: 'Email already subscribed' };
    }

    // Add new subscriber
    await addDoc(collection(db, 'newsletter_subscribers'), {
      email: email.toLowerCase(),
      subscribedAt: serverTimestamp(),
      active: true,
      lastEmailSent: null
    });

    return { success: true };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, error: error.message };
  }
};

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = async (email) => {
  if (!firebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const q = query(
      collection(db, 'newsletter_subscribers'),
      where('email', '==', email.toLowerCase())
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: 'Email not found' };
    }

    // Delete the subscription
    await deleteDoc(doc(db, 'newsletter_subscribers', snapshot.docs[0].id));
    return { success: true };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return { success: false, error: error.message };
  }
};

// Get all subscribers (admin only)
export const getSubscribers = async () => {
  if (!firebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(
      collection(db, 'newsletter_subscribers'),
      where('active', '==', true),
      orderBy('subscribedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      subscribedAt: doc.data().subscribedAt?.toDate?.() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
};

// Get subscriber count
export const getSubscriberCount = async () => {
  if (!firebaseConfigured || !db) {
    return 0;
  }

  try {
    const q = query(
      collection(db, 'newsletter_subscribers'),
      where('active', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error counting subscribers:', error);
    return 0;
  }
};

// Send newsletter email via API route
export const sendNewsletterEmail = async (to, subject, content) => {
  try {
    const response = await fetch('/api/newsletter/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'send_test',
        email: to
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send test email to admin
export const sendTestNewsletter = async () => {
  try {
    const response = await fetch('/api/newsletter/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'send_test',
        email: '018kpmanoj@gmail.com'
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Test email error:', error);
    return { success: false, error: error.message };
  }
};

// Generate newsletter content from articles
export const generateNewsletterContent = (articles, isNew = true) => {
  const articlesList = articles.slice(0, 5).map(article => `
    <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
      <h3 style="margin: 0 0 10px 0; color: #1a1a2e;">
        <a href="https://kpmtechworld.netlify.app/articles/${article.slug}" style="color: #3b82f6; text-decoration: none;">
          ${article.title}
        </a>
      </h3>
      <p style="margin: 0; color: #666; font-size: 14px;">
        ${article.excerpt || article.description?.slice(0, 150)}...
      </p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
        ${article.category} • ${article.readTime || '5 min read'}
      </p>
    </div>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">K P Manoj Tech Trends</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0;">Weekly AI & Technology Insights</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #1a1a2e; margin-bottom: 20px;">
          ${isNew ? '🆕 This Week\'s New Articles' : '📚 Recommended Articles for You'}
        </h2>
        
        ${articlesList}
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://kpmtechworld.netlify.app/articles" 
             style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            View All Articles
          </a>
        </div>
      </div>
      
      <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p>You received this email because you subscribed to K P Manoj Tech Trends newsletter.</p>
        <p>
          <a href="https://kpmtechworld.netlify.app" style="color: #3b82f6;">Visit Website</a> | 
          <a href="mailto:018kpmanoj@gmail.com" style="color: #3b82f6;">Contact</a>
        </p>
      </div>
    </div>
  `;
};
