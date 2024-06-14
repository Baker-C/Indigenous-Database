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
    owner: {
        type: String,
        required: true
    },
    entries: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    date: {
        type: Date,
        required: true
    },
    color: {
        type: String,
        required: true,
        default: 'LightSteelBlue',
        enum: ['LightSteelBlue', 'DodgerBlue', 'SteelBlue', 'LightSalmon', 'LightPink', 'Violet', 'DarkOrchid', 'SeaGreen', 'MediumSpringGreen']
    }
})

module.exports = mongoose.model('Catalogue', catalogueSchema) 