import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addDoctor, allDoctors, adminDashboard, getDoctorById, updateDoctor, updateDoctorVerification, updateDoctorStatus, deactivateDoctor, getAdminProfile, changeAdminEmail, changeAdminPassword, deleteAdminAccount } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post(
    "/add-doctor",
    authAdmin,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "license", maxCount: 1 },
        { name: "degreeCert", maxCount: 1 },
        { name: "idProof", maxCount: 1 },
        { name: "certifications", maxCount: 5 }
    ]),
    addDoctor
)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.get("/doctor/:doctorId", authAdmin, getDoctorById)
adminRouter.put(
    "/doctor/:doctorId",
    authAdmin,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "license", maxCount: 1 },
        { name: "degreeCert", maxCount: 1 },
        { name: "idProof", maxCount: 1 },
        { name: "certifications", maxCount: 5 }
    ]),
    updateDoctor
)
adminRouter.post("/doctor/:doctorId/verify", authAdmin, updateDoctorVerification)
adminRouter.post("/doctor/:doctorId/status", authAdmin, updateDoctorStatus)
adminRouter.post("/doctor/:doctorId/deactivate", authAdmin, deactivateDoctor)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)
adminRouter.get("/profile", authAdmin, getAdminProfile)
adminRouter.post("/change-email", authAdmin, changeAdminEmail)
adminRouter.post("/change-password", authAdmin, changeAdminPassword)
adminRouter.post("/delete-account", authAdmin, deleteAdminAccount)

export default adminRouter;
