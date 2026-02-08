import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'

const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const EditDoctor = () => {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const { getDoctor, updateDoctor } = useContext(AdminContext)

  const [loading, setLoading] = useState(true)
  const [docImg, setDocImg] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [degree, setDegree] = useState('')
  const [experience, setExperience] = useState('')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [clinicName, setClinicName] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [stateRegion, setStateRegion] = useState('')
  const [pincode, setPincode] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [status, setStatus] = useState('published')
  const [verificationStatus, setVerificationStatus] = useState('pending')
  const [availabilityDays, setAvailabilityDays] = useState(dayOptions.map((day) => ({ day, enabled: false, start: '09:00', end: '17:00' })))
  const [slotDuration, setSlotDuration] = useState(30)
  const [breakMinutes, setBreakMinutes] = useState(0)
  const [licenseFile, setLicenseFile] = useState(null)
  const [degreeCertFile, setDegreeCertFile] = useState(null)
  const [idProofFile, setIdProofFile] = useState(null)
  const [certFiles, setCertFiles] = useState([])

  useEffect(() => {
    const loadDoctor = async () => {
      const data = await getDoctor(doctorId)
      if (!data) {
        toast.error('Unable to load doctor')
        return
      }
      setName(data.name || '')
      setEmail(data.email || '')
      setSpeciality(data.speciality || '')
      setDegree(data.degree || '')
      setExperience(data.experience || '')
      setFees(data.fees ?? '')
      setAbout(data.about || '')
      setClinicName(data.address?.clinicName || '')
      setAddress1(data.address?.line1 || '')
      setAddress2(data.address?.line2 || '')
      setCity(data.address?.city || '')
      setStateRegion(data.address?.state || '')
      setPincode(data.address?.pincode || '')
      setLat(data.location?.lat ?? '')
      setLng(data.location?.lng ?? '')
      setStatus(data.status || 'published')
      setVerificationStatus(data.verificationStatus || 'pending')
      setAvailabilityDays(data.availability?.days?.length ? data.availability.days : dayOptions.map((day) => ({ day, enabled: false, start: '09:00', end: '17:00' })))
      setSlotDuration(data.availability?.slotDuration ?? 30)
      setBreakMinutes(data.availability?.breakMinutes ?? 0)
      setLoading(false)
    }
    loadDoctor()
  }, [doctorId])

  const updateDay = (index, updates) => {
    setAvailabilityDays((prev) => prev.map((day, i) => (i === index ? { ...day, ...updates } : day)))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    if (docImg) formData.append('image', docImg)
    formData.append('name', name)
    formData.append('email', email)
    if (password) formData.append('password', password)
    formData.append('speciality', speciality)
    formData.append('degree', degree)
    formData.append('experience', experience)
    formData.append('fees', Number(fees))
    formData.append('about', about)
    formData.append('status', status)
    formData.append('verificationStatus', verificationStatus)
    formData.append('address', JSON.stringify({
      line1: address1,
      line2: address2,
      city,
      state: stateRegion,
      pincode,
      clinicName
    }))
    formData.append('location', JSON.stringify({
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null
    }))
    formData.append('availability', JSON.stringify({
      days: availabilityDays,
      slotDuration: Number(slotDuration),
      breakMinutes: Number(breakMinutes)
    }))

    if (licenseFile) formData.append('license', licenseFile)
    if (degreeCertFile) formData.append('degreeCert', degreeCertFile)
    if (idProofFile) formData.append('idProof', idProofFile)
    certFiles.forEach((file) => formData.append('certifications', file))

    const updated = await updateDoctor(doctorId, formData)
    if (updated) {
      navigate(`/doctor/${doctorId}`)
    }
  }

  if (loading) {
    return (
      <div className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6'>
        <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]'>
          <p className='text-sm text-slate-500 dark:text-slate-400'>Loading doctor...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Doctors &gt; Edit</p>
          <h1 className='text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white'>Edit Doctor</h1>
          <p className='text-sm text-slate-500 dark:text-slate-400'>Update profile fields and documents.</p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <button type='button' onClick={() => navigate(`/doctor/${doctorId}`)} className='h-10 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:border-slate-300'>
            Cancel
          </button>
          <button type='submit' className='h-10 rounded-full bg-gradient-to-r from-primary via-indigo-600 to-cyan-500 px-5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:opacity-95'>
            Save Changes
          </button>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1fr_2fr]'>
        <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
          <p className='text-sm font-semibold text-slate-900 dark:text-white'>Profile Photo</p>
          <div className='mt-4 flex flex-col items-center gap-4'>
            <div className='h-28 w-28 overflow-hidden rounded-3xl bg-slate-100 ring-4 ring-white'>
              {docImg ? (
                <img className='h-28 w-28 object-cover' src={URL.createObjectURL(docImg)} alt='Preview' />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-xs text-slate-400'>No preview</div>
              )}
            </div>
            <input type='file' className='w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20' onChange={(e) => setDocImg(e.target.files[0])} />
          </div>

          <div className='mt-6 grid gap-3 text-sm'>
            <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-3 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700'>
                <option value='published'>Published</option>
                <option value='draft'>Draft</option>
              </select>
            </label>
            <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
              Verification
              <select value={verificationStatus} onChange={(e) => setVerificationStatus(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-3 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700'>
                <option value='pending'>Pending</option>
                <option value='verified'>Verified</option>
              </select>
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Basic Details</p>
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' required />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Email
                <input value={email} onChange={(e) => setEmail(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' required />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Password (optional)
                <input value={password} onChange={(e) => setPassword(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' type='password' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Speciality
                <input value={speciality} onChange={(e) => setSpeciality(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Degree
                <input value={degree} onChange={(e) => setDegree(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Experience
                <input value={experience} onChange={(e) => setExperience(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Fees
                <input value={fees} onChange={(e) => setFees(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' type='number' />
              </label>
            </div>
          </div>

          <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Clinic Address</p>
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Clinic name
                <input value={clinicName} onChange={(e) => setClinicName(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Address line 1
                <input value={address1} onChange={(e) => setAddress1(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Address line 2
                <input value={address2} onChange={(e) => setAddress2(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                City
                <input value={city} onChange={(e) => setCity(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                State
                <input value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Pincode
                <input value={pincode} onChange={(e) => setPincode(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' />
              </label>
            </div>
          </div>

          <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Availability</p>
            <div className='mt-4 flex flex-wrap gap-2'>
              {availabilityDays.map((day, index) => (
                <button
                  key={day.day}
                  type='button'
                  onClick={() => updateDay(index, { enabled: !day.enabled })}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${day.enabled ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-white text-slate-500 dark:text-slate-400 border border-slate-200'}`}
                >
                  {day.day}
                </button>
              ))}
            </div>
            <div className='mt-4 grid gap-4 md:grid-cols-3'>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Start time
                <input
                  type='time'
                  value={availabilityDays[0]?.start}
                  onChange={(e) => setAvailabilityDays((prev) => prev.map((item) => ({ ...item, start: e.target.value })))}
                  className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700'
                />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                End time
                <input
                  type='time'
                  value={availabilityDays[0]?.end}
                  onChange={(e) => setAvailabilityDays((prev) => prev.map((item) => ({ ...item, end: e.target.value })))}
                  className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700'
                />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Slot duration
                <select value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-3 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700'>
                  <option value='15'>15 mins</option>
                  <option value='30'>30 mins</option>
                  <option value='45'>45 mins</option>
                  <option value='60'>60 mins</option>
                </select>
              </label>
            </div>
            <label className='mt-4 grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
              Break time (minutes)
              <input value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} className='w-full h-10 rounded-xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' type='number' min='0' />
            </label>
          </div>

          <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>About</p>
            <textarea value={about} onChange={(e) => setAbout(e.target.value)} className='mt-4 min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white/90 dark:bg-slate-900/70 px-4 py-3 text-sm text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700' />
          </div>

          <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Documents</p>
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Medical license
                <input className='w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20' onChange={(e) => setLicenseFile(e.target.files[0])} type='file' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Degree certificate
                <input className='w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20' onChange={(e) => setDegreeCertFile(e.target.files[0])} type='file' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                ID proof
                <input className='w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20' onChange={(e) => setIdProofFile(e.target.files[0])} type='file' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Certifications
                <input className='w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20' onChange={(e) => setCertFiles(Array.from(e.target.files || []))} type='file' multiple />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default EditDoctor
