import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {
    const [editSection, setEditSection] = useState(null)
    const [image, setImage] = useState(false)
    const [activeNav, setActiveNav] = useState('overview')
    const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false)
    const [isGenderOpen, setIsGenderOpen] = useState(false)
    const mobileNavRef = useRef(null)

    const { token, backendUrl, userData, setUserData, loadUserProfileData, profileDashboard } = useContext(AppContext)
    const navigate = useNavigate()

    const stats = profileDashboard?.stats || { totalVisits: 0, completedVisits: 0, upcomingVisits: 0 }
    const appointments = profileDashboard?.appointments || []
    const doctorHistory = profileDashboard?.doctorHistory || []
    const reports = profileDashboard?.reports || []
    const payments = profileDashboard?.payments || []
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const formatProfileDate = (value) => {
        if (!value) return ''
        if (typeof value === 'string') {
            if (value.includes('_')) {
                const [day, month, year] = value.split('_')
                const monthLabel = months[Number(month) - 1] || month
                return `${day} ${monthLabel} ${year}`
            }
            const parsed = new Date(value)
            if (!Number.isNaN(parsed.getTime())) {
                return parsed.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
            }
        }
        if (value instanceof Date) {
            return value.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        }
        return String(value)
    }

    // Function to update user profile data using API
    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            formData.append('bloodGroup', userData.bloodGroup || '')
            formData.append('heightCm', userData.heightCm || '')
            formData.append('weightKg', userData.weightKg || '')
            formData.append('allergies', JSON.stringify(userData.allergies || []))
            formData.append('chronicDiseases', JSON.stringify(userData.chronicDiseases || []))
            formData.append('currentMedications', userData.currentMedications || '')
            formData.append('emergencyContact', JSON.stringify(userData.emergencyContact || {}))
            formData.append('notificationPreferences', JSON.stringify(userData.notificationPreferences || {}))
            formData.append('languagePreference', userData.languagePreference || 'en')

            formData.append('darkModePreference', userData.darkModePreference ?? false)

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setEditSection(null)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const completionPercent = (() => {
        if (!userData) return 0
        const fields = [
            userData.name,
            userData.phone,
            userData.address?.line1,
            userData.gender,
            userData.dob,
            userData.bloodGroup,
            userData.heightCm,
            userData.weightKg,
            userData.emergencyContact?.phone
        ]
        const filled = fields.filter(Boolean).length
        return Math.round((filled / fields.length) * 100)
    })()

    const getStatusBadge = (appointment) => {
        if (appointment.cancelled) {
            return <span className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-600 ring-1 ring-red-200/70">Cancelled</span>
        }
        if (appointment.isCompleted) {
            return <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/70">Completed</span>
        }
        return <span className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200/70">Upcoming</span>
    }

    const openSection = (id) => {
        setActiveNav(id)
        setEditSection(null)
    }

    useEffect(() => {
        const container = mobileNavRef.current
        if (!container) return
        const activeButton = container.querySelector('[data-active="true"]')
        if (activeButton?.scrollIntoView) {
            activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
        }
    }, [activeNav])

    const isEditing = (section) => editSection === section

    const handleCancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/cancel-appointment',
                { appointmentId },
                { headers: { token } }
            )
            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleUploadReport = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', file.name)
            formData.append('fileType', 'report')

            const { data } = await axios.post(
                backendUrl + '/api/user/upload-report',
                formData,
                { headers: { token } }
            )

            if (data.success) {
                toast.success('Report uploaded')
                await loadUserProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            e.target.value = ''
        }
    }

    if (!userData) return null

    return (
        <div className="min-h-screen bg-slate-50/80 dark:bg-gray-950 pt-4 sm:pt-6 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-10 flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Sidebar navigation */}
            <aside className="hidden lg:flex flex-col w-64 bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-slate-200/60 dark:border-gray-800/60 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] rounded-3xl py-5">
                <div className="px-6 pb-4 border-b border-slate-200/60 dark:border-gray-800/60">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.18em]">Patient</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 truncate">
                        {userData.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Patient Dashboard</p>
                </div>
                <nav className="flex-1 px-2 pt-3 text-sm space-y-1">
                    <button
                        onClick={() => {
                            setActiveNav('dashboard')
                            navigate('/')
                        }}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-300 ${activeNav === 'dashboard'
                            ? 'bg-primary text-white shadow-[0_10px_30px_-20px_rgba(79,70,229,0.8)]'
                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-gray-800/70'
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        <span>Dashboard</span>
                    </button>
                    <button
                        onClick={() => openSection('overview')}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-300 ${activeNav === 'overview'
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-gray-800/70'
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>Profile Overview</span>
                    </button>
                    <button
                        onClick={() => openSection('basic-info')}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-300 ${activeNav === 'basic-info'
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-gray-800/70'
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>Basic Info</span>
                    </button>
                    <button
                        onClick={() => openSection('medical-info')}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-300 ${activeNav === 'medical-info'
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-gray-800/70'
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>Medical Details</span>
                    </button>
                    <button
                        onClick={() => openSection('stats')}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-300 ${activeNav === 'stats'
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-gray-800/70'
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>Visit Stats</span>
                    </button>
                    <button
                        onClick={() => openSection('appointments')}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-300 ${activeNav === 'appointments'
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-gray-800/70'
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>Appointments</span>
                    </button>
                    <button
                        onClick={() => openSection('doctor-history')}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-300 ${activeNav === 'doctor-history'
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-gray-800/70'
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>Doctors</span>
                    </button>
                    <button
                        onClick={() => openSection('reports-payments')}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-300 ${activeNav === 'reports-payments'
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-gray-800/70'
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>Reports & Billing</span>
                    </button>
                    <button
                        onClick={() => openSection('preferences')}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-300 ${activeNav === 'preferences'
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                            : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-gray-800/70'
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>Notifications</span>
                    </button>
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1">
                <div
                    id="overview"
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 sm:mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-slate-200/60 dark:border-gray-800/60 rounded-3xl p-4 sm:p-5 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.45)]"
                >
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
                            My Profile
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage your personal, medical and appointment information
                        </p>
                    </div>
                    {activeNav === 'overview' && (
                        <button
                            onClick={() => setEditSection(prev => prev === 'overview' ? null : 'overview')}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all"
                        >
                            {isEditing('overview') ? 'Cancel' : 'Edit Overview'}
                        </button>
                    )}
                </div>

                <div className="lg:hidden mb-6">
                    <div ref={mobileNavRef} className="flex gap-2 overflow-x-auto pb-1 scroll-smooth">
                        <button
                            onClick={() => {
                                setActiveNav('dashboard')
                                navigate('/')
                            }}
                            data-active={activeNav === 'dashboard'}
                            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium border transition ${activeNav === 'dashboard'
                                ? 'bg-primary text-white border-primary shadow-[0_10px_30px_-20px_rgba(79,70,229,0.8)]'
                                : 'bg-white/90 dark:bg-gray-900/80 border-slate-200/70 dark:border-gray-800/70 text-slate-600 dark:text-gray-300'
                                }`}
                        >
                            Dashboard
                        </button>
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'basic-info', label: 'Basic Info' },
                            { id: 'medical-info', label: 'Medical' },
                            { id: 'stats', label: 'Stats' },
                            { id: 'appointments', label: 'Appointments' },
                            { id: 'doctor-history', label: 'Doctors' },
                            { id: 'reports-payments', label: 'Reports' },
                            { id: 'preferences', label: 'Notifications' }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => openSection(item.id)}
                                data-active={activeNav === item.id}
                                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium border transition ${activeNav === item.id
                                    ? 'bg-primary/10 text-primary border-primary/30'
                                    : 'bg-white/90 dark:bg-gray-900/80 border-slate-200/70 dark:border-gray-800/70 text-slate-600 dark:text-gray-300'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6">
                {/* Left column: profile card + completion */}
                <div className={`relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[28px] dark:bg-gray-900/80 dark:border-gray-800/60 p-4 sm:p-6 flex flex-col gap-6 ${activeNav !== 'overview' ? 'hidden' : ''}`}>
                    <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-primary/10 via-cyan-500/10 to-transparent blur-3xl"></div>
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-gradient-to-br from-emerald-400/10 via-sky-400/10 to-transparent blur-3xl"></div>

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        {isEditing('overview') ? (
                            <label htmlFor='image' className="cursor-pointer relative">
                                <img
                                    className='w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover opacity-90 ring-2 ring-white shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)]'
                                    src={image ? URL.createObjectURL(image) : userData.image}
                                    alt=""
                                />
                                <img className='w-8 absolute -bottom-1 -right-1' src={assets.upload_icon} alt="" />
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                            </label>
                        ) : (
                            <img className='w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-white shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)]' src={userData.image} alt="" />
                        )}
                        <div className="flex-1">
                            {isEditing('overview') ? (
                                <input
                                    className='w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-4 py-2 text-lg font-semibold text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition'
                                    type="text"
                                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                    value={userData.name}
                                />
                            ) : (
                                <p className='font-semibold text-xl text-slate-900 dark:text-white'>{userData.name}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">Patient ID: {userData._id}</p>
                            <span className="inline-flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200/70 px-3 py-1 rounded-full mt-2">
                                Active Patient
                            </span>
                        </div>
                    </div>

                    <div className="relative rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.22em]">Profile completion</p>
                            <p className="text-xs font-semibold text-slate-700">{completionPercent}%</p>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-500 transition-all"
                                style={{ width: `${completionPercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Complete your profile to help doctors during appointments.
                        </p>
                    </div>

                    <div className="relative grid gap-3 text-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                            <span className="text-slate-500">Email</span>
                            <span className="text-primary font-medium">{userData.email}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                            <span className="text-slate-500">Phone</span>
                            {isEditing('overview') ? (
                                <input
                                    className="w-full sm:w-40 sm:text-right rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-3 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                    type="text"
                                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                    value={userData.phone}
                                />
                            ) : (
                                <span className="text-primary font-medium">{userData.phone}</span>
                            )}
                        </div>
                        <div className="rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                            <span className="text-slate-500 block mb-2">Address</span>
                            {isEditing('overview') ? (
                                <div className="space-y-2">
                                    <input
                                        className='w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-3 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition'
                                        type="text"
                                        placeholder="Address line 1"
                                        onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                        value={userData.address?.line1 || ''}
                                    />
                                    <input
                                        className='w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-3 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition'
                                        type="text"
                                        placeholder="Address line 2"
                                        onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                        value={userData.address?.line2 || ''}
                                    />
                                </div>
                            ) : (
                                <p className='text-slate-600 text-sm'>
                                    {userData.address?.line1} <br /> {userData.address?.line2}
                                </p>
                            )}
                        </div>
                    </div>

                    {isEditing('overview') && (
                        <button
                            onClick={updateUserProfileData}
                            className='mt-2 w-full rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold py-3 shadow-[0_12px_32px_-18px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all'
                        >
                            Save information
                        </button>
                    )}
                </div>

                {/* Right column: main dashboard sections */}
                <div className="space-y-6">
                    {/* Basic + medical info row */}
                    <div
                        id="basic-info"
                        className={`grid gap-4 ${activeNav === 'basic-info' ? 'md:grid-cols-2' : ''} ${activeNav !== 'basic-info' && activeNav !== 'medical-info' ? 'hidden' : ''}`}
                    >
                        <div className={`relative overflow-visible bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[28px] dark:bg-gray-900/80 dark:border-gray-800/60 p-6 ${activeNav !== 'basic-info' ? 'hidden' : ''}`}>
                            <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary/10 via-cyan-500/10 to-transparent blur-3xl"></div>
                            <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-400/10 via-sky-400/10 to-transparent blur-3xl"></div>
                            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/15 to-cyan-500/20 flex items-center justify-center text-primary text-lg font-semibold shadow-[0_10px_25px_-18px_rgba(59,130,246,0.6)]">
                                        i
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                            Basic Information
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                                            Personal details
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setEditSection(prev => prev === 'basic-info' ? null : 'basic-info')}
                                        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        {isEditing('basic-info') ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                            </div>

                            <div className="relative mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="group rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.5)]">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.22em]">Gender</p>
                                    <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                                        <span className="text-slate-500">Identity</span>
                                        {isEditing('basic-info') ? (
                                            <div
                                                className="relative z-30"
                                                tabIndex={0}
                                                onBlur={() => setIsGenderOpen(false)}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setIsGenderOpen(prev => !prev)}
                                                    className="w-32 text-center rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 pl-3 pr-8 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition relative"
                                                >
                                                    {userData.gender || 'Select'}
                                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        v
                                                    </span>
                                                </button>
                                                {isGenderOpen && (
                                                    <div className="absolute left-0 top-full mt-2 w-32 max-h-44 overflow-y-auto rounded-2xl border border-slate-200/90 dark:border-gray-700/90 bg-white dark:bg-gray-900 shadow-[0_18px_50px_-26px_rgba(15,23,42,0.7)] py-2 text-sm text-slate-700 dark:text-gray-100 z-50">
                                                        {['Not Selected', 'Male', 'Female', 'Other'].map(option => (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                onMouseDown={() => {
                                                                    setUserData(prev => ({ ...prev, gender: option }))
                                                                    setIsGenderOpen(false)
                                                                }}
                                                                className="w-full px-4 py-2 text-left hover:bg-slate-100/80 dark:hover:bg-gray-800/70 transition"
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-900 dark:text-gray-100 font-semibold">
                                                {userData.gender}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="group rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.5)]">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.22em]">Date Of Birth</p>
                                    <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                                        <span className="text-slate-500">Birthday</span>
                                        {isEditing('basic-info') ? (
                                            <input
                                                className="rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-3 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                                type="date"
                                                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                                value={userData.dob}
                                            />
                                        ) : (
                                            <span className="text-slate-900 dark:text-gray-100 font-semibold">
                                                {userData.dob}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="group rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.5)]">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.22em]">Blood Group</p>
                                    <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                                        <span className="text-slate-500">Type</span>
                                        {isEditing('basic-info') ? (
                                            <div
                                                className="relative"
                                                tabIndex={0}
                                                onBlur={() => setIsBloodGroupOpen(false)}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setIsBloodGroupOpen(prev => !prev)}
                                                    className="w-28 text-center rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 pl-3 pr-8 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition relative"
                                                >
                                                    {userData.bloodGroup || 'Select'}
                                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        v
                                                    </span>
                                                </button>
                                                {isBloodGroupOpen && (
                                                    <div className="absolute left-0 top-full mt-2 w-28 max-h-44 overflow-y-auto rounded-2xl border border-slate-200/90 dark:border-gray-700/90 bg-white dark:bg-gray-900 shadow-[0_18px_50px_-26px_rgba(15,23,42,0.7)] py-2 text-sm text-slate-700 dark:text-gray-100 z-40">
                                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                                            <button
                                                                key={group}
                                                                type="button"
                                                                onMouseDown={() => {
                                                                    setUserData(prev => ({ ...prev, bloodGroup: group }))
                                                                    setIsBloodGroupOpen(false)
                                                                }}
                                                                className="w-full px-4 py-2 text-left hover:bg-slate-100/80 dark:hover:bg-gray-800/70 transition"
                                                            >
                                                                {group}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-900 dark:text-gray-100 font-semibold">
                                                {userData.bloodGroup || '-'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="group rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.5)]">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.22em]">Height & Weight</p>
                                    <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                                        <span className="text-slate-500">Vitals</span>
                                        {isEditing('basic-info') ? (
                                            <div className="flex gap-2">
                                                <input
                                                    className="w-24 text-center rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-3 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                                    type="number"
                                                    placeholder="cm"
                                                    onChange={(e) => setUserData(prev => ({ ...prev, heightCm: e.target.value }))}
                                                    value={userData.heightCm || ''}
                                                />
                                                <input
                                                    className="w-24 text-center rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-3 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                                    type="number"
                                                    placeholder="kg"
                                                    onChange={(e) => setUserData(prev => ({ ...prev, weightKg: e.target.value }))}
                                                    value={userData.weightKg || ''}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-slate-900 dark:text-gray-100 font-semibold">
                                                {userData.heightCm ? `${userData.heightCm} cm` : '-'} / {userData.weightKg ? `${userData.weightKg} kg` : '-'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isEditing('basic-info') && (
                                <button
                                    onClick={updateUserProfileData}
                                    className="mt-5 w-full rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold py-3 shadow-[0_12px_32px_-18px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all"
                                >
                                    Save changes
                                </button>
                            )}
                        </div>

                        <div
                            id="medical-info"
                            className={`relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[28px] dark:bg-gray-900/80 dark:border-gray-800/60 p-6 ${activeNav !== 'medical-info' ? 'hidden' : ''}`}
                        >
                            <div className="absolute -top-20 -right-24 h-52 w-52 rounded-full bg-gradient-to-br from-rose-400/10 via-primary/10 to-transparent blur-3xl"></div>
                            <div className="relative flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400/15 to-primary/10 flex items-center justify-center text-rose-500 text-lg font-semibold shadow-[0_10px_25px_-18px_rgba(244,63,94,0.45)]">
                                        +
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                            Medical Details
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                                            Health summary
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEditSection(prev => prev === 'medical-info' ? null : 'medical-info')}
                                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                >
                                    {isEditing('medical-info') ? 'Cancel' : 'Edit'}
                                </button>
                            </div>

                            <div className="relative mt-5 space-y-4 text-sm text-slate-700">
                                <div className="rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.22em]">Allergies</p>
                                    {isEditing('medical-info') ? (
                                        <input
                                            className="mt-3 w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-4 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                            type="text"
                                            placeholder="e.g. Peanuts, Penicillin"
                                            onChange={(e) => setUserData(prev => ({ ...prev, allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                                            value={(userData.allergies || []).join(', ')}
                                        />
                                    ) : (
                                        <p className="mt-2 text-slate-700">
                                            {(userData.allergies || []).length ? (userData.allergies || []).join(', ') : 'No known allergies'}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.22em]">Chronic Diseases</p>
                                    {isEditing('medical-info') ? (
                                        <input
                                            className="mt-3 w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-4 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                            type="text"
                                            placeholder="e.g. Diabetes, Hypertension"
                                            onChange={(e) => setUserData(prev => ({ ...prev, chronicDiseases: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                                            value={(userData.chronicDiseases || []).join(', ')}
                                        />
                                    ) : (
                                        <p className="mt-2 text-slate-700">
                                            {(userData.chronicDiseases || []).length ? (userData.chronicDiseases || []).join(', ') : 'None reported'}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.22em]">Current Medications</p>
                                    {isEditing('medical-info') ? (
                                        <textarea
                                            className="mt-3 w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-4 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition min-h-[88px]"
                                            placeholder="List current medications and dosages"
                                            onChange={(e) => setUserData(prev => ({ ...prev, currentMedications: e.target.value }))}
                                            value={userData.currentMedications || ''}
                                        />
                                    ) : (
                                        <p className="mt-2 text-slate-700">
                                            {userData.currentMedications || 'Not specified'}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.22em]">Emergency Contact</p>
                                    {isEditing('medical-info') ? (
                                        <div className="mt-3 grid gap-3">
                                            <input
                                                className="w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-4 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                                type="text"
                                                placeholder="Name"
                                                onChange={(e) => setUserData(prev => ({
                                                    ...prev,
                                                    emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                                                }))}
                                                value={userData.emergencyContact?.name || ''}
                                            />
                                            <input
                                                className="w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-4 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                                type="text"
                                                placeholder="Relation"
                                                onChange={(e) => setUserData(prev => ({
                                                    ...prev,
                                                    emergencyContact: { ...prev.emergencyContact, relation: e.target.value }
                                                }))}
                                                value={userData.emergencyContact?.relation || ''}
                                            />
                                            <input
                                                className="w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-4 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                                type="text"
                                                placeholder="Phone"
                                                onChange={(e) => setUserData(prev => ({
                                                    ...prev,
                                                    emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                                                }))}
                                                value={userData.emergencyContact?.phone || ''}
                                            />
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-sm text-slate-700">
                                            {userData.emergencyContact?.name ? (
                                                <>
                                                    <p>{userData.emergencyContact.name} ({userData.emergencyContact.relation})</p>
                                                    <p className="text-blue-600">{userData.emergencyContact.phone}</p>
                                                </>
                                            ) : (
                                                <p className="text-slate-600">Not added</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isEditing('medical-info') && (
                                <button
                                    onClick={updateUserProfileData}
                                    className="mt-5 w-full rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold py-3 shadow-[0_12px_32px_-18px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all"
                                >
                                    Save changes
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Current vitals / stats row */}
                    <div id="stats" className={`grid md:grid-cols-3 gap-4 ${activeNav !== 'stats' ? 'hidden' : ''}`}>
                        <div className="relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_16px_50px_-28px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.5)]">
                            <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl"></div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em] mb-2">
                                Total Visits
                            </p>
                            <p className="text-3xl font-semibold text-slate-900">{stats.totalVisits}</p>
                            <p className="text-xs text-emerald-600 mt-1">
                                {stats.completedVisits} completed, {stats.upcomingVisits} upcoming
                            </p>
                        </div>
                        <div className="relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_16px_50px_-28px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.5)]">
                            <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-sky-500/10 blur-2xl"></div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em] mb-2">
                                Doctors Consulted
                            </p>
                            <p className="text-3xl font-semibold text-slate-900">{doctorHistory.length}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Based on your past appointments
                            </p>
                        </div>
                        <div className="relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_16px_50px_-28px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.5)]">
                            <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl"></div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em] mb-2">
                                Payments Made
                            </p>
                            <p className="text-3xl font-semibold text-slate-900">
                                {payments.reduce((acc, p) => acc + (p.amount || 0), 0)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Across {payments.length} paid appointments
                            </p>
                        </div>
                    </div>

                    {/* Appointment Management */}
                    <div id="appointments" className={`relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[28px] dark:bg-gray-900/80 dark:border-gray-800/60 p-4 sm:p-6 ${activeNav !== 'appointments' ? 'hidden' : ''}`}>
                        <div className="absolute -top-24 -right-20 h-52 w-52 rounded-full bg-gradient-to-br from-primary/10 via-cyan-500/10 to-transparent blur-3xl"></div>
                        <div className="relative flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/15 to-cyan-500/15 flex items-center justify-center text-primary text-lg font-semibold shadow-[0_10px_25px_-18px_rgba(59,130,246,0.5)]">
                                    A
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                        Appointment Management
                                    </p>
                                    <p className="text-sm text-slate-600">Upcoming & past appointments</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative mt-3 md:hidden space-y-3">
                            {appointments.slice(0, 5).map(app => (
                                <div key={app._id} className="rounded-2xl border border-slate-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{app.docData?.name}</p>
                                            <p className="text-xs text-slate-500">{app.docData?.speciality}</p>
                                        </div>
                                        <div>{getStatusBadge(app)}</div>
                                    </div>
                                    <div className="mt-3 text-xs text-slate-500 space-y-1">
                                        <p><span className="font-semibold text-slate-700">Date:</span> {formatProfileDate(app.slotDate)}</p>
                                        <p><span className="font-semibold text-slate-700">Time:</span> {app.slotTime}</p>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-3 text-xs">
                                        <button
                                            className="text-primary font-medium hover:opacity-80 transition"
                                            onClick={() => navigate(`/appointment/${app.docId}`)}
                                        >
                                            Reschedule
                                        </button>
                                        {!app.cancelled && !app.isCompleted && (
                                            <button
                                                className="text-rose-500 font-medium hover:opacity-80 transition"
                                                onClick={() => handleCancelAppointment(app._id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {!appointments.length && (
                                <div className="rounded-2xl border border-slate-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/60 p-4 text-center text-sm text-slate-400">
                                    No appointments yet.
                                </div>
                            )}
                        </div>
                        <div className="relative mt-3 overflow-x-auto hidden md:block">
                            <div className="min-w-full rounded-2xl border border-slate-200/70 dark:border-gray-800/70 overflow-hidden">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="text-[11px] uppercase tracking-[0.2em] text-slate-400 border-b bg-slate-50/80 dark:bg-gray-900/60">
                                        <tr>
                                            <th className="py-3 px-4 font-medium">Doctor</th>
                                            <th className="py-3 px-4 font-medium">Speciality</th>
                                            <th className="py-3 px-4 font-medium">Date</th>
                                            <th className="py-3 px-4 font-medium">Time</th>
                                            <th className="py-3 px-4 font-medium">Status</th>
                                            <th className="py-3 px-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.slice(0, 5).map(app => (
                                            <tr key={app._id} className="border-b last:border-0 hover:bg-slate-50/60 dark:hover:bg-gray-800/50 transition">
                                                <td className="py-3 px-4 text-gray-800">{app.docData?.name}</td>
                                                <td className="py-3 px-4 text-slate-500">{app.docData?.speciality}</td>
                                                <td className="py-3 px-4 text-slate-500">{formatProfileDate(app.slotDate)}</td>
                                                <td className="py-3 px-4 text-slate-500">{app.slotTime}</td>
                                                <td className="py-3 px-4">{getStatusBadge(app)}</td>
                                                <td className="py-3 px-4 text-right space-x-2">
                                                    <button
                                                        className="text-xs text-primary font-medium hover:opacity-80 transition"
                                                        onClick={() => navigate(`/appointment/${app.docId}`)}
                                                    >
                                                        Reschedule
                                                    </button>
                                                    {!app.cancelled && !app.isCompleted && (
                                                        <button
                                                            className="text-xs text-rose-500 font-medium hover:opacity-80 transition"
                                                            onClick={() => handleCancelAppointment(app._id)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {!appointments.length && (
                                            <tr>
                                                <td colSpan={6} className="py-4 text-center text-sm text-slate-400">
                                                    No appointments yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Doctor interaction + Reports / Payments / Preferences */}
                    <div className={`grid gap-4 ${activeNav !== 'doctor-history' && activeNav !== 'reports-payments' ? 'hidden' : ''}`}>
                        <div id="doctor-history" className={`relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[28px] dark:bg-gray-900/80 dark:border-gray-800/60 p-6 ${activeNav !== 'doctor-history' ? 'hidden' : ''}`}>
                            <div className="absolute -top-20 -right-24 h-52 w-52 rounded-full bg-gradient-to-br from-sky-400/10 via-primary/10 to-transparent blur-3xl"></div>
                            <div className="relative flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-sky-500/15 to-primary/10 flex items-center justify-center text-sky-500 text-lg font-semibold shadow-[0_10px_25px_-18px_rgba(14,165,233,0.5)]">
                                        D
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                            Doctor Interaction History
                                        </p>
                                        <p className="text-sm text-slate-600">Your recent consultations</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative space-y-3">
                                {doctorHistory.slice(0, 4).map(doc => (
                                    <div key={doc.docId} className="flex items-center justify-between rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.5)]">
                                        <div className="flex items-center gap-3">
                                            {doc.image && (
                                                <img src={doc.image} alt="" className="w-10 h-10 rounded-2xl object-cover" />
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                                                <p className="text-xs text-slate-500">{doc.speciality}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em]">Last visit</p>
                                            <p className="text-xs text-slate-700">{formatProfileDate(doc.lastVisit)}</p>
                                            <button
                                                className="mt-1 text-xs text-primary font-medium hover:opacity-80 transition"
                                                onClick={() => navigate(`/appointment/${doc.docId}`)}
                                            >
                                                Rebook
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {!doctorHistory.length && (
                                    <p className="text-sm text-slate-400">No doctor history yet.</p>
                                )}
                            </div>
                        </div>

                        <div className={`space-y-4 ${activeNav !== 'reports-payments' ? 'hidden' : ''}`} id="reports-payments">
                            <div className="relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[28px] dark:bg-gray-900/80 dark:border-gray-800/60 p-6">
                                <div className="absolute -top-20 -right-24 h-52 w-52 rounded-full bg-gradient-to-br from-emerald-400/10 via-cyan-500/10 to-transparent blur-3xl"></div>
                                <div className="relative flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400/15 to-cyan-500/15 flex items-center justify-center text-emerald-600 text-lg font-semibold shadow-[0_10px_25px_-18px_rgba(16,185,129,0.45)]">
                                            R
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                                Reports & Prescriptions
                                            </p>
                                            <p className="text-sm text-slate-600">Your uploaded medical files</p>
                                        </div>
                                    </div>
                                    <label className="text-xs text-primary font-semibold cursor-pointer hover:opacity-80 transition">
                                        Upload
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleUploadReport}
                                        />
                                    </label>
                                </div>
                                <div className="relative space-y-3 max-h-44 overflow-y-auto text-sm">
                                    {reports.slice(0, 4).map(rep => (
                                        <div key={rep._id} className="flex items-center justify-between rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.5)]">
                                            <div>
                                                <p className="text-gray-800 font-medium">{rep.title}</p>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(rep.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <a
                                                href={rep.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-primary font-medium hover:opacity-80 transition"
                                            >
                                                View
                                            </a>
                                        </div>
                                    ))}
                                    {!reports.length && (
                                        <p className="text-sm text-slate-400">
                                            No reports uploaded yet.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[28px] dark:bg-gray-900/80 dark:border-gray-800/60 p-6">
                                <div className="absolute -top-20 -right-24 h-52 w-52 rounded-full bg-gradient-to-br from-primary/10 via-sky-500/10 to-transparent blur-3xl"></div>
                                <div className="relative flex items-center gap-3 mb-4">
                                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/15 to-sky-500/15 flex items-center justify-center text-primary text-lg font-semibold shadow-[0_10px_25px_-18px_rgba(59,130,246,0.5)]">
                                        $
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                            Payments & Billing
                                        </p>
                                        <p className="text-sm text-slate-600">Recent payments and status</p>
                                    </div>
                                </div>
                                <div className="relative space-y-3 max-h-44 overflow-y-auto text-sm">
                                    {payments.slice(0, 4).map(pay => (
                                        <div key={pay.appointmentId} className="flex items-center justify-between rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.5)]">
                                            <div>
                                                <p className="text-gray-800 font-medium">
                                                    {pay.amount}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(pay.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="text-xs text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200/60 px-3 py-1 rounded-full">
                                                {pay.status}
                                            </span>
                                        </div>
                                    ))}
                                    {!payments.length && (
                                        <p className="text-sm text-slate-400">
                                            No payments recorded yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications & Preferences */}
                    <div id="preferences" className={`relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[28px] dark:bg-gray-900/80 dark:border-gray-800/60 p-6 ${activeNav !== 'preferences' ? 'hidden' : ''}`}>
                        <div className="absolute -top-20 -right-24 h-52 w-52 rounded-full bg-gradient-to-br from-primary/10 via-violet-500/10 to-transparent blur-3xl"></div>
                        <div className="relative flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/15 to-violet-500/15 flex items-center justify-center text-primary text-lg font-semibold shadow-[0_10px_25px_-18px_rgba(99,102,241,0.45)]">
                                    N
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                        Notifications & Preferences
                                    </p>
                                    <p className="text-sm text-slate-600">Control alerts and settings</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditSection(prev => prev === 'preferences' ? null : 'preferences')}
                                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                {isEditing('preferences') ? 'Cancel' : 'Edit'}
                            </button>
                        </div>
                        <div className="relative grid md:grid-cols-3 gap-4 text-sm">
                            <div className="rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
                                <p className="text-[11px] text-slate-400 uppercase tracking-[0.24em] mb-3">Notifications</p>
                                <div className="space-y-2">
                                    {['email', 'sms', 'appointmentReminders'].map(key => (
                                        <label key={key} className={`flex items-center justify-between rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-3 py-2 ${!isEditing('preferences') ? 'opacity-70' : ''}`}>
                                            <span className="text-sm text-slate-700 dark:text-gray-100">
                                                {key === 'email' && 'Email notifications'}
                                                {key === 'sms' && 'SMS notifications'}
                                                {key === 'appointmentReminders' && 'Appointment reminders'}
                                            </span>
                                            <input
                                                type="checkbox"
                                                className="rounded disabled:cursor-not-allowed"
                                                checked={userData.notificationPreferences?.[key] ?? true}
                                                onChange={(e) => setUserData(prev => ({
                                                    ...prev,
                                                    notificationPreferences: {
                                                        ...prev.notificationPreferences,
                                                        [key]: e.target.checked
                                                    }
                                                }))}
                                                disabled={!isEditing('preferences')}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] space-y-3">
                                <p className="text-[11px] text-slate-400 uppercase tracking-[0.24em]">Language</p>
                                <div className="relative">
                                    <select
                                        className="appearance-none w-full rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 pl-4 pr-10 py-2 text-sm text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition disabled:opacity-70 disabled:cursor-not-allowed"
                                        value={userData.languagePreference || 'en'}
                                        onChange={(e) => setUserData(prev => ({ ...prev, languagePreference: e.target.value }))}
                                        disabled={!isEditing('preferences')}
                                    >
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                    </select>
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        v
                                    </span>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/60 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] space-y-3">
                                <p className="text-[11px] text-slate-400 uppercase tracking-[0.24em]">Appearance</p>
                                <label className={`flex items-center justify-between rounded-2xl border border-slate-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 px-3 py-2 ${!isEditing('preferences') ? 'opacity-70' : ''}`}>
                                    <span className="text-sm text-slate-700 dark:text-gray-100">Dark mode</span>
                                    <input
                                        type="checkbox"
                                        className="rounded disabled:cursor-not-allowed"
                                        checked={!!userData.darkModePreference}
                                        onChange={(e) => setUserData(prev => ({
                                            ...prev,
                                            darkModePreference: e.target.checked
                                        }))}
                                        disabled={!isEditing('preferences')}
                                    />
                                </label>
                            </div>
                        </div>
                        {isEditing('preferences') && (
                            <button
                                onClick={updateUserProfileData}
                                className="mt-5 w-full rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold py-3 shadow-[0_12px_32px_-18px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all"
                            >
                                Save changes
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
    
}

export default MyProfile
