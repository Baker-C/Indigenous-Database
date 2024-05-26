const mongoose = require('mongoose')
const { Schema } = mongoose;

const catalogueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    privacy: {
        type: String,
        enum: ['PUBLIC', 'PRIVATE'],
        default: 'PUBLIC'
    },
    owners: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    entries: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }]
})

module.exports = mongoose.model('Catalogue', catalogueSchema) 