import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData } = useContext(DoctorContext)
  const { backendUrl } = useContext(AppContext)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
  const [availabilityDays, setAvailabilityDays] = useState(dayOptions.map((day) => ({ day, enabled: false, start: '09:00', end: '17:00' })))
  const [slotDuration, setSlotDuration] = useState(30)
  const [breakMinutes, setBreakMinutes] = useState(0)
  const [languageInput, setLanguageInput] = useState('')
  const [languages, setLanguages] = useState([])
  const [serviceInput, setServiceInput] = useState('')
  const [services, setServices] = useState([])
  const [available, setAvailable] = useState(true)
  const [licenseFile, setLicenseFile] = useState(null)
  const [degreeCertFile, setDegreeCertFile] = useState(null)
  const [idProofFile, setIdProofFile] = useState(null)
  const [certFiles, setCertFiles] = useState([])

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  useEffect(() => {
    if (!profileData) return
    setName(profileData.name || '')
    setEmail(profileData.email || '')
    setSpeciality(profileData.speciality || '')
    setDegree(profileData.degree || '')
    setExperience(profileData.experience || '')
    setFees(profileData.fees ?? '')
    setAbout(profileData.about || '')
    setClinicName(profileData.address?.clinicName || '')
    setAddress1(profileData.address?.line1 || '')
    setAddress2(profileData.address?.line2 || '')
    setCity(profileData.address?.city || '')
    setStateRegion(profileData.address?.state || '')
    setPincode(profileData.address?.pincode || '')
    setLat(profileData.location?.lat ?? '')
    setLng(profileData.location?.lng ?? '')
    setAvailabilityDays(profileData.availability?.days?.length ? profileData.availability.days : dayOptions.map((day) => ({ day, enabled: day !== 'Sun', start: '09:00', end: '17:00' })))
    setSlotDuration(profileData.availability?.slotDuration ?? 30)
    setBreakMinutes(profileData.availability?.breakMinutes ?? 0)
    setLanguages(profileData.languages || [])
    setServices(profileData.services || [])
    setAvailable(profileData.available ?? true)
    setLoading(false)
  }, [profileData])

  const mapLat = lat || 28.6139
  const mapLng = lng || 77.2090
  const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY
  const mapSrc = mapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${mapLat},${mapLng}`
    : `https://maps.google.com/maps?q=${mapLat},${mapLng}&z=14&output=embed`

  const handleChipAdd = (value, setter, list) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (list.includes(trimmed)) return
    setter([...list, trimmed])
  }

  const handleChipRemove = (value, setter, list) => {
    setter(list.filter((item) => item !== value))
  }

  const handleLanguageKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleChipAdd(languageInput, setLanguages, languages)
      setLanguageInput('')
    }
  }

  const handleServiceKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleChipAdd(serviceInput, setServices, services)
      setServiceInput('')
    }
  }

  const updateDay = (index, updates) => {
    setAvailabilityDays((prev) => prev.map((day, i) => (i === index ? { ...day, ...updates } : day)))
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(6))
        setLng(position.coords.longitude.toFixed(6))
      },
      () => toast.error('Unable to fetch location')
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSaving(true)
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
      formData.append('available', available)
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
      formData.append('languages', JSON.stringify(languages))
      formData.append('services', JSON.stringify(services))

      if (licenseFile) formData.append('license', licenseFile)
      if (degreeCertFile) formData.append('degreeCert', degreeCertFile)
      if (idProofFile) formData.append('idProof', idProofFile)
      certFiles.forEach((file) => formData.append('certifications', file))

      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', formData, { headers: { dToken } })
      if (data.success) {
        toast.success(data.message)
        setPassword('')
        setDocImg(null)
        setLicenseFile(null)
        setDegreeCertFile(null)
        setIdProofFile(null)
        setCertFiles([])
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6'>
        <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]'>
          <p className='text-sm text-slate-500 dark:text-slate-400'>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='w-full min-w-0 min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 px-3 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden'>
      <div className='max-w-6xl mx-auto w-full min-w-0'>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-center sm:text-left'>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Doctor &gt; Profile</p>
            <h1 className='text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white'>My Profile</h1>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Update your public profile, clinic details, and availability.</p>
          </div>
          <div className='flex w-full sm:w-auto items-center justify-center sm:justify-end'>
            <button type='submit' disabled={saving} className='w-full sm:w-auto h-11 rounded-full bg-gradient-to-r from-primary via-indigo-600 to-cyan-500 px-6 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:opacity-95 disabled:opacity-60'>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className='grid gap-4 sm:gap-6 lg:grid-cols-[1fr_2fr] w-full min-w-0'>
        <div className='rounded-3xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/90 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] w-full min-w-0'>
          <p className='text-sm font-semibold text-slate-900 dark:text-white'>Profile Photo</p>
          <div className='mt-4 flex flex-col sm:flex-row sm:items-center gap-4'>
            <div className='h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-800/80 mx-auto sm:mx-0'>
              <img className='h-24 w-24 sm:h-28 sm:w-28 object-cover' src={docImg ? URL.createObjectURL(docImg) : profileData?.image} alt='Preview' />
            </div>
            <div className='flex-1'>
              <input type='file' onChange={(e) => setDocImg(e.target.files[0])} className='w-full text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-200' />
              <p className='mt-2 text-xs text-slate-500 dark:text-slate-400'>Recommended size 512x512.</p>
            </div>
          </div>

          <div className='mt-6 grid gap-3 text-sm'>
            <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
              Availability
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setAvailable((prev) => !prev)}
                  className={`h-9 w-full sm:w-auto rounded-full px-4 text-xs font-semibold transition ${available ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white text-slate-500 border border-slate-200'}`}
                >
                  {available ? 'Accepting Appointments' : 'Not Available'}
                </button>
              </div>
            </label>
            <div className='rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4'>
              <div className='flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300'>
                <span>Profile Completion</span>
                <span className='rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-slate-600 dark:text-slate-200'>{profileData?.profileCompletion || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:gap-6 w-full min-w-0'>
          <div className='rounded-3xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/90 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Basic Details</p>
            <div className='mt-4 grid gap-4 sm:grid-cols-2'>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' required />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Email
                <input value={email} onChange={(e) => setEmail(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' required />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Password (optional)
                <input value={password} onChange={(e) => setPassword(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' type='password' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Speciality
                <input value={speciality} onChange={(e) => setSpeciality(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Degree
                <input value={degree} onChange={(e) => setDegree(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Experience
                <input value={experience} onChange={(e) => setExperience(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Fees
                <input value={fees} onChange={(e) => setFees(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' type='number' />
              </label>
            </div>
          </div>

          <div className='rounded-3xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/90 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Clinic Address</p>
            <div className='mt-4 grid gap-4 sm:grid-cols-2'>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Clinic name
                <input value={clinicName} onChange={(e) => setClinicName(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Address line 1
                <input value={address1} onChange={(e) => setAddress1(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Address line 2
                <input value={address2} onChange={(e) => setAddress2(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                City
                <input value={city} onChange={(e) => setCity(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                State
                <input value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Pincode
                <input value={pincode} onChange={(e) => setPincode(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
              </label>
            </div>
            <div className='mt-6 flex flex-col gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-sm'>
              <div className='h-40 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'>
                <iframe title="Clinic map" className='h-full w-full' src={mapSrc} />
              </div>
              <button type='button' onClick={useCurrentLocation} className='h-10 w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 text-xs font-semibold text-slate-600 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-500'>
                Use Current Location
              </button>
            </div>
          </div>

          <div className='rounded-3xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/90 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
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
            <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Start time
                <input
                  type='time'
                  value={availabilityDays[0]?.start}
                  onChange={(e) => setAvailabilityDays((prev) => prev.map((item) => ({ ...item, start: e.target.value })))}
                  className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30'
                />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                End time
                <input
                  type='time'
                  value={availabilityDays[0]?.end}
                  onChange={(e) => setAvailabilityDays((prev) => prev.map((item) => ({ ...item, end: e.target.value })))}
                  className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30'
                />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Slot duration
                <select value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-3 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30'>
                  <option value='15'>15 mins</option>
                  <option value='30'>30 mins</option>
                  <option value='45'>45 mins</option>
                  <option value='60'>60 mins</option>
                </select>
              </label>
            </div>
            <label className='mt-4 grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
              Break time (minutes)
              <input value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' type='number' min='0' />
            </label>
          </div>

          <div className='rounded-3xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/90 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>About</p>
            <textarea value={about} onChange={(e) => setAbout(e.target.value)} className='mt-4 min-h-[140px] w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 py-3 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' />
            <div className='mt-5 grid gap-4 sm:grid-cols-2'>
              <div className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Languages spoken
                <input onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={handleLanguageKey} value={languageInput} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' type="text" placeholder='Type and press Enter' />
                <div className='flex flex-wrap gap-2'>
                  {languages.map((item) => (
                    <button type='button' key={item} onClick={() => handleChipRemove(item, setLanguages, languages)} className='rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-200'>
                      {item} x
                    </button>
                  ))}
                </div>
              </div>
              <div className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Clinic services
                <input onChange={(e) => setServiceInput(e.target.value)} onKeyDown={handleServiceKey} value={serviceInput} className='h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30' type="text" placeholder='Type and press Enter' />
                <div className='flex flex-wrap gap-2'>
                  {services.map((item) => (
                    <button type='button' key={item} onClick={() => handleChipRemove(item, setServices, services)} className='rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-200'>
                      {item} x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-3xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/90 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Documents</p>
            <div className='mt-4 grid gap-4 sm:grid-cols-2'>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Medical license
                <input onChange={(e) => setLicenseFile(e.target.files[0])} type='file' className='text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-200' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Degree certificate
                <input onChange={(e) => setDegreeCertFile(e.target.files[0])} type='file' className='text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-200' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                ID proof
                <input onChange={(e) => setIdProofFile(e.target.files[0])} type='file' className='text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-200' />
              </label>
              <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                Certifications
                <input onChange={(e) => setCertFiles(Array.from(e.target.files || []))} type='file' multiple className='text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-200' />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    </form>
  )
}

export default DoctorProfile
