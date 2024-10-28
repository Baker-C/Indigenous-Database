const mongoose = require('mongoose')
const { Schema } = mongoose;

const catalogueSchema = new Schema({
    name: {
        type: String,
        maxLength: [30, 'Name can not be more than 30 characters.'],
        required: true
    },
    description: {
        type: String,
        maxLength: [300, 'Description can not be longer than 300 characters.']
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
    updated: {
        type: Date,
        default: Date.now
    },
    color: {
        type: String,
        required: true,
        default: '#B0C4DE', // LightSteelBlue
        enum: [
            '#B0C4DE', // LightSteelBlue
            '#1E90FF', // DodgerBlue
            '#4682B4', // SteelBlue
            '#FFA07A', // LightSalmon
            '#FFB6C1', // LightPink
            '#EE82EE', // Violet
            '#2E8B57', // SeaGreen
            '#00FA9A'  // MediumSpringGreen
        ]
    }
})

module.exports = mongoose.model('Catalogue', catalogueSchema) 