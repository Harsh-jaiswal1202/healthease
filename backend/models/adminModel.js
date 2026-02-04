import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetOtpHash: { type: String, default: '' },
    resetOtpExpires: { type: Number, default: 0 }
}, { timestamps: true })

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;
