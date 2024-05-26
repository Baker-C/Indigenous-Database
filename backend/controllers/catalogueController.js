const Catalogue = require('../schemas/Catalogue')
const Book = require('../schemas/Book')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const User = require('../schemas/User')
const ObjId = mongoose.Types.ObjectId

// @desc Get a single catalogue
// @route GET /catalogues
// @access Private
const get = asyncHandler(async (req, res) => {
    const { _id, userId } = req.body

    // Return all public catalogues if no catalogue ID specified
    if ( !_id && !userId ) {
        const catalogues = await Catalogue.find({ privacy: 'PUBLIC' }).populate('entries').lean().exec()
        if (catalogues?.length) {
           return res.json(catalogues)
        } else {
            return res.status(400).json({ message: 'No catalogues found' })
        }
    }

    // Return all catalogues of a users catalogues list if user ID is specified and no catalogue ID specified
    if ( !_id && userId ) {
        // Checks if user exists
        const user = await User.findById(userId).populate({
            path: 'catalogues',
            select: '-owners'
        }).lean().exec()
        if (!user) {
            return res.status(400).json({ message: `User ${userId} not found` })
        }
        const catalogues = user.catalogues
        return res.json(catalogues)
    }

    // Returns catalogue if PUBLIC or if user ID is on catalogue's owners list
    if (_id) {
        // Checks if catalogue exists
        const catalogue = await Catalogue.findById(_id).populate('entries').select('-owners').lean().exec()
        if (!catalogue) {
            return res.status(400).json({ message: 'Catalogue not found' })
        } 

        // Returns if PUBLIC
        if (catalogue && catalogue.privacy === 'PUBLIC' ) {
            return res.json(catalogue)
        }

        // Returns only if user ID is in owners list of catalogue
        if (catalogue.owners.includes(ObjId(userId))) {
            return res.json(catalogue)
        } else {
            return res.status(400).json({ message: 'User does not have sufficient permissions' })
        }
    }
})


// @desc Create new catalogue
// @route POST /catalogues
// @access Private
const create = asyncHandler(async (req, res) => {
    const { title, ownerId, entries } = req.body

    // Confirm data
    if ( !title || !ownerId ) {
        return res.status(400).json({ message: 'A title and ownerId is required is required' })
    }
    
    // All title data is UPPERCASE
    const titleLC = title.toUpperCase()

    // Check that owner exists
    const owner = await User.findById( ownerId ).exec()
    if (!owner) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check that all entries exist 
    const checkedEntries = await Book.find({ '_id': { $in: entries.map(entry => new ObjId(entry)) } }).lean().exec()
    const entriesNotFound = entries.filter(entry => !checkedEntries.some(checkedEntry => checkedEntry._id.toString() === entry))
    if (entriesNotFound.length) {
        return res.status(400).json({ message: `Entries not found ${entriesNotFound}` })
    }

    // Check for duplicates
    const duplicate = await Catalogue.findOne({ 'title': titleLC }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: `Duplicate catalogue name found ${title}` })
    }

    const catalogueObj = { 
        'title': titleLC, 
        'privacy': 'PUBLIC', 
        'entries': [ ... entries ], 
        'owners': [ new ObjId(ownerId) ] }
    const catalogue = await Catalogue.create( catalogueObj )

    const updatedUser = await User.updateOne(
        { _id: ownerId },
        { $push: { catalogues: catalogue._id } }
    )
    if (!updatedUser) {
        return res.status(400).json({ message: 'Error updating user catalogue list' })
    }

    // Check for created
    if (catalogue) {
        res.status(201).json({ message: `New catalogue title: ${title} id: ${catalogue._id} created` })
    } else {
        res.status(400).json({ message: 'Error creating catalogue: Invalid catalogue data recieved' })
    }
})

// @desc Update catalogue
// @route PATCH /catalogues
// @access Private
const update = asyncHandler(async (req, res) => {
    const { _id, title, privacy, owners, entries } = req.body

    // Confirm data
    if ( !_id ) {
        return res.status(400).json({ message: 'An id is required' })
    }

    // Check that catalogue exists
    const catalogue = await Catalogue.findById( _id ).exec()
    if (!catalogue) {
        return res.status(400).json({ message: 'Catalogue not found'})
    }

    if (title) {     
        const newTitleUC = title.toUpperCase()
        // Check for any duplicates of the new title
        const duplicate = await Catalogue.findOne({ title: newTitleUC }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate new title' })
        }
    }


    // Check that priivacy follows enum of 'PUBLIC', 'PRIVATE'
    const PRIVACY_ENUMS = ['PUBLIC', 'PRIVATE']
    if ( privacy && !PRIVACY_ENUMS.includes(privacy) ) {
        return res.status(400).json({ message: `${privacy} not valid. Must be either 'PUBLIC' or 'PRIVATE'`})
    }

    if (owners) {
        // Check that all owners exist 
        const checkedOwners = await User.find({ '_id': { $in: owners.map(owner => new ObjId(owner)) } }).lean().exec()
        const ownersNotFound = owners.filter(owner => !checkedOwners.some(checkedOwner => checkedOwner._id.toString() === owner))
        if (ownersNotFound.length) {
            return res.status(400).json({ message: `Owners not found ${ownersNotFound}` })
        }
    }

    if (entries) {
        const checkedEntries = await Book.find({ 'username': { $in: entries.map(entry => new ObjId(entry)) } }).lean().exec()
        // Check that all entries exist 
        const entriesNotFound = entries.filter(entry => !checkedEntries.some(checkedEntry => checkedEntry.username === entry.toUpperCase()))
        if (entriesNotFound) {
            return res.status(400).json({ message: `Entries not found ${entriesNotFound})` })
        }
    }

    if (title) catalogue.title = newTitleLC
    if (privacy) catalogue.privacy = privacy
    if (owners) catalogue.owners = owners
    if (entries) catalogue.entries = entries

    // Confirm update
    const updatedCatalogue = await catalogue.save()

    res.json({ message: `${updatedCatalogue.title} updated`})
})

// @desc Delete catalogue
// @route DELETE /catalogues
// @access Private
const remove = asyncHandler(async (req, res) => {
    const { _id, userId } = req.body

    if ( !_id || !userId ) {
        return res.status(400).json({ message: 'Catalogue id and userId is required.'})
    }

    const catalogue = await Catalogue.findById(_id).lean().exec()

    // Check for catalogue
    if (!catalogue) {
        return res.status(400).json({ message: `Catalogue not found` })
    }

    if (!catalogue.owners.includes({ userId })) {
        return res.status(400).json({ message: 'User is not an owner of the catalogue' })
    }

    const updatedUsers = await User.updateMany({}, { $pull: { catalogues: userId }})
    if (!updatedUsers) {
        return res.status(400).json({ message: 'Catalogues of users on owners list not updated with delete' })
    }

    res.json({ message: `${deletedCatalogue.title} deleted` })
})




module.exports = {
    get,
    create,
    update,
    remove
}
