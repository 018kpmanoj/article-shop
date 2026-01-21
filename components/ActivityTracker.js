'use client'

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/activityTracker';
import { trackVisitor } from '@/lib/visitorAnalytics';
import { useAuth } from '@/context/AuthContext';

export default function ActivityTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    // Track page view on route change
    if (pathname && pathname !== lastTrackedPath.current) {
      lastTrackedPath.current = pathname;
      const pageTitle = document.title || 'K P Manoj Tech';
      
      // Track page view (existing)
      trackPageView(pathname, pageTitle);
      
      // Track visitor (new - includes anonymous tracking)
      trackVisitor(user, pathname);
    }
  }, [pathname, user]);

  // This component doesn't render anything
  return null;
}
