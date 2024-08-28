const mongoose = require('mongoose')
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    author: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        maxLength: [300, 'Description can not exceed 300 characters.']
    },
    isbn: {
        type: String,
        index: true,
        sparse: true
    },
    publishedDate: {
        type: Date
    },
    genre: [{
        type: String,
        enum: ['Childrens', 'Young adult', 'Historical',  'Fiction',  'Non-fiction', 'Bibliography', 'Autobiography', 'Poetry',  'Cookbook', 'Spirituality', 'Novel', 'Tale'],
    }],
    coverImage: {
        type: String
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    link: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Book', bookSchema) 