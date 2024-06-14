const Catalogue = require('../schemas/Catalogue')
const User = require('../schemas/User')
const Book = require('../schemas/Book')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId

// @desc Get a single catalogue
// @route GET /catalogues
// @access Private
const get = asyncHandler(async (req, res) => {
    const size = req.query.size // returning entire size of query
    const p = parseInt(req.query.p, 10) || 0 // page number
    const q = req.query.q // search query
    const s = parseInt(req.query.s, 10) || 50 // page size
    const id = req.query.id
    const userId = req.query.userId


    // Return all catalogues of a users catalogues list if user ID is specified and no catalogue ID specified
    if ( !id && userId ) {
        // Checks if user exists
        const user = await User.findById(userId)
            .select('-password')
            .populate({
                path: 'catalogues',
                    populate: {
                        path: 'entries'
                    }
            })
            .lean().exec()
        if (!user) {
            return res.status(400).json({ message: `User ${userId} not found` })
        }
        const catalogues = user.catalogues
        return res.json(catalogues)
    }

    // Return specific catalogue if catalogue ID rpovided - PUBLIC
    if (id && !userId) {
        // Checks if catalogue exists
        const catalogue = await Catalogue.findById(id).populate('entries').lean().exec()
        if (!catalogue) {
            return res.status(400).json({ message: 'Catalogue not found - PUBLIC' })
        } 

        // Returns if PUBLIC
        if (catalogue && catalogue.privacy === 'PUBLIC' ) {
            return res.json(catalogue)
        } else if (catalogue && catalogue.privacy === 'PRIVATE') {
            return res.status(400).json({ message: 'UserId needed for PRIVATE' })
        } else {
            return res.status(409).json({ message: 'Catalogue not found' })
        }
    }
    

    // Return specific catalogue if catalogue ID rpovided - PRIVATE
    if (id && userId) {
        // Checks if catalogue exists
        const catalogue = await Catalogue.findById(id).populate('entries').lean().exec()
        if (!catalogue) {
            return res.status(400).json({ message: 'Catalogue not found - PRIVATE' })
        } 

        // Returns only if user ID is in owners list of catalogue
        if (catalogue.owner === ObjId(userId)) {
            return res.json(catalogue)
        } else {
            return res.status(400).json({ message: 'User does not have sufficient permissions' })
        }
    }


    // Query for catalogues
    // Return total num catalogues if size is true
    if (size) {
        const catalogues = !q ? await Catalogue.find().lean().exec() : await Catalogue.find({
                $or: [
                    { title: { $regex: `.*${q}.*`, $options: 'i' } }
                ]
            }).lean().exec()
        const resultSize = catalogues.length
        return res.json(resultSize)
    }

    // Query the catalogue pages
    if (q === undefined) {
        const catalogues = await Catalogue.find()
            .sort({ date: 1 })
            .skip(p * s)
            .limit(s)
            .exec()

        if (!catalogues || catalogues.length === 0) {
            return res.status(400).json({ message: 'Catalogues not found' })
        }
        return res.json(catalogues)
    }

    const catalogues = await Catalogue.find({
            $or: [
                { title: { $regex: `.*${q}.*`, $options: 'i' } }
            ]
        })
        .sort({ date: 1 })
        .skip(p * s)
        .limit(s)
        .exec()
    
    if (!catalogues || catalogues.length === 0) {
        return res.status(400).json({ message: 'Catalogues not found' })
    }
    return res.json(catalogues)
})



// @desc Create new catalogue
// @route POST /catalogues
// @access Private
const create = asyncHandler(async (req, res) => {
    const { title, ownerUsername, entries } = req.body

    // Confirm data
    if ( !title || !ownerUsername ) {
        return res.status(400).json({ message: 'A title and ownerUsername is required is required' })
    }

    // Check against illegal names
    if (title === 'Saved Books') {
        return res.status(400).json({ message: 'Illegal name, choose a different one' })
    }

    // Check that owner exists
    const owner = await User.findOne({ username: ownerUsername }).exec()
    if (!owner) {
        return res.status(400).json({ message: 'Owner not found' })
    }

    if (entries) {
        const checkedEntries = await Book.find({ _id: { $in: entries.map(entry => new ObjId(entry)) } }).lean().exec()
        // Check that all entries exist 
        if (checkedEntries?.length !== entries?.length) {
            return res.status(400).json({ message: `Entry(s) not found` })
        }
    }

    // Check for duplicates
    const duplicate = await Catalogue.findOne({ 'title': title }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: `Duplicate title found ${title}` })
    }

    // init entries
    let entriesObjIds
    if (entries) {
        entriesObjIds = [ ... entries?.map(entry => new ObjId(entry)) ]
    } else {
        entriesObjIds = []
    }

    // init Date obj
    const currentDate = new Date()

    const catalogueObj = { 
        'title': title, 
        'privacy': 'PUBLIC', 
        'entries': entriesObjIds, 
        'owner': ownerUsername,
        'date': currentDate
    }
    const catalogue = await Catalogue.create({ ...catalogueObj })

    const updatedUser = await User.updateOne(
        { username: ownerUsername },
        { $push: { catalogues: catalogue._id } }
    )
    if (!updatedUser) {
        return res.status(400).json({ message: 'Error updating owner catalogue list' })
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
    const { id, title, privacy, addEntries, delEntries, color } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: `An id is required` })
    }

    // Check that catalogue exists
    const catalogue = await Catalogue.findById(id).exec()
    if (!catalogue) {
        return res.status(400).json({ message: 'Catalogue not found'})
    }
    
    // Check against illegal names
    if (title && title === 'Saved Books') {
        return res.status(400).json({ message: 'Illegal name, choose a different one' })
    } else if (title && (catalogue.title === 'Saved Books')) {
        return res.status(400).json({ message: 'Cannot modify title of Saved Books' })
    }

    if (title) {     
        // Check for any duplicates of the new title
        const duplicate = await Catalogue.findOne({ title: title }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate title' })
        }
    }

    // Check that priivacy follows enum of 'PUBLIC', 'PRIVATE'
    const PRIVACY_ENUMS = ['PUBLIC', 'PRIVATE']
    if (privacy && !PRIVACY_ENUMS.includes(privacy)) {
        return res.status(400).json({ message: `${privacy} not valid. Must be either 'PUBLIC' or 'PRIVATE'`})
    }
    
    // Update info
    if (title) catalogue.title = title
    if (privacy) catalogue.privacy = privacy
    if (addEntries) {
        // Check that all entries exist
        const checkedEntries = await Book.find({ _id: { $in: addEntries.map(entry => new ObjId(entry)) } }).lean().exec()
        if (checkedEntries?.length !== addEntries?.length) {
            return res.status(400).json({ message: `Entry(s) not found` })
        }
        // Make sure there are no duplicates
        const filteredEntries = addEntries.filter(entry => !catalogue.entries.some(e => e.equals(new ObjId(entry))));
        // If entries are left, add them
        if (filteredEntries?.length) {
            catalogue.entries = [...catalogue.entries, ...filteredEntries.map(entry => new ObjId(entry))];
        }
    }
    if (delEntries) {
        // Check that all entries exist 
        const checkedEntries = await Book.find({ _id: { $in: delEntries.map(entry => new ObjId(entry)) } }).lean().exec()
        if (checkedEntries?.length !== delEntries?.length) {
            return res.status(400).json({ message: `Entry(s) not found` })
        }
        catalogue.entries = [ ...catalogue.entries.filter(entry => !delEntries.includes(entry.toString())) ]
    }
    if (!catalogue.date) catalogue.date = new Date()
    if (color) catalogue.color = color

    // Confirm update
    const updatedCatalogue = await catalogue.save()

    res.json({ message: `${updatedCatalogue.title} updated`})
})



// @desc Delete catalogue
// @route DELETE /catalogues
// @access Private
const remove = asyncHandler(async (req, res) => {
    const { id } = req.body

    if ( !id ) {
        return res.status(400).json({ message: 'Catalogue id and userId is required.'})
    }

    const catalogue = await Catalogue.findById(id).lean().exec()

    // Check for catalogue
    if (!catalogue) {
        return res.status(400).json({ message: `Catalogue not found` })
    } else if (catalogue.title === "Saved Books") {
        return res.sendStatus(400).json({ message: 'Illegal to delete "Saved Books" catalogue' })
    }

    //if (catalogue.owner !== new ObjId(userId) ) {
    //    return res.status(400).json({ message: 'User is not the owner of the catalogue' })
    //}

    // Delete from all other user's catalogue lists
    const objId = new ObjId(id)
    const updatedUsers = await User.updateMany({}, { $pull: { catalogues: objId }})
    if (!updatedUsers) {
        return res.status(400).json({ message: 'Catalogues of other users not updated with delete' })
    }

    const deletedCatalogue = await Catalogue.findByIdAndDelete(id).lean().exec()

    res.json({ message: `${deletedCatalogue.title} deleted` })
})




module.exports = {
    get,
    create,
    update,
    remove
}
