const mongoose = require('mongoose')
const { Schema } = mongoose;

const catalogueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    entries: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    created: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    color: {
        type: String,
        required: true,
        default: 'LightSteelBlue',
        enum: ['LightSteelBlue', 'DodgerBlue', 'SteelBlue', 'LightSalmon', 'LightPink', 'Violet', 'SeaGreen', 'MediumSpringGreen']
    }
})

module.exports = mongoose.model('Catalogue', catalogueSchema) 