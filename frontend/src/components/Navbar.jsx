import React, { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { token, setToken, userData, isDarkMode, toggleTheme } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='sticky top-0 z-50 flex items-center justify-between text-sm py-4 mb-0 border-b border-b-[#ADADAD] dark:border-b-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-900/80 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
      <div className='flex items-center gap-4'>
        <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.icon} alt="" />
        <button
          onClick={toggleTheme}
          className='p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300'
          aria-label='Toggle theme'
        >
          {isDarkMode ? (
            <svg className='w-5 h-5 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z' clipRule='evenodd' />
            </svg>
          ) : (
            <svg className='w-5 h-5 text-gray-700' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
            </svg>
          )}
        </button>
      </div>

      <div className='flex items-center gap-4 '>
        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 dark:text-gray-300 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 dark:bg-gray-800 rounded flex flex-col gap-4 p-4 shadow-lg'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black dark:hover:text-white cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black dark:hover:text-white cursor-pointer'>My Appointments</p>
                  <p onClick={() => navigate('/settings')} className='hover:text-black dark:hover:text-white cursor-pointer'>Settings</p>
                  <p onClick={() => setShowLogoutConfirm(true)} className='hover:text-black dark:hover:text-white cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <div className='hidden md:flex items-center gap-3'>
                <button 
                  onClick={() => navigate('/login', { state: { initialTab: 'login' } })} 
                  className='bg-white dark:bg-gray-800 text-primary border-2 border-primary px-6 py-2.5 rounded-full font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 shadow-sm hover:shadow-md'
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/login', { state: { initialTab: 'signup' } })} 
                  className='bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 dark:hover:bg-primary/80 transition-all duration-300 shadow-md hover:shadow-lg'
                >
                  Sign Up
                </button>
              </div>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white dark:bg-gray-900 transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
        </div>

        {/* ---- Logout Confirm Modal ---- */}
        {showLogoutConfirm && createPortal(
          <div className="fixed inset-0 z-[9999] grid place-items-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <div className="relative mx-4 w-full max-w-md rounded-3xl bg-white/95 dark:bg-gray-900/95 border border-slate-200/60 dark:border-gray-800/60 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.6)] p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                  <span className="text-primary text-xl">!</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm logout</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                    Are you sure you want to log out of your account?
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200/80 dark:border-gray-700/80 text-slate-700 dark:text-gray-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-gray-800 transition-all"
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
    </div>
  )
}

export default Navbar
