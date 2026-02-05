import express from 'express';
import { loginDoctor, googleLoginDoctor, forgotDoctorPassword, verifyDoctorOtp, resetDoctorPassword, appointmentsDoctor, appointmentCancel, doctorList, changeAvailablity, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile, changeDoctorEmail, changeDoctorPassword, deleteDoctorAccount } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';
const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)
doctorRouter.post("/google-login", googleLoginDoctor)
doctorRouter.post("/forgot-password", forgotDoctorPassword)
doctorRouter.post("/verify-otp", verifyDoctorOtp)
doctorRouter.post("/reset-password", resetDoctorPassword)
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.get("/list", authUser, doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailablity)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post(
    "/update-profile",
    authDoctor,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "license", maxCount: 1 },
        { name: "degreeCert", maxCount: 1 },
        { name: "idProof", maxCount: 1 },
        { name: "certifications", maxCount: 5 }
    ]),
    updateDoctorProfile
)
doctorRouter.post("/change-email", authDoctor, changeDoctorEmail)
doctorRouter.post("/change-password", authDoctor, changeDoctorPassword)
doctorRouter.post("/delete-account", authDoctor, deleteDoctorAccount)

export default doctorRouter;
