'use client'

import { collection, addDoc, getDocs, query, orderBy, limit, where, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';

/**
 * Generate a fingerprint for anonymous visitors
 * Privacy-friendly - doesn't collect sensitive data
 */
const generateVisitorFingerprint = () => {
  if (typeof window === 'undefined') return null;
  
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown'
  ];
  
  // Simple hash function
  const hash = components.join('|').split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return Math.abs(hash).toString(36);
};

/**
 * Get or create visitor ID
 */
const getVisitorId = () => {
  if (typeof window === 'undefined') return null;
  
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

/**
 * Get session ID
 */
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

/**
 * Track visitor (anonymous or authenticated)
 * @param {Object|null} user - Firebase user object if signed in
 * @param {string} page - Current page path
 */
export const trackVisitor = async (user, page = '/') => {
  if (!firebaseConfigured || !db) return false;
  
  try {
    const visitorData = {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      fingerprint: generateVisitorFingerprint(),
      isAnonymous: !user,
      userId: user?.uid || null,
      email: user?.email || null,
      displayName: user?.displayName || null,
      page,
      timestamp: serverTimestamp(),
      referrer: document.referrer || 'direct',
      device: getDeviceType(),
      browser: getBrowserInfo(),
      screenSize: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : null
    };

    await addDoc(collection(db, 'visitors'), visitorData);
    return true;
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return false;
  }
};

/**
 * Get device type
 */
const getDeviceType = () => {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    if (/ipad|tablet/i.test(ua)) return 'tablet';
    return 'mobile';
  }
  return 'desktop';
};

/**
 * Get browser info
 */
const getBrowserInfo = () => {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Other';
};

/**
 * Get visitor analytics for admin dashboard
 * @param {number} days - Number of days to look back
 * @returns {Object} - Analytics data
 */
export const getVisitorAnalytics = async (days = 7) => {
  if (!firebaseConfigured || !db) {
    return {
      totalVisitors: 0,
      uniqueVisitors: 0,
      anonymousVisitors: 0,
      signedInVisitors: 0,
      signedInEmails: [],
      deviceBreakdown: {},
      browserBreakdown: {},
      pageBreakdown: {},
      dailyVisits: [],
      recentVisitors: []
    };
  }

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const snapshot = await getDocs(
      query(collection(db, 'visitors'), orderBy('timestamp', 'desc'), limit(1000))
    );
    
    const visitors = snapshot.docs
      .map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date()
      }))
      .filter(v => v.timestamp >= startDate);
    
    // Calculate analytics
    const uniqueVisitorIds = new Set(visitors.map(v => v.visitorId));
    const anonymousVisitors = visitors.filter(v => v.isAnonymous);
    const signedInVisitors = visitors.filter(v => !v.isAnonymous);
    const uniqueEmails = [...new Set(signedInVisitors.map(v => v.email).filter(Boolean))];
    
    // Device breakdown
    const deviceBreakdown = visitors.reduce((acc, v) => {
      acc[v.device || 'unknown'] = (acc[v.device || 'unknown'] || 0) + 1;
      return acc;
    }, {});
    
    // Browser breakdown
    const browserBreakdown = visitors.reduce((acc, v) => {
      acc[v.browser || 'unknown'] = (acc[v.browser || 'unknown'] || 0) + 1;
      return acc;
    }, {});
    
    // Page breakdown
    const pageBreakdown = visitors.reduce((acc, v) => {
      const page = v.page || '/';
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {});
    
    // Daily visits
    const dailyVisits = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayVisits = visitors.filter(v => 
        v.timestamp.toISOString().split('T')[0] === dateStr
      );
      
      dailyVisits.unshift({
        date: dateStr,
        total: dayVisits.length,
        unique: new Set(dayVisits.map(v => v.visitorId)).size,
        anonymous: dayVisits.filter(v => v.isAnonymous).length,
        signedIn: dayVisits.filter(v => !v.isAnonymous).length
      });
    }
    
    // Recent unique visitors (last 20)
    const seenVisitors = new Set();
    const recentVisitors = [];
    
    for (const v of visitors) {
      if (!seenVisitors.has(v.visitorId) && recentVisitors.length < 20) {
        seenVisitors.add(v.visitorId);
        recentVisitors.push({
          visitorId: v.visitorId,
          isAnonymous: v.isAnonymous,
          email: v.email,
          displayName: v.displayName,
          device: v.device,
          browser: v.browser,
          lastSeen: v.timestamp,
          page: v.page
        });
      }
    }
    
    return {
      totalVisitors: visitors.length,
      uniqueVisitors: uniqueVisitorIds.size,
      anonymousVisitors: anonymousVisitors.length,
      signedInVisitors: signedInVisitors.length,
      signedInEmails: uniqueEmails.map(email => ({
        email,
        visits: signedInVisitors.filter(v => v.email === email).length,
        lastVisit: signedInVisitors.find(v => v.email === email)?.timestamp
      })),
      deviceBreakdown,
      browserBreakdown,
      pageBreakdown,
      dailyVisits,
      recentVisitors
    };
  } catch (error) {
    console.error('Error fetching visitor analytics:', error);
    return {
      totalVisitors: 0,
      uniqueVisitors: 0,
      anonymousVisitors: 0,
      signedInVisitors: 0,
      signedInEmails: [],
      deviceBreakdown: {},
      browserBreakdown: {},
      pageBreakdown: {},
      dailyVisits: [],
      recentVisitors: []
    };
  }
};

/**
 * Get real-time visitor count (active in last 5 minutes)
 */
export const getActiveVisitors = async () => {
  if (!firebaseConfigured || !db) return 0;
  
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const snapshot = await getDocs(
      query(collection(db, 'visitors'), orderBy('timestamp', 'desc'), limit(100))
    );
    
    const activeVisitors = snapshot.docs
      .map(doc => doc.data())
      .filter(v => v.timestamp?.toDate?.() >= fiveMinutesAgo);
    
    return new Set(activeVisitors.map(v => v.sessionId)).size;
  } catch (error) {
    console.error('Error getting active visitors:', error);
    return 0;
  }
};
