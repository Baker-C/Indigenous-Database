const Book = require('../schemas/Book')
const Catalogue = require('../schemas/Catalogue')
const Util = require('./util')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId.createFromHexString



// @desc Get a page of books
// @route GET /books
// @access Private
const get = async (req, res) => {
    /* pagination queries */
    const pageNumber = parseInt(req.query.p, 10) || 0
    const pageSize = parseInt(req.query.s, 10) || 20
    const getNumPages = req.query.getNumPages// boolean-esque, either undefined or not undefined
    /* end of pagination queries */

    /* search queries */
    const query = req.query.q || ""
    /* end of queries */

    // Get number of pages yielded by the query 
    if (getNumPages) {
        const numBooks = await Book
        .find({
            $or : [
                { 
                    author: { $regex: `.*${query}.*`, $options: 'i' } 
                },
                { 
                    title: { $regex: `.*${query}.*`, $options: 'i' } 
                },
            ]
        })
        .countDocuments()
        .lean()
        .exec()
        const numPages = Math.ceil(numBooks / pageSize)

        return res.status(200).json({ 
            numPages 
        })
    }

    // Query a single page of books
    const books = await Book
    .find({
        $or: [
            { 
                author: { $regex: `.*${query}.*`, $options: 'i' }
            },
            { 
                title: { $regex: `.*${query}.*`, $options: 'i' }
            },
        ]
    })
    .skip(pageNumber * pageSize)
    .limit(pageSize)
    .lean()
    .exec()

    if (!books?.length) {
        return res.status(400).json({ 
            message: 'Books not found' 
        })
    }

    return res.status(200).json({ 
        books 
    })
}



// @desc Create new book
// @route POST /books
// @access Private
const create = async (req, res) => {
    const { title, author, description, isbn, publishedDate, genre, coverImage, cost, link } = req.body
    
    // Confirm required data
    if ( !title || !author || !cost || !link ) {
        return res.status(400).json({ 
            message: 'A title, author, cost, and link are required' 
        })
    }

    // Check for duplicates
    const duplicate = await Book
    .findOne({
        $and: [
            { 
                author: { $regex: `^${author}$`, $options: 'i' }
            },
            { 
                title: { $regex: `^${title}$`, $options: 'i' }
            },
        ]
    })
    .exec()

    if (duplicate) {
        return res.status(409).json({ 
            message: 'Duplicate book found' 
        })
    }

    // Create book object
    const bookObj = { title, author, cost, link }

    if (description) {
        if (Util.descriptionOverMaxLength(description)) {
            return res.status(400).json({
                message: Util.descriptionOverMaxLength(description)
            })
        }
        bookObj.description = description
    }
    
    if (Util.validISBN(isbn)) bookObj.isbn = isbn

    if (publishedDate) bookObj.publishedDate = publishedDate

    const genres = Util.toArray(genre)
    if (genres?.length) bookObj.genres = genres

    if (coverImage) bookObj.coverImage = coverImage
    
    // Create book in database
    const book = await Book.create(bookObj)

    if (book) {
        res.status(201).json( book )
    } else {
        res.status(400).json({ 
            message: 'Error creating book: Invalid  data' 
        })
    }
}



// @desc Update book
// @route PATCH /books
// @access Private
const update = async (req, res) => {
    Util.trimWhitespace(req.body)

    const { id, title, author, description, isbn, publishedDate, genre, coverImage, cost, link } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ 
            message: 'An id is required to update' 
        })
    }

    if (Util.invalidObjId(id)) {
        return res.status(400).json({
            message: 'Invalid book id.'
        })
    }

   const book = await Book
   .findById( id )
   .exec()

    if (!book) {
        return res.status(400).json({ 
            message: 'Book not found'
        })
    }

    // change the check for duplicates
    if ( !(title == book.title) || !(author == book.author) ) {
        const duplicate = await Book
        .findOne({
            $and: [
                { 
                    author: { $regex: `.*${author}.*`, $options: 'i' }
                },
                { 
                    title: { $regex: `.*${title}.*`, $options: 'i' }
                },
            ]
        })
        .exec()
        if (duplicate) {
            return res.status(409).json({ 
                message: 'Duplicate title and author found' 
            })
        }
    }

    // Update book info if given
    if (title) book.title = title
    
    if (author) book.author = author

    if (description) {
        if (Util.descriptionOverMaxLength(description)) {
            return res.status(400).json({
                message: Util.descriptionOverMaxLength(description)
            })
        }
        book.description = description
    }

    if (Util.validISBN(isbn)) book.isbn = isbn

    if (publishedDate) book.publishedDate = publishedDate

    const genres = Util.toArray(genre)
    if (genres?.length) book.genres = genres

    if (coverImage) book.coverImage = coverImage

    if (cost) book.cost = Util.parseCost(cost)

    if (link) book.link = link

    // Confirm update
    const updatedBook = await book.save()

    if (!updatedBook) {
        return res.status(400).json({
            message: 'Error updating book'
        })
    }

    res.status(200).json( updatedBook )
}



// @desc Delete book
// @route DELETE /books
// @access Private
const remove = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ 
            message: 'Book id is required.'
        })
    }

    if (Util.invalidObjId(id)) {
        return res.status(400).json({
            message: 'Invalid book id.'
        })
    }

    //  Delete book from all catalogues
    await Catalogue
    .updateMany({}, { 
        $pull: { 
            entries: ObjId(id) 
        }
    })

    // Delete book
    const deletedBook = await Book
    .findByIdAndDelete( id )
    .lean()
    .exec()

    if (!deletedBook) {
        return res.status(400).json({ 
            message: `Book not found` 
        })
    }

    res.status(200).json( deletedBook )
}


module.exports = {
    get,
    create,
    update,
    remove
}
