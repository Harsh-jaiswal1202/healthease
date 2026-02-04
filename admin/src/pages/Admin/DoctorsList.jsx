import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const DoctorsList = () => {

  const { doctors, changeAvailability, aToken, getAllDoctors, verifyDoctor, setDoctorStatus, deactivateDoctor } = useContext(AdminContext)
  const [search, setSearch] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  const specialities = useMemo(() => {
    const list = doctors.map((doc) => doc.speciality).filter(Boolean)
    return ['All', ...Array.from(new Set(list))]
  }, [doctors])

  const filteredDoctors = useMemo(() => {
    let list = doctors
    if (selectedSpeciality && selectedSpeciality !== 'All') {
      list = list.filter((doc) => doc.speciality === selectedSpeciality)
    }
    if (search.trim()) {
      const query = search.trim().toLowerCase()
      list = list.filter((doc) => (
        doc.name.toLowerCase().includes(query) ||
        doc.speciality.toLowerCase().includes(query)
      ))
    }
    return list
  }, [doctors, search, selectedSpeciality])

  return (
    <div className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8'>
      <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Admin roster</p>
            <h1 className='text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white'>All Doctors</h1>
            <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>Monitor availability, status, and profile health at a glance.</p>
          </div>
          <div className='w-full lg:max-w-md'>
            <div className='flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white/95 dark:bg-slate-900/70 px-4 py-3 shadow-sm'>
              <svg className='w-5 h-5 text-slate-400' viewBox='0 0 24 24' fill='none'>
                <path d='M21 21l-4.35-4.35m1.1-4.15a7 7 0 11-14 0 7 7 0 0114 0z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
              </svg>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search doctor or speciality'
                className='w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none'
              />
            </div>
          </div>
        </div>

        <div className='mt-5 flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2'>
          {specialities.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedSpeciality(item)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedSpeciality === item
                  ? 'bg-gradient-to-r from-primary to-cyan-500 text-white border-transparent shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)]'
                  : 'border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6'>
        {filteredDoctors.map((item) => (
          <div
            key={item._id}
            className='group rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_26px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur'
          >
            <div className='flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center'>
              <div className='relative flex-shrink-0 self-start md:self-auto'>
                <img className='h-20 w-20 sm:h-28 sm:w-28 rounded-2xl sm:rounded-3xl object-cover ring-4 ring-white shadow-md' src={item.image} alt={item.name} />
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold ${
                  item.available ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                }`}>
                  {item.available ? 'Available' : 'Offline'}
                </div>
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3'>
                  <h3 className='text-lg sm:text-xl font-semibold text-slate-900 dark:text-white truncate'>{item.name}</h3>
                  <span className='text-sm font-medium text-primary'>{item.speciality}</span>
                </div>
                <div className='mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400'>
                  <span>{item.experience || 'N/A'} experience</span>
                  <span className='hidden sm:inline h-1 w-1 rounded-full bg-slate-300'></span>
                  <span>Consultation: INR {item.fees ?? '-'}</span>
                </div>

                <div className='mt-3 flex flex-wrap items-center gap-2'>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                  }`}>
                    {item.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'draft' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                  }`}>
                    {item.status === 'draft' ? 'Draft' : 'Published'}
                  </span>
                  <span className='px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                    Profile {item.profileCompletion ?? 0}%
                  </span>
                </div>
              </div>

              <div className='flex flex-col gap-3 w-full md:w-auto md:items-end'>
                <label className='flex w-full md:w-auto items-center justify-between gap-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm'>
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type='checkbox'
                    checked={item.available}
                    className='h-4 w-4 accent-primary'
                  />
                  Toggle availability
                </label>
                <div className='flex flex-wrap items-center gap-2'>
                  <button
                    onClick={() => navigate(`/doctor/${item._id}`)}
                    className='rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate(`/edit-doctor/${item._id}`)}
                    className='rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => verifyDoctor(item._id, item.verificationStatus === 'verified' ? 'pending' : 'verified')}
                    className='rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  >
                    {item.verificationStatus === 'verified' ? 'Unverify' : 'Verify'}
                  </button>
                  <button
                    onClick={() => setDoctorStatus(item._id, item.status === 'published' ? 'draft' : 'published')}
                    className='rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  >
                    {item.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => deactivateDoctor(item._id)}
                    className='rounded-full border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-300 hover:border-rose-300'
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList
