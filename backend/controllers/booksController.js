const Book = require('../schemas/Book')
const asyncHandler = require('express-async-handler')




// @desc Get a single books
// @route GET /books
// @access Private
const get = asyncHandler(async (req, res) => {
    const { _id } = req.body

    // Return all if no ID specified
    if (!_id) {
        const books = await Book.find().lean().exec()
        if (books?.length) {
           return res.json(books)
        } else {
            return res.status(400).json({ message: 'No books found' })
        }
    }

    const book = await Book.findOne().lean().exec()
    if (!book) {
        return res.status(400).json({ message: 'Book not found' })
    }
    res.json(book)
})


// @desc Create new book
// @route POST /books
// @access Private
const create = asyncHandler(async (req, res) => {
    const { title, author } = req.body

    const titleUC = title.toUpperCase()
    const authorUC = author.toUpperCase()

    // Confirm data
    if ( !title || !author ) {
        return res.status(400).json({ message: 'A title and author are required' })
    }

    // Check for duplicates
    const duplicate = await Book.findOne({ "title": titleUC, "author": authorUC }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate book found' })
    }

    const bookObj = { "title": titleUC, "author": authorUC }
    const book = await Book.create(bookObj)

    // Check for created
    if (book) {
        res.status(201).json({ message: `New book title: ${title} id: ${book._id} created` })
    } else {
        res.status(400).json({ message: 'Error creating book: Invalid book data recieved' })
    }
})

// @desc Update book
// @route PATCH /books
// @access Private
const update = asyncHandler(async (req, res) => {
    const { _id, title, author } = req.body

    // Confirm data
    if ( !_id || !title || !author ) {
        return res.status(400).json({ message: 'An id, title, and author are required' })
    }

    const book = await Book.findOne({ id }).exec()
    if (!book) {
        return res.status(400).json({ message: 'Book not found'})
    }

    const titleUC = title.toUpperCase()
    const authorUC = author.toUpperCase()
    // Check for duplicate
    const duplicate = await Book.findOne({ "title": titleUC, "author": authorUC }).exec()
    // Allow updates to the original book
    if (duplicate && duplicate?.title.toString() == title && duplicate?.author.toString() == author) {
        return res.status(409).json({ message: 'Duplicate title and author' })
    }

    book.title = title
    book.author = author

    // Confirm update
    const updatedBook = await book.save()

    res.json({ message: `${updatedBook.title} updated`})
})

// @desc Delete book
// @route DELETE /books
// @access Private
const remove = asyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Book id is required.'})
    }

    const deletedBook = await Book.findByIdAndRemove(_id).lean().exec()

    // Check for book
    if (!deletedBook) {
        return res.status(400).json({ message: `Book not found` })
    }

    res.json({ message: `${deletedBook.title} deleted` })
})


module.exports = {
    get,
    create,
    update,
    remove
}
