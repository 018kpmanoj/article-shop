'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    // Re-run animations on route change
    const scrollElements = document.querySelectorAll('.scroll-reveal')
    scrollElements.forEach(el => {
      el.classList.remove('revealed')
    })

    // Scroll reveal animations - re-trigger on visibility
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        } else {
          // Remove revealed class when out of view so it can re-trigger
          entry.target.classList.remove('revealed')
        }
      })
    }, observerOptions)

    // Observe all scroll-reveal elements
    setTimeout(() => {
      const elements = document.querySelectorAll('.scroll-reveal')
      elements.forEach(el => observer.observe(el))
    }, 100)

    // Background gradient shift on scroll
    const handleScroll = () => {
      const sections = document.querySelectorAll('.gradient-shift')
      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
          section.classList.add('scrolled')
        } else {
          section.classList.remove('scrolled')
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  return null
}

