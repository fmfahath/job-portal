import companyModel from "../models/companyModel.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'


//register new company
export const registerCompany = async (req, res) => {
    const { name, email, image, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !imageFile || !password) {
        return res.status(400).json({ success: false, message: "Missing details (name, email, image and password required" })
    }

    try {
        const companyExist = await companyModel.findOne({ email })

        if (companyExist) {
            return res.status(400).json({ success: false, message: "Email already registered" })
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

        res.status(201).json({
            success: success, company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            }
        })


    } catch (error) {

    }


}

//company login
export const loginCompany = async (req, res) => {

}

//get comanpy data
export const getCompanyData = async (req, res) => {

}

//psot a new job
export const postJob = async (req, res) => {

}

//get comapny job applicants
export const getCompanyJobApplicants = async (req, res) => {

}

//get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {

}

//change job apllication status
export const changeJobApplicationsStatus = async (req, res) => {

}

//change job visibility
export const changeJobVisibility = async (req, res) => {

}
