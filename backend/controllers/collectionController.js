const Collection = require('../schemas/Collection')
const Book = require('../schemas/Book')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId

// @desc Get a single collection
// @route GET /collections
// @access Private
const get = asyncHandler(async (req, res) => {
    const { _id } = req.body

    // return all if no ID specified
    if (!_id) {
        const collections = await Collection.find().populate('entries').lean().exec()
        if (collections?.length) {
           return res.json(collections)
        } else {
            return res.status(400).json({ message: 'No collections found' })
        }
    }

    const collection = await Collection.findOne().populate('entries').lean().exec()

    if (!collection) {
        return res.status(400).json({ message: 'Collection not found' })
    } else {
        res.json(collection)
    }
})


// @desc Create new collection
// @route POST /collections
// @access Private
const create = asyncHandler(async (req, res) => {
    const { title } = req.body
    // going to add initial entries once it works
    const titleLC = title.toLowerCase()

    // Confirm data
    if ( !title ) {
        return res.status(400).json({ message: 'A title is required' })
    }

    // Check for duplicates
    const duplicate = await Collection.findOne({ 'title': titleLC }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate book found' })
    }

    const collectionObj = { 'title': titleLC, 'entries': [] }
    const collection = await Collection.create(collectionObj)

    // Check for created
    if (collection) {
        res.status(201).json({ message: `New collection title: ${title} id: ${collection._id} created` })
    } else {
        res.status(400).json({ message: 'Error creating collection: Invalid collection data recieved' })
    }
})

// @desc Update collection
// @route PATCH /collections
// @access Private
const update = asyncHandler(async (req, res) => {
    const { _id, title, entries } = req.body

    // Confirm data
    if ( !_id ) {
        return res.status(400).json({ message: 'An id is required' })
    }

    const collection = await Collection.findById( _id ).exec()
    if (!collection) {
        return res.status(400).json({ message: 'Collection not found'})
    }

    const newTitleLC = title.toLowerCase()

    const duplicate = await Collection.findOne({ "title": newTitleLC }).lean().exec()
    // Allow updates to the original collection
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate title' })
    }

    collection.title = newTitleLC
    collection.entries = entries.map(entry => new ObjId(entry))

    // Confirm update
    const updatedCollection = await collection.save()

    res.json({ message: `${updatedCollection.title} updated`})
})

// @desc Delete collection
// @route DELETE /collections
// @access Private
const remove = asyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Collection id is required.'})
    }

    const deletedCollection = await Collection.findByIdAndDelete(_id).lean().exec()

    // Check for collection
    if (!deletedCollection) {
        return res.status(400).json({ message: `Collection not found` })
    }

    res.json({ message: `${deletedCollection.title} deleted` })
})


module.exports = {
    get,
    create,
    update,
    remove
}
