import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import HowItWorks from '../components/HowItWorks'
import Banner from '../components/Banner'
import AnimatedBackground from '../components/AnimatedBackground'
import GridBackground from '../components/GridBackground'

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    // Set up smooth scroll animations
    const ctx = gsap.context(() => {
      // Animate sections on scroll
      gsap.utils.toArray('.section-animate').forEach((section, index) => {
        gsap.from(section, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative overflow-hidden min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Modern Healthcare UI Background Layers */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900/20"></div>
        
        {/* Animated Grid Background - Subtle dot pattern */}
        <GridBackground />
        
        {/* Animated Particle Background - Soft bokeh effects */}
        <AnimatedBackground variant="default" />
        
        {/* Additional soft gradient orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-10"
            style={{
              width: `${300 + i * 200}px`,
              height: `${300 + i * 200}px`,
              background: `radial-gradient(circle, ${
                i === 0 ? 'rgba(147, 197, 253, 0.15)' : 
                i === 1 ? 'rgba(196, 181, 253, 0.12)' : 
                'rgba(95, 111, 255, 0.10)'
              } 0%, transparent 70%)`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <div className="section-animate">
          <SpecialityMenu />
        </div>
        <div className="section-animate">
          <TopDoctors compact />
        </div>
        <div className="section-animate">
          <HowItWorks />
        </div>
        <div className="section-animate">
          <Banner />
        </div>
      </div>
    </div>
  )
}

export default Home
