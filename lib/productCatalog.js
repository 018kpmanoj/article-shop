'use client'

import { collection, addDoc, getDocs, query, where, serverTimestamp, updateDoc, doc, increment, getDoc } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';

// Product catalog data (can be expanded or moved to CMS)
export const PRODUCTS = [
  {
    id: 'book-agentic-ai',
    title: 'Mastering Agentic AI',
    subtitle: 'Build Intelligent Autonomous Systems',
    description: 'A comprehensive guide to building enterprise-grade AI agent systems. Learn patterns, architectures, and best practices from real-world implementations.',
    type: 'book',
    status: 'coming_soon',
    coverImage: '/products/agentic-ai-book.png',
    price: null, // TBA
    features: [
      'Multi-Agent Architecture Patterns',
      'Enterprise Scale Design',
      'Real-world Case Studies',
      'Code Examples & Templates'
    ],
    chapters: [
      'Introduction to Agentic AI',
      'Agent Architecture Fundamentals',
      'Multi-Agent Orchestration',
      'Enterprise Deployment',
      'Security & Governance',
      'Future of AI Agents'
    ]
  },
  {
    id: 'course-ai-agents',
    title: 'AI Agents Masterclass',
    subtitle: 'From Zero to Production',
    description: 'Video course covering everything you need to know about building AI agents. Perfect for developers and architects looking to implement AI solutions.',
    type: 'course',
    status: 'coming_soon',
    coverImage: '/products/ai-course.png',
    price: null,
    features: [
      '20+ Hours of Content',
      'Hands-on Projects',
      'Certificate of Completion',
      'Lifetime Access'
    ]
  },
  {
    id: 'template-agent-starter',
    title: 'Agent Starter Kit',
    subtitle: 'Production-Ready Templates',
    description: 'Ready-to-use templates and boilerplate code for building AI agents. Save weeks of development time.',
    type: 'template',
    status: 'coming_soon',
    coverImage: '/products/template-kit.png',
    price: null,
    features: [
      'Multi-Agent Framework',
      'RAG Implementation',
      'Tool Integration',
      'Deployment Scripts'
    ]
  }
];

/**
 * Register interest in a product
 * @param {string} productId - Product ID
 * @param {string} email - User email
 * @param {Object} additionalData - Additional user data
 * @returns {Object} - { success: boolean, message: string }
 */
export const registerProductInterest = async (productId, email, additionalData = {}) => {
  if (!firebaseConfigured || !db) {
    // Store locally if Firebase not configured
    const interests = JSON.parse(localStorage.getItem('product_interests') || '[]');
    interests.push({ productId, email, timestamp: new Date().toISOString(), ...additionalData });
    localStorage.setItem('product_interests', JSON.stringify(interests));
    return { success: true, message: 'Interest registered locally' };
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
      return { success: false, message: 'You\'re already on the interest list for this product!' };
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

    // Update product interest count
    await updateProductInterestCount(productId, 1);

    return { success: true, message: 'Thank you! We\'ll notify you when this becomes available.' };
  } catch (error) {
    console.error('Error registering product interest:', error);
    return { success: false, message: error.message || 'Failed to register interest' };
  }
};

/**
 * Update the interest count for a product
 */
const updateProductInterestCount = async (productId, incrementBy = 1) => {
  if (!firebaseConfigured || !db) return;

  try {
    const statsRef = doc(db, 'product_stats', productId);
    const statsDoc = await getDoc(statsRef);
    
    if (statsDoc.exists()) {
      await updateDoc(statsRef, {
        interestCount: increment(incrementBy),
        lastUpdated: serverTimestamp()
      });
    } else {
      await addDoc(collection(db, 'product_stats'), {
        productId,
        interestCount: incrementBy,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating interest count:', error);
  }
};

/**
 * Get interest count for a product
 * @param {string} productId - Product ID
 * @returns {number} - Interest count
 */
export const getProductInterestCount = async (productId) => {
  if (!firebaseConfigured || !db) {
    const interests = JSON.parse(localStorage.getItem('product_interests') || '[]');
    return interests.filter(i => i.productId === productId).length;
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
 * @returns {Array} - List of interests
 */
export const getAllProductInterests = async () => {
  if (!firebaseConfigured || !db) {
    return JSON.parse(localStorage.getItem('product_interests') || '[]');
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
 * @returns {Object} - { totalInterests: number, byProduct: {} }
 */
export const getProductStats = async () => {
  if (!firebaseConfigured || !db) {
    const interests = JSON.parse(localStorage.getItem('product_interests') || '[]');
    const byProduct = {};
    interests.forEach(i => {
      byProduct[i.productId] = (byProduct[i.productId] || 0) + 1;
    });
    return { totalInterests: interests.length, byProduct };
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
 * @param {string} productId - Product ID
 * @returns {Object|null} - Product data
 */
export const getProductById = (productId) => {
  return PRODUCTS.find(p => p.id === productId) || null;
};

/**
 * Get all products
 * @returns {Array} - All products
 */
export const getAllProducts = () => {
  return PRODUCTS;
};
