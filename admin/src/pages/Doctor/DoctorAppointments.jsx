import React from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-2 sm:px-6 lg:px-8 py-6 sm:py-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'>
          <div>
            <p className='text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]'>Appointments</p>
            <h1 className='text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mt-2'>Doctor Appointments</h1>
            <p className='text-sm text-slate-500 dark:text-slate-400 mt-2'>Track upcoming visits, payments, and action status.</p>
          </div>
          <div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
            <span className='inline-flex h-2 w-2 rounded-full bg-emerald-400'></span>
            {appointments.length} total
          </div>
        </div>

        <div className='bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)] overflow-hidden'>
          <div className='hidden md:grid grid-cols-[0.4fr_2.2fr_1fr_0.8fr_2.2fr_0.8fr_1fr] gap-2 px-6 py-4 border-b border-slate-200/70 dark:border-slate-800/60 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
          </div>

          {appointments.length === 0 && (
            <div className='px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400'>
              No appointments yet.
            </div>
          )}

          {appointments.map((item, index) => {
            const ageValue = calculateAge(item.userData.dob)
            const age = Number.isNaN(ageValue) ? '-' : ageValue
            const paymentLabel = item.payment
              ? 'Online'
              : item.paymentMethod === 'cash'
                ? 'Cash'
                : 'Unpaid'
            const paymentClass = item.payment
              ? 'border-emerald-200 text-emerald-600 bg-emerald-50'
              : item.paymentMethod === 'cash'
                ? 'border-amber-200 text-amber-600 bg-amber-50'
                : 'border-slate-200 text-slate-500 bg-slate-50'
            return (
              <div key={item._id || index} className='border-b border-slate-200/60 dark:border-slate-800/60 px-3 sm:px-6 py-4'>
                <div className='md:hidden grid gap-3'>
                  <div className='flex items-start gap-3'>
                    <img src={item.userData.image} className='h-12 w-12 rounded-2xl object-cover ring-2 ring-white' alt="" />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white truncate'>{item.userData.name}</p>
                      <p className='text-xs text-slate-400 truncate'>{item.userData.email || 'Patient'}</p>
                      <div className='mt-2'>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${paymentClass}`}>
                          {paymentLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='grid gap-1 text-xs text-slate-500 dark:text-slate-400'>
                    <span>{slotDateFormat(item.slotDate)}, {item.slotTime}</span>
                    <span className='font-semibold text-slate-700 dark:text-slate-100'>{currency}{item.amount}</span>
                  </div>

                  <div className='flex items-center justify-between flex-wrap gap-2'>
                    <span className='text-xs text-slate-500 dark:text-slate-400'>Age: {age}</span>
                    {item.cancelled ? (
                      <span className='text-rose-500 text-xs font-semibold'>Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className='text-emerald-500 text-xs font-semibold'>Completed</span>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          onClick={() => cancelAppointment(item._id)}
                          className='h-9 w-9 rounded-full border border-rose-200 bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100'
                        >
                          <img className='w-4' src={assets.cancel_icon} alt="" />
                        </button>
                        <button
                          type='button'
                          onClick={() => completeAppointment(item._id)}
                          className='h-9 w-9 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100'
                        >
                          <img className='w-4' src={assets.tick_icon} alt="" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className='hidden md:grid gap-4 md:grid-cols-[0.4fr_2.2fr_1fr_0.8fr_2.2fr_0.8fr_1fr] items-center text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors rounded-2xl px-2 py-2'>
                  <p className='text-slate-400'>{index + 1}</p>
                  <div className='flex items-center gap-3'>
                    <img src={item.userData.image} className='h-10 w-10 rounded-2xl object-cover ring-2 ring-white' alt="" />
                    <div>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white'>{item.userData.name}</p>
                      <p className='text-xs text-slate-400'>{item.userData.email || 'Patient'}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${paymentClass}`}>
                      {paymentLabel}
                    </span>
                  </div>
                  <p>{age}</p>
                  <div>
                    <p className='text-sm text-slate-700 dark:text-slate-200'>{slotDateFormat(item.slotDate)}</p>
                    <p className='text-xs text-slate-400'>{item.slotTime}</p>
                  </div>
                  <p className='font-semibold text-slate-700 dark:text-slate-100'>{currency}{item.amount}</p>
                  {item.cancelled ? (
                    <p className='text-rose-500 text-xs font-semibold'>Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className='text-emerald-500 text-xs font-semibold'>Completed</p>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => cancelAppointment(item._id)}
                        className='h-9 w-9 rounded-full border border-rose-200 bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100'
                      >
                        <img className='w-4' src={assets.cancel_icon} alt="" />
                      </button>
                      <button
                        type='button'
                        onClick={() => completeAppointment(item._id)}
                        className='h-9 w-9 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100'
                      >
                        <img className='w-4' src={assets.tick_icon} alt="" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments
