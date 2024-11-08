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
            message: `New user ${username} created.` 
        })
    }
}


// @desc Update user
// @route PATCH /users
// @access Private
const update = async (req, res) => {
    const { userId, username, email, firstName, lastName, addCatalogues, delCatalogues } = req.body

    
    // Confirm data, username is required
    if ( !userId ) {
        return res
        .status(400)
        .json({ 
            message: 'User Id is required for udates.' 
        })
    }
    
    // check if user exists
    const user = await User
    .findById(userId)
    .exec()

    if (!user) {
        return res
        .status(400)
        .json({ 
            message: 'User not found'
        })
    }

    // Confirm user token belongs to user being changed
    if (req.user !== user.username) {
        return res
        .status(401)
        .json({
            message: 'User token does not match.'
        })
    }

    // Check for duplicate username
    const duplicate = await User
    .findOne({ username })
    .lean()
    .exec()

    if (duplicate && (duplicate?.username?.toString() === username) && (user.username !== username)) {
        return res
        .status(409)
        .json({ 
            message: 'Duplicate username found.' 
        })
    }

    // set new info if given
    if (username) user.username = username

    if (email) user.email = email

    if (firstName) user.profile.firstName = firstName

    if (lastName) user.profile.lastName = lastName
     
    if (addCatalogues) {
        // Converts single arguments into array if not already
        const listCatalogues = Array.isArray(addCatalogues) ? addCatalogues : (addCatalogues ? [addCatalogues] : [])

        
        // get object ids
        let addObjIds
        try {
            addObjIds = listCatalogues.map(entry => 
                ObjId(entry)
            )
        } catch (err) {
            return res
            .status(400)
            .json({ 
                message: 'Add catalogues contains a non-ObjId.' 
            })
        }
        
        // filter out the ids that are already in the list
        const filteredObjIds = addObjIds.filter(addObjId => 
            !user.catalogues.includes(addObjId)
        )
        
        // check that the catalogues exist
        const checkedCatalogues = await Catalogue
        .find({
            _id: { $in : filteredObjIds }
        })
        .lean()
        .exec()
        
        if (filteredObjIds?.length !== checkedCatalogues?.length) {
            return res
            .status(400)
            .json({ 
                message: `Entry(s) not found` 
            })
        }

        // If entries are left, add them
        if (filteredObjIds?.length) {
            user.catalogues = [ ...user.catalogues, ...filteredObjIds ]
        }
    }

    if (delCatalogues) {
        // Converts single arguments into array if not already
        const listCatalogues = Array.isArray(delCatalogues) ? delCatalogues : (delCatalogues ? [delCatalogues] : [])

        // get object ids
        let delObjIds
        try {
            delObjIds = listCatalogues.map(entry => 
                ObjId(entry)
            )
        } catch (err) {
            return res
            .status(400)
            .json({ 
                message: 'Del catalogues contains a non-ObjId.' 
            })
        }
        
        // if any are matching, delete them
        user.catalogues = user.catalaogues?.filter(catalogueObjId => 
            !delObjIds.includes(catalogueObjId)
        )
    }

    // Confirm update
    await user.save()

    res.status(204).end()
}



// @desc Delete user
// @route DELETE /users
// @access Private
const remove = async (req, res) => {
    const { userId } = req.body

    // confirm data
    if (!userId) {
        return res.status(400).json({ message: 'User Id is required.'})
    }

    // Check is user exists
    const user = await User
    .findById(userId)
    .populate({ 
        path: 'catalogues',
        select: 'owner'
    })
    .exec()

    if (!user) {
        return res
        .status(400)
        .json({ 
            message: 'User not found.' 
        })
    }

    // Check that username matches token
    if (user.username !== req.user) {
        return res
        .status(400)
        .json({ 
            message: 'User does not match token.' 
        })
    }

    // Delete user owned catalogues
    for (let catalogue of user.catalogues) {
        if (catalogue.owner === user._id) {
            await User
            .updateMany({}, { 
                $pull: { 
                    catalogues: ObjId(catalogue._id) 
                }
            })   
            
            await Catalogue
            .findByIdAndRemove(catalogue._id)
            .lean()
            .exec()   
        }
    }

    // delete user
    const deletedUser = await User
    .findByIdAndDelete(userId)
    .lean()
    .exec()

    if (!deletedUser) {
        return res.status(400).json({ message: 'Failed to delete user.' })
    }

    res.status(204).end()
}

module.exports = {
    get,
    create,
    update,
    remove
}
