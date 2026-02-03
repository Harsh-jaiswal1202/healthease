import React, { useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground'

gsap.registerPlugin(ScrollTrigger)

const Banner = () => {
  const navigate = useNavigate()
  const bannerRef = useRef(null)
  const textRef = useRef(null)
  const imageRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate elements on scroll
      gsap.from(textRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      })

      // Removed GSAP image animation to prevent conflicts
      // Image animations are now handled by Framer Motion only

      gsap.from(buttonRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      })

      // Removed floating animation that was causing conflicts
    }, bannerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={bannerRef}
      className='relative flex flex-col md:flex-row bg-gradient-to-br from-primary via-purple-600 to-blue-600 overflow-visible shadow-2xl px-6 sm:px-10 md:px-14 lg:px-16 mt-0 mb-0'
    >
      {/* Animated Background */}
      <AnimatedBackground variant="intense" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Animated waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-2xl opacity-15"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              background: `radial-gradient(circle, ${i === 0 ? '#667eea' : i === 1 ? '#764ba2' : '#4facfe'} 0%, transparent 70%)`,
              left: `${i * 30}%`,
              top: `${i * 25}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.2,
            }}
          />
        ))}
      </div>

      {/* Left Side */}
      <div className='relative z-10 flex-1 py-12 sm:py-16 md:py-20 lg:py-24 flex flex-col justify-center'>
        <div ref={textRef}>
          <motion.h2 
            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Book Appointment
          </motion.h2>
          <motion.p 
            className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 mb-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            With <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">100+ Trusted Doctors</span>
          </motion.p>
        </div>
        
        <motion.button 
          ref={buttonRef}
          onClick={() => { navigate('/login'); scrollTo(0, 0) }} 
          className='group relative bg-white/95 backdrop-blur-sm text-sm sm:text-base text-[#595959] px-8 py-4 rounded-full mt-6 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold w-fit overflow-hidden'
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Create account
            <motion.svg 
              className="w-5 h-5"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </motion.button>
      </div>

      {/* Right Side - Fixed Image */}
      <div className='relative z-10 hidden md:block md:w-1/2 lg:w-[400px] overflow-visible'>
        <motion.div
          ref={imageRef}
          className="relative h-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -8, 0]
          }}
          transition={{ 
            opacity: { duration: 0.8 },
            scale: { duration: 0.8 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ 
            opacity: 1,
            visibility: 'visible',
            display: 'block'
          }}
        >
          <img 
            className='w-full absolute bottom-0 right-0 max-w-md drop-shadow-2xl' 
            src={assets.appointment_img} 
            alt="Appointment"
            style={{ 
              opacity: 1, 
              visibility: 'visible',
              display: 'block',
              position: 'absolute',
              bottom: 0,
              right: 0
            }}
          />
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none"></div>
          
          {/* Enhanced floating particles effect */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/40 rounded-full pointer-events-none"
              style={{
                left: `${15 + i * 8}%`,
                top: `${20 + i * 6}%`,
                opacity: 1,
                visibility: 'visible'
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
                x: [0, (Math.random() - 0.5) * 30, 0],
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Banner
