import React, { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ isOpen, setIsOpen }) => {

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

  const handleNavClick = () => {
    if (setIsOpen) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`fixed md:sticky z-50 h-full shrink-0 w-16 sm:w-64 bg-white border-r top-0 dark:bg-slate-900 dark:border-slate-800 flex flex-col overflow-hidden transition-transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative`}>
      {aToken && <ul className='text-[#515151] mt-5 dark:text-slate-300 flex-1'>

        <NavLink to={'/admin-dashboard'} onClick={handleNavClick} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/all-appointments'} onClick={handleNavClick} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>
        <NavLink to={'/add-doctor'} onClick={handleNavClick} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.add_icon} alt='' />
          <p className='hidden md:block'>Add Doctor</p>
        </NavLink>
        <NavLink to={'/doctor-list'} onClick={handleNavClick} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Doctors List</p>
        </NavLink>
        <NavLink to={'/settings'} onClick={handleNavClick} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.list_icon} alt='' />
          <p className='hidden md:block'>Settings</p>
        </NavLink>
      </ul>}

      {dToken && <ul className='text-[#515151] mt-5 dark:text-slate-300 flex-1'>
        <NavLink to={'/doctor-dashboard'} onClick={handleNavClick} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/doctor-appointments'} onClick={handleNavClick} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>
        <NavLink to={'/doctor-profile'} onClick={handleNavClick} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Profile</p>
        </NavLink>
        <NavLink to={'/settings'} onClick={handleNavClick} className={({ isActive }) => `relative w-full flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] dark:bg-slate-800/60 after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[3px] after:rounded-full after:bg-primary' : ''}`}>
          <img className='min-w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.list_icon} alt='' />
          <p className='hidden md:block'>Settings</p>
        </NavLink>
      </ul>}

      {(aToken || dToken) && (
        <div className='mt-auto border-t border-slate-200 dark:border-slate-800 p-3 md:px-6'>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className='w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:border-slate-300 flex items-center justify-center gap-2'
          >
            <svg className='h-4 w-4 text-slate-600 dark:text-slate-200' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
              <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
              <path d='M16 17l5-5-5-5' />
              <path d='M21 12H9' />
            </svg>
            <span className='hidden sm:inline'>Logout</span>
          </button>
        </div>
      )}

      {showLogoutConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative mx-3 w-full max-w-sm sm:max-w-md rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/60 dark:border-slate-800/60 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.6)] p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                <span className="text-primary text-lg sm:text-xl">!</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Confirm logout</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to log out of your account?
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      </div>
    </>
  )
}

export default Sidebar
