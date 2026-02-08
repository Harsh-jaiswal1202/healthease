import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8 text-slate-900 dark:text-slate-100'>
      <div className='mx-auto w-full max-w-6xl'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500'>Admin</p>
            <h1 className='text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white'>All Appointments</h1>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Review upcoming visits, fees, and statuses.</p>
          </div>
          <div className='hidden sm:flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 dark:bg-slate-900/70 dark:border-slate-800 px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur'>
            <span className='inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400'></span>
            Updated moments ago
          </div>
        </div>

        <div className='overflow-hidden rounded-3xl border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 text-sm shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
          <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col border-b border-white/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
            <p>#</p>
            <p>Patient</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Doctor</p>
            <p>Fees</p>
            <p>Action</p>
          </div>
          <div className='max-h-[70vh] overflow-y-auto'>
            {appointments.map((item, index) => (
              <div
                className='max-md:mx-2 max-md:my-3 max-md:rounded-xl max-md:border max-md:border-slate-200 max-md:dark:border-slate-700 max-md:bg-white max-md:dark:bg-slate-900 max-md:p-4 max-md:shadow-sm flex flex-col gap-3 border-b border-white/70 dark:border-slate-800 px-5 py-4 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800/60 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] sm:gap-0 sm:px-6'
                key={index}
              >
                <p className='hidden sm:block text-slate-500'>{index + 1}</p>
                <div className='flex items-center gap-3'>
                  <img src={item.userData.image} className='h-9 w-9 rounded-full object-cover ring-2 ring-white' alt="" />
                  <div>
                    <p className='font-medium text-slate-900 dark:text-white'>{item.userData.name}</p>
                    <p className='text-xs text-slate-400 dark:text-slate-500 sm:hidden'>Age {calculateAge(item.userData.dob)}</p>
                  </div>
                </div>
                <p className='hidden sm:block'>{calculateAge(item.userData.dob)}</p>
                <p className='text-slate-500 dark:text-slate-400'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                <div className='flex items-center gap-3'>
                  <img src={item.docData.image} className='h-9 w-9 rounded-full bg-gray-200 object-cover ring-2 ring-white' alt="" />
                  <p className='font-medium text-slate-900 dark:text-white'>{item.docData.name}</p>
                </div>
                <p className='font-semibold text-slate-900 dark:text-white'>{currency}{item.amount}</p>
                <div className='flex flex-wrap items-center gap-2'>
                  {item.cancelled ? (
                    <span className='rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500'>Cancelled</span>
                  ) : item.isCompleted ? (
                    <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600'>Completed</span>
                  ) : (
                    <button
                      type='button'
                      onClick={() => cancelAppointment(item._id)}
                      className='inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-900 px-3 py-1 text-xs font-semibold text-rose-500 transition hover:border-rose-300'
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
    </div>
  )
}

export default AllAppointments
