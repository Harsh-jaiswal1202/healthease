import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const resetToken = sessionStorage.getItem('fp_reset_token') || ''

  useEffect(() => {
    if (!resetToken) {
      navigate('/forgot-password')
    }
  }, [resetToken, navigate])

  const handleReset = async (e) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/user/reset-password', {
        resetToken,
        newPassword
      })
      if (data.success) {
        sessionStorage.removeItem('fp_email')
        sessionStorage.removeItem('fp_reset_token')
        toast.success('Password updated successfully. Please login.')
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8'>
        <button
          onClick={() => navigate('/verify-otp')}
          className='text-sm text-gray-500 hover:text-primary transition-all'
        >
          Back
        </button>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mt-4'>Reset Password</h1>
        <p className='text-sm text-gray-500 mt-2'>Create a new password for your account.</p>

        <form onSubmit={handleReset} className='mt-6 space-y-4'>
          <input
            type='password'
            placeholder='New Password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='w-full py-3 border border-gray-300 rounded-xl px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
          />
          <input
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full py-3 border border-gray-300 rounded-xl px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
          />
          <button
            type='submit'
            disabled={loading}
            className={`w-full py-3.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
