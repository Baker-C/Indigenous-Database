const User = require('../schemas/User')
const Group = require('../schemas/Group')
const Catalogue = require('../schemas/Catalogue')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId


// @desc Get a single user
// @route GET /users
// @access Private
const get = asyncHandler(async (req, res) => {
    const { username } = req.body

    // returns all users if no username specified
    if (!username) {
        const users = await User.find().select('-password').populate('catalogues').lean().exec()
        if (users?.length) {
            return res.json(users)
        } else {
            return res.status(400).json({ message: 'No users found' })
        }
    }

    if (!username || !password ) {
        return res.status(400).json({ message: 'A password is required if username is provided' })
    }

    const user = await User.find().populate('catalogues').lean().exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    res.json(user)
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
    const userObj = { 
        username, 
        email, 
        "password": hashedPwd 
    }

    const user = await User.create(userObj)

    // Check for created
    if (!user) {
        res.status(400).json({ message: 'Error creating user: Invalid user data recieved' }) 
    }

    // Create Saved Books catalogue
    const yourBooksObj = {
        "title": "Saved Books",
        "privacy": "PRIVATE",
        "owner": user._id,
        "date": new Date()
    }
    const yourBooks = await Catalogue.create(yourBooksObj)
    if (!yourBooks) {
        await User.findByIdAndDelete(user._id).lean().exec()
        return res.status(400).json({ message: 'Error creating Saved Books for new user' })
    } else {
        user.catalogues = [ yourBooks._id ]
        await user.save()
    }

    res.status(201).json({ message: `New user ${username} created` })
})


// @desc Update user
// @route PATCH /users
// @access Private
const update = asyncHandler(async (req, res) => {
    const { username, newUsername, email, catalogueId, friendId, groupId } = req.body

    // Confirm data
    if ( !username ) {
        return res.status(400).json({ message: 'A username, password, newUsername, newEmail, and newPassword are required' })
    }

    const user = await User.findOne({ username }).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    // Check for duplicate
    const duplicate = await User.findOne({ newUsername }).lean().exec()
    // Allow updates to the original user
    if (duplicate && duplicate?.username?.toString() === newUsername) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    if (newUsername) user.username = newUsername
    if (email) user.email = email
    if (catalogueId) {
        const catalogue = await Catalogue.findById(catalogueId).lean().exec()
        if (!catalogue) {
            return res.status(400).json({ message: 'Catalogue not found'})
        }
        const catalogueObjId = new ObjId(catalogueId)
        user.catalogues = { ...user.catalogues, catalogueObjId }
    }
    if (groupId) {
        const group = await Group.findById(groupId).lean().exec()
        if (!group) {
            return res.status(400).json({ message: 'Group not found'})
        }        
        const groupObjId = new ObjId(groupId)
        if (user.groups?.includes(groupId)) {
            user.groups = user.groups?.filter(f => f !== groupObjId)
        } else {
            user.groups = { ...user.groups, groupObjId }
        }
    }

    // Confirm update
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated`})
})

// @desc Delete user
// @route DELETE /users
// @access Private
const remove = asyncHandler(async (req, res) => {
    const { username, id } = req.body

    if (!username && !id) {
        return res.status(400).json({ message: 'Username or id is required'})
    }

    let user

    // Check for user
    if (username) {
        user = await User.findOne({ username: username }).lean().exec()
    } else {
        user = await User.findById(id).lean().exec()
    }

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Delete from all other user's catalogue lists
    for (let catalogueId of user.catalogues) {
        const updatedUsers = await User.updateMany({}, { $pull: { catalogues: new ObjId(catalogueId) }})
        if (!updatedUsers) {
            return res.status(400).json({ message: `Catalogues of other users not updated with delete: ${catalogueId}` })
        }
        deletedCatalogue = await Catalogue.findByIdAndRemove(catalogueId).lean().exec()
        if (!updatedUsers) {
            return res.status(400).json({ message: `Unable to delete catalogue: ${catalogueId}` })
        }
    }

    const updatedUsers = await Group.updateMany({}, { $pull: { members: new ObjId(id) }})
    if (!updatedUsers) {
        return res.status(400).json({ message: `Groups not updated with delete` })
    }

    let deletedUser
    if (id) {
        deletedUser = await User.findByIdAndRemove(id).lean().exec()
    } else if (username) {
        deletedUser = await User.findOneAndRemove({ "username": username }).lean().exec()
    }
    if (!deletedUser) {
        return res.status(400).json({ message: 'Failed to delete user' })
    }

    res.json({ message: `User ${deletedUser.username} deleted` })
})

module.exports = {
    get,
    create,
    update,
    remove
}
