'use client'

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/activityTracker';

export default function ActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    if (pathname) {
      const pageTitle = document.title || 'K P Manoj Tech';
      trackPageView(pathname, pageTitle);
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
