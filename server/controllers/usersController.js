import jobApplicationModel from "../models/jobApplicationModel.js"
import jobsModel from "../models/jobsMOdel.js"
import userModel from "../models/userModel.js"
import { v2 as cloudinary } from 'cloudinary'


//get user data
export const getUserData = async (req, res) => {

    const userId = req.auth.userId

    try {
        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.status(200).json({ success: true, user })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}

//apply for a job
export const applyForJob = async (req, res) => {
    const { jobId } = req.body
    const userId = req.auth.userId

    try {
        const isAlreadyApplied = await jobApplicationModel.find({ jobId, userId })

        if (isAlreadyApplied.length > 0) {
            return res.status(200).json({ success: false, message: "User already applied to this job" })
        }

        const jobData = await jobsModel.findById(jobId)

        if (!jobData) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }

        await jobApplicationModel.create({
            companyId: jobData.companyId,
            userId,
            jobId,
        })

        res.status(200).json({ success: true, message: "Applied successfully" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//get user aplied applications
export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.auth.userId

        const applications = await jobApplicationModel.find({ userId })
            .populate('companyID', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec()

        if (!applications) {
            return res.status(404).json({ success: false, message: "No job applications found for this user" })
        }

        res.status(200).json({ success: true, applications })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//update user profile(resume)
export const updateUserResume = async (req, res) => {
    try {
        const userId = req.auth.userId
        const resumeFile = req.file

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User details not found", userId, resumeFile })
        }

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        res.status(200).json({ success: true, message: "Resume updated" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}