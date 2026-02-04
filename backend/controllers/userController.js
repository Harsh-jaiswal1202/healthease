import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import reportModel from "../models/reportModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})
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

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
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

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login/register with Google
const googleLogin = async (req, res) => {
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

        let user = await userModel.findOne({ email })

        if (!user) {
            const randomPassword = crypto.randomBytes(32).toString('hex')
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(randomPassword, salt)

            user = await userModel.create({
                name: payload?.name || email.split('@')[0],
                email,
                image: payload?.picture || undefined,
                password: hashedPassword
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Send reset OTP
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.json({ success: false, message: "Email is required" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: true, message: "If the email exists, an OTP has been sent." })
        }

        const otp = generateOtp()
        user.resetOtpHash = hashOtp(otp)
        user.resetOtpExpires = Date.now() + otpExpiryMs
        await user.save()

        const transporter = getEmailTransporter()
        if (!transporter) {
            return res.json({ success: false, message: "Email service not configured" })
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your HealthEase OTP",
            text: `Your OTP is ${otp}. It expires in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>HealthEase Password Reset</h2>
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

// API: Verify OTP and return reset token
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.json({ success: false, message: "Email and OTP are required" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (!user.resetOtpHash || !user.resetOtpExpires) {
            return res.json({ success: false, message: "OTP not requested" })
        }

        if (Date.now() > user.resetOtpExpires) {
            return res.json({ success: false, message: "OTP expired" })
        }

        const hashed = hashOtp(otp)
        if (hashed !== user.resetOtpHash) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        const resetToken = jwt.sign(
            { id: user._id, purpose: "reset" },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        )

        res.json({ success: true, resetToken })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Reset password using reset token
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body

        if (!resetToken || !newPassword) {
            return res.json({ success: false, message: "Missing details" })
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
        if (decoded.purpose !== "reset") {
            return res.json({ success: false, message: "Invalid reset token" })
        }

        const user = await userModel.findById(decoded.id)
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        user.password = hashedPassword
        user.resetOtpHash = ''
        user.resetOtpExpires = 0
        await user.save()

        res.json({ success: true, message: "Password updated" })
    } catch (error) {
        console.log(error)
        if (error.name === "TokenExpiredError") {
            return res.json({ success: false, message: "Reset token expired" })
        }
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const {
            userId,
            name,
            phone,
            address,
            dob,
            gender,
            bloodGroup,
            heightCm,
            weightKg,
            allergies,
            chronicDiseases,
            currentMedications,
            emergencyContact,
            notificationPreferences,
            languagePreference,
            darkModePreference
        } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        const updatePayload = {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
            bloodGroup: bloodGroup || '',
            heightCm: heightCm || null,
            weightKg: weightKg || null,
            allergies: allergies ? JSON.parse(allergies) : [],
            chronicDiseases: chronicDiseases ? JSON.parse(chronicDiseases) : [],
            currentMedications: currentMedications || '',
            emergencyContact: emergencyContact ? JSON.parse(emergencyContact) : undefined,
            notificationPreferences: notificationPreferences ? JSON.parse(notificationPreferences) : undefined,
            languagePreference: languagePreference || 'en',
            darkModePreference: typeof darkModePreference !== 'undefined' ? darkModePreference === 'true' || darkModePreference === true : undefined
        }

        // Remove undefined keys so we don't overwrite with undefined
        Object.keys(updatePayload).forEach((key) => updatePayload[key] === undefined && delete updatePayload[key])

        await userModel.findByIdAndUpdate(userId, updatePayload)

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Upload medical report or prescription
const uploadReport = async (req, res) => {
    try {
        const { userId, title, fileType } = req.body;
        const file = req.file;

        if (!file) {
            return res.json({ success: false, message: "No file uploaded" });
        }

        const uploadResult = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto"
        });

        const report = new reportModel({
            userId,
            title: title || file.originalname,
            fileUrl: uploadResult.secure_url,
            fileType: fileType || "report",
        });

        const saved = await report.save();

        res.json({ success: true, message: "File uploaded", report: saved });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API: Get summarized dashboard data for profile page
const getProfileDashboard = async (req, res) => {
    try {
        const { userId } = req.body;

        const [userData, appointments, reports] = await Promise.all([
            userModel.findById(userId).select("-password"),
            appointmentModel.find({ userId }),
            reportModel.find({ userId })
        ]);

        // Derive doctor interaction history
        const doctorHistoryMap = {};
        appointments.forEach(app => {
            const doc = app.docData || {};
            const id = app.docId;
            if (!doctorHistoryMap[id]) {
                doctorHistoryMap[id] = {
                    docId: id,
                    name: doc.name,
                    speciality: doc.speciality,
                    image: doc.image,
                    lastVisit: app.slotDate,
                    totalVisits: 1
                };
            } else {
                doctorHistoryMap[id].totalVisits += 1;
                doctorHistoryMap[id].lastVisit = app.slotDate;
            }
        });

        const doctorHistory = Object.values(doctorHistoryMap);

        // Payment summary derived from appointments
        const payments = appointments
            .filter(app => app.payment)
            .map(app => ({
                appointmentId: app._id,
                amount: app.amount,
                date: app.date,
                status: app.cancelled ? "Refunded / Cancelled" : "Paid"
            }));

        res.json({
            success: true,
            data: {
                userData,
                stats: {
                    totalVisits: appointments.length,
                    completedVisits: appointments.filter(a => a.isCompleted).length,
                    upcomingVisits: appointments.filter(a => !a.cancelled && !a.isCompleted && a.payment).length
                },
                appointments,
                doctorHistory,
                reports,
                payments
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API: Change user email
const changeEmail = async (req, res) => {
    try {
        const { userId, newEmail, password } = req.body

        if (!newEmail || !password) {
            return res.json({ success: false, message: 'Missing details' })
        }

        if (!validator.isEmail(newEmail)) {
            return res.json({ success: false, message: 'Please enter a valid email' })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' })
        }

        const existing = await userModel.findOne({ email: newEmail })
        if (existing && existing._id.toString() !== userId) {
            return res.json({ success: false, message: 'Email already in use' })
        }

        user.email = newEmail
        await user.save()

        res.json({ success: true, message: 'Email updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Change user password
const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: 'Missing details' })
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'Please enter a strong password' })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid current password' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword
        await user.save()

        res.json({ success: true, message: 'Password updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: Delete user account
const deleteAccount = async (req, res) => {
    try {
        const { userId, password } = req.body

        if (!password) {
            return res.json({ success: false, message: 'Missing details' })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' })
        }

        await appointmentModel.deleteMany({ userId })
        await reportModel.deleteMany({ userId })
        await userModel.findByIdAndDelete(userId)

        res.json({ success: true, message: 'Account deleted' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginUser,
    registerUser,
    googleLogin,
    forgotPassword,
    verifyOtp,
    resetPassword,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
    getProfileDashboard,
    uploadReport,
    changeEmail,
    changePassword,
    deleteAccount
}
