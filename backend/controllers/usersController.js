const User = require('../schemas/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc Get a single user
// @route GET /users
// @access Private
const get = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    // returns all users if no username specified
    if (!username) {
        const users = await User.find().select('-password').lean()
        if (users?.length) {
            return res.json(users)
        } else {
            return res.status(400).json({ message: 'No users found' })
        }
    }

    if (!username || !password ) {
        return res.status(400).json({ message: 'A password is required if username is provided' })
    }

    const user = await User.find().lean().exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
    // check password
    if (bcrypt.compare(password, user.password)) {
        res.json(user)
    } else {
        res.status(400).json({ message: 'User password is incorrect' })
    }
})


// @desc Create new user
// @route POST /users
// @access Private
const create = asyncHandler(async (req, res) => {
    const { username, email, password, rePassword } = req.body

    // Confirm data
    if ( !username || !email || !password || !rePassword ) {
        return res.status(400).json({ message: 'A username, email, and password rePassword are required' })
    }

    // Check that passwords match
    if (!(password === rePassword)) {
        return res.status(400).json({ message: 'The password and re-password need to match' })
    }

    // Check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username found' })
    }

    // User object with hashed pass
    const hashedPwd = await bcrypt.hash(password, 10) // Salt rounds = 10
    const userObj = { username, email, "password": hashedPwd }
    
    const user = await User.create(userObj)

    // Check for created
    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Error creating user: Invalid user data recieved' })
    }
})


// @desc Update user
// @route PATCH /users
// @access Private
const update = asyncHandler(async (req, res) => {
    const { username, password, newUsername, newEmail, newPassword, catalogue } = req.body

    // Confirm data
    if ( !username || !password || !newUsername || !newEmail || !newPassword ) {
        return res.status(400).json({ message: 'A username, password, newUsername, newEmail, and newPassword are required' })
    }

    const user = await User.findOne({ username }).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    }
    if (bcrypt.compare(password, user.password)) {
        return res.status(400).json({ message: 'Incorrect Password'})
    }

    /*
    Need to make this an update email
    */

    // Check for duplicate
    const duplicate = await User.findOne({ newUsername }).lean().exec()
    // Allow updates to the original user
    if (duplicate && duplicate?.username.toString() == newUsername) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = newUsername
    user.email = newEmail
    user.catalogues = catalogues.map(catalogue => new ObjId(catalogue))

    if (newPassword) {
        // Hash passwrd
        user.password = await bcrypt.hash(newPassword, 10) // Salt rounds = 10
    }
    // Confirm update
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated`})
})

// @desc Delete user
// @route DELETE /users
// @access Private
const remove = asyncHandler(async (req, res) => {
    const { username } = req.body

    if (!username) {
        return res.status(400).json({ message: 'User username is required'})
    }
    /* For future reference of user collections
        const collections = await Collection.findOne({ user: id }).lean().exec()
        if (collections.length) {
            return res.status(400).json({ message: User has assigned collections. deal with that somehow })
        } 
    */
    const deletedUser = await User.findOneAndRemove({ username }).lean()

    // Check for user
    if (!deletedUser) {
        return res.status(400).json({ message: 'User not found' })
    }

    res.json({ message: `User ${deletedUser.username} deleted` })
})

module.exports = {
    get,
    create,
    update,
    remove
}
