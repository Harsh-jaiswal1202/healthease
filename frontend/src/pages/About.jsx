import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className='relative overflow-hidden px-4 sm:px-6 lg:px-10 py-8'>
      <div className='absolute inset-0 -z-10'>
        <div className='absolute -top-20 -left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl'></div>
        <div className='absolute top-40 -right-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl'></div>
      </div>

      <section className='rounded-3xl border border-slate-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/80 p-5 sm:p-10 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.5)]'>
        <button
          onClick={() => { navigate('/'); scrollTo(0, 0) }}
          className='inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/80 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-200 shadow-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-all'
        >
          Back
        </button>
        <div className='mt-4 flex flex-col lg:flex-row gap-6 sm:gap-10 items-center'>
          <div className='flex-1'>
            <p className='text-sm uppercase tracking-[0.35em] text-slate-400 dark:text-gray-500'>About Us</p>
            <h1 className='text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white mt-2'>Care that feels effortless</h1>
            <p className='text-slate-600 dark:text-gray-400 mt-4'>
              Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently.
              We help you book appointments, track visits, and stay informed with a calm, modern experience.
            </p>
            <p className='text-slate-600 dark:text-gray-400 mt-3'>
              We continuously improve our platform with thoughtful technology so you can focus on your health,
              not the paperwork. From first-time bookings to ongoing care, Prescripto supports you every step of the way.
            </p>
            <div className='mt-6 flex flex-wrap gap-3'>
              <span className='px-4 py-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700'>Trusted providers</span>
              <span className='px-4 py-2 rounded-full text-xs font-semibold bg-blue-50 text-blue-700'>Fast scheduling</span>
              <span className='px-4 py-2 rounded-full text-xs font-semibold bg-violet-50 text-violet-700'>Secure records</span>
            </div>
          </div>
          <div className='flex-1 w-full'>
            <div className='relative rounded-[28px] overflow-hidden border border-slate-200/60 dark:border-gray-800/60 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.55)]'>
              <img className='w-full h-full object-cover' src={assets.about_image} alt="" />
              <div className='absolute inset-0 bg-gradient-to-tr from-white/60 via-transparent to-transparent dark:from-gray-900/40'></div>
            </div>
          </div>
        </div>
      </section>

      <section className='mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5'>
        <div className='rounded-2xl border border-slate-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/80 p-6 shadow-[0_16px_50px_-35px_rgba(15,23,42,0.45)]'>
          <p className='text-xs uppercase tracking-[0.28em] text-slate-400'>Efficiency</p>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white mt-2'>Book in minutes</h3>
          <p className='text-sm text-slate-600 dark:text-gray-400 mt-2'>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='rounded-2xl border border-slate-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/80 p-6 shadow-[0_16px_50px_-35px_rgba(15,23,42,0.45)]'>
          <p className='text-xs uppercase tracking-[0.28em] text-slate-400'>Convenience</p>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white mt-2'>Trusted network</h3>
          <p className='text-sm text-slate-600 dark:text-gray-400 mt-2'>Access to verified healthcare professionals in your area.</p>
        </div>
        <div className='rounded-2xl border border-slate-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/80 p-6 shadow-[0_16px_50px_-35px_rgba(15,23,42,0.45)]'>
          <p className='text-xs uppercase tracking-[0.28em] text-slate-400'>Personalization</p>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white mt-2'>Care that adapts</h3>
          <p className='text-sm text-slate-600 dark:text-gray-400 mt-2'>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </section>

      <section className='mt-6 sm:mt-10 rounded-3xl border border-slate-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/80 p-5 sm:p-8 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.5)]'>
        <div className='flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between'>
          <div>
            <p className='text-sm uppercase tracking-[0.32em] text-slate-400 dark:text-gray-500'>Our Vision</p>
            <h2 className='text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mt-2'>A seamless healthcare experience</h2>
            <p className='text-slate-600 dark:text-gray-400 mt-3'>
              We bridge the gap between patients and providers so you can get the care you need, exactly when you need it.
            </p>
          </div>
          <div className='flex flex-wrap gap-3'>
            <div className='rounded-2xl border border-slate-200/70 dark:border-gray-800/70 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-950 px-5 py-4'>
              <p className='text-xs uppercase tracking-[0.28em] text-slate-400'>Focus</p>
              <p className='text-lg font-semibold text-slate-900 dark:text-white mt-1'>Patient first</p>
            </div>
            <div className='rounded-2xl border border-slate-200/70 dark:border-gray-800/70 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-950 px-5 py-4'>
              <p className='text-xs uppercase tracking-[0.28em] text-slate-400'>Promise</p>
              <p className='text-lg font-semibold text-slate-900 dark:text-white mt-1'>Reliable care</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
