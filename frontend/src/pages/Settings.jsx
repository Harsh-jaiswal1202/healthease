import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const { userData, backendUrl, token, setToken, loadUserProfileData } = useContext(AppContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState(userData?.email || '')
  const [emailPassword, setEmailPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showEmailConfirm, setShowEmailConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState({
    email: false,
    password: false,
    delete: false
  })

  const handleChangeEmail = async () => {
    if (!email || !emailPassword) {
      toast.error('Please enter email and password')
      return
    }
    try {
      setLoading(prev => ({ ...prev, email: true }))
      const { data } = await axios.post(
        backendUrl + '/api/user/change-email',
        { newEmail: email, password: emailPassword },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        setEmailPassword('')
        await loadUserProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(prev => ({ ...prev, email: false }))
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password must match')
      return
    }
    try {
      setLoading(prev => ({ ...prev, password: true }))
      const { data } = await axios.post(
        backendUrl + '/api/user/change-password',
        { currentPassword, newPassword },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(prev => ({ ...prev, password: false }))
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      toast.error('Please confirm account deletion')
      return
    }
    if (!deletePassword) {
      toast.error('Please enter your password')
      return
    }
    try {
      setLoading(prev => ({ ...prev, delete: true }))
      const { data } = await axios.post(
        backendUrl + '/api/user/delete-account',
        { password: deletePassword },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        localStorage.removeItem('token')
        setToken(false)
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(prev => ({ ...prev, delete: false }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-gray-950 px-4 sm:px-6 lg:px-10 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
              Account Settings
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mt-2">
              Secure your account
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
              Update your email, password, or remove your account.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            Profile status: active
          </div>
        </div>

        <div className="grid gap-6">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-slate-200/60 dark:border-gray-800/60 rounded-3xl shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)] p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                  Change Email
                </p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-2">
                  Update your email address
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                  We will use this email for appointment updates and notifications.
                </p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/15 to-cyan-500/15 flex items-center justify-center text-primary">
                @
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-[11px] text-slate-400 uppercase tracking-[0.24em]">Email</label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 px-4 py-3 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 uppercase tracking-[0.24em]">Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 px-4 py-3 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowEmailConfirm(true)}
                disabled={loading.email}
                className="w-full md:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading.email ? 'Saving...' : 'Save email'}
              </button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-slate-200/60 dark:border-gray-800/60 rounded-3xl shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)] p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                  Change Password
                </p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-2">
                  Create a new password
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                  Use at least 8 characters with a mix of numbers and symbols.
                </p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/15 to-cyan-500/15 flex items-center justify-center text-primary">
                *
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-[11px] text-slate-400 uppercase tracking-[0.24em]">Current</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 px-4 py-3 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 uppercase tracking-[0.24em]">New</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 px-4 py-3 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 uppercase tracking-[0.24em]">Confirm</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 px-4 py-3 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={handleChangePassword}
                disabled={loading.password}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading.password ? 'Updating...' : 'Update password'}
              </button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 border border-rose-200/60 dark:border-rose-900/40 rounded-3xl shadow-[0_18px_60px_-40px_rgba(190,18,60,0.35)] p-6"
          >
            <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-rose-200/30 blur-3xl"></div>
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-[0.24em]">
                  Delete Account
                </p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-2">
                  Permanently remove your account
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                  This action is irreversible. All data and appointments will be deleted.
                </p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                !
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 items-end">
              <div>
                <label className="text-[11px] text-rose-400 uppercase tracking-[0.24em]">Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-rose-200/70 dark:border-rose-900/40 bg-white/80 dark:bg-gray-900/80 px-4 py-3 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <label className="mt-3 text-sm text-slate-600 dark:text-gray-300 flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.checked)}
                  />
                I understand this will delete my account.
              </label>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading.delete}
                  className="btn-pill bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading.delete ? 'Deleting...' : 'Delete account'}
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>

      {showEmailConfirm && (
        <div className="fixed inset-0 z-[9999] grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowEmailConfirm(false)}
          />
          <div className="relative mx-4 w-full max-w-md rounded-3xl bg-white/95 dark:bg-gray-900/95 border border-slate-200/60 dark:border-gray-800/60 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.6)] p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center text-primary">
                @
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm email change</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                  Update your account email to <span className="font-semibold text-slate-700 dark:text-gray-200">{email}</span>?
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowEmailConfirm(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200/80 dark:border-gray-700/80 text-slate-700 dark:text-gray-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowEmailConfirm(false)
                  await handleChangeEmail()
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative mx-4 w-full max-w-md rounded-3xl bg-white/95 dark:bg-gray-900/95 border border-rose-200/60 dark:border-rose-900/40 shadow-[0_20px_60px_-30px_rgba(190,18,60,0.45)] p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                !
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete account?</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                  This action is permanent. Your account and data will be removed.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200/80 dark:border-gray-700/80 text-slate-700 dark:text-gray-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowDeleteConfirm(false)
                  await handleDeleteAccount()
                }}
                className="px-6 py-3 rounded-full !bg-rose-600 !text-white ring-2 ring-rose-300/60 dark:ring-rose-400/60 text-sm font-semibold shadow-[0_12px_40px_-18px_rgba(244,63,94,0.9)] hover:!bg-rose-500 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
