'use client'

import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';

// Product catalog - Only books for now, more coming soon
export const PRODUCTS = [
  {
    id: 'book-agentic-ai',
    title: 'Mastering Agentic AI',
    subtitle: 'Build Intelligent Autonomous Systems',
    description: 'A comprehensive guide to building enterprise-grade AI agent systems. Learn patterns, architectures, and best practices from real-world implementations.',
    type: 'book',
    status: 'coming_soon',
    bgGradient: 'bg-gradient-to-br from-blue-600 to-indigo-700',
    features: [
      'Multi-Agent Architecture Patterns',
      'Enterprise Scale Design',
      'Real-world Case Studies',
      'Code Examples & Templates'
    ]
  },
  {
    id: 'book-tech-leadership',
    title: 'Tech Leadership Handbook',
    subtitle: 'From Developer to Tech Leader',
    description: 'Practical insights on transitioning from developer to tech leader. Covers team management, architecture decisions, and stakeholder communication.',
    type: 'book',
    status: 'coming_soon',
    bgGradient: 'bg-gradient-to-br from-green-600 to-teal-700',
    features: [
      'Leadership Frameworks',
      'Team Building Strategies',
      'Technical Decision Making',
      'Career Growth Roadmap'
    ]
  }
];

// More products coming soon (shown as placeholder)
export const COMING_SOON_CATEGORIES = [
  { name: 'T-Shirts & Apparel', icon: 'clothing', description: 'Tech-themed premium clothing' },
  { name: 'Mugs & Accessories', icon: 'merch', description: 'Developer lifestyle products' },
  { name: 'Online Courses', icon: 'course', description: 'In-depth video tutorials' },
  { name: 'Templates & Kits', icon: 'template', description: 'Ready-to-use starter kits' }
];

/**
 * Register interest in a product (requires user to be signed in)
 */
export const registerProductInterest = async (productId, userEmail, userName = '') => {
  if (!userEmail) {
    return { success: false, message: 'Please sign in to get notified.' };
  }

  if (!firebaseConfigured || !db) {
    // Store locally if Firebase not configured
    try {
      const interests = JSON.parse(localStorage.getItem('product_interests') || '[]');
      const exists = interests.find(i => i.productId === productId && i.email === userEmail);
      if (exists) {
        return { success: false, message: 'You\'re already on the list!' };
      }
      interests.push({ productId, email: userEmail, name: userName, timestamp: new Date().toISOString() });
      localStorage.setItem('product_interests', JSON.stringify(interests));
      return { success: true, message: 'You\'ll be notified when this launches!' };
    } catch {
      return { success: false, message: 'Unable to save. Please try again.' };
    }
  }

  const normalizedEmail = userEmail.toLowerCase().trim();
  
  try {
    // Check if already interested
    const existingQuery = query(
      collection(db, 'product_interests'),
      where('productId', '==', productId),
      where('email', '==', normalizedEmail)
    );
    const existing = await getDocs(existingQuery);
    
    if (!existing.empty) {
      return { success: false, message: 'You\'re already on the list for this product!' };
    }

    // Add interest
    await addDoc(collection(db, 'product_interests'), {
      productId,
      email: normalizedEmail,
      name: userName,
      registeredAt: serverTimestamp(),
      notified: false
    });

    return { success: true, message: 'You\'ll be notified when this launches!' };
  } catch (error) {
    console.error('Error registering product interest:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

/**
 * Get interest count for a product
 */
export const getProductInterestCount = async (productId) => {
  if (!firebaseConfigured || !db) {
    try {
      const interests = JSON.parse(localStorage.getItem('product_interests') || '[]');
      return interests.filter(i => i.productId === productId).length;
    } catch {
      return 0;
    }
  }

  try {
    const q = query(
      collection(db, 'product_interests'),
      where('productId', '==', productId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting interest count:', error);
    return 0;
  }
};

/**
 * Check if user is already interested in a product
 */
export const isUserInterested = async (productId, userEmail) => {
  if (!userEmail) return false;
  
  if (!firebaseConfigured || !db) {
    try {
      const interests = JSON.parse(localStorage.getItem('product_interests') || '[]');
      return interests.some(i => i.productId === productId && i.email === userEmail.toLowerCase());
    } catch {
      return false;
    }
  }

  try {
    const q = query(
      collection(db, 'product_interests'),
      where('productId', '==', productId),
      where('email', '==', userEmail.toLowerCase())
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch {
    return false;
  }
};

/**
 * Get all product interests (admin)
 */
export const getAllProductInterests = async () => {
  if (!firebaseConfigured || !db) {
    try {
      return JSON.parse(localStorage.getItem('product_interests') || '[]');
    } catch {
      return [];
    }
  }

  try {
    const snapshot = await getDocs(collection(db, 'product_interests'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      registeredAt: doc.data().registeredAt?.toDate?.() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching product interests:', error);
    return [];
  }
};

/**
 * Get product stats for admin dashboard
 */
export const getProductStats = async () => {
  if (!firebaseConfigured || !db) {
    try {
      const interests = JSON.parse(localStorage.getItem('product_interests') || '[]');
      const byProduct = {};
      interests.forEach(i => {
        byProduct[i.productId] = (byProduct[i.productId] || 0) + 1;
      });
      return { totalInterests: interests.length, byProduct };
    } catch {
      return { totalInterests: 0, byProduct: {} };
    }
  }

  try {
    const snapshot = await getDocs(collection(db, 'product_interests'));
    const byProduct = {};
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      byProduct[data.productId] = (byProduct[data.productId] || 0) + 1;
    });
    
    return {
      totalInterests: snapshot.size,
      byProduct
    };
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return { totalInterests: 0, byProduct: {} };
  }
};

export const getProductById = (productId) => PRODUCTS.find(p => p.id === productId) || null;
export const getAllProducts = () => PRODUCTS;
