import React, { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'
import { DoctorContext } from '../../context/DoctorContext'

const Settings = () => {
  const { backendUrl } = useContext(AppContext)
  const { dToken, setDToken } = useContext(DoctorContext)

  const [email, setEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showEmailConfirm, setShowEmailConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [loading, setLoading] = useState({
    email: false,
    password: false,
    delete: false
  })

  useEffect(() => {
    const storedTheme = localStorage.getItem('doctor-theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = storedTheme ? storedTheme === 'dark' : prefersDark
    setIsDark(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme)
    document.body.classList.toggle('dark', initialTheme)
    document.getElementById('root')?.classList.toggle('dark', initialTheme)

    const loadProfile = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
        if (data.success) {
          setEmail(data.profileData.email || '')
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (dToken) loadProfile()
  }, [dToken])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.body.classList.toggle('dark', next)
    document.getElementById('root')?.classList.toggle('dark', next)
    localStorage.setItem('doctor-theme', next ? 'dark' : 'light')
  }

  const handleChangeEmail = async () => {
    if (!email || !emailPassword) {
      toast.error('Please enter email and password')
      return
    }
    try {
      setLoading(prev => ({ ...prev, email: true }))
      const { data } = await axios.post(
        backendUrl + '/api/doctor/change-email',
        { newEmail: email, password: emailPassword },
        { headers: { dToken } }
      )
      if (data.success) {
        toast.success(data.message)
        setEmailPassword('')
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
        backendUrl + '/api/doctor/change-password',
        { currentPassword, newPassword },
        { headers: { dToken } }
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
        backendUrl + '/api/doctor/delete-account',
        { password: deletePassword },
        { headers: { dToken } }
      )
      if (data.success) {
        toast.success(data.message)
        localStorage.removeItem('dToken')
        setDToken('')
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
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-3 sm:px-6 lg:px-10 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]">
              Account Settings
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mt-2">
              Secure your doctor account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Update your email, password, or remove your account.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            Profile status: active
          </div>
        </div>

        <div className="grid gap-6">
          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)] p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]">
                  Theme
                </p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-2">
                  Appearance mode
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Toggle between light and dark theme for the doctor panel.
                </p>
              </div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-primary/15 to-cyan-500/15 flex items-center justify-center text-primary">
                o
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Current mode: <span className="font-semibold">{isDark ? 'Dark' : 'Light'}</span>
              </div>
              <button
                onClick={toggleTheme}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-semibold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Switch to {isDark ? 'Light' : 'Dark'}
              </button>
            </div>
          </section>

          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)] p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]">
                  Change Email
                </p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-2">
                  Update your email address
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  This email is used for doctor notifications.
                </p>
              </div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-primary/15 to-cyan-500/15 flex items-center justify-center text-primary">
                @
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]">Email</label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]">Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowEmailConfirm(true)}
                disabled={loading.email}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading.email ? 'Saving...' : 'Save email'}
              </button>
            </div>
          </section>

          <section className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)] p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]">
                  Change Password
                </p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-2">
                  Create a new password
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Use at least 8 characters with a mix of numbers and symbols.
                </p>
              </div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-primary/15 to-cyan-500/15 flex items-center justify-center text-primary">
                *
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]">Current</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]">New</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]">Confirm</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={handleChangePassword}
                disabled={loading.password}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading.password ? 'Updating...' : 'Update password'}
              </button>
            </div>
          </section>

          <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-rose-200/60 dark:border-rose-900/40 rounded-3xl shadow-[0_18px_60px_-40px_rgba(190,18,60,0.35)] p-4 sm:p-6">
            <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-rose-200/30 blur-3xl"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-[0.24em]">
                  Delete Account
                </p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-2">
                  Permanently remove the doctor account
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  This action is irreversible. The doctor record will be deleted.
                </p>
              </div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                !
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 items-end">
              <div>
                <label className="text-[11px] text-rose-400 uppercase tracking-[0.24em]">Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-rose-200/70 dark:border-rose-900/40 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <label className="mt-3 text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.checked)}
                  />
                  I understand this will delete the doctor account.
                </label>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading.delete}
                  className="w-full sm:w-auto btn-pill bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading.delete ? 'Deleting...' : 'Delete account'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showEmailConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowEmailConfirm(false)}
          />
          <div className="relative mx-4 w-full max-w-md rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/60 dark:border-slate-800/60 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.6)] p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center text-primary">
                @
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm email change</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Update your doctor email to <span className="font-semibold text-slate-700 dark:text-slate-200">{email}</span>?
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowEmailConfirm(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
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
        </div>,
        document.body
      )}

      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative mx-4 w-full max-w-md rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-rose-200/60 dark:border-rose-900/40 shadow-[0_20px_60px_-30px_rgba(190,18,60,0.45)] p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                !
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete doctor account?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  This action is permanent. The doctor record will be removed.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
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
        </div>,
        document.body
      )}
    </div>
  )
}

export default Settings
