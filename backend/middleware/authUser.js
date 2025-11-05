import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        if (!process.env.JWT_SECRET) {
            return res.json({ success: false, message: 'JWT_SECRET not configured' })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log('JWT Error:', error.message)
        // Provide more specific error messages
        if (error.name === 'JsonWebTokenError') {
            return res.json({ success: false, message: 'Invalid token. Please login again.' })
        }
        if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: 'Token expired. Please login again.' })
        }
        res.json({ success: false, message: 'Authentication failed. Please login again.' })
    }
}

export default authUser;