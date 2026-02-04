import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: {
        line1: { type: String, required: true },
        line2: { type: String, required: true },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
        clinicName: { type: String, default: "" }
    },
    location: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    availability: {
        days: {
            type: Array,
            default: []
        },
        slotDuration: { type: Number, default: 30 },
        breakMinutes: { type: Number, default: 0 }
    },
    languages: { type: Array, default: [] },
    services: { type: Array, default: [] },
    documents: {
        licenseUrl: { type: String, default: "" },
        degreeUrl: { type: String, default: "" },
        idUrl: { type: String, default: "" },
        certifications: { type: Array, default: [] }
    },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    verificationStatus: { type: String, enum: ["pending", "verified"], default: "pending" },
    profileCompletion: { type: Number, default: 0 },
    resetOtpHash: { type: String, default: '' },
    resetOtpExpires: { type: Number, default: 0 },
    date: { type: Number, required: true },
}, { minimize: false })

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;
