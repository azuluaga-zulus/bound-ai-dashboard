'use client'

import { useEffect } from 'react'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical fonts
    const fontLinks = [
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
    ]
    
    fontLinks.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = href
      document.head.appendChild(link)
    })

    // Optimize scroll performance
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll-based animations can be added here
          ticking = false
        })
        ticking = true
      }
    }

    // Add passive scroll listener for better performance
    document.addEventListener('scroll', handleScroll, { passive: true })

    // Preconnect to external domains
    const preconnectLinks = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']
    preconnectLinks.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = href
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return null
}