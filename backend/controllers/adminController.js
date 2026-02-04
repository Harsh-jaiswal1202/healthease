import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const otpExpiryMs = 10 * 60 * 1000

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

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        const admin = await adminModel.findOne({ email })
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password)
            if (!isMatch) {
                return res.json({ success: false, message: "Invalid credentials" })
            }
            const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET)
            return res.json({ success: true, token })
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const newAdmin = new adminModel({ email, password: hashedPassword })
            await newAdmin.save()
            const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, process.env.JWT_SECRET)
            return res.json({ success: true, token })
        } else {
            return res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API: Admin Google login
const googleLoginAdmin = async (req, res) => {
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

        let admin = await adminModel.findOne({ email })

        if (!admin) {
            if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
                const randomPassword = crypto.randomBytes(32).toString('hex')
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(randomPassword, salt)
                admin = await adminModel.create({ email, password: hashedPassword })
            } else {
                return res.json({ success: false, message: "Admin account not found" })
            }
        }

        const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Send admin reset OTP
const forgotAdminPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.json({ success: false, message: "Email is required" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        const admin = await adminModel.findOne({ email })
        if (!admin) {
            return res.json({ success: true, message: "If the email exists, an OTP has been sent." })
        }

        const otp = generateOtp()
        admin.resetOtpHash = hashOtp(otp)
        admin.resetOtpExpires = Date.now() + otpExpiryMs
        await admin.save()

        const transporter = getEmailTransporter()
        if (!transporter) {
            return res.json({ success: false, message: "Email service not configured" })
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Prescripto Admin OTP",
            text: `Your OTP is ${otp}. It expires in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Prescripto Admin Password Reset</h2>
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

// API: Verify admin OTP and return reset token
const verifyAdminOtp = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.json({ success: false, message: "Email and OTP are required" })
        }

        const admin = await adminModel.findOne({ email })
        if (!admin) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (!admin.resetOtpHash || !admin.resetOtpExpires) {
            return res.json({ success: false, message: "OTP not requested" })
        }

        if (Date.now() > admin.resetOtpExpires) {
            return res.json({ success: false, message: "OTP expired" })
        }

        const hashed = hashOtp(otp)
        if (hashed !== admin.resetOtpHash) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        const resetToken = jwt.sign(
            { id: admin._id, purpose: "admin-reset" },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        )

        res.json({ success: true, resetToken })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Reset admin password using reset token
const resetAdminPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body

        if (!resetToken || !newPassword) {
            return res.json({ success: false, message: "Missing details" })
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
        if (decoded.purpose !== "admin-reset") {
            return res.json({ success: false, message: "Invalid reset token" })
        }

        const admin = await adminModel.findById(decoded.id)
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" })
        }

        const salt = await bcrypt.genSalt(10)
        admin.password = await bcrypt.hash(newPassword, salt)
        admin.resetOtpHash = ''
        admin.resetOtpExpires = 0
        await admin.save()

        res.json({ success: true, message: "Password updated" })
    } catch (error) {
        console.log(error)
        if (error.name === "TokenExpiredError") {
            return res.json({ success: false, message: "Reset token expired" })
        }
        res.json({ success: false, message: error.message })
    }
}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

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
            status,
            verificationStatus
        } = req.body

        const imageFile = req.files?.image?.[0]
        const licenseFile = req.files?.license?.[0]
        const degreeFile = req.files?.degreeCert?.[0]
        const idFile = req.files?.idProof?.[0]
        const certFiles = req.files?.certifications || []

        const addressData = parseJson(address, null)
        const locationData = parseJson(location, null)
        const availabilityData = parseJson(availability, null)
        const languagesData = parseJson(languages, [])
        const servicesData = parseJson(services, [])

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !addressData) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!imageFile) {
            return res.json({ success: false, message: "Image Not Selected" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUrl = await uploadToCloudinary(imageFile, "image")

        const licenseUrl = await uploadToCloudinary(licenseFile, "raw")
        const degreeUrl = await uploadToCloudinary(degreeFile, "raw")
        const idUrl = await uploadToCloudinary(idFile, "raw")
        const certifications = []

        for (const file of certFiles) {
            const certUrl = await uploadToCloudinary(file, "raw")
            if (certUrl) certifications.push(certUrl)
        }

        const completionFields = [
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
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

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees: Number(fees),
            address: addressData,
            location: locationData,
            availability: availabilityData,
            languages: languagesData,
            services: servicesData,
            documents: {
                licenseUrl,
                degreeUrl,
                idUrl,
                certifications
            },
            status: status || "published",
            verificationStatus: verificationStatus || "pending",
            profileCompletion: completionScore,
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: status === "draft" ? "Doctor Saved as Draft" : "Doctor Published" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get single doctor details for admin
const getDoctorById = async (req, res) => {
    try {
        const { doctorId } = req.params
        const doctor = await doctorModel.findById(doctorId).select("-password")
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" })
        }
        res.json({ success: true, doctor })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor details for admin
const updateDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params
        const doctor = await doctorModel.findById(doctorId)
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
            status,
            verificationStatus
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
        doctor.documents = {
            licenseUrl: licenseUrl || "",
            degreeUrl: degreeUrl || "",
            idUrl: idUrl || "",
            certifications
        }
        doctor.status = status || doctor.status
        doctor.verificationStatus = verificationStatus || doctor.verificationStatus
        doctor.profileCompletion = completionScore

        await doctor.save()
        res.json({ success: true, message: "Doctor updated", doctor })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update verification status
const updateDoctorVerification = async (req, res) => {
    try {
        const { doctorId } = req.params
        const { verificationStatus } = req.body
        const doctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            { verificationStatus },
            { new: true }
        ).select("-password")
        if (!doctor) return res.json({ success: false, message: "Doctor not found" })
        res.json({ success: true, message: "Verification updated", doctor })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update publish status
const updateDoctorStatus = async (req, res) => {
    try {
        const { doctorId } = req.params
        const { status } = req.body
        const doctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            { status },
            { new: true }
        ).select("-password")
        if (!doctor) return res.json({ success: false, message: "Doctor not found" })
        res.json({ success: true, message: "Status updated", doctor })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to deactivate doctor
const deactivateDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params
        const doctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            { available: false, status: "draft" },
            { new: true }
        ).select("-password")
        if (!doctor) return res.json({ success: false, message: "Doctor not found" })
        res.json({ success: true, message: "Doctor deactivated", doctor })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get admin profile
const getAdminProfile = async (req, res) => {
    try {
        const admin = await adminModel.findById(req.adminId).select('-password')
        if (!admin) return res.json({ success: false, message: "Admin not found" })
        res.json({ success: true, admin })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to change admin email
const changeAdminEmail = async (req, res) => {
    try {
        const { newEmail, password } = req.body
        if (!newEmail || !password) {
            return res.json({ success: false, message: "Missing details" })
        }
        if (!validator.isEmail(newEmail)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        const admin = await adminModel.findById(req.adminId)
        if (!admin) return res.json({ success: false, message: "Admin not found" })
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) return res.json({ success: false, message: "Invalid password" })
        admin.email = newEmail
        await admin.save()
        res.json({ success: true, message: "Email updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to change admin password
const changeAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: "Missing details" })
        }
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }
        const admin = await adminModel.findById(req.adminId)
        if (!admin) return res.json({ success: false, message: "Admin not found" })
        const isMatch = await bcrypt.compare(currentPassword, admin.password)
        if (!isMatch) return res.json({ success: false, message: "Invalid password" })
        const salt = await bcrypt.genSalt(10)
        admin.password = await bcrypt.hash(newPassword, salt)
        await admin.save()
        res.json({ success: true, message: "Password updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to delete admin account
const deleteAdminAccount = async (req, res) => {
    try {
        const { password } = req.body
        if (!password) {
            return res.json({ success: false, message: "Password required" })
        }
        const admin = await adminModel.findById(req.adminId)
        if (!admin) return res.json({ success: false, message: "Admin not found" })
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) return res.json({ success: false, message: "Invalid password" })
        await adminModel.findByIdAndDelete(req.adminId)
        res.json({ success: true, message: "Admin account deleted" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginAdmin,
    googleLoginAdmin,
    forgotAdminPassword,
    verifyAdminOtp,
    resetAdminPassword,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    getDoctorById,
    updateDoctor,
    updateDoctorVerification,
    updateDoctorStatus,
    deactivateDoctor,
    allDoctors,
    adminDashboard,
    getAdminProfile,
    changeAdminEmail,
    changeAdminPassword,
    deleteAdminAccount
}
