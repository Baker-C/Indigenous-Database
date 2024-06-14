const mongoose = require('mongoose')
const { Schema } = mongoose

const groupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Group', groupSchema) 