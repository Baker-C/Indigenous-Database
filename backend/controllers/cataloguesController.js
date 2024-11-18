const Catalogue = require('../schemas/Catalogue')
const User = require('../schemas/User')
const Book = require('../schemas/Book')
const { userSavedCatalogue } = require('../schemas/Catalogue')
const mongoose = require('mongoose')
const { isValid } = require('date-fns')
const ObjId = mongoose.Types.ObjectId.createFromHexString
const isValidObjId = mongoose.Types.ObjectId.isValid



// @desc Get a single catalogue
// @route GET /catalogues
// @access Public
const get = async (req, res) => {
    const { ids } = req.body

    // check for provided info
    if (!ids) {
        return res
        .status(400)
        .json({ 
            message: 'Must provide either catalogue id or list of catalogue ids.'
        })
    }

    // Converts single arguments into array if not already
    const listIds = Array.isArray(ids) ? ids : (ids ? [ids] : [])
    
    // get object ids
    let catalogueObjIds
    try {
        catalogueObjIds = listIds.map(entry => 
            ObjId(entry)
        )
    } catch (err) {
        return res
        .status(400)
        .json({ 
            message: 'Catalogues contains a non-ObjId.' 
        })
    }

    // checks if catalogues exist
    const catalogue = await Catalogue
    .find({
        _id: { $in : catalogueObjIds }
    })
    .populate('entries')
    .lean()
    .exec()

    if (!catalogue) {
        return res
        .status(400)
        .json({ 
            message: 'Catalogue not found' 
        })
    } 

    return res
    .status(200)
    .json({ ...catalogue })
}



// @desc Create new catalogue
// @route POST /catalogues
// @access Private
const create = async (req, res) => {
    const { name, ownerId, entries } = req.body

    // Confirm data
    if ( !ownerId | !isValidObjId(ownerId) ) {
        return res
        .status(400)
        .json({ 
            message: 'A valid ownerId is required'
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
    if (entries?.length) {
        // Converts single arguments into array if not already
        const listEntries = Array.isArray(entries) ? entries : (entries ? [entries] : [])
        
        let entriesObjIds
        try {
            entriesObjIds = listEntries.map(entry => 
                ObjId(entry)
            )
        } catch (err) {
            return res
            .status(400)
            .json({ 
                message: 'Entries contains a non-ObjId.' 
            })
        }

        const checkedEntries = await Book
        .find({ 
            _id: { $in: entriesObjIds } 
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

    // set initial name
    initialName = name ? name : `Untitiled ${owner?.catalogues.length + 1}`

    // create catalogue
    const catalogueObj = { 
        'name': initialName, 
        'owner': ObjId(ownerId),
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
    .updateOne(
    {
        _id: ownerId 
    }, 
    { 
        $push: { catalogues: catalogue._id }
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
    if (!id | !isValidObjId(id)) {
        return res
        .status(400)
        .json({ 
            message: `A valid catalogue id is required` 
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
    if (name && (name === userSavedCatalogue)) {
        return res
        .status(400)
        .json({ 
            message: 'Illegal name, choose a different one' 
        })
    }

    if (name) catalogue.name = name

    if (description) catalogue.description = description
    
    // check and add new entries
    if (addEntries) {
        // Converts single arguments into array if not already
        const listEntries = Array.isArray(addEntries) ? addEntries : (addEntries ? [addEntries] : [])

        // get object ids
        let addObjIds
        try {
            addObjIds = listEntries.map(entry => 
                ObjId(entry)
            )
        } catch (err) {
            console.log(err)
            return res
            .status(400)
            .json({ 
                message: 'Add entries contains a non-ObjId.' 
            })
        }

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
        if (checkedEntries?.length) {
            catalogue.entries = [ ...catalogue.entries, ...filteredObjIds ]
        }
    }

    // check and delete given entries
    if (delEntries) {
        // Converts single arguments into array if not already
        const listEntries = Array.isArray(delEntries) ? delEntries : (delEntries ? [delEntries] : [])

        // get object ids
        let delObjIds
        try {
            delObjIds = listEntries.map(entry => ObjId(entry))
        } catch (err) {
            console.log(err)
            return res
            .status(400)
            .json({ 
                message: 'Del entries contains a non-ObjId.' 
            })
        }

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
    await catalogue.save()

    return res
    .status(204)
    .end()
}



// @desc Delete catalogue
// @route DELETE /catalogues
// @access Private
const remove = async (req, res) => {
    const { id } = req.body

    if ( !id | !isValidObjId(id) ) {
        return res
        .status(400)
        .json({ 
            message: 'Valid Catalogue id is required.'
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
    } else if (catalogue.name === userSavedCatalogue) {
        return res
        .status(400)
        .json({ 
            message: `Illegal to delete ${userSavedCatalogue} catalogue` 
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
        .json({
             message: 'Catalogues of users not updated with delete' 
        })
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

    return res
    .status(204)
    .end()
}



module.exports = {
    get,
    create,
    update,
    remove
}
