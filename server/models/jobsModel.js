import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    salary: { type: Number, required: true },
    date: { type: Number, required: true },
    visible: { type: Boolean, required: true },
    comapny_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }
})

const jobsModel = mongoose.model('Job', jobsSchema)

export default jobsModel;