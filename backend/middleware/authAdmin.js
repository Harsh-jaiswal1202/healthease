import jwt from "jsonwebtoken"
import adminModel from "../models/adminModel.js"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        if (!process.env.JWT_SECRET) {
            return res.json({ success: false, message: 'JWT_SECRET not configured' })
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        if (token_decode?.id) {
            const admin = await adminModel.findById(token_decode.id)
            if (!admin) {
                return res.json({ success: false, message: 'Not Authorized Login Again' })
            }
            req.adminId = admin._id
            return next()
        }

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        next()
    } catch (error) {
        console.log('JWT Error:', error.message)
        if (error.name === 'JsonWebTokenError') {
            return res.json({ success: false, message: 'Invalid token. Please login again.' })
        }
        if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: 'Token expired. Please login again.' })
        }
        res.json({ success: false, message: 'Authentication failed. Please login again.' })
    }
}

export default authAdmin;
