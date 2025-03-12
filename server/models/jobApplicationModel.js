import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    companyId: { type: mongoose.SchemaType.objectId, ref: 'Company', required: true },
    jobId: { type: mongoose.SchemaType.objectId, ref: 'Job', required: true },
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now() },
})

const jobApplicationModel = mongoose.model('JobApplication', jobApplicationSchema)

export default jobApplicationModel;