import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to select cash payment
    const appointmentCash = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-cash', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div className="min-h-screen bg-slate-50/80 dark:bg-gray-950 px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-3 sm:mb-4 md:hidden">
                    <button
                        onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/80 text-slate-700 dark:text-gray-200 shadow-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-all"
                        aria-label="Back"
                    >
                        <span className="text-lg leading-none">←</span>
                    </button>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-slate-200/60 dark:border-gray-800/60 rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.45)]">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.24em]">Appointments</p>
                        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mt-2">My appointments</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Track upcoming visits, payments, and history.
                        </p>
                    </div>
                    <button
                        onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                        className="hidden md:inline-flex w-full md:w-auto self-start md:self-auto items-center justify-center rounded-full border border-slate-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/80 px-4 md:px-5 py-2 text-sm font-semibold text-slate-700 dark:text-gray-200 shadow-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-all"
                        aria-label="Back"
                    >
                        Back
                    </button>
                </div>

                <div className="grid gap-6">
                    {appointments.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            className="relative overflow-hidden bg-white/90 backdrop-blur border border-slate-200/60 dark:border-gray-800/60 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.5)] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-36px_rgba(15,23,42,0.55)]"
                        >
                            <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary/10 via-cyan-500/10 to-transparent blur-3xl"></div>
                            <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-400/10 via-sky-400/10 to-transparent blur-3xl"></div>

                            <div className="relative flex flex-col lg:flex-row gap-4 sm:gap-6">
                                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5 flex-1">
                                    <div className="bg-slate-50 rounded-2xl p-2 ring-1 ring-slate-200/70 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.4)]">
                                        <img className="w-16 h-16 sm:w-28 sm:h-28 object-cover rounded-2xl" src={item.docData.image} alt="" />
                                    </div>
                                    <div className="flex-1 text-sm text-slate-600">
                                        <p className="text-slate-900 text-lg font-semibold">{item.docData.name}</p>
                                        <p className="text-slate-500">{item.docData.speciality}</p>
                                        <div className="mt-3 rounded-2xl border border-slate-200/60 bg-white/80 px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)]">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Address</p>
                                            <p className="text-slate-700 mt-1">{item.docData.address.line1}</p>
                                            <p className="text-slate-500">{item.docData.address.line2}</p>
                                        </div>
                                        <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-full bg-slate-100 text-slate-600 px-3 sm:px-4 py-1.5 text-xs">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                                            <span className="font-semibold text-slate-700">Date & Time:</span>
                                            {slotDateFormat(item.slotDate)} | {item.slotTime}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-auto flex flex-row flex-wrap lg:flex-col gap-2 justify-start lg:justify-end text-sm text-center lg:min-w-[220px]">
                                    {!item.cancelled && !item.payment && !item.isCompleted && item.paymentMethod === 'cash' && (
                                        <button className="w-full lg:w-full flex-1 lg:flex-none py-2.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 font-semibold">
                                            Cash on Visit
                                        </button>
                                    )}
                                    {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && item.paymentMethod !== 'cash' && (
                                        <button
                                            onClick={() => setPayment(item._id)}
                                            className="w-full lg:w-full flex-1 lg:flex-none py-2.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white font-semibold shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)] hover:opacity-95 transition-all"
                                        >
                                            Pay Online
                                        </button>
                                    )}
                                    {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && item.paymentMethod !== 'cash' && (
                                        <button
                                            onClick={() => appointmentCash(item._id)}
                                            className="w-full lg:w-full flex-1 lg:flex-none py-2.5 rounded-full border border-amber-200 text-amber-700 hover:bg-amber-50 transition-all"
                                        >
                                            Pay Cash
                                        </button>
                                    )}
                                    {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                        <button
                                            onClick={() => appointmentStripe(item._id)}
                                            className="w-full lg:w-full flex-1 lg:flex-none py-2.5 rounded-full border border-slate-200/70 bg-white/80 hover:bg-slate-50 transition-all flex items-center justify-center"
                                        >
                                            <img className="max-w-20 max-h-5" src={assets.stripe_logo} alt="" />
                                        </button>
                                    )}
                                    {!item.cancelled && item.payment && !item.isCompleted && (
                                        <button className="w-full lg:w-full flex-1 lg:flex-none py-2.5 rounded-full bg-emerald-50 ring-1 ring-emerald-200/70 text-emerald-700 font-semibold">
                                            Paid
                                        </button>
                                    )}

                                    {item.isCompleted && (
                                        <button className="w-full lg:w-full flex-1 lg:flex-none py-2.5 rounded-full border border-emerald-500 text-emerald-600 font-semibold">
                                            Completed
                                        </button>
                                    )}

                                    {!item.cancelled && !item.isCompleted && (
                                        <button
                                            onClick={() => cancelAppointment(item._id)}
                                            className="w-full lg:w-full flex-1 lg:flex-none py-2.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            Cancel appointment
                                        </button>
                                    )}
                                    {item.cancelled && !item.isCompleted && (
                                        <button className="w-full lg:w-full flex-1 lg:flex-none py-2.5 rounded-full border border-rose-500 text-rose-600">
                                            Appointment cancelled
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyAppointments
