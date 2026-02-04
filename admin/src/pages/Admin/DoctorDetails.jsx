import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'

const DoctorDetails = () => {
  const { doctorId } = useParams()
  const { getDoctor, verifyDoctor, setDoctorStatus, deactivateDoctor, changeAvailability } = useContext(AdminContext)
  const [doctor, setDoctor] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadDoctor = async () => {
      const data = await getDoctor(doctorId)
      setDoctor(data)
    }
    loadDoctor()
  }, [doctorId])

  if (!doctor) {
    return (
      <div className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6'>
        <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]'>
          <p className='text-sm text-slate-500 dark:text-slate-400'>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Doctors > Profile</p>
          <h1 className='text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white'>{doctor.name}</h1>
          <p className='text-sm text-slate-500 dark:text-slate-400'>{doctor.speciality}</p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <button onClick={() => navigate(`/edit-doctor/${doctor._id}`)} className='h-10 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:border-slate-300'>
            Edit
          </button>
          <button onClick={() => verifyDoctor(doctor._id, doctor.verificationStatus === 'verified' ? 'pending' : 'verified')} className='h-10 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:border-slate-300'>
            {doctor.verificationStatus === 'verified' ? 'Unverify' : 'Verify'}
          </button>
          <button onClick={() => setDoctorStatus(doctor._id, doctor.status === 'published' ? 'draft' : 'published')} className='h-10 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:border-slate-300'>
            {doctor.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          <button onClick={() => deactivateDoctor(doctor._id)} className='h-10 rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-600 shadow-sm hover:border-rose-300'>
            Deactivate
          </button>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1fr_2fr]'>
        <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
          <div className='flex flex-col items-center text-center'>
            <img className='h-32 w-32 rounded-3xl object-cover ring-4 ring-white shadow-md' src={doctor.image} alt={doctor.name} />
            <p className='mt-4 text-lg font-semibold text-slate-900 dark:text-white'>{doctor.name}</p>
            <p className='text-sm text-slate-500 dark:text-slate-400'>{doctor.speciality}</p>
            <div className='mt-3 flex flex-wrap items-center justify-center gap-2'>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doctor.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {doctor.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doctor.status === 'published' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600 dark:text-slate-300'}`}>
                {doctor.status === 'published' ? 'Published' : 'Draft'}
              </span>
              <span className='px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:text-slate-300'>
                Profile {doctor.profileCompletion ?? 0}%
              </span>
            </div>
            <label className='mt-4 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300'>
              <input
                onChange={() => changeAvailability(doctor._id)}
                type='checkbox'
                checked={doctor.available}
                className='h-4 w-4 accent-primary'
              />
              Available
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Professional Summary</p>
            <div className='mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300'>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='text-slate-500 dark:text-slate-400'>Experience:</span>
                <span className='font-semibold text-slate-900 dark:text-white'>{doctor.experience}</span>
              </div>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='text-slate-500 dark:text-slate-400'>Degree:</span>
                <span className='font-semibold text-slate-900 dark:text-white'>{doctor.degree}</span>
              </div>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='text-slate-500 dark:text-slate-400'>Fee:</span>
                <span className='font-semibold text-slate-900 dark:text-white'>INR {doctor.fees}</span>
              </div>
              <div>
                <span className='text-slate-500 dark:text-slate-400'>Bio:</span>
                <p className='mt-2 text-slate-700 dark:text-slate-200'>{doctor.about}</p>
              </div>
            </div>
          </div>

          <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Clinic Location</p>
            <div className='mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300'>
              <p className='font-semibold text-slate-900 dark:text-white'>{doctor.address?.clinicName || 'Clinic'}</p>
              <p>{doctor.address?.line1}</p>
              <p>{doctor.address?.line2}</p>
              <p>{doctor.address?.city} {doctor.address?.state} {doctor.address?.pincode}</p>
            </div>
          </div>

          <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Availability</p>
            <div className='mt-4 flex flex-wrap gap-2'>
              {(doctor.availability?.days || []).map((day) => (
                <span key={day.day} className={`px-3 py-1 rounded-full text-xs font-semibold ${day.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500 dark:text-slate-400'}`}>
                  {day.day} {day.enabled ? `${day.start}-${day.end}` : 'Off'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetails
