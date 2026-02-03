import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    doctorId: { type: String },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: "report" }, // report | prescription
    uploadedAt: { type: Date, default: Date.now },
}, { minimize: false })

const reportModel = mongoose.models.report || mongoose.model("report", reportSchema);
export default reportModel;


