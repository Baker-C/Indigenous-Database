const Group = require('../schemas/Group')
const User = require('../schemas/User')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId

// @desc Get a single group
// @route GET /groups
// @access Private
const get = async (req, res) => {
    const { id } = req.query

    // Check for input info
    if (!id) {
        return res.status(400).json({ message: 'An id is required'})
    }

    // Checks if group exists
    const group = await Group
    .findById({id})
    .populate({
       path: 'admins',
       select: '-password'
    })
    .populate({ 
        path: 'members',
        select: '-password'
     })
    .lean()
    .exec()
    if (!group) {
        return res.status(400).json({ message: 'Group not found' })
    }

    return res.json(group)
}



// @desc Create new group
// @route POST /groups
// @access Private
const create = async (req, res) => {
    const { adminId, name, desecription } = req.body

    // Confirm data
    if ( !name || !adminId ) {
        return res.status(400).json({ message: 'A name and adminId are required' })
    }

    // Check that owner exists
    const user = await User
    .findById(adminId)
    .exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicates
    const duplicate = await Group
    .findOne({ 'name': name })
    .lean()
    .exec()
    if (duplicate) {
        return res.status(409).json({ message: `Duplicate name found ${name}` })
    }

    const groupObj = { 
        'name': name, 
        'members': {
            'admins': [new ObjId(adminId)]
        }
    }

    if (description) groupObj.description = description

    // Create group
    const group = await Group
    .create({ 
        ...groupObj 
    })
    if (!group) {
        return res.status(400).json({ message: 'Error creating group: Invalid group data recieved' })
    }

    // add to admin's group list
    const updatedUser = await User
    .update(
        { 
            _id: adminId
        },
        { 
            $push: { 
                groups: group._id 
            } 
        }
    )
    
    if (!updatedUser) {
        return res.status(400).json({ message: 'Error updating user group list' })
    }
    
    return res.status(201).json({ message: `New group title: ${name} id: ${group._id} created` })
}



// @desc Update group
// @route PATCH /groups
// @access Private
const update = async (req, res) => {
    const { id, title, addMembers, delMembers } = req.body

    // Confirm data
    if (!id && !title) {
        return res.status(400).json({ message: `An id or title is required` })
    }

    // Check that group exists
    const group = await Group.findById(id).exec()
    if (!group) {
        return res.status(400).json({ message: 'Group not found'})
    }
    

    if (title) {     
        // Check for any duplicates of the new title
        const duplicate = await Group.findOne({ title: title }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate title' })
        }
        group.title = title
    }
    

    if (addMembers) {
        // Check that all members exist
        const checkedMembers = await User.find({ _id: { $in: addMembers.map(user => new ObjId(user)) } }).lean().exec()
        if (checkedMembers?.length !== addMembers?.length) {
            return res.status(400).json({ message: `Member(s) not found` })
        }
        // Make sure there are no duplicates
        const filteredMembers = addMembers.filter(user => !group.members.some(e => e.equals(new ObjId(user))));
        // If members are left, add them
        if (filteredMembers?.length) {
            group.members = [...group.members, ...filteredMembers.map(user => new ObjId(user))];
        }
    }
    if (delMembers) {
        // Check that all members exist 
        const checkedMembers = await Group.find({ _id: { $in: delMembers.map(user => new ObjId(user)) } }).lean().exec()
        if (checkedMembers?.length !== delMembers?.length) {
            return res.status(400).json({ message: `Member(s) not found` })
        }
        group.members = [ ...group.members.filter(user => !delMembers.includes(user.toString())) ]
    }

    // Confirm update
    const updatedGroup = await group.save()

    res.json({ message: `${updatedGroup.title} updated`})
}



// @desc Delete group
// @route DELETE /groups
// @access Private
const remove = async (req, res) => {
    const { id } = req.body

    if ( !id ) {
        return res.status(400).json({ message: 'Catalogue id is required.'})
    }

    const group = await Group.findById(id).lean().exec()

    // Check for group
    if (!group) {
        return res.status(400).json({ message: `Group not found` })
    }

    // update user's groups
    const updatedGroups = await User.updateMany({}, { $pull: { groups: { _id: new ObjId(id) } }})
    if (!updatedGroups.nModified) {
        return res.status(400).json({ message: `Groups not updated with delete` })
    }

    const deletedGroup = await Group.findByIdAndRemove(id).lean().exec()
    if (!deletedGroup) {
        return res.status(400).json({ message: 'Failed to delete group' })
    }

    res.json({ message: `Group ${deletedGroup.title} deleted` })
}




module.exports = {
    get,
    create,
    update,
    remove
}
