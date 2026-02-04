import React, { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    setShowLogoutConfirm(false)
  }

  return (
    <div className='h-full shrink-0 w-16 sm:w-64 bg-white border-r sticky top-0 dark:bg-slate-900 dark:border-slate-800 flex flex-col overflow-hidden'>
      {aToken && <ul className='text-[#515151] mt-5 dark:text-slate-300 flex-1'>

        <NavLink to={'/admin-dashboard'} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/all-appointments'} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>
        <NavLink to={'/add-doctor'} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.add_icon} alt='' />
          <p className='hidden md:block'>Add Doctor</p>
        </NavLink>
        <NavLink to={'/doctor-list'} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Doctors List</p>
        </NavLink>
        <NavLink to={'/settings'} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.list_icon} alt='' />
          <p className='hidden md:block'>Settings</p>
        </NavLink>
      </ul>}

      {dToken && <ul className='text-[#515151] mt-5 dark:text-slate-300 flex-1'>
        <NavLink to={'/doctor-dashboard'} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/doctor-appointments'} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>
        <NavLink to={'/doctor-profile'} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Profile</p>
        </NavLink>
      </ul>}

      {(aToken || dToken) && (
        <div className='mt-auto border-t border-slate-200 dark:border-slate-800 p-3 md:px-6'>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className='w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:border-slate-300'
          >
            Logout
          </button>
        </div>
      )}

      {showLogoutConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative mx-4 w-full max-w-md rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/60 dark:border-slate-800/60 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.6)] p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                <span className="text-primary text-xl">!</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm logout</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to log out of your account?
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default Sidebar
