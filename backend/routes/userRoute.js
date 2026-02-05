import express from 'express';
import { loginUser, registerUser, googleLogin, forgotPassword, verifyOtp, resetPassword, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentStripe, verifyStripe, paymentCash, getProfileDashboard, uploadReport, changeEmail, changePassword, deleteAccount } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/google-login", googleLogin)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/reset-password", resetPassword)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.get("/profile-dashboard", authUser, getProfileDashboard)
userRouter.post("/upload-report", upload.single('file'), authUser, uploadReport)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)

userRouter.post("/payment-stripe", authUser, paymentStripe)
userRouter.post("/verifyStripe", authUser, verifyStripe)
userRouter.post("/payment-cash", authUser, paymentCash)
userRouter.post("/change-email", authUser, changeEmail)
userRouter.post("/change-password", authUser, changePassword)
userRouter.post("/delete-account", authUser, deleteAccount)

export default userRouter;
