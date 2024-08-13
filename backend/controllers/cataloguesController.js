const Catalogue = require('../schemas/Catalogue')
const User = require('../schemas/User')
const Book = require('../schemas/Book')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId

// @desc Get a single catalogue
// @route GET /catalogues
// @access Private
const get = async (req, res) => {
    const id = req.query.id
    const q = req.query.q // search query
    const userId = req.query.userId

    
    // Return specific catalogue if catalogue ID provided
    if (id) {
        // Checks if catalogue exists
        const catalogue = await Catalogue.findById(id).populate('entries').lean().exec()
        if (!catalogue) {
            return res.status(400).json({ message: 'Catalogue not found' })
        } 

        return res.json(catalogue)
    }

    let catalogues

    if (userId) {

        // Return all catalogues of a users catalogues list if user ID is specified
        if (q !== undefined) {
            const user = await User.findById(userId)
            .select('-password')
            .populate({ 
                path: 'catalogues',
                    match: { title: { $regex: `.*${q}.*`, $options: 'i' } },
                    populate: { path: 'entries' }
            })
            .lean().exec()

            if (!user) return res.status(400).json({ message: `User ${userId} not found` })
            catalogues = user.catalogues

        } else {

            const user = await User.findById(userId)
            .select('-password')
            .populate({ 
                path: 'catalogues',
                    populate: { path: 'entries' }
            })
            .lean().exec()

            if (!user) return res.status(400).json({ message: `User ${userId} not found` })
            catalogues = user.catalogues
        }

    } else {

        // if no userId is specified
        if (q !== undefined) {
            catalogues = await Catalogue.find({ 
                title: { $regex: `.*${q}.*`, $options: 'i' },
                owner: userId
             })
            .sort({ date: 1 })
            .skip(p * s)
            .limit(s)
            .exec()

        } else {

            catalogues = await Catalogue.find()
            .sort({ date: 1 })
            .skip(p * s)
            .limit(s)
            .exec()
        }
    }

    if (!catalogues) {
        return res.status(400).json({ message: 'Catalogues not found' })
    }
    return res.json(catalogues)
}



// @desc Create new catalogue
// @route POST /catalogues
// @access Private
const create = async (req, res) => {
    const { ownerUsername, entries } = req.body

    // Confirm data
    if ( !ownerUsername ) {
        return res.status(400).json({ message: 'An ownerUsername is required' })
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

    // init entries
    let entriesObjIds
    if (entries) {
        entriesObjIds = [ ... entries?.map(entry => new ObjId(entry)) ]
    } else {
        entriesObjIds = []
    }

    // set initial title
    const title = `Untitiled ${owner?.catalogues.length + 1}`

    const catalogueObj = { 
        'title': title, 
        'entries': entriesObjIds, 
        'owner': ownerUsername,
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
        res.status(201).json({ message: `New catalogue ${title} id: ${catalogue._id} created` })
    } else {
        res.status(400).json({ message: 'Error creating catalogue: Invalid catalogue data recieved' })
    }
}

// @desc Update catalogue
// @route PATCH /catalogues
// @access Private
const update = async (req, res) => {
    const { id, title, addEntries, delEntries, color } = req.body

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
    if (title && (title === 'Saved Books' || title.includes('Untitled'))) {
        return res.status(400).json({ message: 'Illegal name, choose a different one' })
    } else if (title && (catalogue.title === 'Saved Books')) {
        return res.status(400).json({ message: 'Cannot modify title of "Saved Books"' })
    }

    if (title) {     
        // Check for any duplicates of the new title
        const duplicate = await Catalogue.findOne({ title: title }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate title' })
        }
        catalogue.title = title
    }
    
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
    if (color) catalogue.color = color

    catalogue.lastUpdated = Date.now()
    // Confirm update
    const updatedCatalogue = await catalogue.save()

    res.json({ message: `${updatedCatalogue.title} updated`})
}



// @desc Delete catalogue
// @route DELETE /catalogues
// @access Private
const remove = async (req, res) => {
    const { id } = req.body

    if ( !id ) {
        return res.status(400).json({ message: 'Catalogue id and userId is required.'})
    }

    const catalogue = await Catalogue.findById(id).lean().exec()

    // Check for catalogue
    if (!catalogue) {
        return res.status(400).json({ message: `Catalogue not found` })
    } else if (catalogue.title === "Saved Books") {
        return res.status(400).json({ message: 'Illegal to delete "Saved Books" catalogue' })
    }

    // Delete from all other users' catalogue lists
    const updatedUsers = await User.updateMany({}, { $pull: { catalogues: new ObjId(id) } })
    if (updatedUsers.modifiedCount === 0) {
        return res.status(400).json({ message: 'Catalogues of other users not updated with delete' })
    }

    const deletedCatalogue = await Catalogue.findByIdAndDelete(id).lean().exec()

    res.json({ message: `${deletedCatalogue.title} deleted` })
}




module.exports = {
    get,
    create,
    update,
    remove
}
