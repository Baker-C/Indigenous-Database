const Book = require('../schemas/Book')
const asyncHandler = require('express-async-handler')
const User = require('../schemas/User')



// @desc Get a page of books
// @route GET /books
// @access Private
const get = asyncHandler(async (req, res) => {
    // size is a boolean to get total number of results instead of the actual results
    const { _id } = req.body
    const size = req.query.size // returning entire size of query
    const p = parseInt(req.query.p, 10) || 0 // page number
    const q = req.query.q // search query
    const s = parseInt(req.query.s, 10) || 50 // page size


    // Return single book if id is specified
    if (_id) {
        const book = await Book.findOne(_id).lean().exec()
        if (!book) {
            return res.status(400).json({ message: 'Book not found' })
        }
        res.json(book)
    }

    // Return num entries if size is true
    if (size) {
        const books = !q ? await Book.find().lean().exec() : await Book.find({
                $or: [
                    { author: { $regex: `.*${q}.*`, $options: 'i' } },
                    { title: { $regex: `.*${q}.*`, $options: 'i' } },
                ]
            }).lean().exec()
        const resultSize = books.length
        return res.json(resultSize)
    }


    // Query the book pages
    if (q === undefined) {
        const books = await Book.find()
            .sort({ author: 1 })
            .skip(p * s)
            .limit(s)
            .exec()

        if (!books) {
            return res.status(400).json({ message: 'Books not found' })
        }
        return res.json(books)
    }

    const books = await Book.find({
            $or: [
                { author: { $regex: `.*${q}.*`, $options: 'i' } },
                { title: { $regex: `.*${q}.*`, $options: 'i' } },
            ]
        })
        .skip(p * s)
        .limit(s)
        .exec()
    
    if (!books) {
        return res.status(400).json({ message: 'Books not found' })
    }
    return res.json(books)

})


// @desc Create new book
// @route POST /books
// @access Private
const create = asyncHandler(async (req, res) => {
    const { title, author } = req.body
    
    // Confirm data
    if ( !title || !author ) {
        return res.status(400).json({ message: 'A title and author are required' })
    }

    // Check for duplicates
    const duplicate = await Book.findOne({ title, author }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate book found' })
    }

    const bookObj = { title, author }
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
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Book id is required.'})
    }

    const deletedBook = await Book.findByIdAndRemove({ _id: id }).lean().exec()

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
