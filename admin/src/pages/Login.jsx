import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const googleBtnRef = useRef(null)
  const googleInitRef = useRef(false)
  const roleRef = useRef(state)

  const [resetOpen, setResetOpen] = useState(false)
  const [resetStep, setResetStep] = useState('request')
  const [resetEmail, setResetEmail] = useState('')
  const [resetOtp, setResetOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    roleRef.current = state
  }, [state])

  const getAuthPrefix = () => (roleRef.current === 'Admin' ? '/api/admin' : '/api/doctor')

  const handleGoogleLogin = async (response) => {
    if (!response?.credential) {
      toast.error('Google login failed. Please try again.')
      return
    }

    try {
      const { data } = await axios.post(backendUrl + `${getAuthPrefix()}/google-login`, {
        credential: response.credential
      })
      if (data.success) {
        if (roleRef.current === 'Admin') {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
          navigate('/', { replace: true })
        } else {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
          navigate('/doctor-dashboard', { replace: true })
        }
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
          size: 'large'
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

  const openReset = () => {
    setResetEmail(email || '')
    setResetOtp('')
    setResetToken('')
    setNewPassword('')
    setResetStep('request')
    setResetOpen(true)
  }

  const closeReset = () => {
    if (resetLoading) return
    setResetOpen(false)
  }

  const sendResetOtp = async () => {
    if (!resetEmail) {
      toast.error('Please enter your email')
      return
    }
    if (!backendUrl) {
      toast.error('Backend URL not configured. Please check your .env file.')
      return
    }
    setResetLoading(true)
    try {
      const { data } = await axios.post(backendUrl + `${getAuthPrefix()}/forgot-password`, { email: resetEmail })
      if (data.success) {
        toast.success(data.message || 'OTP sent successfully')
        setResetStep('verify')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setResetLoading(false)
    }
  }

  const verifyResetOtp = async () => {
    if (!resetEmail || !resetOtp) {
      toast.error('Please enter email and OTP')
      return
    }
    if (!backendUrl) {
      toast.error('Backend URL not configured. Please check your .env file.')
      return
    }
    setResetLoading(true)
    try {
      const { data } = await axios.post(backendUrl + `${getAuthPrefix()}/verify-otp`, { email: resetEmail, otp: resetOtp })
      if (data.success) {
        setResetToken(data.resetToken)
        setResetStep('reset')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed')
    } finally {
      setResetLoading(false)
    }
  }

  const resetPassword = async () => {
    if (!resetToken || !newPassword) {
      toast.error('Please enter a new password')
      return
    }
    if (!backendUrl) {
      toast.error('Backend URL not configured. Please check your .env file.')
      return
    }
    setResetLoading(true)
    try {
      const { data } = await axios.post(backendUrl + `${getAuthPrefix()}/reset-password`, {
        resetToken,
        newPassword
      })
      if (data.success) {
        toast.success(data.message || 'Password updated')
        setResetOpen(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed')
    } finally {
      setResetLoading(false)
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
        navigate('/', { replace: true })
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
        navigate('/doctor-dashboard', { replace: true })
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <>
      <form onSubmit={onSubmitHandler} className='min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10'>
        <div className='relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur'>
          <div className='pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl' />

          <div className='grid lg:grid-cols-[1.1fr_1fr]'>
            <div className='hidden lg:flex flex-col justify-between gap-10 p-10 bg-gradient-to-br from-primary/90 via-indigo-600 to-slate-900 text-white'>
              <div>
                <p className='text-xs uppercase tracking-[0.3em] text-white/70'>Prescripto Portal</p>
                <h1 className='mt-4 text-3xl font-semibold tracking-tight'>Secure access for clinicians and admins.</h1>
                <p className='mt-3 text-sm text-white/80 max-w-md'>
                  Manage schedules, patient records, and clinic operations with a clean, focused workspace.
                </p>
              </div>
              <div className='flex items-center gap-3 text-sm text-white/80'>
                <div className='h-10 w-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center'>
                  <span className='text-lg'>+</span>
                </div>
                <div>
                  <p className='font-semibold text-white'>Tip</p>
                  <p>Use a strong password for shared terminals.</p>
                </div>
              </div>
            </div>

            <div className='p-4 sm:p-10 lg:p-12'>
              <div className='flex flex-col sm:flex-row items-center justify-between lg:justify-end gap-3 sm:gap-4'>
                <p className='lg:hidden text-xl font-bold text-slate-900 dark:text-white'>HealthEase</p>
                <div className='inline-flex rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                  <button
                    type='button'
                    onClick={() => setState('Admin')}
                    className={`px-3 py-2 rounded-full transition ${state === 'Admin' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-700 dark:text-slate-200'}`}
                  >
                    Admin
                  </button>
                  <button
                    type='button'
                    onClick={() => setState('Doctor')}
                    className={`px-3 py-2 rounded-full transition ${state === 'Doctor' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-700 dark:text-slate-200'}`}
                  >
                    Doctor
                  </button>
                </div>
              </div>

              <div className='mt-8 grid gap-5'>
                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                  Email
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className='h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20'
                    type='email'
                    placeholder='name@clinic.com'
                    required
                  />
                </label>
                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                  Password
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className='h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20'
                    type='password'
                    placeholder='Enter your password'
                    required
                  />
                </label>
              </div>

              <div className='mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400'>
                <button
                  type='button'
                  onClick={openReset}
                  className='text-primary font-semibold hover:underline'
                >
                  Forgot password?
                </button>
              </div>

              <button className='mt-7 h-12 w-full rounded-xl bg-gradient-to-r from-primary via-indigo-600 to-slate-800 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-95'>
                Login
              </button>

              {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                <>
                  <div className='my-6 flex items-center gap-3 text-xs text-slate-400'>
                    <span className='h-px w-full bg-slate-200 dark:bg-slate-700'></span>
                    OR
                    <span className='h-px w-full bg-slate-200 dark:bg-slate-700'></span>
                  </div>
                  <div className='flex justify-center'>
                    <div ref={googleBtnRef}></div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div >
      </form >

      {resetOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6'>
          <div className='w-full max-w-md rounded-2xl border border-white/40 bg-white/95 p-6 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/95'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Reset Password</p>
                <h3 className='mt-1 text-xl font-semibold text-slate-900 dark:text-white'>
                  {state} Account
                </h3>
              </div>
              <button type='button' onClick={closeReset} className='text-xs font-semibold text-slate-500 hover:text-slate-700'>
                Close
              </button>
            </div>

            {resetStep === 'request' && (
              <div className='mt-6 grid gap-4'>
                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                  Email
                  <input
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20'
                    type='email'
                    placeholder='name@clinic.com'
                    required
                  />
                </label>
                <button
                  type='button'
                  onClick={sendResetOtp}
                  disabled={resetLoading}
                  className='h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-95 disabled:opacity-60'
                >
                  {resetLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            )}

            {resetStep === 'verify' && (
              <div className='mt-6 grid gap-4'>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  Enter the 6-digit OTP sent to {resetEmail}.
                </p>
                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                  OTP
                  <input
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20'
                    type='text'
                    inputMode='numeric'
                    placeholder='123456'
                    required
                  />
                </label>
                <div className='grid gap-3'>
                  <button
                    type='button'
                    onClick={verifyResetOtp}
                    disabled={resetLoading}
                    className='h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-95 disabled:opacity-60'
                  >
                    {resetLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type='button'
                    onClick={sendResetOtp}
                    disabled={resetLoading}
                    className='text-xs font-semibold text-primary hover:underline'
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            )}

            {resetStep === 'reset' && (
              <div className='mt-6 grid gap-4'>
                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                  New Password
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20'
                    type='password'
                    placeholder='Create a new password'
                    required
                  />
                </label>
                <button
                  type='button'
                  onClick={resetPassword}
                  disabled={resetLoading}
                  className='h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-95 disabled:opacity-60'
                >
                  {resetLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}
          </div>
        </div>
      )
      }
    </>
  )
}

export default Login
