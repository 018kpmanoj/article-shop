'use client'

import { collection, addDoc, getDocs, query, where, serverTimestamp, updateDoc, doc, increment, getDoc } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';

// Product catalog data - Books, Clothing, Merchandise
export const PRODUCTS = [
  {
    id: 'book-agentic-ai',
    title: 'Mastering Agentic AI',
    subtitle: 'Build Intelligent Autonomous Systems',
    description: 'A comprehensive guide to building enterprise-grade AI agent systems. Learn patterns, architectures, and best practices from real-world implementations.',
    type: 'book',
    status: 'coming_soon',
    bgGradient: 'bg-gradient-to-br from-blue-600 to-indigo-700',
    price: null,
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
    price: null,
    features: [
      'Leadership Frameworks',
      'Team Building Strategies',
      'Technical Decision Making',
      'Career Growth Roadmap'
    ]
  },
  {
    id: 'tshirt-ai-developer',
    title: 'AI Developer T-Shirt',
    subtitle: 'Premium Cotton Apparel',
    description: 'Show your passion for AI with this premium quality t-shirt. Features unique AI-themed designs that spark conversations.',
    type: 'clothing',
    status: 'coming_soon',
    bgGradient: 'bg-gradient-to-br from-purple-600 to-pink-600',
    price: null,
    features: [
      '100% Premium Cotton',
      'Unique AI-themed Design',
      'Multiple Sizes Available',
      'Comfortable Fit'
    ]
  },
  {
    id: 'hoodie-tech-trendy',
    title: 'Tech Trendy Hoodie',
    subtitle: 'Cozy & Stylish',
    description: 'Stay warm and stylish with this tech-themed hoodie. Perfect for coding sessions, meetups, or casual wear.',
    type: 'clothing',
    status: 'coming_soon',
    bgGradient: 'bg-gradient-to-br from-gray-700 to-gray-900',
    price: null,
    features: [
      'Soft Fleece Interior',
      'Front Kangaroo Pocket',
      'Adjustable Hood',
      'Tech-inspired Graphics'
    ]
  },
  {
    id: 'mug-code-coffee',
    title: 'Code & Coffee Mug',
    subtitle: 'For the Caffeinated Developer',
    description: 'Start your day right with this programmer-themed coffee mug. Durable ceramic construction with witty tech quotes.',
    type: 'merch',
    status: 'coming_soon',
    bgGradient: 'bg-gradient-to-br from-orange-500 to-red-600',
    price: null,
    features: [
      'High-quality Ceramic',
      'Microwave Safe',
      'Large 15oz Capacity',
      'Unique Tech Quotes'
    ]
  },
  {
    id: 'bundle-starter-kit',
    title: 'Tech Creator Bundle',
    subtitle: 'Everything You Need',
    description: 'Get the complete package! Includes book, t-shirt, and mug at a special bundle price. Perfect gift for tech enthusiasts.',
    type: 'bundle',
    status: 'coming_soon',
    bgGradient: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    price: null,
    features: [
      'Agentic AI Book',
      'Premium T-Shirt',
      'Coffee Mug',
      'Exclusive Sticker Pack'
    ]
  }
];

/**
 * Register interest in a product
 */
export const registerProductInterest = async (productId, email, additionalData = {}) => {
  if (!firebaseConfigured || !db) {
    // Store locally if Firebase not configured
    try {
      const interests = JSON.parse(localStorage.getItem('product_interests') || '[]');
      interests.push({ productId, email, timestamp: new Date().toISOString(), ...additionalData });
      localStorage.setItem('product_interests', JSON.stringify(interests));
      return { success: true, message: 'Thank you! We\'ll notify you when this launches.' };
    } catch {
      return { success: false, message: 'Unable to save. Please try again.' };
    }
  }

  const normalizedEmail = email.toLowerCase().trim();
  
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
      registeredAt: serverTimestamp(),
      notified: false,
      source: 'website',
      ...additionalData
    });

    return { success: true, message: 'Thank you! We\'ll notify you when this launches.' };
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

/**
 * Get product by ID
 */
export const getProductById = (productId) => {
  return PRODUCTS.find(p => p.id === productId) || null;
};

/**
 * Get all products
 */
export const getAllProducts = () => {
  return PRODUCTS;
};
