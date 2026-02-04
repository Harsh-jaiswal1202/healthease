import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {

        setDocSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {

            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = [];


            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {

                    // Add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setDocSlots(prev => ([...prev, timeSlots]))

        }

    }

    const bookAppointment = async () => {

        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    return docInfo ? (
        <div className="relative min-h-screen bg-slate-50/80 dark:bg-gray-950 px-4 sm:px-6 lg:px-10 py-10">
            <button
                onClick={() => navigate('/doctors')}
                className="absolute left-4 sm:left-6 lg:left-10 top-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur border border-slate-200/70 text-slate-700 text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.45)] transition z-20"
            >
                Back
            </button>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* ---------- Doctor Details ----------- */}
                <div className="relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 dark:border-gray-800/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[28px] p-6">
                    <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary/10 via-cyan-500/10 to-transparent blur-3xl"></div>
                    <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-400/10 via-sky-400/10 to-transparent blur-3xl"></div>

                    <div className="relative flex flex-col lg:flex-row gap-6">
                        <div className="bg-slate-50 rounded-2xl p-2 ring-1 ring-slate-200/70 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.4)]">
                            <img className="w-full max-w-72 rounded-2xl object-cover" src={docInfo.image} alt="" />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="flex items-center gap-2 text-2xl md:text-3xl font-semibold text-slate-900">
                                    {docInfo.name}
                                    <img className="w-5" src={assets.verified_icon} alt="" />
                                </p>
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    {docInfo.speciality}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-600 text-sm">
                                <p>{docInfo.degree} - {docInfo.speciality}</p>
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                                    {docInfo.experience}
                                </span>
                            </div>

                            <div className="mt-4 rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)]">
                                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                                    About
                                    <img className="w-3" src={assets.info_icon} alt="" />
                                </p>
                                <p className="text-sm text-slate-600 mt-2">{docInfo.about}</p>
                            </div>

                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 ring-1 ring-emerald-200/70 px-4 py-2 text-sm text-emerald-700 font-semibold">
                                Appointment fee: {currencySymbol}{docInfo.fees}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking slots */}
                <div className="relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 dark:border-gray-800/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[28px] p-6">
                    <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary/10 via-cyan-500/10 to-transparent blur-3xl"></div>
                    <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-400/10 via-sky-400/10 to-transparent blur-3xl"></div>

                    <div className="relative">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Booking slots</p>
                        <h2 className="text-lg font-semibold text-slate-900 mt-2">Choose a day and time</h2>

                        <div className="flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2">
                            {docSlots.length && docSlots.map((item, index) => (
                                <button
                                    onClick={() => setSlotIndex(index)}
                                    key={index}
                                    className={`min-w-16 rounded-2xl px-4 py-3 text-center text-sm font-semibold transition-all ${slotIndex === index ? 'bg-gradient-to-r from-primary to-cyan-500 text-white shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)]' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                    <p>{item[0] && item[0].datetime.getDate()}</p>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 w-full overflow-x-auto mt-4 pb-2">
                            {docSlots.length && docSlots[slotIndex].map((item, index) => (
                                <button
                                    onClick={() => setSlotTime(item.time)}
                                    key={index}
                                    className={`text-sm font-medium flex-shrink-0 px-5 py-2 rounded-full transition-all ${item.time === slotTime ? 'bg-gradient-to-r from-primary to-cyan-500 text-white shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)]' : 'text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {item.time.toLowerCase()}
                                </button>
                            ))}
                        </div>

                        <button onClick={bookAppointment} className="mt-6 w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold shadow-[0_12px_32px_-18px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all">
                            Book an appointment
                        </button>
                    </div>
                </div>

                {/* Listing Releated Doctors */}
                <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
            </div>
        </div>
    ) : null
}

export default Appointment
