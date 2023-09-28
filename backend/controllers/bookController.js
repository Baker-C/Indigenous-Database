const Book = require('../models/Book')
const asyncHandler = require('express-async-handler')

// @desc Get all books
// @route GET /books
// @access Private
const getAllBooks = asyncHandler(async (req, res) => {
    const books = await User.find().select('-bookID').lean()
    if (!books) {
        return res.status(400).json({ message: 'No books found' })
    }
    res.json(books)
})

// @desc Create new book
// @route POST /books
// @access Private
const createNewBook = asyncHandler(async (req, res) => {
    const { title, author, year, genre } = req.body

    // Confirm data
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required' })
    }

    //Check for duplicates
    const duplicate = await User.findOne()
})

// @desc Update book
// @route PATCH /books
// @access Private
const updateBook = asyncHandler(async (req, res) => {

})

// @desc Delete book
// @route DELETE /books
// @access Private
const deleteBook = asyncHandler(async (req, res) => {

})

module.exports = {
    getAllBooks,
    createNewBook,
    updateBook,
    deleteBook
}