import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Landing = () => {
  const navigate = useNavigate()
  const { aToken, getDashData, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  const stats = [
    { label: 'Doctors', value: dashData?.doctors ?? 0, icon: assets.doctor_icon, tint: 'bg-primary/10' },
    { label: 'Appointments', value: dashData?.appointments ?? 0, icon: assets.appointments_icon, tint: 'bg-indigo-500/10' },
    { label: 'Patients', value: dashData?.patients ?? 0, icon: assets.patients_icon, tint: 'bg-emerald-500/10' }
  ]

  const actions = [
    { title: 'Add Doctor', desc: 'Create a new doctor profile', icon: assets.add_icon, path: '/add-doctor' },
    { title: 'View Appointments', desc: 'Manage upcoming bookings', icon: assets.appointment_icon, path: '/all-appointments' },
    { title: 'Doctors List', desc: 'Review profiles and status', icon: assets.people_icon, path: '/doctor-list' },
    { title: 'Settings', desc: 'Admin email and theme', icon: assets.list_icon, path: '/settings' }
  ]

  return (
    <div className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8 text-slate-900 dark:text-slate-100'>
      <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
        <div className='rounded-3xl border border-white/60 bg-white/85 dark:bg-slate-900/80 dark:border-slate-800 p-6 sm:p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
          <p className='text-xs uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500'>Admin Workspace</p>
          <h1 className='mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white'>
            Welcome back. Let us get the clinic ready for today.
          </h1>
          <p className='mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-2xl'>
            Track clinic performance, manage doctors, and keep appointments flowing smoothly from one place.
          </p>

          <div className='mt-6 grid gap-4 sm:grid-cols-2'>
            {actions.map((action) => (
              <button
                key={action.title}
                type='button'
                onClick={() => navigate(action.path)}
                className='group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white/70 dark:bg-slate-900/60 dark:border-slate-800 px-4 py-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]'
              >
                <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10'>
                  <img className='h-6 w-6 dark:invert dark:brightness-110 dark:contrast-110' src={action.icon} alt="" />
                </span>
                <span>
                  <span className='block text-sm font-semibold text-slate-900 dark:text-white'>{action.title}</span>
                  <span className='block text-xs text-slate-500 dark:text-slate-400 mt-1'>{action.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className='rounded-3xl border border-white/60 bg-white/85 dark:bg-slate-900/80 dark:border-slate-800 p-6 sm:p-7 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <p className='text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500'>Clinic Pulse</p>
              <h2 className='mt-2 text-lg font-semibold text-slate-900 dark:text-white'>Today at a glance</h2>
              <p className='text-xs text-slate-500 dark:text-slate-400'>Live snapshot across doctors and appointments.</p>
            </div>
            <span className='flex items-center gap-2 rounded-full border border-white/70 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300'>
              <span className='h-2 w-2 rounded-full bg-emerald-400'></span>
              Synced
            </span>
          </div>

          <div className='mt-6 grid gap-4'>
            {stats.map((stat) => (
              <div key={stat.label} className='flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 dark:bg-slate-900/70 dark:border-slate-800 px-4 py-4 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tint}`}>
                    <img className='h-6 w-6 dark:invert dark:brightness-110 dark:contrast-110' src={stat.icon} alt="" />
                  </span>
                  <div>
                    <p className='text-sm font-semibold text-slate-900 dark:text-white'>{stat.label}</p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>Active in system</p>
                  </div>
                </div>
                <p className='text-2xl font-semibold text-slate-900 dark:text-white'>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
        <div className='rounded-3xl border border-white/60 bg-white/85 dark:bg-slate-900/80 dark:border-slate-800 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
          <div className='flex items-center justify-between border-b border-white/70 dark:border-slate-800 px-6 py-4'>
            <div className='flex items-center gap-3'>
              <span className='flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10'>
                <img className='w-5 dark:invert dark:brightness-110 dark:contrast-110' src={assets.list_icon} alt="" />
              </span>
              <div>
                <p className='font-semibold text-slate-900 dark:text-white'>Latest activity</p>
                <p className='text-xs text-slate-500 dark:text-slate-400'>Most recent bookings and updates.</p>
              </div>
            </div>
            <button
              type='button'
              onClick={() => navigate('/all-appointments')}
              className='rounded-full border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm transition hover:border-slate-300'
            >
              View all
            </button>
          </div>

          <div className='divide-y divide-white/70 dark:divide-slate-800'>
            {(dashData?.latestAppointments || []).slice(0, 4).map((item) => (
              <div key={item._id} className='flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-3'>
                  <img className='h-11 w-11 rounded-full object-cover ring-2 ring-white' src={item.docData.image} alt="" />
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-slate-900 dark:text-white'>{item.docData.name}</p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>Booking on {slotDateFormat(item.slotDate)}</p>
                  </div>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.cancelled ? 'bg-rose-50 text-rose-500' : item.isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Upcoming'}
                </span>
              </div>
            ))}

            {(dashData?.latestAppointments || []).length === 0 && (
              <div className='px-6 py-6 text-sm text-slate-500 dark:text-slate-400'>
                No recent activity yet. New bookings will appear here.
              </div>
            )}
          </div>
        </div>

        <div className='rounded-3xl border border-white/60 bg-white/85 dark:bg-slate-900/80 dark:border-slate-800 p-6 sm:p-7 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
          <p className='text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500'>Quick Guidance</p>
          <h2 className='mt-2 text-lg font-semibold text-slate-900 dark:text-white'>Admin checklist</h2>
          <ul className='mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300'>
            <li className='flex items-start gap-3 rounded-2xl border border-white/70 bg-white/70 dark:bg-slate-900/60 dark:border-slate-800 px-4 py-3'>
              <span className='mt-1 h-2 w-2 rounded-full bg-emerald-400'></span>
              Verify pending doctor profiles to keep the roster accurate.
            </li>
            <li className='flex items-start gap-3 rounded-2xl border border-white/70 bg-white/70 dark:bg-slate-900/60 dark:border-slate-800 px-4 py-3'>
              <span className='mt-1 h-2 w-2 rounded-full bg-indigo-400'></span>
              Review tomorrow's appointment slots and coverage.
            </li>
            <li className='flex items-start gap-3 rounded-2xl border border-white/70 bg-white/70 dark:bg-slate-900/60 dark:border-slate-800 px-4 py-3'>
              <span className='mt-1 h-2 w-2 rounded-full bg-amber-400'></span>
              Keep documents verified to improve patient trust.
            </li>
          </ul>
          <button
            type='button'
            onClick={() => navigate('/settings')}
            className='mt-6 w-full rounded-full bg-gradient-to-r from-primary to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_-30px_rgba(59,130,246,0.9)] transition hover:opacity-95'
          >
            Review admin settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing
