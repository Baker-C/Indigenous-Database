const User = require('../schemas/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// @desc Logout
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findOne({ username }).populate('catalogues').lean().exec()
    if (!user) {
        return res.status(401).json({ message: 'User not found' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const accessToken = jwt.sign(
        { "username": user.username },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: '10s' }
    )

    const refreshToken = jwt.sign(
        { "username": user.username },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: '30d' }
    )

    // send refreshToken as a cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // only access through web server
        secure: false, // only https
        //sameSite: 'None', // cross-site cookies
        maxAge: 30 * 24 * 60 * 60 * 1000 // expires in a month
    })

    // dont send back the password
    delete user.password

    // send accessToken as the response
    res.json({ accessToken, user })
}



// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token expired
const refresh = (req, res) => {
    const cookies = req.cookies
    
    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' })
            }

            const user = await User.findOne({ username: decoded.username })
                                    .select('-password')
                                    .populate('catalogues')
                                    .lean().exec()

            const accessToken = jwt.sign(
                {
                    "username": user.username
                },
                process.env.ACCESS_TOKEN_KEY,
                { expiresIn: '10s' }
            )

            res.json({ accessToken, user })
        }
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if it exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204) // no jwt cookies
    }
    res.clearCookie('jwt', { 
        httpOnly: true,
        sameSite: 'None',
        secure: true
     })
     res.json({ message: 'Cookies cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}