import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Login = () => {
  const location = useLocation()
  const initialTab = location.state?.initialTab === 'signup' ? 'Sign Up' : 'Login'
  const [state, setState] = useState(initialTab)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const googleBtnRef = useRef(null)
  const googleInitRef = useRef(false)

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      localStorage.removeItem('token')
      setToken('')
    }
    // Update state when location changes
    const initialTab = location.state?.initialTab === 'signup' ? 'Sign Up' : 'Login'
    setState(initialTab)
  }, [setToken, location.state])

  const handleGoogleLogin = async (response) => {
    if (!response?.credential) {
      toast.error('Google login failed. Please try again.')
      return
    }

    try {
      const { data } = await axios.post(backendUrl + '/api/user/google-login', {
        credential: response.credential
      })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Login successful!')
        setTimeout(() => navigate('/'), 1000)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Google Login Error:', error)
      toast.error(error.response?.data?.message || 'Google login failed. Please try again.')
    }
  }

  useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      return
    }

    let attempts = 0
    const interval = setInterval(() => {
      attempts += 1
      if (googleInitRef.current) {
        clearInterval(interval)
        return
      }
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin
        })
        googleBtnRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 280
        })
        googleInitRef.current = true
        clearInterval(interval)
      }
      if (attempts > 20) {
        clearInterval(interval)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (loading) return
    
    if (!backendUrl) {
      toast.error('Backend URL not configured. Please check your .env file.')
      return
    }

    setLoading(true)

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
          setTimeout(() => navigate('/'), 1000)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Login successful!')
          setTimeout(() => navigate('/'), 1000)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.error('Registration/Login Error:', error)
      if (error.response) {
        toast.error(error.response.data?.message || 'An error occurred. Please try again.')
      } else if (error.request) {
        toast.error('Cannot connect to server. Is the backend running?')
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-3 sm:p-4 relative'>
      {/* Back Button */}
      <motion.button
        onClick={() => navigate('/')}
        className='hidden md:flex md:absolute md:top-8 md:left-8 items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-primary z-50 text-base'
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
        </svg>
        <span className='font-medium'>Back to Home</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[520px] sm:min-h-[600px]'
      >
        {/* Welcome Section - Left Side */}
        <div className='hidden md:flex flex-1 bg-gradient-to-br from-primary via-purple-600 to-blue-600 text-white p-10 relative overflow-hidden'>
          {/* Animated Background Elements */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2'></div>
          <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2'></div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='relative z-10 flex flex-col justify-center h-full'
          >
            <div className='flex items-center mb-8'>
              <h1 className='text-3xl font-bold'>HealthEase</h1>
            </div>
            
            <h2 className='text-4xl font-bold mb-6'>Your Health, Our Priority</h2>
            <p className='text-lg mb-8 opacity-90'>
              Book appointments with top healthcare providers in just a few clicks. Manage your health journey with ease.
            </p>
            
            <ul className='space-y-4'>
              {[
                'Find doctors by specialty',
                'Book appointments 24/7',
                'Receive reminders',
                'Secure health records'
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className='flex items-center text-lg'
                >
                  <svg className='w-6 h-6 mr-3' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Form Section - Right Side */}
        <div className='flex-1 p-5 sm:p-8 md:p-12 flex flex-col justify-center min-w-0'>
          <div className='w-full max-w-md mx-auto min-w-0'>
            <div className='md:hidden mb-6'>
              <motion.button
                onClick={() => navigate('/')}
                className='flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-primary'
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                </svg>
              </motion.button>
            </div>
            {/* Toggle Buttons */}
            <div className='flex mb-6 sm:mb-8 border-b border-gray-200'>
              <button
                onClick={() => setState('Login')}
                className={`flex-1 py-3 text-center font-semibold transition-all duration-300 ${
                  state === 'Login'
                    ? 'text-primary border-b-3 border-primary'
                    : 'text-gray-500 border-b-3 border-transparent'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setState('Sign Up')}
                className={`flex-1 py-3 text-center font-semibold transition-all duration-300 ${
                  state === 'Sign Up'
                    ? 'text-primary border-b-3 border-primary'
                    : 'text-gray-500 border-b-3 border-transparent'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={onSubmitHandler} className='space-y-4 sm:space-y-5 w-full'>
              <motion.h2
                key={state}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6'
              >
                {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
              </motion.h2>

              {state === 'Sign Up' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='relative'
                >
                  <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                  </div>
                  <input
                    type='text'
                    placeholder='Full Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full max-w-full box-border pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                    required
                  />
                </motion.div>
              )}

              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                </div>
                <input
                  type='email'
                  placeholder='Email Address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full max-w-full box-border pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                  required
                />
              </div>

              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                </div>
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full max-w-full box-border pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                  required
                />
              </div>

              {state === 'Login' && (
                <div className='flex justify-between items-center text-sm'>
                  <label className='flex items-center text-gray-600 cursor-pointer'>
                    <input type='checkbox' className='mr-2' />
                    Remember me
                  </label>
                  <button
                    type='button'
                    onClick={() => navigate('/forgot-password')}
                    className='text-primary hover:underline'
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type='submit'
                disabled={loading}
                className={`w-full max-w-full box-border py-3.5 sm:py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Please wait...' : (state === 'Sign Up' ? 'Create Account' : 'Login')}
              </button>
            </form>

            <div className='my-6 flex items-center gap-3 text-xs text-gray-400'>
              <span className='h-px w-full bg-gray-200'></span>
              OR
              <span className='h-px w-full bg-gray-200'></span>
            </div>

            <div className='flex justify-center'>
              <div ref={googleBtnRef}></div>
            </div>

            <div className='mt-6 text-center text-sm text-gray-600'>
              {state === 'Sign Up' ? (
                <p>Already have an account?{' '}
                  <button onClick={() => setState('Login')} className='text-primary font-semibold hover:underline'>
                    Login
                  </button>
                </p>
              ) : (
                <p>Don't have an account?{' '}
                  <button onClick={() => setState('Sign Up')} className='text-primary font-semibold hover:underline'>
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
