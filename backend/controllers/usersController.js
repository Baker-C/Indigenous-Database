const User = require('../schemas/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAll = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})





// @desc Create new user
// @route POST /users
// @access Private
const create = asyncHandler(async (req, res) => {
    const { username, email, password, rePassword } = req.body

    // Confirm data
    if (!username || !email || !password || !rePassword ) {
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



/*
in the process of doing update functions
need to find out how to confirm passwords 
    and how to find duplicates based off username
*/


// @desc Update user
// @route PATCH /users
// @access Private
const updateUserInfo = asyncHandler(async (req, res) => {
    const { username, newUsername, newEmail, password } = req.body

    // Confirm data
    if ( !username || !newUsername || !newEmail || !password ) {
        return res.status(400).json({ message: 'A username, email, and password are required' })
    }

    const user = await User.findOne({ username }).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    if (password != user.password) {
        return res.status(400).json({ message: 'Incorrect Password'})
    }

    /*
    Need to make this an update email
        Find user by username
        Check pass is correct
    */

    // Check for duplicate
    const duplicate = await User.findOne({ newUsername }).lean().exec()

    // Allow updates to the original user
    if (duplicate && duplicate?.username.toString() == newUsername) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = newUsername
    user.email = newEmail

    if (password) {

        // Hash passwrd
        user.password = await bcrypt.hash(password, 10) // Salt rounds = 10
    }

    // Confirm update
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated`})
})

// @desc Update user
// @route PATCH /users
// @access Private
const updateUserPass = asyncHandler(async (req, res) => {
    const { username, password, newPassword } = req.body

    // Confirm data
    if ( !username || !email || !password || !newPassword ) {
        return res.status(400).json({ message: 'A username, email, and password are required' })
    }

    const user = await User.findOne({ username }).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    if (password != user.password) {
        return res.status(400).json({ message: 'Incorrect Password'})
    }

    /*
    Need to make this an update email
        Find user by username
        Check pass is correct
    */

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updates to the original user
    if (duplicate && duplicate?.username.toString() !== email) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.email = email

    if (password) {
        // Hash passwrd
        user.password = await bcrypt.hash(password, 10) // Salt rounds = 10
    }

    // Confirm update
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated`})
})

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
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
    const user = await User.findOne({ username }).exec()

    // Check for user
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const deletedUser = await User.findOneAndDelete({ username }).lean()

    res.json({ message: `User ${deletedUser.username} deleted` })
})

module.exports = {
    getAll,
    create,
    update,
    deleteUser
}