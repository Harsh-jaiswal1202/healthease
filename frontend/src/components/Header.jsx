import React, { useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground'
import AnimatedDoctorsImage from './AnimatedDoctorsImage'

const Header = () => {
  const headerRef = useRef(null)
  const textRef = useRef(null)
  const imageRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline()
    
    // Ensure button is visible before animation
    if (buttonRef.current) {
      gsap.set(buttonRef.current, { opacity: 1, visibility: 'visible' })
    }
    
    tl.from(textRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    })
    // Removed image animation from GSAP to prevent conflicts
    // Image animations are now handled by Framer Motion in AnimatedDoctorsImage component
    .from(buttonRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.5')
    .to(buttonRef.current, {
      opacity: 1,
      visibility: 'visible',
      duration: 0.1,
      ease: 'none'
    })

    // Gentle floating animation for image container (disabled parallax to prevent disappearing)
    // Removed parallax scroll effect that was causing images to disappear
  }, [])

  return (
    <div 
      ref={headerRef}
      className='relative flex flex-col md:flex-row flex-wrap bg-gradient-to-br from-primary via-primary to-purple-600 overflow-visible shadow-2xl mt-0 mb-0 rounded-none'
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <AnimatedBackground variant="intense" />
      </div>
      
      {/* Additional animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Animated gradient orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-2xl opacity-20"
            style={{
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              background: `radial-gradient(circle, ${i === 0 ? '#667eea' : i === 1 ? '#764ba2' : '#5F6FFF'} 0%, transparent 70%)`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      {/* Header Left */}
      <div className='relative z-10 md:w-1/2 flex flex-col items-center md:items-start justify-center gap-5 sm:gap-6 py-10 sm:py-12 px-6 md:px-10 lg:px-20 m-auto md:py-[10vw] md:mb-[-30px] text-center md:text-left'>
        <div ref={textRef}>
          <motion.h1 
            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-extrabold leading-tight md:leading-tight lg:leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] max-w-md md:max-w-none'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Book Appointment <br />
            <span className="text-white">
              With Trusted Doctors
            </span>
          </motion.h1>
        </div>
        
          <motion.div 
          className='flex flex-col md:flex-row items-center gap-4 text-white/95 text-sm font-light drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)] max-w-md md:max-w-none'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.img 
            className='w-24 sm:w-32 drop-shadow-lg' 
            src={assets.group_profiles} 
            alt=""
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <p className="text-white/90">
            Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block' /> 
            schedule your appointment hassle-free.
          </p>
        </motion.div>
        
        <motion.a 
          ref={buttonRef}
          href='#speciality' 
          className='group relative flex items-center justify-center gap-3 bg-white px-8 py-4 rounded-full text-[#595959] text-sm font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden z-20 w-full sm:w-auto'
          style={{ opacity: 1, visibility: 'visible', display: 'flex' }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 1, visibility: 'visible' }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Book appointment
            <motion.img 
              className='w-4' 
              src={assets.arrow_icon} 
              alt=""
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </motion.a>

      </div>

      {/* Header Right - Animated Doctors Image */}
      <div className='relative z-10 hidden sm:flex md:w-1/2 items-center justify-center min-h-[320px] sm:min-h-[380px] md:min-h-[500px] overflow-visible'>
        <motion.div
          ref={imageRef}
          className="relative w-full h-full overflow-visible"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ willChange: 'transform' }}
        >
          <AnimatedDoctorsImage />
          
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-purple-500/20 rounded-lg pointer-events-none"></div>
          
          {/* Additional floating particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/50 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.3, 0.9, 0.3],
                scale: [1, 2, 1],
                x: [0, (Math.random() - 0.5) * 30, 0],
              }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Header
