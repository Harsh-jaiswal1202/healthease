import React, { useEffect, useRef } from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const SpecialityMenu = () => {
  const containerRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Only run animations if screen width is > 768px
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Animate title
        gsap.from(titleRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: 'power2.out'
        })

        // Stagger animation for speciality items
        gsap.from('.speciality-item', {
          opacity: 0,
          y: 30,
          scale: 0.8,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        })
      });
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      id='speciality'
      className='flex flex-col items-center gap-6 py-20 text-[#262626] dark:text-gray-200 relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white dark:bg-gray-900 transition-colors duration-300'
    >
      {/* Animated Background - Hidden on mobile */}
      <div className="hidden md:block absolute inset-0 -z-10 overflow-hidden">
        <div className="parallax-layer absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-pulse" data-parallax="0.12"></div>
        <div className="parallax-layer absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} data-parallax="0.16"></div>
        <div className="parallax-layer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-full blur-3xl" data-parallax="0.08"></div>
      </div>

      {/* Animated particles - Hidden on mobile */}
      <div className="hidden md:block">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div ref={titleRef} className="text-center">
        <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3'>
          Find by Speciality
        </h1>
        <p className='sm:w-1/2 mx-auto text-center text-gray-600 dark:text-gray-400 text-base'>
          Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
        </p>
      </div>

      <div className='flex sm:justify-center gap-6 pt-8 w-full overflow-x-auto pb-4 px-4 scrollbar-hide'>
        {specialityData.map((item, index) => (
          <motion.div
            key={index}
            className="speciality-item"
            whileHover={{
              scale: 1.1,
              y: -10,
              transition: { type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={`/doctors/${item.speciality}`}
              onClick={() => scrollTo(0, 0)}
              className='group flex flex-col items-center text-xs cursor-pointer flex-shrink-0'
            >
              <motion.div
                className="relative mb-4"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <img
                  className='w-20 sm:w-28 relative z-10 drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300'
                  src={item.image}
                  alt={item.speciality}
                />
              </motion.div>
              <p className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors duration-300">
                {item.speciality}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu
