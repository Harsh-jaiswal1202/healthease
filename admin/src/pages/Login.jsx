import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10'>
      <div className='relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur'>
        <div className='pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl' />

        <div className='grid lg:grid-cols-[1.1fr_1fr]'>
          <div className='hidden lg:flex flex-col justify-between gap-10 p-10 bg-gradient-to-br from-primary/90 via-indigo-600 to-slate-900 text-white'>
            <div>
              <p className='text-xs uppercase tracking-[0.3em] text-white/70'>Prescripto Portal</p>
              <h1 className='mt-4 text-3xl font-semibold tracking-tight'>Secure access for clinicians and admins.</h1>
              <p className='mt-3 text-sm text-white/80 max-w-md'>
                Manage schedules, patient records, and clinic operations with a clean, focused workspace.
              </p>
            </div>
            <div className='flex items-center gap-3 text-sm text-white/80'>
              <div className='h-10 w-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center'>
                <span className='text-lg'>+</span>
              </div>
              <div>
                <p className='font-semibold text-white'>Tip</p>
                <p>Use a strong password for shared terminals.</p>
              </div>
            </div>
          </div>

          <div className='p-6 sm:p-10 lg:p-12'>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Sign In</p>
                <h2 className='text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white'>
                  {state} Login
                </h2>
              </div>
              <div className='inline-flex rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                <button
                  type='button'
                  onClick={() => setState('Admin')}
                  className={`px-4 py-2 rounded-full transition ${state === 'Admin' ? 'bg-white text-slate-900 dark:text-white shadow-sm' : 'hover:text-slate-700 dark:text-slate-200'}`}
                >
                  Admin
                </button>
                <button
                  type='button'
                  onClick={() => setState('Doctor')}
                  className={`px-4 py-2 rounded-full transition ${state === 'Doctor' ? 'bg-white text-slate-900 dark:text-white shadow-sm' : 'hover:text-slate-700 dark:text-slate-200'}`}
                >
                  Doctor
                </button>
              </div>
            </div>

            <div className='mt-8 grid gap-5'>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Email
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className='h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20'
                  type='email'
                  placeholder='name@clinic.com'
                  required
                />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Password
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className='h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20'
                  type='password'
                  placeholder='Enter your password'
                  required
                />
              </label>
            </div>

            <button className='mt-7 h-12 w-full rounded-xl bg-gradient-to-r from-primary via-indigo-600 to-slate-800 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-95'>
              Login
            </button>

            <div className='mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400'>
              <p className='flex items-center gap-2'>
                <span className='inline-block h-2 w-2 rounded-full bg-emerald-400'></span>
                Secure connection enabled
              </p>
              {
                state === 'Admin'
                  ? <button type='button' onClick={() => setState('Doctor')} className='text-primary font-semibold hover:underline'>Switch to Doctor</button>
                  : <button type='button' onClick={() => setState('Admin')} className='text-primary font-semibold hover:underline'>Switch to Admin</button>
              }
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Login
