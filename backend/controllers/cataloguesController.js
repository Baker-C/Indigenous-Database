const Catalogue = require('../schemas/Catalogue')
const User = require('../schemas/User')
const Book = require('../schemas/Book')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId.createFromHexString

// reserved name used for all saved entries
const savedName = 'My Saved' 
// default catalogue for all users



// @desc Get a single catalogue
// @route GET /catalogues
// @access Private
const get = async (req, res) => {
    const { id, userId } = req.body

    // check for provided info
    if (!(id || userId)) {
        return res.status(400).json({ message: 'Must provide either catalogue id or user id.' })
    }
    
    // Return specific catalogue if catalogue id provided
    if (id) {
        // checks if catalogue exists
        const catalogue = await Catalogue
        .findById(id)
        .populate('entries')
        .lean()
        .exec()

        if (!catalogue) {
            return res.status(400).json({ message: 'Catalogue not found' })
        } 

        return res.status(200).json({ ...catalogue })
    }

    // Return all catalogues of a user if user ID is specified
    // check if user exists
    const user = await User
    .findById(userId)
    .select('catalogues')
    .populate({ 
        path: 'catalogues', 
        populate: { 
            path: 'entries' 
        }
    })
    .lean()
    .exec()

    if (!user) {
        return res.status(400).json({ message: `User ${userId} not found` })
    }

    return res.status(200).json({ ...user.catalogues })

}



// @desc Create new catalogue
// @route POST /catalogues
// @access Private
const create = async (req, res) => {
    const { name, ownerId, entries } = req.body

    // Confirm data
    if ( !ownerId ) {
        return res
        .status(400)
        .json({ 
            message: 'An ownerId is required'
        })
    }

    // Check that owner exists
    const owner = await User
    .findById(ownerId)
     .exec()

    if (!owner) {
        return res
        .status(400)
        .json({ 
            message: 'Owner not found' 
        })
    }
    
    let entriesObjIds = []
   
    // Check that entries exist
    if (entries) {
        // check that entries are in an array format
        if (!entries?.isArray()) {
            return res
            .status(400)
            .json({ 
                message: 'Entries must be in an array format (e.g. [ entry 01, ... ])' 
            })
        }
        
        entriesObjIds = entries.map(entry =>  ObjId(entry))

        const checkedEntries = await Book
        .find({ 
            _id: { 
                $in: entriesObjIds 
            } 
        })
        .lean()
        .exec()

        if (checkedEntries?.length !== entriesObjIds?.length) {
            return res
            .status(400)
            .json({ 
                message: `Entry(s) not found` 
            })
        }
    }

    let initialName
    // set initial name
    if (!name) {
        initialName = `Untitiled ${owner?.catalogues.length + 1}`
    } else {
        initialName = name
    }

    // create catalogue
    const catalogueObj = { 
        'name': initialName, 
        'owner': ownerId,
        'entries': entriesObjIds 
    }
    const catalogue = await Catalogue
    .create({ 
        ...catalogueObj 
    })

    if (!catalogue) {
        return res
        .status(400)
        .json({
            message: 'Error creating catalogue'
        })
    }

    // update user's catalogue list
    const updatedUser = await User
    .updateOne({ 
        _id: ownerId
    },
    { 
        $push: { 
            catalogues: catalogue._id 
        }
    })

    if (!updatedUser) {
        return res
        .status(400)
        .json({ 
            message: 'Error updating owner catalogue list' 
        })
    }

    return res
    .status(201)
    .json({ 
        message: `New catalogue ${title} id: ${catalogue._id} created` 
    })
}



// @desc Update catalogue
// @route PATCH /catalogues
// @access Private
const update = async (req, res) => {
    const { id, name, description, addEntries, delEntries, color } = req.body

    // Confirm data
    if (!id) {
        return res
        .status(400)
        .json({ 
            message: `An id is required` 
        })
    }

    // Check that the catalogue exists
    const catalogue = await Catalogue
    .findById(id)
    .exec()
    
    if (!catalogue) {
        return res
        .status(400)
        .json({ 
            message: 'Catalogue not found'
        })
    }
    
    // Check against illegal names
    if (title && (title === savedName)) {
        return res
        .status(400)
        .json({ 
            message: 'Illegal name, choose a different one' 
        })
    }

    // update catalogue info

    if (title) catalogue.title = title
    
    // check and add new entries
    if (addEntries) {

        // get object ids
        const addObjIds = addEntries.map(entry => 
            ObjId(entry)
        )

        // filter out the ids that are already in the list
        const filteredObjIds = addObjIds.filter(addObjId => 
            !catalogue.entries.includes(addObjId)
        )

        // Check that all entries exist
        const checkedEntries = await Book
        .find({ 
            _id: { 
                $in: filteredObjIds
            } 
        })
        .lean()
        .exec()

        if (filteredObjIds?.length !== checkedEntries?.length) {
            return res
            .status(400)
            .json({ 
                message: `Entry(s) not found` 
            })
        }

        // If entries are left, add them
        if (filteredObjIds?.length) {
            catalogue.entries = [ ...catalogue.entries, ...filteredObjIds ]
        }
    }

    // check and delete given entries
    if (delEntries) {

        // get object ids
        const delObjIds = delEntries.map(entry => ObjId(entry))

         // filter out the ids that are not in the list
         const filteredObjIds = delObjIds.filter(delObjId => 
            catalogue.entries.includes(delObjId)
        )

        // Check that all entries exist
        const checkedEntries = await Book
        .find({ 
            _id: { 
                $in: filteredObjIds
            } 
        })
        .lean()
        .exec()

        if (filteredObjIds?.length !== checkedEntries?.length) {
            return res
            .status(400)
            .json({ 
                message: `Entry(s) not found` 
            })
        }

        // if any are still matching, delete them
        catalogue.entries = [ ...catalogue.entries.filter(entryObjId => 
            !filteredObjIds.includes(entryObjId)
        )]
    }

    if (color) catalogue.color = color

    catalogue.lastUpdated = Date.now()

    // update catalogue
    const updatedCatalogue = await catalogue.save()

    return res
    .json({ 
        message: `${updatedCatalogue.title} updated`
    })
}



// @desc Delete catalogue
// @route DELETE /catalogues
// @access Private
const remove = async (req, res) => {
    const { id } = req.body

    if ( !id ) {
        return res
        .status(400)
        .json({ 
            message: 'Catalogue id and userId is required.'
        })
    }

    // Check for catalogue
    const catalogue = await Catalogue
    .findById(id)
    .lean()
    .exec()

    if (!catalogue) {
        return res
        .status(400)
        .json({ 
            message: `Catalogue not found` 
        })
    } else if (catalogue.title === savedName) {
        return res
        .status(400)
        .json({ 
            message: `Illegal to delete ${savedName} catalogue` 
        })
    }

    // Delete from all users' catalogue lists
    const updatedUsers = await User
    .updateMany({}, {
        $pull: {
            catalogues: ObjId(id) 
        }
    })

    if (updatedUsers.modifiedCount === 0) {
        return res
        .status(400)
        .json({ message: 'Catalogues of users not updated with delete' })
    }

    // delete catalogue
    const deletedCatalogue = await Catalogue
    .findByIdAndDelete(id)
    .lean()
    .exec()

    if (!deletedCatalogue) {
        return res
        .status(400)
        .json({
            message: 'Error when deleting catalogue'
        })
    }

    return res.status(200)
    .json({
        message: `${deletedCatalogue.title} deleted`
    })
}



module.exports = {
    get,
    create,
    update,
    remove
}
