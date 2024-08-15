const mongoose = require('mongoose')
const { Schema } = mongoose

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: [30, 'Name can not be more than 30 characters.'],
        required: true
    },
    description: {
        type: String,
        maxLength: [300, 'Description can not be longer than 300 characters.']
    },
    created: {
        type: Date,
        default: Date.now
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Group', groupSchema) 