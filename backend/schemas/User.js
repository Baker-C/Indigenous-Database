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
    catalogues: [{
        type: Schema.Types.ObjectId,
        ref: 'Catalogue'
    }]
})

module.exports = mongoose.model('User', userSchema) 
