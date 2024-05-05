const mongoose = require('mongoose')
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
})

/*
for when I get it working, this is waiting
    genre: [{
        type: String,
        enum: ['Childrens', 'Young adult', 'Historical',  'Fiction', 'Non-fiction', 'Bibliography', 'Autobiography', 'Poetry', 'Cookbook', 'Spirituality', 'Novel', 'Tale'],
        message: 'Genres to choose from: Childrens, Young adult, Historical, Fiction, Non-fiction, Bibliography, Autobiography, Poetry, Cookbook, Spirituality, Novel, Tale.'
    }]
*/

module.exports = mongoose.model('Book', bookSchema) 