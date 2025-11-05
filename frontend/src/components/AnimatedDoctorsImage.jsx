import React from 'react'
import { motion } from 'framer-motion'

// Import doctor images
import doc1 from '../assets/doc1.png'
import doc2 from '../assets/doc2.png'
import doc3 from '../assets/doc3.png'
import doc4 from '../assets/doc4.png'
import doc5 from '../assets/doc5.png'
import doc6 from '../assets/doc6.png'

const doctorImages = [doc1, doc2, doc3, doc4, doc5, doc6]

const AnimatedDoctorsImage = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ overflow: 'visible' }}>
      {/* Main doctor images in a modern layout */}
      <div className="relative w-full max-w-lg h-[500px] md:h-[600px]" style={{ overflow: 'visible' }}>
        
        {/* Center large doctor image */}
        <motion.div
          className="doctor-card absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -8, 0]
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.2 },
            scale: { duration: 0.8, delay: 0.2 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          whileHover={{ scale: 1.1, zIndex: 40 }}
          style={{ 
            willChange: 'transform',
            opacity: 1,
            visibility: 'visible',
            display: 'block'
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl blur-xl"></div>
            <img
              src={doctorImages[0]}
              alt="Doctor"
              className="w-48 md:w-56 h-56 md:h-64 object-cover rounded-2xl shadow-2xl border-4 border-white/50"
              style={{ 
                opacity: 1, 
                visibility: 'visible',
                display: 'block'
              }}
            />
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-500 rounded-2xl opacity-0 hover:opacity-30 blur-xl transition-opacity duration-300"></div>
          </div>
        </motion.div>

        {/* Top left doctor */}
        <motion.div
          className="doctor-card absolute top-10 left-4 md:left-10 z-20"
          initial={{ opacity: 0, x: -30, y: -30 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: [0, -6, 0]
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.4 },
            x: { duration: 0.8, delay: 0.4 },
            y: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
          }}
          whileHover={{ scale: 1.15, zIndex: 40 }}
          style={{ 
            willChange: 'transform',
            opacity: 1,
            visibility: 'visible',
            display: 'block'
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-primary/20 rounded-xl blur-lg"></div>
            <img
              src={doctorImages[1]}
              alt="Doctor"
              className="w-32 md:w-40 h-32 md:h-40 object-cover rounded-xl shadow-xl border-3 border-white/40"
              style={{ 
                opacity: 1, 
                visibility: 'visible',
                display: 'block'
              }}
            />
          </div>
        </motion.div>

        {/* Top right doctor */}
        <motion.div
          className="doctor-card absolute top-10 right-4 md:right-10 z-20"
          initial={{ opacity: 0, x: 30, y: -30 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: [0, -6, 0]
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.5 },
            x: { duration: 0.8, delay: 0.5 },
            y: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }}
          whileHover={{ scale: 1.15, zIndex: 40 }}
          style={{ 
            willChange: 'transform',
            opacity: 1,
            visibility: 'visible',
            display: 'block'
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl blur-lg"></div>
            <img
              src={doctorImages[2]}
              alt="Doctor"
              className="w-32 md:w-40 h-32 md:h-40 object-cover rounded-xl shadow-xl border-3 border-white/40"
              style={{ 
                opacity: 1, 
                visibility: 'visible',
                display: 'block'
              }}
            />
          </div>
        </motion.div>

        {/* Bottom left doctor */}
        <motion.div
          className="doctor-card absolute bottom-10 left-4 md:left-10 z-20"
          initial={{ opacity: 0, x: -30, y: 30 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: [0, -6, 0]
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.6 },
            x: { duration: 0.8, delay: 0.6 },
            y: { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
          }}
          whileHover={{ scale: 1.15, zIndex: 40 }}
          style={{ 
            willChange: 'transform',
            opacity: 1,
            visibility: 'visible',
            display: 'block'
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-400/20 rounded-xl blur-lg"></div>
            <img
              src={doctorImages[3]}
              alt="Doctor"
              className="w-32 md:w-40 h-32 md:h-40 object-cover rounded-xl shadow-xl border-3 border-white/40"
              style={{ 
                opacity: 1, 
                visibility: 'visible',
                display: 'block'
              }}
            />
          </div>
        </motion.div>

        {/* Bottom right doctor */}
        <motion.div
          className="doctor-card absolute bottom-10 right-4 md:right-10 z-20"
          initial={{ opacity: 0, x: 30, y: 30 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: [0, -6, 0]
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.7 },
            x: { duration: 0.8, delay: 0.7 },
            y: { duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: 0.7 }
          }}
          whileHover={{ scale: 1.15, zIndex: 40 }}
          style={{ 
            willChange: 'transform',
            opacity: 1,
            visibility: 'visible',
            display: 'block'
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-xl blur-lg"></div>
            <img
              src={doctorImages[4]}
              alt="Doctor"
              className="w-32 md:w-40 h-32 md:h-40 object-cover rounded-xl shadow-xl border-3 border-white/40"
              style={{ 
                opacity: 1, 
                visibility: 'visible',
                display: 'block'
              }}
            />
          </div>
        </motion.div>

        {/* Floating decorative elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${20 + (i % 4) * 20}%`,
              top: `${15 + Math.floor(i / 4) * 25}%`,
              opacity: 1,
              visibility: 'visible'
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Animated connecting lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ opacity: 0.2 }}>
          <motion.line
            x1="25%"
            y1="25%"
            x2="50%"
            y2="50%"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.line
            x1="75%"
            y1="25%"
            x2="50%"
            y2="50%"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
          />
        </svg>
      </div>
    </div>
  )
}

export default AnimatedDoctorsImage
