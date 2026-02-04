import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const VerifyOtp = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)

  const email = sessionStorage.getItem('fp_email') || ''

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
      return
    }
  }, [email, navigate])

  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Enter a 6-digit OTP')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/user/verify-otp', { email, otp })
      if (data.success) {
        sessionStorage.setItem('fp_reset_token', data.resetToken)
        toast.success('OTP verified')
        navigate('/reset-password')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/forgot-password', { email })
      if (data.success) {
        if (data.devOtp) {
          toast.info(`OTP: ${data.devOtp}`)
        } else {
          toast.success(data.message || 'OTP resent')
        }
        setResendTimer(30)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to resend OTP')
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8'>
        <button
          onClick={() => navigate('/forgot-password')}
          className='text-sm text-gray-500 hover:text-primary transition-all'
        >
          Back
        </button>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mt-4'>Verify OTP</h1>
        <p className='text-sm text-gray-500 mt-2'>Enter the 6-digit OTP sent to {email}.</p>

        <form onSubmit={handleVerify} className='mt-6 space-y-4'>
          <input
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            maxLength={6}
            placeholder='Enter 6-digit OTP'
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className='w-full text-center tracking-[0.4em] text-lg py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
          />

          <button
            type='submit'
            disabled={loading}
            className={`w-full py-3.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className='mt-4 text-sm text-gray-500'>
          {resendTimer > 0 ? (
            <span>Resend OTP in {resendTimer}s</span>
          ) : (
            <button onClick={handleResend} className='text-primary font-semibold hover:underline'>
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp
