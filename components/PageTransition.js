'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 600)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div className={`page-transition-wrapper ${isAnimating ? 'transitioning' : ''}`}>
      {children}
    </div>
  )
}

