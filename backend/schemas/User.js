const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    roles: [{
        type: String,
        required: true,
        enum: ['Admin', 'User'],
        default: 'User'
    }],
    profile: {
        firstName: {
            type: String,
            required: true,
            maxLength: [20, 'Name cannot be longer than 20 characters.']
        },
        lastName: {
            type: String,
            required: true,
            maxLength: [20, 'Name cannot be longer than 20 characters.']
        },
        avatar: {
            type: String,
        }
    },
    catalogues: [{
        type: Schema.Types.ObjectId,
        ref: 'Catalogue'
    }],
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }]
})

module.exports = mongoose.model('User', userSchema) 
