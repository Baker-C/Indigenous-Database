const Group = require('../schemas/Group')
const User = require('../schemas/User')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId

// @desc Get a single group
// @route GET /groups
// @access Private
const get = async (req, res) => {
    const { id, title, userId } = req.query

    if (id && id !== 'undefined') {
        // Checks if group exists
        const group = await Group.findById(id).populate('members').lean().exec()
        if (!group) {
            return res.status(400).json({ message: 'Group not found' })
        } 
    }
    
    if (title && title !== 'undefined') {
        // Checks if group exists
        const group = await Group.findOne({ title: title }).populate('members').lean().exec()
        if (!group) {
            return res.status(400).json({ message: 'Group not found' })
        } 
    }

    if (userId && userId !== 'undefined') {
        // Checks if user exists
        const user = await User
        .findById(userId)
        .populate({ 
            path: 'groups',
            populate: {
                path: 'members'
            }
        })
        .lean()
        .exec()
        if (!user) {
            return res.status(400).json({ message: 'Group not found' })
        }
        return res.json(user.groups)
    }

    const groups = await Group.find().populate({ path: 'members', select: '-password' }).lean().exec()
    if (!groups.length) {
        return res.status(400).json({ message: 'Groups not found' })
    }
    return res.json(groups)
}



// @desc Create new group
// @route POST /groups
// @access Private
const create = async (req, res) => {
    const { title, userId } = req.body

    // Confirm data
    if ( !title || !userId ) {
        return res.status(400).json({ message: 'A title and userId is required' })
    }

    // Check that owner exists
    const user = await User.findById(userId).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicates
    const duplicate = await Group.findOne({ 'title': title }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: `Duplicate title found ${title}` })
    }

    const groupObj = { 
        'title': title, 
        'members': [new ObjId(userId)]
    }
    const group = await Group.create({ ...groupObj })

    const updatedUsers = await User.updateMany(
        { _id: userId },
        { $push: { groups: group._id } }
    )
    if (!updatedUsers) {
        return res.status(400).json({ message: 'Error updating user group list' })
    }

    // Check for created
    if (group) {
        res.status(201).json({ message: `New group title: ${title} id: ${group._id} created` })
    } else {
        res.status(400).json({ message: 'Error creating group: Invalid group data recieved' })
    }
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
