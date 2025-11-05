import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

const AnimatedBackground = ({ variant = 'default' }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create soft, scattered blurry circles (bokeh effect) - modern healthcare aesthetic
    const particles = []
    const particleCount = variant === 'intense' ? 30 : 20

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute rounded-full'
      
      // Random size for organic feel
      const size = 40 + Math.random() * 120 // 40-160px
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      
      // Soft healthcare colors - light blue and purple
      const colors = [
        'rgba(95, 111, 255, 0.06)',   // Soft primary blue
        'rgba(118, 75, 162, 0.06)',   // Soft purple
        'rgba(102, 126, 234, 0.05)',  // Soft blue-purple
        'rgba(147, 197, 253, 0.04)',  // Very light blue
        'rgba(196, 181, 253, 0.04)'   // Very light purple
      ]
      particle.style.background = colors[Math.floor(Math.random() * colors.length)]
      particle.style.filter = 'blur(40px)' // Soft blur for bokeh effect
      particle.style.opacity = '0.3'
      
      container.appendChild(particle)
      particles.push(particle)
    }

    // Gentle floating animation for organic movement
    particles.forEach((particle, index) => {
      const duration = 20 + Math.random() * 15 // Slow, calming movement
      const delay = index * 0.5
      
      gsap.to(particle, {
        x: `+=${(Math.random() - 0.5) * 100}`,
        y: `+=${(Math.random() - 0.5) * 100}`,
        opacity: 0.2 + Math.random() * 0.2,
        scale: 0.8 + Math.random() * 0.4,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay
      })
    })

    // Create soft gradient orbs for depth
    const orbs = []
    const orbCount = variant === 'intense' ? 4 : 3

    for (let i = 0; i < orbCount; i++) {
      const orb = document.createElement('div')
      orb.className = 'absolute opacity-20 blur-3xl'
      
      const size = 200 + Math.random() * 300 // 200-500px
      orb.style.width = `${size}px`
      orb.style.height = `${size}px`
      orb.style.borderRadius = '50%'
      orb.style.left = `${Math.random() * 100}%`
      orb.style.top = `${Math.random() * 100}%`
      
      // Soft gradient orbs
      const gradients = [
        'radial-gradient(circle, rgba(95, 111, 255, 0.15) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(118, 75, 162, 0.12) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(147, 197, 253, 0.10) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(196, 181, 253, 0.10) 0%, transparent 70%)'
      ]
      orb.style.background = gradients[Math.floor(Math.random() * gradients.length)]
      
      container.appendChild(orb)
      orbs.push(orb)
    }

    // Gentle movement for orbs
    orbs.forEach((orb, index) => {
      gsap.to(orb, {
        x: `+=${(Math.random() - 0.5) * 150}`,
        y: `+=${(Math.random() - 0.5) * 150}`,
        scale: 0.9 + Math.random() * 0.3,
        opacity: 0.1 + Math.random() * 0.15,
        duration: 25 + Math.random() * 15,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: index * 3
      })
    })

    return () => {
      particles.forEach(p => p.remove())
      orbs.forEach(o => o.remove())
    }
  }, [variant])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
      style={{ 
        background: variant === 'intense' 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 250, 255, 0.98) 50%, rgba(255, 255, 255, 0.95) 100%)'
          : 'transparent'
      }}
    />
  )
}

export default AnimatedBackground
