import React, { useContext, useMemo, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const specialityOptions = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist',
    'Cardiologist',
    'Orthopedic',
    'Psychiatrist'
]

const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degreeInput, setDegreeInput] = useState('')
    const [degrees, setDegrees] = useState([])
    const [experienceYears, setExperienceYears] = useState(1)
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [clinicFocus, setClinicFocus] = useState('')
    const [clinicName, setClinicName] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [city, setCity] = useState('')
    const [stateRegion, setStateRegion] = useState('')
    const [pincode, setPincode] = useState('')
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [languageInput, setLanguageInput] = useState('')
    const [languages, setLanguages] = useState([])
    const [serviceInput, setServiceInput] = useState('')
    const [services, setServices] = useState([])
    const [availabilityDays, setAvailabilityDays] = useState(
        dayOptions.map((day) => ({ day, enabled: day !== 'Sun', start: '09:00', end: '17:00' }))
    )
    const [slotDuration, setSlotDuration] = useState(30)
    const [breakMinutes, setBreakMinutes] = useState(0)
    const [licenseFile, setLicenseFile] = useState(null)
    const [degreeCertFile, setDegreeCertFile] = useState(null)
    const [idProofFile, setIdProofFile] = useState(null)
    const [certFiles, setCertFiles] = useState([])
    const [verificationStatus] = useState('pending')
    const [showPreview, setShowPreview] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email])

    const passwordStrength = useMemo(() => {
        let score = 0
        if (password.length >= 8) score += 1
        if (/[A-Z]/.test(password)) score += 1
        if (/[0-9]/.test(password)) score += 1
        if (/[^A-Za-z0-9]/.test(password)) score += 1
        return score
    }, [password])

    const profileCompletion = useMemo(() => {
        const fields = [
            name,
            email,
            password,
            speciality,
            degrees.length ? 'yes' : '',
            experienceYears,
            about,
            fees,
            clinicName,
            address1,
            address2,
            city,
            stateRegion,
            pincode,
            lat,
            lng,
            languages.length ? 'yes' : '',
            services.length ? 'yes' : ''
        ]
        const filled = fields.filter(Boolean).length
        return Math.round((filled / fields.length) * 100)
    }, [name, email, password, speciality, degrees, experienceYears, about, fees, clinicName, address1, address2, city, stateRegion, pincode, lat, lng, languages, services])

    const experienceLabel = `${experienceYears} ${experienceYears === 1 ? 'Year' : 'Years'}`

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

    const handleDegreeKey = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleChipAdd(degreeInput, setDegrees, degrees)
            setDegreeInput('')
        }
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

    const resetForm = () => {
        setDocImg(null)
        setName('')
        setEmail('')
        setPassword('')
        setSpeciality('General physician')
        setDegreeInput('')
        setDegrees([])
        setExperienceYears(1)
        setFees('')
        setAbout('')
        setClinicFocus('')
        setClinicName('')
        setAddress1('')
        setAddress2('')
        setCity('')
        setStateRegion('')
        setPincode('')
        setLat('')
        setLng('')
        setLanguageInput('')
        setLanguages([])
        setServiceInput('')
        setServices([])
        setAvailabilityDays(dayOptions.map((day) => ({ day, enabled: day !== 'Sun', start: '09:00', end: '17:00' })))
        setSlotDuration(30)
        setBreakMinutes(0)
        setLicenseFile(null)
        setDegreeCertFile(null)
        setIdProofFile(null)
        setCertFiles([])
    }

    const handleSubmit = async (intent) => {
        try {
            if (!docImg) {
                return toast.error('Doctor photo is required')
            }

            setSubmitting(true)

            const formData = new FormData()
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('speciality', speciality)
            formData.append('degree', degrees.length ? degrees.join(', ') : degreeInput)
            formData.append('experience', experienceLabel)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('status', intent)
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
            formData.append('languages', JSON.stringify(languages))
            formData.append('services', JSON.stringify(services.length ? services : (clinicFocus ? [clinicFocus] : [])))

            if (licenseFile) formData.append('license', licenseFile)
            if (degreeCertFile) formData.append('degreeCert', degreeCertFile)
            if (idProofFile) formData.append('idProof', idProofFile)
            certFiles.forEach((file) => formData.append('certifications', file))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                resetForm()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={(event) => event.preventDefault()} className='min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
            <div className='px-4 sm:px-6 lg:px-8'>
                <div className='mb-6 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Dashboard > Doctors > Add Doctor</p>
                        <h1 className='text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 dark:text-white'>Add New Doctor</h1>
                        <p className='text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400'>Fill in doctor details to publish their profile.</p>
                    </div>
                    <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3'>
                        <button type='button' onClick={() => handleSubmit('draft')} disabled={submitting} className='h-11 rounded-full border border-slate-200 dark:border-slate-700 bg-white px-6 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300'>
                            Save Draft
                        </button>
                        <button type='button' onClick={() => handleSubmit('published')} disabled={submitting} className='h-11 rounded-full bg-gradient-to-r from-primary via-indigo-600 to-cyan-500 px-6 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-95'>
                            Publish Doctor
                        </button>
                    </div>
                </div>

                <div className='grid gap-6 lg:grid-cols-[1.1fr_2fr]'>
                    <div className='w-full rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
                        <p className='text-sm font-semibold text-slate-900 dark:text-slate-100 dark:text-white'>Doctor Identity</p>
                        <p className='text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400'>Quick snapshot of profile status.</p>

                        <div className='mt-5 flex flex-col gap-4'>
                            <label htmlFor="doc-img" className='flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-4 sm:px-6 py-6 sm:py-8 text-center text-slate-600 cursor-pointer'>
                                <span className='flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 ring-4 ring-white'>
                                    <img className='h-24 w-24 sm:h-28 sm:w-28 object-cover' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                                </span>
                                <div>
                                    <p className='text-sm font-semibold text-slate-900 dark:text-slate-100 dark:text-white'>Upload PNG/JPG (Max 5MB)</p>
                                    <p className='text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400'>Drag & drop or click to browse</p>
                                </div>
                            </label>
                            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />

                            <div className='flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between text-slate-500 dark:text-slate-400 dark:text-slate-400'>
                                <button type='button' onClick={() => setDocImg(null)} className='rounded-full border border-slate-200 dark:border-slate-700 bg-white px-4 py-2 font-semibold text-slate-600 hover:border-slate-300'>Remove</button>
                                <button type='button' onClick={() => document.getElementById('doc-img')?.click()} className='rounded-full border border-slate-200 dark:border-slate-700 bg-white px-4 py-2 font-semibold text-slate-600 hover:border-slate-300'>Change photo</button>
                            </div>

                            <div className='rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4'>
                                <div className='flex items-center justify-between text-xs font-semibold text-slate-600'>
                                    <span>Status</span>
                                    <span className='rounded-full bg-amber-50 px-3 py-1 text-amber-600'>Draft</span>
                                </div>
                                <div className='mt-3 flex items-center justify-between text-xs font-semibold text-slate-600'>
                                    <span>Verification</span>
                                    <span className='rounded-full bg-slate-100 px-3 py-1 text-slate-600'>Not Verified</span>
                                </div>
                                <div className='mt-4'>
                                    <p className='text-xs font-semibold text-slate-600'>Profile Completion</p>
                                    <div className='mt-2 h-2 rounded-full bg-slate-100'>
                                        <div className='h-2 rounded-full bg-gradient-to-r from-primary to-cyan-400' style={{ width: `${profileCompletion}%` }}></div>
                                    </div>
                                    <p className='mt-2 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400'>{profileCompletion}% complete</p>
                            </div>
                        </div>
                    </div>

                    <div className='mt-2 w-full rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
                        <p className='text-sm font-semibold text-slate-900 dark:text-slate-100 dark:text-white'>Verification & Documents</p>
                        <p className='text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400'>Upload licenses and certificates for verification.</p>
                        <div className='mt-5 grid gap-4 grid-cols-1 xl:grid-cols-2'>
                            <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                Medical license (PDF)
                                <input onChange={(e) => setLicenseFile(e.target.files[0])} className='h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-200' type="file" />
                            </label>
                            <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                Degree certificate
                                <input onChange={(e) => setDegreeCertFile(e.target.files[0])} className='h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-200' type="file" />
                            </label>
                            <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                ID proof
                                <input onChange={(e) => setIdProofFile(e.target.files[0])} className='h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-200' type="file" />
                            </label>
                            <div className='flex flex-col justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 text-xs text-slate-600'>
                                <p className='font-semibold'>Verification badge</p>
                                <span className='mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-600'>
                                    Pending verification
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-6'>
                        <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-semibold text-slate-900 dark:text-slate-100 dark:text-white'>Basic Details</p>
                                    <p className='text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400'>Clean input cards with helpful cues.</p>
                                </div>
                            </div>

                            <div className='mt-6 grid gap-4 sm:gap-5 md:grid-cols-2'>
                                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Full name
                                    <div className='relative'>
                                        <input onChange={e => setName(e.target.value)} value={name} className='h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="text" placeholder='Dr. Jane Doe' required />
                                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400'>ID</span>
                                    </div>
                                </label>

                                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Email
                                    <div className='relative'>
                                        <input onChange={e => setEmail(e.target.value)} value={email} className='h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="email" placeholder='name@clinic.com' required />
                                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold ${emailValid ? 'text-emerald-500' : 'text-slate-300'}`}>OK</span>
                                    </div>
                                </label>

                                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Password
                                    <input onChange={e => setPassword(e.target.value)} value={password} className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="password" placeholder='Create a secure password' required />
                                    <div className='mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400'>
                                        <div className='h-1.5 flex-1 rounded-full bg-slate-100'>
                                            <div className={`h-1.5 rounded-full ${passwordStrength >= 3 ? 'bg-emerald-500' : passwordStrength >= 2 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${(passwordStrength / 4) * 100}%` }}></div>
                                        </div>
                                        <span>{passwordStrength >= 3 ? 'Strong' : passwordStrength >= 2 ? 'Medium' : 'Weak'}</span>
                                    </div>
                                </label>

                                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Speciality
                                    <input
                                        list="speciality-list"
                                        value={speciality}
                                        onChange={(e) => setSpeciality(e.target.value)}
                                        className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500'
                                        placeholder='Search speciality'
                                    />
                                    <datalist id="speciality-list">
                                        {specialityOptions.map((item) => (
                                            <option value={item} key={item} />
                                        ))}
                                    </datalist>
                                </label>

                                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Degree (multi-select)
                                    <input
                                        onChange={e => setDegreeInput(e.target.value)}
                                        onKeyDown={handleDegreeKey}
                                        value={degreeInput}
                                        className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500'
                                        type="text"
                                        placeholder='Type and press Enter'
                                    />
                                    <div className='flex flex-wrap gap-2'>
                                        {degrees.map((item) => (
                                            <button type='button' key={item} onClick={() => handleChipRemove(item, setDegrees, degrees)} className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>
                                                {item} x
                                            </button>
                                        ))}
                                    </div>
                                </label>

                                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Experience
                                    <div className='flex items-center gap-3'>
                                        <input
                                            type="range"
                                            min="0"
                                            max="30"
                                            value={experienceYears}
                                            onChange={(e) => setExperienceYears(Number(e.target.value))}
                                            className='w-full accent-primary'
                                        />
                                        <span className='text-xs font-semibold text-slate-600'>{experienceLabel}</span>
                                    </div>
                                </label>

                                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Consultation fee
                                    <div className='relative'>
                                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-400'>INR</span>
                                        <input onChange={e => setFees(e.target.value)} value={fees} className='h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="number" placeholder='500' required />
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
                            <p className='text-sm font-semibold text-slate-900 dark:text-slate-100 dark:text-white'>Clinic Location</p>
                            <p className='text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400'>Add address details and preview the map.</p>
                            <div className='mt-6 grid gap-6 lg:grid-cols-[3fr_2fr] items-start'>
                                <div className='grid gap-4 min-w-0'>
                                    <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                        Clinic name
                                        <input onChange={e => setClinicName(e.target.value)} value={clinicName} className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="text" placeholder='HealthEase Clinic' />
                                    </label>
                                    <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                        Address line 1
                                        <input onChange={e => setAddress1(e.target.value)} value={address1} className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="text" placeholder='Street address' required />
                                    </label>
                                    <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                        Address line 2
                                        <input onChange={e => setAddress2(e.target.value)} value={address2} className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="text" placeholder='Suite, floor' required />
                                    </label>
                                    <div className='grid gap-4 grid-cols-1 lg:grid-cols-3'>
                                        <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                            City
                                            <input onChange={e => setCity(e.target.value)} value={city} className='h-11 w-full min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="text" placeholder='City' />
                                        </label>
                                        <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                            State
                                            <input onChange={e => setStateRegion(e.target.value)} value={stateRegion} className='h-11 w-full min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="text" placeholder='State' />
                                        </label>
                                        <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                            Pincode
                                            <input onChange={e => setPincode(e.target.value)} value={pincode} className='h-11 w-full min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="text" placeholder='Postal code' />
                                        </label>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-sm min-w-0'>
                                    <div className='h-40 sm:h-48 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'>
                                        <iframe
                                            title="Clinic map"
                                            className='h-full w-full'
                                            src={mapSrc}
                                        />
                                    </div>
                                    <button type='button' onClick={useCurrentLocation} className='h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm hover:border-slate-300'>
                                        Use Current Location
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
                            <p className='text-sm font-semibold text-slate-900 dark:text-slate-100 dark:text-white'>Doctor Availability</p>
                            <p className='text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400'>Set working days and time slots.</p>
                            <div className='mt-5 grid gap-4'>
                                <div className='flex flex-wrap gap-2'>
                                    {availabilityDays.map((day, index) => (
                                        <button
                                            key={day.day}
                                            type='button'
                                            onClick={() => updateDay(index, { enabled: !day.enabled })}
                                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${day.enabled ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-white text-slate-500 dark:text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}
                                        >
                                            {day.day}
                                        </button>
                                    ))}
                                </div>
                                <div className='grid gap-4 md:grid-cols-3'>
                                    <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                        Start time
                                        <input
                                            type="time"
                                            value={availabilityDays[0]?.start}
                                            onChange={(e) => setAvailabilityDays((prev) => prev.map((item) => ({ ...item, start: e.target.value })))}
                                            className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500'
                                        />
                                    </label>
                                    <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                        End time
                                        <input
                                            type="time"
                                            value={availabilityDays[0]?.end}
                                            onChange={(e) => setAvailabilityDays((prev) => prev.map((item) => ({ ...item, end: e.target.value })))}
                                            className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500'
                                        />
                                    </label>
                                    <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                        Slot duration
                                        <select onChange={(e) => setSlotDuration(e.target.value)} value={slotDuration} className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-3 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500'>
                                            <option value="15">15 mins</option>
                                            <option value="30">30 mins</option>
                                            <option value="45">45 mins</option>
                                            <option value="60">60 mins</option>
                                        </select>
                                    </label>
                                </div>
                                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Break time (minutes)
                                    <input onChange={(e) => setBreakMinutes(e.target.value)} value={breakMinutes} className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="number" min="0" placeholder='0' />
                                </label>
                            </div>
                        </div>

                        <div className='rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
                            <p className='text-sm font-semibold text-slate-900 dark:text-slate-100 dark:text-white'>About Doctor</p>
                            <p className='text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400'>Write a short professional description. This will be visible to patients.</p>
                            <div className='mt-5 grid gap-4'>
                                <textarea onChange={e => setAbout(e.target.value)} value={about} className='min-h-[160px] w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' placeholder='Doctor bio, specialties, and clinic focus'></textarea>
                                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Clinic focus / services
                                    <input onChange={e => setClinicFocus(e.target.value)} value={clinicFocus} className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="text" placeholder='e.g. Cardiac rehab, Preventive care' />
                                </label>
                                <div className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Languages spoken
                                    <input onChange={e => setLanguageInput(e.target.value)} onKeyDown={handleLanguageKey} value={languageInput} className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="text" placeholder='Type and press Enter' />
                                    <div className='flex flex-wrap gap-2'>
                                        {languages.map((item) => (
                                            <button type='button' key={item} onClick={() => handleChipRemove(item, setLanguages, languages)} className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>
                                                {item} x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Clinic services (chips)
                                    <input onChange={e => setServiceInput(e.target.value)} onKeyDown={handleServiceKey} value={serviceInput} className='h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 text-sm text-slate-900 dark:text-slate-100 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-4  dark:placeholder:text-slate-500 focus:ring-primary/20 dark:placeholder:text-slate-500' type="text" placeholder='Type and press Enter' />
                                    <div className='flex flex-wrap gap-2'>
                                        {services.map((item) => (
                                            <button type='button' key={item} onClick={() => handleChipRemove(item, setServices, services)} className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>
                                                {item} x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <label className='grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-200'>
                                    Certifications (upload)
                                    <input onChange={(e) => setCertFiles(Array.from(e.target.files || []))} className='h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-200' type="file" multiple />
                                </label>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            {showPreview && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4'>
                    <div className='w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-lg font-semibold text-slate-900 dark:text-slate-100 dark:text-white'>Profile Preview</h2>
                            <button type='button' onClick={() => setShowPreview(false)} className='text-slate-500 dark:text-slate-400 dark:text-slate-400'>Close</button>
                        </div>
                        <div className='mt-5 flex gap-4'>
                            <img className='h-24 w-24 rounded-3xl object-cover' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                            <div>
                                <p className='text-lg font-semibold text-slate-900 dark:text-slate-100 dark:text-white'>{name || 'Doctor Name'}</p>
                                <p className='text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400'>{speciality}</p>
                                <p className='text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400'>{experienceLabel} experience</p>
                                <p className='text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400'>INR {fees || '0'} per visit</p>
                            </div>
                        </div>
                        <div className='mt-4 text-sm text-slate-600'>
                            <p>{about || 'No bio added yet.'}</p>
                            <p className='mt-3 font-semibold text-slate-800'>Clinic</p>
                            <p>{clinicName || 'Clinic name'}</p>
                            <p>{address1} {address2}</p>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}

export default AddDoctor
