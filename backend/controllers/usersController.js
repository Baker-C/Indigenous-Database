const User = require('../schemas/User')
const Group = require('../schemas/Group')
const Catalogue = require('../schemas/Catalogue')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId.createFromHexString

// reserved name used for catalogue holding all user saved entries
const savedName = 'My Saved' 
// default catalogue for all users



// @desc Get a single user
// @route GET /users
// @access Private
const get = async (req, res) => {
    const { username, userId } = req.body

    if (!username && !userId) {
        return res
        .status(400)
        .json({ 
            message: 'User ID or username required.' 
        })
    }

    // Converts single arguments into array if not already
    const usernames = Array.isArray(username) ? username : (username ? [username] : [])
    const userIds = Array.isArray(userId) ? userId : (userId ? [userId] : [])

    // returns all users in list if username or userId is a list
    const users = await User
    .find({
        $or: [
            { username: { $in : usernames } },
            { _id: { $in : userIds } }
        ]
    })
    .populate('catalogues')
    .select('-password')
    .lean()
    .exec()

    if (!users?.length) {
        return res
        .status(400)
        .json({ 
            message: users
        })
    } else {
        return res
        .status(200)
        .json(users)
    }
}


// @desc Create new user
// @route POST /users
// @access Private
const create = async (req, res) => {
    const { username, email, password, rePassword, firstName, lastName } = req.body

    // Confirm data
    if ( !username || !email || !password || !rePassword || !firstName || !lastName ) {
        return res
        .status(400)
        .json({ 
            message: 'A firstName, lastName, username, email, and password rePassword are required.' 
        })
    }

    // Check that passwords match
    if (password !== rePassword) {
        return res
        .status(400)
        .json({
            message: 'The password and rePassword need to match.' 
        })
    }

    // Check for duplicate usernames or emails
    const duplicate = await User
    .findOne({ username: username })
    .lean()
    .exec()
    if (duplicate) {
        return res
        .status(409)
        .json({ 
            message: 'Duplicate username found.' 
        })
    }

    // User object with hashed pass
    const hashedPwd = await bcrypt.hash(password, 10) // Salt rounds = 10
    const userObj = {
        username, 
        email, 
        "password": hashedPwd,
        "profile" : {
            firstName,
            lastName
        }
    }

    const user = await User.create(userObj)

    // Check for created
    if (!user) {
        res
        .status(400)
        .json({ 
            message: 'Error creating user.' 
        }) 
    }

    // Create Saved Books catalogue
    const savedObj = {
        "name": savedName,
        "description": "All of your saved entries",
        "owner": user._id
    }

    // save to users profile
    const savedCatalogue = await Catalogue
    .create({
        ...savedObj
    })

    if (!savedCatalogue) {
        await User
        .findByIdAndDelete(user._id)
        .lean()
        .exec()

        return res
        .status(400)
        .json({ 
            message: `Error creating ${savedName} for new user` 
        })
    } else {
        user.catalogues = [ savedCatalogue._id ]
        await user.save()

        return res
        .status(201)
        .json({ 
            message: `New user ${username} created` 
        })
    }
}


// @desc Update user
// @route PATCH /users
// @access Private
const update = async (req, res) => {
    const { username, userId, newUsername, email, catalogueId, removeCatalogueId, groupId, removeGroupId } = req.body

    // Confirm data
    if ( !username && !userId ) {
        return res
        .status(400)
        .json({ 
            message: 'A username or userId is required for udates.' 
        })
    }

    // check if user exists
    const user = await User
    .findOne({
        $or: [
            { username: username },
            { _id: userId }
        ]
    })
    .exec()
    if (!user) {
        return res
        .status(400)
        .json({ 
            message: 'User not found'
        })
    }

    // Check for duplicate username or email
    const duplicate = await User
    .findOne({ newUsername })
    .lean()
    .exec()
    if (duplicate && duplicate?.username?.toString() === newUsername) {
        return res
        .status(409)
        .json({ 
            message: 'Duplicate username found.' 
        })
    }

    // set new info if given
    if (newUsername) user.username = newUsername

    if (email) user.email = email
    
    if (catalogueId || removeCatalogueId) {
        // check that the catalogue exists
        const catalogue = await Catalogue
        .findById(catalogueId)
        .lean()
        .exec()
        if (!catalogue) {
            return res.status(400).json({ message: 'Catalogue(s) not found'})
        }

        // add/delete catalogues from users' list
        const catalogueObjId = ObjId(catalogueId)
        if (catalogueId) {
            user.catalogues = [ ...user.catalogues, catalogueObjId ]            
        } else if (removeCatalogueId) {
            user.catalogues = user.catalogues?.filter(id => 
                id !== removeCatalogueId
            )
        }

    }
    
    if (groupId || removeGroupId) {
        // check that the group exists
        const group = await Group
        .findById(groupId)
        .lean()
        .exec()
        if (!group) {
            return res.status(400).json({ message: 'Group(s) not found.'})
        }

        // add/delete groups from users' list
        const groupObjId = ObjId(groupId)
        if (groupId) {
            user.groups = [ ...user.groups, groupObjId ]
        } else if (removeGroupId) {
            user.groups = user.groups?.filter(id => id !== removeGroupId)
        }
    }

    // Confirm update
    const updatedUser = await user.save()

    res.status(204).json({ message: `${updatedUser.username} updated.`})

    
}

// @desc Delete user
// @route DELETE /users
// @access Private
const remove = async (req, res) => {
    const { username, userId } = req.body

    // confirm data
    if (!username && !userId) {
        return res.status(400).json({ message: 'Username or id is required.'})
    }

    // Check is user exists
    const user = await User
    .findOne({
        $or: [
            { username: username },
            { _id: userId }
        ]
    })
    .populate({ 
        path: 'catalogues',
        select: 'owner'
    })
    .lean()
    .exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found.' })
    }

    // Delete user owned catalogues
    for (let catalogue of user.catalogues) {
        if (catalogue.owner === user._id) {
            const updatedUsers = await User
            .updateMany({}, { $pull: { catalogues: ObjId(catalogue._id) }})   
            if (!updatedUsers) {
                return res.status(400).json({ message: `Catalogues of other users not updated with delete: ${catalogue._id}` })
            }
        }
        deletedCatalogue = await Catalogue
        .findByIdAndRemove(catalogue._id)
        .lean()
        .exec()
        if (!deletedCatalogue) {
            return res.status(400).json({ message: `Unable to delete catalogue: ${catalogue._id}` })
        }
    }

    // Delete user from group lists
    const updatedUsers = await Group
    .updateMany({}, { 
        $pull: { 
            members: ObjId(id) 
        }
    })
    if (!updatedUsers) {
        return res.status(400).json({ message: `Groups not updated with delete.` })
    }

    // delete user
    const deletedUser = await User
    .findOneAndRemove({
        $or: [
            { username: username },
            { _id: userId }
        ]
    })
    .lean()
    .exec()
    if (!deletedUser) {
        return res.status(400).json({ message: 'Failed to delete user.' })
    }

    res.status(200).json({ message: `User ${deletedUser.username} deleted.` })
}

module.exports = {
    get,
    create,
    update,
    remove
}
