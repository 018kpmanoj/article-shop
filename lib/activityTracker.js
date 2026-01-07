'use client'

import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Generate a unique session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// Get visitor fingerprint (basic)
const getVisitorInfo = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || 'direct'
  };
};

// Track user activity
export const trackActivity = async (action, data = {}) => {
  try {
    const sessionId = getSessionId();
    const visitorInfo = getVisitorInfo();
    
    const activityData = {
      action,
      data,
      sessionId,
      visitorInfo,
      timestamp: serverTimestamp(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      path: typeof window !== 'undefined' ? window.location.pathname : ''
    };

    await addDoc(collection(db, 'activities'), activityData);
    
    // Also store in localStorage for rate limiting
    storeLocalActivity(action);
    
    return true;
  } catch (error) {
    console.error('Error tracking activity:', error);
    return false;
  }
};

// Track page view
export const trackPageView = async (pagePath, pageTitle) => {
  return trackActivity('page_view', { pagePath, pageTitle });
};

// Track article read
export const trackArticleRead = async (articleSlug, articleTitle) => {
  return trackActivity('article_read', { articleSlug, articleTitle });
};

// Track search
export const trackSearch = async (searchQuery) => {
  return trackActivity('search', { query: searchQuery });
};

// Track newsletter subscription
export const trackNewsletterSubscription = async (email) => {
  return trackActivity('newsletter_subscription', { email });
};

// Store activity locally for rate limiting
const storeLocalActivity = (action) => {
  if (typeof window === 'undefined') return;
  
  const activities = JSON.parse(localStorage.getItem('activity_log') || '[]');
  activities.push({
    action,
    timestamp: Date.now()
  });
  
  // Keep only last 100 activities
  const trimmed = activities.slice(-100);
  localStorage.setItem('activity_log', JSON.stringify(trimmed));
};

// Get activities for admin panel
export const getActivities = async (limitCount = 100, filterOptions = {}) => {
  try {
    let q = query(
      collection(db, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

// Get login statistics
export const getLoginStats = async (days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const q = query(
      collection(db, 'activities'),
      where('action', 'in', ['login', 'google_login', 'email_login', 'signup']),
      where('timestamp', '>=', startDate),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date()
    }));
    
    // Calculate stats
    const stats = {
      totalLogins: activities.filter(a => ['login', 'google_login', 'email_login'].includes(a.action)).length,
      totalSignups: activities.filter(a => a.action === 'signup').length,
      googleLogins: activities.filter(a => a.action === 'google_login').length,
      emailLogins: activities.filter(a => a.action === 'email_login').length,
      uniqueUsers: [...new Set(activities.map(a => a.data?.email).filter(Boolean))].length,
      activities
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching login stats:', error);
    return {
      totalLogins: 0,
      totalSignups: 0,
      googleLogins: 0,
      emailLogins: 0,
      uniqueUsers: 0,
      activities: []
    };
  }
};

// Get page view statistics
export const getPageViewStats = async (days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const q = query(
      collection(db, 'activities'),
      where('action', '==', 'page_view'),
      where('timestamp', '>=', startDate),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const views = snapshot.docs.map(doc => doc.data());
    
    // Group by page
    const pageGroups = views.reduce((acc, view) => {
      const path = view.path || 'unknown';
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalViews: views.length,
      uniqueSessions: [...new Set(views.map(v => v.sessionId))].length,
      pageBreakdown: pageGroups
    };
  } catch (error) {
    console.error('Error fetching page view stats:', error);
    return { totalViews: 0, uniqueSessions: 0, pageBreakdown: {} };
  }
};
