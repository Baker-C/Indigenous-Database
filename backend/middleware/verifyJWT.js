const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization // good practice to check for both options

    // checks if authHeader is valid
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    // verifies the token and 
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.user = decoded.username // verify request must be signed with username in the token
            next() // moves onto either more middleware or the auth controller
        }
    )
}

module.exports = verifyJWT