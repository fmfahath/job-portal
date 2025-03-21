import companyModel from "../models/companyModel.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js";
import jobsModel from "../models/jobsModel.js";
import jobApplicationModel from "../models/jobApplicationModel.js";


//register new company
export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !imageFile || !password) {
        return res.json({ success: false, message: "Missing details (name, email, image and password required" })
    }

    try {
        const companyExist = await companyModel.findOne({ email })

        if (companyExist) {
            return res.json({ success: false, message: "Email already registered" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        //upload company details to mongoDB
        const company = await companyModel.create({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url
        })

        //generate token
        const token = generateToken(company._id)

        res.status(201).json({
            success: "true", company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token
        })


    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }


}

//company login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        const company = await companyModel.findOne({ email })

        if (await bcrypt.compare(password, company.password)) {

            const token = generateToken(company._id)

            res.status(200).json({
                success: true, company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token
            })
        }
        else {
            res.json({ success: false, message: "Invalid email or password" })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//get comanpy data
export const getCompanyData = async (req, res) => {

    try {
        const company = req.company

        res.status(200).json({ success: true, company })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//psot a new job
export const postJob = async (req, res) => {
    const { title, description, location, salary, category, level } = req.body;

    const companyId = req.company._id

    try {
        const newJob = new jobsModel({
            title,
            description,
            location,
            salary,
            companyId,
            category,
            level
        });

        await newJob.save()

        res.status(201).json({ success: true, message: "Job posted successfully", newJob })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}

//get comapny job applicants
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id

        const applications = await jobApplicationModel.find({ companyId })
            .populate('userId', 'name image resume')
            .populate('jobId', 'title location category level salary')
            .exec()

        return res.json({ success: true, applications })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id

        const jobs = await jobsModel.find({ companyId })

        //get total no of applicants count for a paticular job
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await jobApplicationModel.find({ jobId: job._id })
            return { ...job.toObject(), applicants: applicants.length }
        }))

        res.status(200).json({ success: true, jobsData })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//change job apllication status
export const changeJobApplicationsStatus = async (req, res) => {
    try {
        const { id, status } = req.body

        await jobApplicationModel.findByIdAndUpdate({ _id: id }, { status })

        res.json({ success: true, message: "Status Changed" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//change job visibility
export const changeJobVisibility = async (req, res) => {
    try {

        const { id } = req.body
        const companyId = req.company._id

        let job = await jobsModel.findById(id)

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible
        }

        job = await job.save()

        res.status(200).json({ success: true, job })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
