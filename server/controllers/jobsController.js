import jobsModel from "../models/jobsMOdel.js"


//get all jobs
export const getJobs = async (req, res) => {
    try {
        const jobs = await jobsModel.find({ visible: true })
            .populate({ path: 'companyId', select: '-password' })

        res.status(200).json({ success: true, jobs })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//get job by ID
export const getJobbyId = async (req, res) => {

}