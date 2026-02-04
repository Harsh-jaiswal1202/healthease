import React, { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const TopDoctors = ({ compact = false }) => {
  const navigate = useNavigate()
  const { doctors, token } = useContext(AppContext)
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const hasDoctors = doctors && doctors.length > 0

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })

      // Stagger animation for doctor cards
      gsap.from('.doctor-card', {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [doctors])

  return (
    <div 
      ref={containerRef}
      className='flex flex-col items-center mt-2 sm:mt-4 mb-0 text-[#262626] dark:text-gray-200 relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white dark:bg-gray-900 transition-colors duration-300'
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/15 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, (Math.random() - 0.5) * 50, 0],
            opacity: [0, 0.6, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      <div ref={titleRef} className="text-center z-10 flex flex-col items-center">
        <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3'>
          Top Doctors to Book
        </h1>
        <p className='sm:w-1/2 mx-auto text-center text-gray-600 dark:text-gray-400 text-base mb-2'>
          Simply browse through our extensive list of trusted doctors.
        </p>
        <motion.button 
          onClick={() => { 
            if (!token) {
              navigate('/login', { state: { initialTab: 'login' } })
            } else {
              navigate('/doctors')
            }
            scrollTo(0, 0)
          }} 
          className='bg-gradient-to-r from-primary to-purple-600 text-white px-12 py-3 rounded-full mt-1 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group'
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">View More Doctors</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </motion.button>
      </div>

      {!compact && hasDoctors && (
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-8 mt-6 pb-4 px-4 sm:px-0'>
          {doctors.slice(0, 10).map((item, index) => (
            <motion.div
              key={item._id || index}
              className="doctor-card"
              initial={{ opacity: 0 }}
              whileHover={{ 
                y: -15,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} 
                className='group relative border border-[#C9D8FF] dark:border-gray-700 rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-gray-800 shadow-md hover:shadow-2xl transition-all duration-500 backdrop-blur-sm'
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-purple-500/0 group-hover:from-primary/10 group-hover:to-purple-500/10 transition-all duration-500 z-0"></div>
                
                {/* Image container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#EAEFFF] to-blue-50">
                  <motion.img 
                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500' 
                    src={item.image} 
                    alt={item.name}
                    whileHover={{ scale: 1.1 }}
                  />
                  {/* Status badge */}
                  <motion.div 
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      item.available 
                        ? 'bg-green-500/90 text-white' 
                        : 'bg-gray-500/90 text-white'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  >
                    {item.available ? 'Available' : 'Busy'}
                  </motion.div>
                </div>

                {/* Content */}
                <div className='p-5 relative z-10 bg-white dark:bg-gray-800'>
                  <motion.div 
                    className={`flex items-center gap-2 text-sm mb-2 ${
                      item.available ? 'text-green-600' : "text-gray-500"
                    }`}
                  >
                    <motion.div
                      className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}
                      animate={item.available ? {
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="font-medium">{item.available ? 'Available Now' : "Not Available"}</span>
                  </motion.div>
                  <h3 className='text-[#262626] dark:text-gray-200 text-lg font-bold mb-1 group-hover:text-primary transition-colors'>
                    {item.name}
                  </h3>
                  <p className='text-[#5C5C5C] dark:text-gray-400 text-sm font-medium'>{item.speciality}</p>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  )
}

export default TopDoctors
