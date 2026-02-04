import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()

  const [search, setSearch] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState('All')
  const [visibleCount, setVisibleCount] = useState(6)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

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
      list = list.filter((doc) => {
        return (
          doc.name.toLowerCase().includes(query) ||
          doc.speciality.toLowerCase().includes(query)
        )
      })
    }

    return list
  }, [doctors, search, selectedSpeciality])

  useEffect(() => {
    if (speciality) {
      setSelectedSpeciality(speciality)
    } else {
      setSelectedSpeciality('All')
    }
    setVisibleCount(6)
  }, [speciality, doctors])

  return (
    <div className='relative'>
      <div className='rounded-3xl border border-slate-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/80 p-4 sm:p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <p className='text-sm uppercase tracking-[0.32em] text-slate-400 dark:text-gray-500'>Doctors</p>
            <h1 className='text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white'>Find the right specialist</h1>
            <p className='text-slate-500 dark:text-gray-400 mt-1'>Search and filter through verified doctors and book instantly.</p>
          </div>
          <div className='w-full lg:max-w-md'>
            <div className='flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-800 px-4 py-3 shadow-sm'>
              <svg className='w-5 h-5 text-slate-400' viewBox='0 0 24 24' fill='none'>
                <path d='M21 21l-4.35-4.35m1.1-4.15a7 7 0 11-14 0 7 7 0 0114 0z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
              </svg>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search doctor or speciality'
                className='w-full bg-transparent text-sm text-slate-700 dark:text-gray-200 placeholder:text-slate-400 focus:outline-none'
              />
            </div>
          </div>
        </div>

        <div className='mt-5 flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2'>
          {specialities.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelectedSpeciality(item)
                setVisibleCount(6)
                if (item === 'All') {
                  navigate('/doctors')
                } else {
                  navigate(`/doctors/${item}`)
                }
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedSpeciality === item
                  ? 'bg-gradient-to-r from-primary to-cyan-500 text-white border-transparent shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)]'
                  : 'border-slate-200/80 dark:border-gray-700/80 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6'>
        {filteredDoctors.slice(0, visibleCount).map((item) => (
          <div
            key={item._id}
            className='group rounded-3xl border border-slate-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/80 p-4 sm:p-6 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_26px_80px_-40px_rgba(15,23,42,0.55)]'
          >
            <div className='flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center'>
              <div className='relative flex-shrink-0 self-center md:self-auto'>
                <img className='h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-cover ring-4 ring-white shadow-md' src={item.image} alt={item.name} />
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold ${
                  item.available ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                }`}>
                  {item.available ? 'Available' : 'Offline'}
                </div>
              </div>

              <div className='flex-1'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:gap-3'>
                  <h3 className='text-xl font-semibold text-slate-900 dark:text-white'>{item.name}</h3>
                  <span className='text-sm font-medium text-primary'>{item.speciality}</span>
                </div>
                <div className='mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-gray-400'>
                  <span>{item.experience} experience</span>
                  <span className='h-1 w-1 rounded-full bg-slate-300'></span>
                  <span>Consultation: {item.fees}</span>
                </div>

                <div className='mt-3 flex flex-wrap items-center gap-2'>
                  <span className='px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700'>✔ Verified</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.available ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.available ? '🕒 Available Today' : 'Not Available'}
                  </span>
                </div>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row md:flex-col md:items-end w-full md:w-auto'>
                <button
                  onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                  className='w-full md:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all'
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                  className='w-full md:w-auto px-6 py-2.5 rounded-full border border-slate-200/80 dark:border-gray-700/80 text-slate-700 dark:text-gray-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-gray-800 transition-all'
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-8 flex justify-center'>
        {filteredDoctors.length > visibleCount && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className='px-6 py-2.5 rounded-full border border-slate-200/80 dark:border-gray-700/80 text-slate-700 dark:text-gray-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-gray-800 transition-all'
          >
            Load More
          </button>
        )}
      </div>
    </div>
  )
}

export default Doctors
