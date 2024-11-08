const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization // good practice to check for both options

    // checks if authHeader is valid
    if (!authHeader || !authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or missing token' })
    }

    const token = authHeader.split(' ')[1]

    // verifies the token and 
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY,
        (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    // Token is expired, return 401 Unauthorized
                    return res.status(401).json({ message: 'Unauthorized: Token has expired' });
                }
                if (err.name === 'JsonWebTokenError') {
                    // Token is invalid, return 403 Forbidden
                    return res.status(403).json({ message: 'Forbidden: Invalid token' });
                }
                // Other errors related to JWT can be caught here
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            req.user = decoded.username // Sets decoded username in req
            next() // Moves onto either more middleware or route handler
        }
    )
}

module.exports = verifyJWT