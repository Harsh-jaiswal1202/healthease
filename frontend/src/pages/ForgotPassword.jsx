import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Email is required')
      return
    }
    const isValid = /\S+@\S+\.\S+/.test(email)
    if (!isValid) {
      toast.error('Please enter a valid email')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/user/forgot-password', { email })
      if (data.success) {
        sessionStorage.setItem('fp_email', email)
        if (data.devOtp) {
          toast.info(`OTP: ${data.devOtp}`)
        } else {
          toast.success(data.message || 'OTP sent')
        }
        navigate('/verify-otp')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8'>
        <button
          onClick={() => navigate('/login')}
          className='text-sm text-gray-500 hover:text-primary transition-all'
        >
          Back
        </button>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mt-4'>Forgot Password</h1>
        <p className='text-sm text-gray-500 mt-2'>Enter your email to receive an OTP.</p>

        <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
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
              className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full py-3.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
