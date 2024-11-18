const User = require('../schemas/User')
const Catalogue = require('../schemas/Catalogue')
const { userSavedCatalogue } = require('../schemas/Catalogue')
const Util = require('./util')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId.createFromHexString


// @desc Get a single user
// @route GET /users
// @access Public
const get = async (req, res) => {
    const { username, userId } = req.body

    if (!username && !userId ) {
        return res.status(400).json({ 
            message: 'User ID or username required.' 
        })
    }

    const usernames = Util.toArray(username)
    const userIds = Util.toArray(userId)

    if (Util.invalidObjId(userIds)) {
        return res.status(400).json({ 
            message: 'Invalid User ID.' 
        })
    }

    const users = await User
    .find({
        $or: [
            { username: { $in : usernames } },
            { _id: { $in : userIds } }
        ]
    })
    .populate('catalogues')
    .select('-email -password')
    .lean()
    .exec()

    if (!users?.length) {
        return res.status(400).json({ 
            message: 'Users not found.'
        })
    }

    return res.status(200).json(users)
}


// @desc Create new user
// @route POST /users
// @access Private
const create = async (req, res) => {
    Util.trimWhitespace(req.body)

    const { username, email, password, rePassword, firstName, lastName } = req.body

    if ( !username || !email || !password || !rePassword || !firstName || !lastName ) {
        return res.status(400).json({ 
            message: 'A firstName, lastName, username, email, and password rePassword are required.' 
        })
    }

    if (Util.usernameOverMaxLength(username)) {
        return res.status(400).json({
            message: 'Username is too long'
        })
    }

    if (password !== rePassword) {
        return res.status(400).json({
            message: 'The password and rePassword need to match.' 
        })
    }
    

    const duplicate = await User
    .findOne({ username: username })
    .countDocuments()
    

    if (duplicate) {
        return res.status(409).json({ 
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

    if (!user) {
        res.status(400).json({ 
            message: 'Error creating user.' 
        }) 
    }
    
    // Create Saved Books catalogue
    const savedObj = {
        "name": `${userSavedCatalogue}`,
        "description": "All of your saved entries",
        "owner": user._id
    }    

    const savedCatalogue = await Catalogue
    .create(savedObj)

    if (!savedCatalogue) {
        await User
        .findByIdAndDelete(user._id)
        .lean()
        .exec()

        return res.status(400).json({ 
            message: `Error creating ${userSavedCatalogue} for new user` 
        })
    } else {
        user.catalogues = [ savedCatalogue._id ]
        
        await user.save()

        return res.status(201).json( user )
    }
}


// @desc Update user
// @route PATCH /users
// @access Private
const update = async (req, res) => {
    Util.trimWhitespace(req.body)
    
    const { userId, username, email, firstName, lastName, addCatalogues, delCatalogues } = req.body

    // confirm data
    if ( !userId | Util.invalidObjId(userId) ) {
        return res.status(400).json({ 
            message: 'A Valid User Id is required for udates.' 
        })
    }

    if (username && Util.usernameOverMaxLength(username)) {
        return res.status(400).json({
            message: 'Username too long'
        })
    }
    
    // check if user exists
    const user = await User
    .findById(userId)
    .exec()

    if (!user) {
        return res.status(400).json({ 
            message: 'User not found'
        })
    }

    // Confirm user token belongs to user being changed
    if (req.user !== user.username) {
        return res.status(401).json({
            message: 'User token does not match.'
        })
    }

    const duplicate = await User
    .findOne({ username: username })
    .countDocuments()

    if (duplicate && (user.username !== username)) {
        return res.status(409).json({ 
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
        const listCatalogues = Util.toArray(addCatalogues)

        
        if (Util.invalidObjId(listCatalogues)) {
            return res.status(400).json({ 
                message: 'Add catalogues contains a non-ObjId.' 
            })
        }

        const objIds = listCatalogues.map(entry => ObjId(entry))

        // filter out the ids that are already in the list
        const filteredObjIds = objIds.filter(objId => !user.catalogues?.includes(objId))
        
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
        const listCatalogues = Util.toArray(delCatalogues)

        if (Util.invalidObjId(listCatalogues)) {
            return res.status(400).json({ 
                message: 'Add catalogues contains a non-ObjId.' 
            })
        }

        const objIds = listCatalogues.map(entry => ObjId(entry))
        
        // if any are matching, delete them
        user.catalogues = user.catalogues?.filter(objId => !objIds?.includes(objId))
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
    if (!userId | Util.invalidObjId(userId)) {
        return res.status(400).json({ 
            message: 'A valid User Id is required.'
        })
    }

    const user = await User
    .findById(userId)
    .populate({ 
        path: 'catalogues',
        select: 'owner'
    })
    .select('catalogues username')
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
        return res.status(400).json({ 
            message: 'Failed to delete user.' 
        })
    }

    res.status(204).end()
}

module.exports = {
    get,
    create,
    update,
    remove
}
