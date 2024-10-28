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
        default: '',
        maxLength: [300, 'Description can not be longer than 300 characters.']
    },
    privacy: {
        type: String,
        default: 'CLOSED',
        enum: ['OPEN', 'CLOSED']
    },
    created: {
        type: Date,
        default: Date.now
    },
    members: {
        admins: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: [],
            required: true
        }],
        accepted: [{
            type: Schema.Types.ObjectId,
            default: [],
            ref: 'User'
        }],
        queued: [{
            type: Schema.Types.ObjectId,
            default: [],
            ref: 'User'
        }]
    }
})

module.exports = mongoose.model('Group', groupSchema) 