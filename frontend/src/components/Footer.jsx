import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      toast.success(`Thank you for subscribing with: ${email}`)
      setEmail('')
    } else {
      toast.error('Please enter a valid email address')
    }
  }

  return (
    <footer className='relative bg-gradient-to-br from-blue-900 via-blue-700 to-primary dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white mt-6 sm:mt-8 overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10'>
          {/* About Section */}
          <motion.div
            className='flex flex-col'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className='flex items-center mb-4'>
              <i className='fas fa-heartbeat text-2xl mr-3 text-cyan-400'></i>
              <h2 className='text-xl font-bold'>HealthEase</h2>
            </div>
            <p className='text-white/80 dark:text-gray-300 leading-6 mb-4 text-base'>
              Your one-stop solution for all your healthcare needs. Our platform connects you with experienced doctors across various specialties, making it easy to book appointments online from the comfort of your home.
            </p>
            <div className='flex gap-4'>
              <motion.a
                href='#'
                className='flex items-center justify-center w-10 h-10 bg-white/10 dark:bg-gray-800/50 rounded-full hover:bg-cyan-400 transition-all duration-300'
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className='fab fa-facebook-f'></i>
              </motion.a>
              <motion.a
                href='#'
                className='flex items-center justify-center w-10 h-10 bg-white/10 dark:bg-gray-800/50 rounded-full hover:bg-cyan-400 transition-all duration-300'
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className='fab fa-twitter'></i>
              </motion.a>
              <motion.a
                href='#'
                className='flex items-center justify-center w-10 h-10 bg-white/10 dark:bg-gray-800/50 rounded-full hover:bg-cyan-400 transition-all duration-300'
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className='fab fa-instagram'></i>
              </motion.a>
              <motion.a
                href='#'
                className='flex items-center justify-center w-10 h-10 bg-white/10 dark:bg-gray-800/50 rounded-full hover:bg-cyan-400 transition-all duration-300'
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className='fab fa-linkedin-in'></i>
              </motion.a>
            </div>
          </motion.div>

          {/* Company Section */}
          <motion.div
            className='flex flex-col'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className='text-xl font-semibold mb-4 relative pb-2'>
              Company
              <span className='absolute bottom-0 left-0 w-12 h-0.5 bg-cyan-400 rounded-full'></span>
            </h3>
            <ul className='flex flex-col gap-3'>
              <li>
                <Link
                  to='/'
                  className='flex items-center text-white/80 dark:text-gray-300 hover:text-cyan-400 transition-all duration-300 group text-base'
                >
                  <i className='fas fa-chevron-right text-sm mr-2 group-hover:translate-x-1 transition-transform'></i>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to='/about'
                  className='flex items-center text-white/80 dark:text-gray-300 hover:text-cyan-400 transition-all duration-300 group text-base'
                >
                  <i className='fas fa-chevron-right text-sm mr-2 group-hover:translate-x-1 transition-transform'></i>
                  About us
                </Link>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center text-white/80 dark:text-gray-300 hover:text-cyan-400 transition-all duration-300 group text-base'
                >
                  <i className='fas fa-chevron-right text-sm mr-2 group-hover:translate-x-1 transition-transform'></i>
                  Delivery
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center text-white/80 dark:text-gray-300 hover:text-cyan-400 transition-all duration-300 group text-base'
                >
                  <i className='fas fa-chevron-right text-sm mr-2 group-hover:translate-x-1 transition-transform'></i>
                  Privacy policy
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Get in Touch Section */}
          <motion.div
            className='flex flex-col'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className='text-xl font-semibold mb-4 relative pb-2'>
              Get in Touch
              <span className='absolute bottom-0 left-0 w-12 h-0.5 bg-cyan-400 rounded-full'></span>
            </h3>
            <ul className='flex flex-col gap-3'>
              <li className='flex items-start'>
                <i className='fas fa-phone text-cyan-400 mr-4 mt-1 text-lg'></i>
                <span className='text-white/80 dark:text-gray-300 leading-7 text-base'>+91 8005161035</span>
              </li>
              <li className='flex items-start'>
                <i className='fas fa-envelope text-cyan-400 mr-4 mt-1 text-lg'></i>
                <span className='text-white/80 dark:text-gray-300 leading-7 text-base'>udayjaiswal788@gmail.com</span>
              </li>
              <li className='flex items-start'>
                <i className='fas fa-map-marker-alt text-cyan-400 mr-4 mt-1 text-lg'></i>
                <span className='text-white/80 dark:text-gray-300 leading-7 text-base'>
                  123 Healthcare Street<br />
                  Medical District, City 560001
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            className='flex flex-col'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className='text-xl font-semibold mb-4 relative pb-2'>
              Newsletter
              <span className='absolute bottom-0 left-0 w-12 h-0.5 bg-cyan-400 rounded-full'></span>
            </h3>
            <p className='text-white/80 dark:text-gray-300 text-base mb-4 leading-6'>
              Subscribe to our newsletter to receive updates on new features and health tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className='flex flex-col sm:flex-row gap-2'>
              <input
                type='email'
                placeholder='Your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='flex-1 px-4 py-3 rounded-l-lg sm:rounded-l-lg sm:rounded-r-none rounded-r-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700 text-white placeholder-white/60 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 text-base'
                required
              />
              <motion.button
                type='submit'
                className='px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-white font-semibold rounded-r-lg sm:rounded-r-lg sm:rounded-l-none rounded-l-lg transition-all duration-300 whitespace-nowrap text-base'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className='max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 dark:border-gray-700'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6'>
            <p className='text-white/70 dark:text-gray-400 text-base text-center sm:text-left'>
              Copyright 2024 © HealthEase.com - All Right Reserved.
            </p>
            <div className='flex flex-wrap gap-4 sm:gap-6 justify-center'>
              <a
                href='#'
                className='text-white/60 dark:text-gray-500 hover:text-cyan-400 transition-colors duration-300 text-base'
              >
                Terms of Service
              </a>
              <a
                href='#'
                className='text-white/60 dark:text-gray-500 hover:text-cyan-400 transition-colors duration-300 text-base'
              >
                Privacy Policy
              </a>
              <a
                href='#'
                className='text-white/60 dark:text-gray-500 hover:text-cyan-400 transition-colors duration-300 text-base'
              >
                Cookie Policy
              </a>
              <a
                href='#'
                className='text-white/60 dark:text-gray-500 hover:text-cyan-400 transition-colors duration-300 text-base'
              >
                Disclaimer
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
