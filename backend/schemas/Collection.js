const mongoose = require('mongoose')
const { Schema } = mongoose;

const collectionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    entries: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }]
})

module.exports = mongoose.model('Collection', collectionSchema) 