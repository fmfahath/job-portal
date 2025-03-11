import jwt from 'jsonwebtoken'
import companyModel from '../models/companyModel.js'

const protectCompany = async (req, res, next) => {
    const token = req.headers.token

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, Login again" })
    }

    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET)


        if (!decoded_token) {
            return res.status(401).json({ success: false, message: "Invalid token or token expired" })
        }

        const company_data = await companyModel.findById(decoded_token.id).select('-password')
        req.company = company_data;

        next()
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export default protectCompany;