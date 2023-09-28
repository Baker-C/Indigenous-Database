const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, name } = req.body

    // Confirm data
    if (!username || !password || !name) {
        return res.status(400).json({ message: 'A username, password, and name are required' })
    }

    //Check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username found' })
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // Salt rounds = 10

    // Create and store new user
    const userObj = { username, "password": hashedPwd, name }

    const user = await User.create(userObj)

    // Check for created
    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Error creating user: Invalid user data recieved'})
    }
})

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, name } = req.body

    // Confirm data
    if (!id || !username || !password) {
        return res.status(400).json({ message: 'A username, password, and userID are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.name = name

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
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID is required'})
    }
    /* For future reference of user collections
        const collections = await Collection.findOne({ user: id }).lean().exec()
        if (collections.length) {
            return res.status(400).json({ message: User has assigned collections. deal with that somehow })
        } 
    */
    const user = await User.findById(id).exec()

    // Check for user
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const deletedUser = await User.findOneAndDelete().lean()

    res.json({ message: `User ${deletedUser.username} with ID ${deletedUser._id} deleted` })
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}