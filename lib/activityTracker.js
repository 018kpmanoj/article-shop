'use client'

import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';

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
    userAgent: navigator.userAgent?.slice(0, 100),
    language: navigator.language,
    platform: navigator.platform,
    referrer: document.referrer?.slice(0, 100) || 'direct'
  };
};

// Track user activity
export const trackActivity = async (action, data = {}) => {
  if (!firebaseConfigured || !db) return false;
  
  try {
    const activityData = {
      action,
      data,
      sessionId: getSessionId(),
      visitorInfo: getVisitorInfo(),
      timestamp: serverTimestamp(),
      path: typeof window !== 'undefined' ? window.location.pathname : ''
    };

    await addDoc(collection(db, 'activities'), activityData);
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

// Get activities for admin panel - simplified query (no compound indexes needed)
export const getActivities = async (limitCount = 50) => {
  if (!firebaseConfigured || !db) return [];
  
  try {
    const snapshot = await getDocs(
      query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(limitCount))
    );
    
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

// Get login statistics - simplified
export const getLoginStats = async (days = 30) => {
  if (!firebaseConfigured || !db) {
    return { totalLogins: 0, totalSignups: 0, googleLogins: 0, emailLogins: 0, uniqueUsers: 0 };
  }

  try {
    const snapshot = await getDocs(
      query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(200))
    );
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const activities = snapshot.docs
      .map(doc => ({ ...doc.data(), timestamp: doc.data().timestamp?.toDate?.() || new Date() }))
      .filter(a => a.timestamp >= startDate);
    
    const loginActions = ['login', 'google_login', 'email_login'];
    const logins = activities.filter(a => loginActions.includes(a.action));
    
    return {
      totalLogins: logins.length,
      totalSignups: activities.filter(a => a.action === 'signup').length,
      googleLogins: activities.filter(a => a.action === 'google_login').length,
      emailLogins: activities.filter(a => a.action === 'email_login').length,
      uniqueUsers: [...new Set(activities.map(a => a.data?.email).filter(Boolean))].length
    };
  } catch (error) {
    console.error('Error fetching login stats:', error);
    return { totalLogins: 0, totalSignups: 0, googleLogins: 0, emailLogins: 0, uniqueUsers: 0 };
  }
};

// Get page view statistics - simplified
export const getPageViewStats = async (days = 7) => {
  if (!firebaseConfigured || !db) {
    return { totalViews: 0, uniqueSessions: 0, pageBreakdown: {} };
  }

  try {
    const snapshot = await getDocs(
      query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(500))
    );
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const views = snapshot.docs
      .map(doc => doc.data())
      .filter(a => a.action === 'page_view' && (a.timestamp?.toDate?.() || new Date()) >= startDate);
    
    const pageGroups = views.reduce((acc, view) => {
      const path = view.path || view.data?.pagePath || '/';
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalViews: views.length,
      uniqueSessions: [...new Set(views.map(v => v.sessionId).filter(Boolean))].length,
      pageBreakdown: pageGroups
    };
  } catch (error) {
    console.error('Error fetching page view stats:', error);
    return { totalViews: 0, uniqueSessions: 0, pageBreakdown: {} };
  }
};
