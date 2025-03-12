import userModel from "../models/userModel.js"


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

}

//get user aplied applications
export const getuserJobApplications = async (req, res) => {

}

//update user profile(resume)
export const updateUserResume = async (req, res) => {

}