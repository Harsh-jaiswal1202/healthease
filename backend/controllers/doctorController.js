import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import validator from "validator";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const otpExpiryMs = 10 * 60 * 1000

const formatDateKey = (dateObj) => {
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const slotDateToKey = (slotDate) => {
    if (!slotDate) return null
    const [day, month, year] = String(slotDate).split('_')
    if (!day || !month || !year) return null
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

const buildLastDays = (count) => {
    const today = new Date()
    const days = []
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        days.push({
            key: formatDateKey(d),
            label: d.toLocaleDateString('en-US', { weekday: 'short' })
        })
    }
    return days
}

const parseJson = (value, fallback) => {
    if (!value) return fallback
    try {
        return JSON.parse(value)
    } catch (err) {
        return fallback
    }
}

const uploadToCloudinary = async (file, resourceType) => {
    if (!file) return ""
    const uploadResult = await cloudinary.uploader.upload(file.path, { resource_type: resourceType })
    return uploadResult.secure_url
}

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const hashOtp = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex')
}

const getEmailTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return null
    }
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
}

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Doctor Google login
const googleLoginDoctor = async (req, res) => {
    try {
        const { credential } = req.body

        if (!credential) {
            return res.json({ success: false, message: "Missing Google credential" })
        }
        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.json({ success: false, message: "GOOGLE_CLIENT_ID not configured" })
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        const email = payload?.email

        if (!email) {
            return res.json({ success: false, message: "Google account email not available" })
        }

        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({ success: false, message: "Doctor account not found" })
        }

        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Send doctor reset OTP
const forgotDoctorPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.json({ success: false, message: "Email is required" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({ success: true, message: "If the email exists, an OTP has been sent." })
        }

        const otp = generateOtp()
        doctor.resetOtpHash = hashOtp(otp)
        doctor.resetOtpExpires = Date.now() + otpExpiryMs
        await doctor.save()

        const transporter = getEmailTransporter()
        if (!transporter) {
            return res.json({ success: false, message: "Email service not configured" })
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Prescripto Doctor OTP",
            text: `Your OTP is ${otp}. It expires in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Prescripto Doctor Password Reset</h2>
                    <p>Your OTP is:</p>
                    <div style="font-size: 22px; font-weight: bold; letter-spacing: 4px;">${otp}</div>
                    <p>This OTP expires in 10 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        }

        await transporter.sendMail(mailOptions)
        res.json({ success: true, message: "OTP sent successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Verify doctor OTP and return reset token
const verifyDoctorOtp = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.json({ success: false, message: "Email and OTP are required" })
        }

        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (!doctor.resetOtpHash || !doctor.resetOtpExpires) {
            return res.json({ success: false, message: "OTP not requested" })
        }

        if (Date.now() > doctor.resetOtpExpires) {
            return res.json({ success: false, message: "OTP expired" })
        }

        const hashed = hashOtp(otp)
        if (hashed !== doctor.resetOtpHash) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        const resetToken = jwt.sign(
            { id: doctor._id, purpose: "doctor-reset" },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        )

        res.json({ success: true, resetToken })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Reset doctor password using reset token
const resetDoctorPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body

        if (!resetToken || !newPassword) {
            return res.json({ success: false, message: "Missing details" })
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
        if (decoded.purpose !== "doctor-reset") {
            return res.json({ success: false, message: "Invalid reset token" })
        }

        const doctor = await doctorModel.findById(decoded.id)
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" })
        }

        const salt = await bcrypt.genSalt(10)
        doctor.password = await bcrypt.hash(newPassword, salt)
        doctor.resetOtpHash = ''
        doctor.resetOtpExpires = 0
        await doctor.save()

        res.json({ success: true, message: "Password updated" })
    } catch (error) {
        console.log(error)
        if (error.name === "TokenExpiredError") {
            return res.json({ success: false, message: "Reset token expired" })
        }
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const doctor = await doctorModel.findById(docId)
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" })
        }

        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            location,
            availability,
            languages,
            services,
            available
        } = req.body

        const imageFile = req.files?.image?.[0]
        const licenseFile = req.files?.license?.[0]
        const degreeFile = req.files?.degreeCert?.[0]
        const idFile = req.files?.idProof?.[0]
        const certFiles = req.files?.certifications || []

        const addressData = parseJson(address, doctor.address)
        const locationData = parseJson(location, doctor.location)
        const availabilityData = parseJson(availability, doctor.availability)
        const languagesData = parseJson(languages, doctor.languages || [])
        const servicesData = parseJson(services, doctor.services || [])

        if (email && !validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        let hashedPassword = doctor.password
        if (password) {
            if (password.length < 8) {
                return res.json({ success: false, message: "Please enter a strong password" })
            }
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(password, salt)
        }

        const imageUrl = imageFile ? await uploadToCloudinary(imageFile, "image") : doctor.image
        const licenseUrl = licenseFile ? await uploadToCloudinary(licenseFile, "raw") : doctor.documents?.licenseUrl
        const degreeUrl = degreeFile ? await uploadToCloudinary(degreeFile, "raw") : doctor.documents?.degreeUrl
        const idUrl = idFile ? await uploadToCloudinary(idFile, "raw") : doctor.documents?.idUrl
        const certifications = [...(doctor.documents?.certifications || [])]

        for (const file of certFiles) {
            const certUrl = await uploadToCloudinary(file, "raw")
            if (certUrl) certifications.push(certUrl)
        }

        const completionFields = [
            name || doctor.name,
            email || doctor.email,
            speciality || doctor.speciality,
            degree || doctor.degree,
            experience || doctor.experience,
            about || doctor.about,
            fees || doctor.fees,
            addressData?.line1,
            addressData?.line2,
            addressData?.city,
            addressData?.state,
            addressData?.pincode,
            addressData?.clinicName,
            locationData?.lat,
            locationData?.lng,
            availabilityData?.days?.length ? "yes" : "",
            languagesData?.length ? "yes" : "",
            servicesData?.length ? "yes" : ""
        ]
        const completionScore = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)

        doctor.name = name || doctor.name
        doctor.email = email || doctor.email
        doctor.password = hashedPassword
        doctor.image = imageUrl
        doctor.speciality = speciality || doctor.speciality
        doctor.degree = degree || doctor.degree
        doctor.experience = experience || doctor.experience
        doctor.about = about || doctor.about
        doctor.fees = fees !== undefined ? Number(fees) : doctor.fees
        doctor.address = addressData
        doctor.location = locationData
        doctor.availability = availabilityData
        doctor.languages = languagesData
        doctor.services = servicesData
        doctor.available = available !== undefined ? available === 'true' || available === true : doctor.available
        doctor.documents = {
            licenseUrl: licenseUrl || "",
            degreeUrl: degreeUrl || "",
            idUrl: idUrl || "",
            certifications
        }
        doctor.profileCompletion = completionScore

        await doctor.save()

        res.json({ success: true, message: 'Profile Updated', doctor })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to change doctor email
const changeDoctorEmail = async (req, res) => {
    try {
        const { newEmail, password } = req.body
        if (!newEmail || !password) {
            return res.json({ success: false, message: "Missing details" })
        }
        if (!validator.isEmail(newEmail)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        const doctor = await doctorModel.findById(req.body.docId)
        if (!doctor) return res.json({ success: false, message: "Doctor not found" })
        const isMatch = await bcrypt.compare(password, doctor.password)
        if (!isMatch) return res.json({ success: false, message: "Invalid password" })
        doctor.email = newEmail
        await doctor.save()
        res.json({ success: true, message: "Email updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to change doctor password
const changeDoctorPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: "Missing details" })
        }
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }
        const doctor = await doctorModel.findById(req.body.docId)
        if (!doctor) return res.json({ success: false, message: "Doctor not found" })
        const isMatch = await bcrypt.compare(currentPassword, doctor.password)
        if (!isMatch) return res.json({ success: false, message: "Invalid password" })
        const salt = await bcrypt.genSalt(10)
        doctor.password = await bcrypt.hash(newPassword, salt)
        await doctor.save()
        res.json({ success: true, message: "Password updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to delete doctor account
const deleteDoctorAccount = async (req, res) => {
    try {
        const { password } = req.body
        if (!password) {
            return res.json({ success: false, message: "Password required" })
        }
        const doctor = await doctorModel.findById(req.body.docId)
        if (!doctor) return res.json({ success: false, message: "Doctor not found" })
        const isMatch = await bcrypt.compare(password, doctor.password)
        if (!isMatch) return res.json({ success: false, message: "Invalid password" })
        await doctorModel.findByIdAndDelete(req.body.docId)
        res.json({ success: true, message: "Doctor account deleted" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const last7Days = buildLastDays(7)
        const last7Keys = new Set(last7Days.map(day => day.key))
        const todayKey = formatDateKey(new Date())

        const dailyCounts = last7Days.reduce((acc, day) => ({ ...acc, [day.key]: 0 }), {})
        const dailyOnlineRevenue = last7Days.reduce((acc, day) => ({ ...acc, [day.key]: 0 }), {})
        const dailyCashRevenue = last7Days.reduce((acc, day) => ({ ...acc, [day.key]: 0 }), {})

        let todayScheduled = 0
        let todayCompleted = 0
        let todayCancelled = 0
        let todayRevenue = 0

        const dailyPatientSets = last7Days.reduce((acc, day) => ({ ...acc, [day.key]: new Set() }), {})

        appointments.forEach((item) => {
            const key = slotDateToKey(item.slotDate)
            if (!key) return
            if (last7Keys.has(key)) {
                dailyCounts[key] += 1
                if (dailyPatientSets[key]) {
                    dailyPatientSets[key].add(item.userId)
                }
                if (item.payment) {
                    dailyOnlineRevenue[key] += item.amount
                } else if (item.isCompleted) {
                    dailyCashRevenue[key] += item.amount
                }
            }

            if (key === todayKey) {
                if (item.cancelled) {
                    todayCancelled += 1
                } else if (item.isCompleted) {
                    todayCompleted += 1
                } else {
                    todayScheduled += 1
                }

                if (item.isCompleted || item.payment) {
                    todayRevenue += item.amount
                }
            }
        })

        const performanceCounts = last7Days.map(day => dailyCounts[day.key] || 0)
        const performanceAvg = performanceCounts.length
            ? Math.round(performanceCounts.reduce((sum, val) => sum + val, 0) / performanceCounts.length)
            : 0
        const performancePatients = last7Days.map(day => dailyPatientSets[day.key]?.size || 0)
        const patientsPerDay = performancePatients.length
            ? Math.round(performancePatients.reduce((sum, val) => sum + val, 0) / performancePatients.length)
            : 0

        const revenueOnline = last7Days.map(day => dailyOnlineRevenue[day.key] || 0)
        const revenueCash = last7Days.map(day => dailyCashRevenue[day.key] || 0)



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse(),
            charts: {
                labels: last7Days.map(day => day.label),
                appointmentSummary: {
                    scheduled: todayScheduled,
                    completed: todayCompleted,
                    cancelled: todayCancelled
                },
                performance: {
                    counts: performanceCounts,
                    avgPerDay: performanceAvg,
                    patientsPerDay
                },
                revenue: {
                    online: revenueOnline,
                    cash: revenueCash,
                    totalToday: todayRevenue
                }
            }
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginDoctor,
    googleLoginDoctor,
    forgotDoctorPassword,
    verifyDoctorOtp,
    resetDoctorPassword,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    changeDoctorEmail,
    changeDoctorPassword,
    deleteDoctorAccount
}
