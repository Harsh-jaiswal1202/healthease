import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {
    const [editSection, setEditSection] = useState(null)
    const [image, setImage] = useState(false)
    const [activeNav, setActiveNav] = useState('overview')

    const { token, backendUrl, userData, setUserData, loadUserProfileData, profileDashboard, currencySymbol } = useContext(AppContext)
    const navigate = useNavigate()

    const stats = profileDashboard?.stats || { totalVisits: 0, completedVisits: 0, upcomingVisits: 0 }
    const appointments = profileDashboard?.appointments || []
    const doctorHistory = profileDashboard?.doctorHistory || []
    const reports = profileDashboard?.reports || []
    const payments = profileDashboard?.payments || []

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
        if (appointment.cancelled) return <span className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-600">Cancelled</span>
        if (appointment.isCompleted) return <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-600">Completed</span>
        return <span className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-600">Upcoming</span>
    }

    const openSection = (id) => {
        setActiveNav(id)
        setEditSection(null)
    }

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
        <div className="min-h-screen bg-slate-50/80 dark:bg-gray-950 pt-6 pb-12 px-4 sm:px-6 lg:px-10 flex gap-6">
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
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-slate-200/60 dark:border-gray-800/60 rounded-3xl p-5 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.45)]"
                >
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
                            My Profile
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage your personal, medical and appointment information
                        </p>
                    </div>
                    <button
                        onClick={() => setEditSection(prev => prev === 'overview' ? null : 'overview')}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all"
                    >
                        {isEditing('overview') ? 'Cancel' : 'Edit Overview'}
                    </button>
                </div>

                <div className="grid gap-6">
                {/* Left column: profile card + completion */}
                <div className={`bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-6 flex flex-col gap-6 ${activeNav !== 'overview' ? 'hidden' : ''}`}>
                    <div className="flex items-center gap-4">
                        {isEditing('overview') ? (
                            <label htmlFor='image' className="cursor-pointer relative">
                                <img
                                    className='w-24 h-24 rounded-2xl object-cover opacity-80'
                                    src={image ? URL.createObjectURL(image) : userData.image}
                                    alt=""
                                />
                                <img className='w-8 absolute -bottom-1 -right-1' src={assets.upload_icon} alt="" />
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                            </label>
                        ) : (
                            <img className='w-24 h-24 rounded-2xl object-cover' src={userData.image} alt="" />
                        )}
                        <div className="flex-1">
                            {isEditing('overview') ? (
                                <input
                                    className='bg-gray-50 text-xl font-medium rounded-xl px-3 py-2 w-full'
                                    type="text"
                                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                    value={userData.name}
                                />
                            ) : (
                                <p className='font-semibold text-xl text-slate-900'>{userData.name}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">Patient ID: {userData._id}</p>
                            <p className="text-xs text-emerald-600 mt-1">Active Patient</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Profile completion</p>
                            <p className="text-xs font-semibold text-slate-700">{completionPercent}%</p>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${completionPercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Complete your profile to help doctors during appointments.
                        </p>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Email</span>
                            <span className="text-blue-600">{userData.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Phone</span>
                            {isEditing('overview') ? (
                                <input
                                    className="bg-gray-50 rounded-lg px-2 py-1 text-right w-40"
                                    type="text"
                                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                    value={userData.phone}
                                />
                            ) : (
                                <span className="text-blue-600">{userData.phone}</span>
                            )}
            </div>
            <div>
                            <span className="text-slate-500 block mb-1">Address</span>
                            {isEditing('overview') ? (
                                <div className="space-y-2">
                                    <input
                                        className='bg-gray-50 rounded-lg px-2 py-1 w-full'
                                        type="text"
                                        placeholder="Address line 1"
                                        onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                        value={userData.address?.line1 || ''}
                                    />
                                    <input
                                        className='bg-gray-50 rounded-lg px-2 py-1 w-full'
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
                            className='mt-2 w-full border border-primary px-4 py-2.5 rounded-full text-sm font-medium text-primary hover:bg-primary hover:text-white transition-all'
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
                        <div className={`bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5 ${activeNav !== 'basic-info' ? 'hidden' : ''}`}>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">
                                    Basic Information
                                </p>
                                <button
                                    onClick={() => setEditSection(prev => prev === 'basic-info' ? null : 'basic-info')}
                                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                >
                                    {isEditing('basic-info') ? 'Cancel' : 'Edit'}
                                </button>
                            </div>
                            <div className="space-y-3 text-sm text-slate-700">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Gender</span>
                                    {isEditing('basic-info') ? (
                                        <select
                                            className="bg-gray-50 rounded-lg px-2 py-1 text-sm"
                                            onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                            value={userData.gender}
                                        >
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                        </select>
                                    ) : (
                                        <span className="text-slate-700">{userData.gender}</span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Date of Birth</span>
                                    {isEditing('basic-info') ? (
                                        <input
                                            className="bg-gray-50 rounded-lg px-2 py-1 text-sm"
                                            type='date'
                                            onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                            value={userData.dob}
                                        />
                                    ) : (
                                        <span className="text-slate-700">{userData.dob}</span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Blood Group</span>
                                    {isEditing('basic-info') ? (
                                        <input
                                            className="bg-gray-50 rounded-lg px-2 py-1 text-right w-20"
                                            type="text"
                                            onChange={(e) => setUserData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                                            value={userData.bloodGroup || ''}
                                        />
                                    ) : (
                                        <span className="text-slate-700">{userData.bloodGroup || '-'}</span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Height / Weight</span>
                                    {isEditing('basic-info') ? (
                                        <div className="flex gap-2">
                                            <input
                                                className="bg-gray-50 rounded-lg px-2 py-1 w-20 text-right"
                                                type="number"
                                                placeholder="cm"
                                                onChange={(e) => setUserData(prev => ({ ...prev, heightCm: e.target.value }))}
                                                value={userData.heightCm || ''}
                                            />
                                            <input
                                                className="bg-gray-50 rounded-lg px-2 py-1 w-20 text-right"
                                                type="number"
                                                placeholder="kg"
                                                onChange={(e) => setUserData(prev => ({ ...prev, weightKg: e.target.value }))}
                                                value={userData.weightKg || ''}
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-slate-700">
                                            {userData.heightCm ? `${userData.heightCm} cm` : '-'} / {userData.weightKg ? `${userData.weightKg} kg` : '-'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {isEditing('basic-info') && (
                                <button
                                    onClick={updateUserProfileData}
                                    className="mt-4 w-full rounded-full bg-primary text-white text-sm font-semibold py-2.5 hover:bg-primary/90 transition-colors"
                                >
                                    Save changes
                                </button>
                            )}
                        </div>

                        <div
                            id="medical-info"
                            className={`bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5 ${activeNav !== 'medical-info' ? 'hidden' : ''}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">
                                    Medical Information
                                </p>
                                <button
                                    onClick={() => setEditSection(prev => prev === 'medical-info' ? null : 'medical-info')}
                                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                >
                                    {isEditing('medical-info') ? 'Cancel' : 'Edit'}
                                </button>
                            </div>
                            <div className="space-y-3 text-sm text-slate-700">
                                <div>
                                    <p className="text-slate-500 mb-1">Allergies</p>
                                    {isEditing('medical-info') ? (
                                        <input
                                            className="bg-gray-50 rounded-lg px-2 py-1 w-full"
                                            type="text"
                                            placeholder="e.g. Peanuts, Penicillin"
                                            onChange={(e) => setUserData(prev => ({ ...prev, allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                                            value={(userData.allergies || []).join(', ')}
                                        />
                                    ) : (
                                        <p className="text-slate-700">
                                            {(userData.allergies || []).length ? (userData.allergies || []).join(', ') : 'No known allergies'}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-slate-500 mb-1">Chronic diseases</p>
                                    {isEditing('medical-info') ? (
                                        <input
                                            className="bg-gray-50 rounded-lg px-2 py-1 w-full"
                                            type="text"
                                            placeholder="e.g. Diabetes, Hypertension"
                                            onChange={(e) => setUserData(prev => ({ ...prev, chronicDiseases: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                                            value={(userData.chronicDiseases || []).join(', ')}
                                        />
                                    ) : (
                                        <p className="text-slate-700">
                                            {(userData.chronicDiseases || []).length ? (userData.chronicDiseases || []).join(', ') : 'None reported'}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-slate-500 mb-1">Current medications</p>
                                    {isEditing('medical-info') ? (
                                        <textarea
                                            className="bg-gray-50 rounded-lg px-3 py-2 w-full text-sm min-h-[72px]"
                                            placeholder="List current medications and dosages"
                                            onChange={(e) => setUserData(prev => ({ ...prev, currentMedications: e.target.value }))}
                                            value={userData.currentMedications || ''}
                                        />
                                    ) : (
                                        <p className="text-slate-700">
                                            {userData.currentMedications || 'Not specified'}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-slate-500 mb-1">Emergency contact</p>
                                    {isEditing('medical-info') ? (
                                        <div className="space-y-2">
                                            <input
                                                className="bg-gray-50 rounded-lg px-2 py-1 w-full"
                                                type="text"
                                                placeholder="Name"
                                                onChange={(e) => setUserData(prev => ({
                                                    ...prev,
                                                    emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                                                }))}
                                                value={userData.emergencyContact?.name || ''}
                                            />
                                            <input
                                                className="bg-gray-50 rounded-lg px-2 py-1 w-full"
                                                type="text"
                                                placeholder="Relation"
                                                onChange={(e) => setUserData(prev => ({
                                                    ...prev,
                                                    emergencyContact: { ...prev.emergencyContact, relation: e.target.value }
                                                }))}
                                                value={userData.emergencyContact?.relation || ''}
                                            />
                                            <input
                                                className="bg-gray-50 rounded-lg px-2 py-1 w-full"
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
                                        <div className="text-sm text-slate-700">
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
                                    className="mt-4 w-full rounded-full bg-primary text-white text-sm font-semibold py-2.5 hover:bg-primary/90 transition-colors"
                                >
                                    Save changes
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Current vitals / stats row */}
                    <div id="stats" className={`grid md:grid-cols-3 gap-4 ${activeNav !== 'stats' ? 'hidden' : ''}`}>
                        <div className="bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                Total Visits
                            </p>
                            <p className="text-2xl font-semibold text-slate-900">{stats.totalVisits}</p>
                            <p className="text-xs text-emerald-600 mt-1">
                                {stats.completedVisits} completed, {stats.upcomingVisits} upcoming
                            </p>
                        </div>
                        <div className="bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                Doctors consulted
                            </p>
                            <p className="text-2xl font-semibold text-slate-900">{doctorHistory.length}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Based on your past appointments
                            </p>
                        </div>
                        <div className="bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                Payments made
                            </p>
                            <p className="text-2xl font-semibold text-slate-900">
                                {currencySymbol}{payments.reduce((acc, p) => acc + (p.amount || 0), 0)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Across {payments.length} paid appointments
                            </p>
                        </div>
                    </div>

                    {/* Appointment Management */}
                    <div id="appointments" className={`bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5 ${activeNav !== 'appointments' ? 'hidden' : ''}`}>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                    Appointment Management
                                </p>
                                <p className="text-sm text-slate-600">Upcoming & past appointments</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto mt-3">
                            <table className="min-w-full text-left text-sm">
                                <thead className="text-[11px] uppercase tracking-[0.2em] text-slate-400 border-b">
                                    <tr>
                                        <th className="py-2 pr-4 font-medium">Doctor</th>
                                        <th className="py-2 pr-4 font-medium">Speciality</th>
                                        <th className="py-2 pr-4 font-medium">Date</th>
                                        <th className="py-2 pr-4 font-medium">Time</th>
                                        <th className="py-2 pr-4 font-medium">Status</th>
                                        <th className="py-2 pr-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.slice(0, 5).map(app => (
                                        <tr key={app._id} className="border-b last:border-0">
                                            <td className="py-3 pr-4 text-gray-800">{app.docData?.name}</td>
                                            <td className="py-3 pr-4 text-slate-500">{app.docData?.speciality}</td>
                                            <td className="py-3 pr-4 text-slate-500">{app.slotDate}</td>
                                            <td className="py-3 pr-4 text-slate-500">{app.slotTime}</td>
                                            <td className="py-3 pr-4">{getStatusBadge(app)}</td>
                                            <td className="py-3 pr-4 text-right space-x-2">
                                                <button
                                                    className="text-xs text-primary font-medium"
                                                    onClick={() => navigate(`/appointment/${app.docId}`)}
                                                >
                                                    Reschedule
                                                </button>
                                                {!app.cancelled && !app.isCompleted && (
                                                    <button
                                                        className="text-xs text-red-500 font-medium"
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

                    {/* Doctor interaction + Reports / Payments / Preferences */}
                    <div className={`grid gap-4 ${activeNav !== 'doctor-history' && activeNav !== 'reports-payments' ? 'hidden' : ''}`}>
                        <div id="doctor-history" className={`bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5 ${activeNav !== 'doctor-history' ? 'hidden' : ''}`}>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                    Doctor Interaction History
                                </p>
                            </div>
                            <div className="space-y-3">
                                {doctorHistory.slice(0, 4).map(doc => (
                                    <div key={doc.docId} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {doc.image && (
                                                <img src={doc.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                                                <p className="text-xs text-slate-500">{doc.speciality}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">Last visit</p>
                                            <p className="text-xs text-slate-700">{doc.lastVisit}</p>
                                            <button
                                                className="mt-1 text-xs text-primary font-medium"
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
                            <div className="bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                        Reports & Prescriptions
                                    </p>
                                    <label className="text-xs text-primary font-medium cursor-pointer">
                                        Upload
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleUploadReport}
                                        />
                                    </label>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
                                    {reports.slice(0, 4).map(rep => (
                                        <div key={rep._id} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-800">{rep.title}</p>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(rep.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <a
                                                href={rep.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-primary font-medium"
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

                            <div className="bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em] mb-3">
                                    Payments & Billing
                                </p>
                                <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
                                    {payments.slice(0, 4).map(pay => (
                                        <div key={pay.appointmentId} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-800">
                                                    {currencySymbol}{pay.amount}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(pay.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="text-xs text-emerald-600">
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
                    <div id="preferences" className={`bg-white/90 backdrop-blur border border-slate-200/60 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] rounded-3xl dark:bg-gray-900/80 dark:border-gray-800/60 p-5 ${activeNav !== 'preferences' ? 'hidden' : ''}`}>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">
                                Notifications & Preferences
                            </p>
                            <button
                                onClick={() => setEditSection(prev => prev === 'preferences' ? null : 'preferences')}
                                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                {isEditing('preferences') ? 'Cancel' : 'Edit'}
                            </button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-2">
                                <p className="text-[11px] text-slate-400 uppercase tracking-[0.24em]">Notifications</p>
                                {['email', 'sms', 'appointmentReminders'].map(key => (
                                    <label key={key} className={`flex items-center gap-2 text-slate-700 ${!isEditing('preferences') ? 'opacity-70' : ''}`}>
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
                                        <span className="text-sm">
                                            {key === 'email' && 'Email notifications'}
                                            {key === 'sms' && 'SMS notifications'}
                                            {key === 'appointmentReminders' && 'Appointment reminders'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[11px] text-slate-400 uppercase tracking-[0.24em]">Language</p>
                                <select
                                    className="bg-gray-50 rounded-lg px-3 py-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                    value={userData.languagePreference || 'en'}
                                    onChange={(e) => setUserData(prev => ({ ...prev, languagePreference: e.target.value }))}
                                    disabled={!isEditing('preferences')}
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[11px] text-slate-400 uppercase tracking-[0.24em]">Appearance</p>
                                <label className={`flex items-center justify-between bg-gray-50 rounded-2xl px-3 py-2 ${!isEditing('preferences') ? 'opacity-70' : ''}`}>
                                    <span className="text-sm text-slate-700">Dark mode</span>
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
                                className="mt-5 w-full rounded-full bg-primary text-white text-sm font-semibold py-2.5 hover:bg-primary/90 transition-colors"
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
