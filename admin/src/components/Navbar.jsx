import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('admin-theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = stored ? stored === 'dark' : prefersDark
    setIsDark(initial)
    document.documentElement.classList.toggle('dark', initial)
    document.body.classList.toggle('dark', initial)
    document.getElementById('root')?.classList.toggle('dark', initial)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.body.classList.toggle('dark', next)
    document.getElementById('root')?.classList.toggle('dark', next)
    localStorage.setItem('admin-theme', next ? 'dark' : 'light')
  }

  return (
    <div className='sticky top-0 z-50 flex h-16 justify-between items-center px-4 sm:px-10 border-b bg-white dark:bg-slate-900 dark:border-slate-800'>
      <div className='flex items-center gap-2 text-xs'>
        <img onClick={() => navigate('/')} className='w-36 sm:w-40 cursor-pointer dark:invert dark:brightness-110 dark:contrast-110' src={assets.icon} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 dark:border-slate-600 dark:text-slate-200'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <div className='flex items-center gap-3'>
      </div>
    </div>
  )
}

export default Navbar
