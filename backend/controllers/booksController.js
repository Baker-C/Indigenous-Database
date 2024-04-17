const Book = require('../models/Book')
const asyncHandler = require('express-async-handler')

const Genres = { fiction, nonfiction, historical, childrens,  }

// @desc Get all books
// @route GET /books
// @access Private
const getAll = asyncHandler(async (req, res) => {
    const books = await Book.find().select('-bookID').lean()
    if (!books) {
        return res.status(400).json({ message: 'No books found' })
    }
    res.json(books)
})

// @desc Create new book
// @route POST /books
// @access Private
const create = asyncHandler(async (req, res) => {
    const { title, author, year } = req.body

    // Confirm data
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required' })
    }

    //Check for duplicates
    const duplicate = await Book.findOne({ title, author }).lean().exec()
    if (duplicate) {
        return res.status(400).json({ message: 'Duplicate entry found from Title and Author' })
    }

    const bookObj = { title, author, year }

    if (bookObj) {
        res.status(201).json({ message: `New book ${title} created` })
    } else {
        res.status(400).json({ message: 'Error creating book: Invalid book data recieved' })
    }
})

// @desc Update book
// @route PATCH /books
// @access Private
const update = asyncHandler(async (req, res) => {
    const { title, author, year, genres } = req.body

    // Confirm data
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required' })
    }

    const book = await Book.findOne({ title, author }).exec()

    if (!book) {
        return res.status(400).json({ message: 'Book not found'})
    }

    book.title = title
    book.author = author
    book.year = year
    book.genres = genres

    // Confirm update
    const updatedBook = await book.save()

    res.json({ message: `${updatedBook.ttile} updated`})
})


// updateGenres ?? req.body includes either "add" or "delete"

// @desc Update book genres
// @route PATCH /books
// @access Private
const addGenres = asyncHandler(async (req, res) => {
    const { title, author, genres } = req.body

    // Confirm data
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required' })
    }

    const book = await Book.findOne({ title, author }).exec()

    if (!book) {
        return res.status(400).json({ message: 'Book not found'})
    }
    /*
    add new genres to genre list if not already present
    need to make a list of possible genres
    - maybe do this through another API endpoint and schema?
    -- find how to link them
    - otherwise just do const list in codebase
    */
    book.genres = genres

    // Confirm update
    const updatedBook = await book.save()

    res.json({ message: `${updatedBook.ttile} updated`})
})

// @desc Update book genres
// @route PATCH /books
// @access Private
const deleteGenres = asyncHandler(async (req, res) => {
    const { title, author, genres } = req.body

    // Confirm data
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required' })
    }

    const book = await Book.findOne({ title, author }).exec()

    if (!book) {
        return res.status(400).json({ message: 'Book not found'})
    }
    /*
    remove given genres from genre list if not already present
    add message in res if a genre is not found
    - give list of all not found?
    */
    book.genres = genres

    // Confirm update
    const updatedBook = await book.save()

    res.json({ message: `${updatedBook.ttile} updated`})
})

// @desc Delete book
// @route DELETE /books
// @access Private
const deleteBook = asyncHandler(async (req, res) => {
    const { title, author } = req.body

    if (!title || !author) {
        return res.status(400).json({ message: 'Book title & author is required'})
    }

    const book = await Book.findByOne({title, author}).exec()

    // Check for book
    if (!book) {
        return res.status(400).json({ message: 'Book not found' })
    }

    const deletedBook = await Book.findOneAndDelete().lean()

    res.json({ message: `Book ${deletedBook.title} by ${deletedBook.author} deleted` })
})

module.exports = {
    getAll,
    create,
    update,
    addGenres,
    deleteGenres,
    deleteBook
}