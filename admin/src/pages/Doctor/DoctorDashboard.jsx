import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)


  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken])

  const charts = dashData?.charts || {}
  const labels = charts.labels || []
  const appointmentSummary = charts.appointmentSummary || { scheduled: 0, completed: 0, cancelled: 0 }
  const performance = charts.performance || { counts: [], avgPerDay: 0, patientsPerDay: 0 }
  const revenue = charts.revenue || { online: [], cash: [], totalToday: 0 }

  const donutTotal = appointmentSummary.scheduled + appointmentSummary.completed + appointmentSummary.cancelled || 1
  const donutSegments = [
    { label: 'Scheduled', value: appointmentSummary.scheduled, color: '#3B82F6' },
    { label: 'Completed', value: appointmentSummary.completed, color: '#22C55E' },
    { label: 'Cancelled', value: appointmentSummary.cancelled, color: '#EF4444' }
  ]

  const maxPerformance = Math.max(1, ...(performance.counts || []))
  const maxRevenue = Math.max(1, ...revenue.online, ...revenue.cash)

  const buildPolyline = (values, height, width) => {
    if (!values || values.length === 0) return ''
    const step = values.length > 1 ? width / (values.length - 1) : width
    return values.map((val, i) => {
      const x = i * step
      const y = height - (val / maxRevenue) * height
      return `${x},${y}`
    }).join(' ')
  }

  const buildAreaPath = (values, height, width) => {
    const points = buildPolyline(values, height, width)
    if (!points) return ''
    return `M0,${height} L${points} L${width},${height} Z`
  }

  return dashData && (
    <div className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 px-3 sm:px-6 lg:px-8 py-6 sm:py-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
          <div>
            <p className='text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.24em]'>Overview</p>
            <h1 className='text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mt-2'>Doctor Dashboard</h1>
            <p className='text-sm text-slate-500 dark:text-slate-400 mt-2'>Quick summary of earnings and recent activity.</p>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='flex items-center gap-3 bg-white/85 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-4 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.45)]'>
            <div className='h-12 w-12 rounded-2xl bg-primary/10 dark:bg-slate-800/80 flex items-center justify-center ring-1 ring-primary/20 dark:ring-slate-700/60'>
              <img className='w-8 dark:brightness-110 dark:contrast-125' src={assets.earning_icon} alt="" />
            </div>
            <div>
              <p className='text-xl font-semibold text-slate-900 dark:text-white'>{currency} {dashData.earnings}</p>
              <p className='text-sm text-slate-500 dark:text-slate-400'>Earnings</p>
            </div>
          </div>
          <div className='flex items-center gap-3 bg-white/85 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-4 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.45)]'>
            <div className='h-12 w-12 rounded-2xl bg-primary/10 dark:bg-slate-800/80 flex items-center justify-center ring-1 ring-primary/20 dark:ring-slate-700/60'>
              <img className='w-8 dark:brightness-110 dark:contrast-125' src={assets.appointments_icon} alt="" />
            </div>
            <div>
              <p className='text-xl font-semibold text-slate-900 dark:text-white'>{dashData.appointments}</p>
              <p className='text-sm text-slate-500 dark:text-slate-400'>Appointments</p>
            </div>
          </div>
          <div className='flex items-center gap-3 bg-white/85 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-4 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.45)]'>
            <div className='h-12 w-12 rounded-2xl bg-primary/10 dark:bg-slate-800/80 flex items-center justify-center ring-1 ring-primary/20 dark:ring-slate-700/60'>
              <img className='w-8 dark:brightness-110 dark:contrast-125' src={assets.patients_icon} alt="" />
            </div>
            <div>
              <p className='text-xl font-semibold text-slate-900 dark:text-white'>{dashData.patients}</p>
              <p className='text-sm text-slate-500 dark:text-slate-400'>Patients</p>
            </div>
          </div>
        </div>

        <div className='mt-6 grid gap-4 lg:grid-cols-3'>
          <div className='bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)]'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-sm font-semibold text-slate-900 dark:text-white'>Appointments</p>
                <p className='text-xs text-slate-500 dark:text-slate-400'>Today’s Summary</p>
              </div>
              <div className='h-9 w-9 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm'>
                ⏱
              </div>
            </div>
            <div className='mt-5 flex items-center gap-6'>
              <svg width='120' height='120' viewBox='0 0 120 120'>
                <circle cx='60' cy='60' r='42' stroke='#E5E7EB' strokeWidth='14' fill='none' />
                {(() => {
                  let offset = 0
                  const circumference = 2 * Math.PI * 42
                  return donutSegments.map((segment, idx) => {
                    const dash = (segment.value / donutTotal) * circumference
                    const circle = (
                      <circle
                        key={segment.label}
                        cx='60'
                        cy='60'
                        r='42'
                        stroke={segment.color}
                        strokeWidth='14'
                        fill='none'
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={-offset}
                        strokeLinecap='round'
                      />
                    )
                    offset += dash
                    return circle
                  })
                })()}
              </svg>
              <div className='space-y-2 text-sm'>
                {donutSegments.map(segment => (
                  <div key={segment.label} className='flex items-center gap-2 text-slate-600 dark:text-slate-300'>
                    <span className='h-2.5 w-2.5 rounded-full' style={{ backgroundColor: segment.color }}></span>
                    <span>{segment.label}: {segment.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)]'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-sm font-semibold text-slate-900 dark:text-white'>Performance</p>
                <p className='text-xs text-slate-500 dark:text-slate-400'>Daily metrics (7 days)</p>
              </div>
              <div className='h-9 w-9 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm'>
                ↗
              </div>
            </div>
            <div className='mt-4'>
              <svg width='260' height='140' viewBox='0 0 260 140' className='w-full'>
                <line x1='0' y1='100' x2='260' y2='100' stroke='#E5E7EB' strokeWidth='2' />
                {(performance.counts || []).map((val, idx) => {
                  const barWidth = 18
                  const gap = 16
                  const x = idx * (barWidth + gap)
                  const rawHeight = (val / maxPerformance) * 80
                  const height = val === 0 ? 6 : Math.max(12, rawHeight)
                  return (
                    <rect key={idx} x={x} y={100 - height} width={barWidth} height={height} rx='6' fill='#22C55E' opacity='0.9' />
                  )
                })}
                {labels.map((label, idx) => {
                  const barWidth = 18
                  const gap = 16
                  const x = idx * (barWidth + gap) + barWidth / 2
                  return (
                    <text key={label} x={x} y='130' textAnchor='middle' fontSize='10' fill='#94A3B8'>{label}</text>
                  )
                })}
              </svg>
              <div className='mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300'>
                <div>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>Avg. Appointments/Day</p>
                  <p className='text-lg font-semibold text-emerald-600'>{performance.avgPerDay}</p>
                </div>
                <div className='text-right'>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>Patients/Day</p>
                  <p className='text-lg font-semibold text-emerald-600'>{performance.patientsPerDay}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)]'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-sm font-semibold text-slate-900 dark:text-white'>Today’s Revenue</p>
                <p className='text-2xl font-semibold text-slate-900 dark:text-white mt-2'>{currency}{revenue.totalToday}</p>
              </div>
              <div className='h-9 w-9 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm'>
                $
              </div>
            </div>
            <div className='mt-4'>
              <svg width='260' height='140' viewBox='0 0 260 140' className='w-full'>
                <defs>
                  <linearGradient id='revBlue' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#2563EB' stopOpacity='0.35' />
                    <stop offset='100%' stopColor='#2563EB' stopOpacity='0' />
                  </linearGradient>
                  <linearGradient id='revGreen' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#22C55E' stopOpacity='0.35' />
                    <stop offset='100%' stopColor='#22C55E' stopOpacity='0' />
                  </linearGradient>
                </defs>
                <line x1='0' y1='100' x2='260' y2='100' stroke='#E5E7EB' strokeWidth='2' />
                <path d={buildAreaPath(revenue.online, 100, 260)} fill='url(#revBlue)' />
                <path d={buildAreaPath(revenue.cash, 100, 260)} fill='url(#revGreen)' />
                <polyline points={buildPolyline(revenue.online, 100, 260)} fill='none' stroke='#2563EB' strokeWidth='3' />
                <polyline points={buildPolyline(revenue.cash, 100, 260)} fill='none' stroke='#22C55E' strokeWidth='3' />
                {labels.map((label, idx) => {
                  const step = labels.length > 1 ? 260 / (labels.length - 1) : 260
                  const x = idx * step
                  return (
                    <text key={label} x={x} y='130' textAnchor='middle' fontSize='10' fill='#94A3B8'>{label}</text>
                  )
                })}
              </svg>
              <div className='mt-3 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300'>
                <span className='flex items-center gap-2'>
                  <span className='h-2.5 w-2.5 rounded-full bg-blue-600'></span>
                  Online
                </span>
                <span className='flex items-center gap-2'>
                  <span className='h-2.5 w-2.5 rounded-full bg-emerald-500'></span>
                  Cash
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-[0_18px_60px_-40px_rgba(15,23,42,0.5)] overflow-hidden'>
          <div className='flex items-center gap-2.5 px-6 py-4 border-b border-slate-200/70 dark:border-slate-800/60'>
            <div className='h-10 w-10 rounded-2xl bg-primary/10 dark:bg-slate-800/80 flex items-center justify-center ring-1 ring-primary/20 dark:ring-slate-700/60'>
              <img className='w-5 dark:brightness-110 dark:contrast-125' src={assets.list_icon} alt="" />
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-900 dark:text-white'>Latest Bookings</p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>Most recent 5 appointments</p>
            </div>
          </div>

          <div className='divide-y divide-slate-200/60 dark:divide-slate-800/60'>
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div className='max-md:mx-2 max-md:my-3 max-md:rounded-xl max-md:border max-md:border-slate-200 max-md:dark:border-slate-700 max-md:bg-white max-md:dark:bg-slate-900 max-md:p-4 max-md:shadow-sm px-4 sm:px-6 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors' key={index}>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                  <div className='flex items-center gap-3 flex-1 min-w-[220px]'>
                    <img className='rounded-2xl w-11 h-11 object-cover ring-2 ring-white dark:ring-slate-800/80' src={item.userData.image} alt="" />
                    <div className='text-sm'>
                      <p className='text-slate-900 dark:text-white font-semibold'>{item.userData.name}</p>
                      <p className='text-slate-500 dark:text-slate-400'>Booking on {slotDateFormat(item.slotDate)}</p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between sm:justify-end gap-3'>
                    {item.cancelled
                      ? <span className='text-rose-500 text-xs font-semibold'>Cancelled</span>
                      : item.isCompleted
                        ? <span className='text-emerald-500 text-xs font-semibold'>Completed</span>
                        : <div className='flex items-center gap-2'>
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
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
