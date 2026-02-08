import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (!aToken && !dToken) return
    // Force light mode on load
    setIsDark(false)
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('dark')
    document.getElementById('root')?.classList.remove('dark')
  }, [aToken, dToken])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.body.classList.toggle('dark', next)
    document.getElementById('root')?.classList.toggle('dark', next)
    const themeKey = aToken ? 'admin-theme' : 'doctor-theme'
    localStorage.setItem(themeKey, next ? 'dark' : 'light')
  }

  return (
    <div className='sticky top-0 z-50 flex h-16 items-center px-3 sm:px-10 border-b bg-white dark:bg-slate-900 dark:border-slate-800'>
      <button
        type='button'
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className='md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200'
        aria-label='Toggle menu'
      >
        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <path d='M3 6h18' />
          <path d='M3 12h18' />
          <path d='M3 18h18' />
        </svg>
      </button>

      <div className='flex items-center gap-2 text-xs ml-auto md:ml-0 md:order-1'>
        <img onClick={() => navigate('/')} className='w-32 sm:w-40 cursor-pointer dark:invert dark:hue-rotate-180' src={assets.icon} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 dark:border-slate-600 dark:text-slate-200'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
    </div>
  )
}

export default Navbar
