import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8 text-slate-900 dark:text-slate-100'>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500'>Admin Overview</p>
          <h1 className='text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white'>Dashboard</h1>
          <p className='text-sm text-slate-500 dark:text-slate-400'>Track activity, appointments, and clinic health at a glance.</p>
        </div>
        <div className='hidden sm:flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 dark:bg-slate-900/70 dark:border-slate-800 px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur'>
          <span className='inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400'></span>
          Live sync enabled
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <div className='group flex items-center gap-4 rounded-2xl border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 p-4 sm:p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.4)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)]'>
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10'>
            <img className='w-9' src={assets.doctor_icon} alt="" />
          </div>
          <div>
            <p className='text-2xl font-semibold text-slate-900 dark:text-white'>{dashData.doctors}</p>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Doctors</p>
          </div>
        </div>
        <div className='group flex items-center gap-4 rounded-2xl border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 p-4 sm:p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.4)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)]'>
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10'>
            <img className='w-9' src={assets.appointments_icon} alt="" />
          </div>
          <div>
            <p className='text-2xl font-semibold text-slate-900 dark:text-white'>{dashData.appointments}</p>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Appointments</p>
          </div>
        </div>
        <div className='group flex items-center gap-4 rounded-2xl border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 p-4 sm:p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.4)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)]'>
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10'>
            <img className='w-9' src={assets.patients_icon} alt="" />
          </div>
          <div>
            <p className='text-2xl font-semibold text-slate-900 dark:text-white'>{dashData.patients}</p>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='mt-8 overflow-hidden rounded-3xl border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/70 dark:border-slate-800 px-5 py-4 sm:px-6'>
          <div className='flex items-center gap-2.5'>
            <span className='flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10'>
              <img className='w-5' src={assets.list_icon} alt="" />
            </span>
            <div>
              <p className='font-semibold text-slate-900 dark:text-white'>Latest Bookings</p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>Most recent doctor appointments</p>
            </div>
          </div>
          <button className='w-full sm:w-auto rounded-full border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm transition hover:border-slate-300'>
            View all
          </button>
        </div>

        <div className='divide-y divide-white/70 dark:divide-slate-800'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex flex-col gap-3 px-5 py-4 hover:bg-white/70 dark:hover:bg-slate-800/60 sm:flex-row sm:items-center sm:gap-3 sm:px-6' key={index}>
              <img className='h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-white' src={item.docData.image} alt="" />
              <div className='min-w-0 flex-1 text-sm'>
                <p className='text-slate-900 dark:text-white font-medium'>{item.docData.name}</p>
                <p className='text-slate-500 dark:text-slate-400'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              <div className='flex items-center gap-3 text-xs'>
                {item.cancelled ? (
                  <span className='rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-500'>Cancelled</span>
                ) : item.isCompleted ? (
                  <span className='rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-600'>Completed</span>
                ) : (
                  <button
                    type='button'
                    onClick={() => cancelAppointment(item._id)}
                    className='flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-900 px-3 py-1 font-semibold text-rose-500 transition hover:border-rose-300'
                  >
                    <img className='w-4' src={assets.cancel_icon} alt="" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
