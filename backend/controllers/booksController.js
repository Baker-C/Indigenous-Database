const Book = require('../schemas/Book')


// @desc Get a page of books
// @route GET /books
// @access Private
const get = async (req, res) => {
    /* pagination queries */
    const pageNumber = parseInt(req.query.p, 10) || 0
    const getNumPages = req.query.getNumPages // boolean

    /* search queries */
    const query = req.query.q // search query

    /* end of queries */

    const pageSize = 100

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

        return res.json({numPages})
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
    
    if (!books) {
        return res.status(400).json({ message: 'Books not found' })
    }

    return res.json({books})
}



// @desc Create new book
// @route POST /books
// @access Private
const create = async (req, res) => {
    const { title, author, description, isbn, publishedDate, genre, coverImage, cost, link } = req.body
    
    // Confirm required data
    if ( !title || !author || !cost || !link ) {
        return res.status(400).json({ message: 'A title, author, cost, and link are required' })
    }

    // Check for duplicates
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
        return res.status(409).json({ message: 'Duplicate book found' })
    }

    // Create book object
    const bookObj = { title, author, cost, link }

    if (description) bookObj.description = description

    if (isbn) bookObj.isbn = isbn

    if (publishedDate) bookObj.publishedDate = publishedDate

    if (genre?.length && genre?.isArray()) {
        bookObj.genre = genre
    } else if (genre && !genre?.isArray()) {
        bookObj.genre = [ genre ]
    }

    if (coverImage) bookObj.coverImage = coverImage
    
    // Create book in database
    const book = await Book.create(bookObj)
    if (book) {
        res.status(201).json({ message: `New book title: ${title} id: ${book._id} created` })
    } else {
        res.status(400).json({ message: 'Error creating book: Invalid  data' })
    }
}



// @desc Update book
// @route PATCH /books
// @access Private
const update = async (req, res) => {
    const { id, title, author, description, isbn, publishedDate, genre, coverImage, cost, link } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'An id is required to update' })
    }

    // Confirm that book exists
   const book = Book
   .findById({ id })
   .exec()
    if (!book) {
        return res.status(400).json({ message: 'Book not found'})
    }



    // Check for duplicate if title or author are different
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
            return res.status(409).json({ message: 'Duplicate title and author found' })
        }
    }

    // Update book info if given
    if (title) book.title = title
    
    if (author) book.author = author

    if (description) book.description = description

    if (isbn) book.isbn = isbn

    if (publishedDate) book.publishedDate = publishedDate

    if (genre) book.genre = genre

    if (coverImage) book.coverImage = coverImage

    if (cost) book.cost = cost

    if (link) book.link = link

    // Confirm update
    const updatedBook = await book.save()

    //  !!!!!!!!!!!!!!!!! NEEDS AND ERROR CHECK HERE !!!!!!!!!!!!!!!!!!!!

    res.status(201).json({ message: `${updatedBook.title} updated`})
}



// @desc Delete book
// @route DELETE /books
// @access Private
const remove = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Book id is required.'})
    }

    //  Delete book from all catalogues
    const updatedUsers = await Catalogue
    .updateMany({}, { 
        $pull: { 
            entries: new ObjId(id) 
        }
    })

    // Delete book
    const deletedBook = await Book
    .findByIdAndRemove( id )
    .lean()
    .exec()
    if (!deletedBook) {
        return res.status(400).json({ message: `Book not found` })
    }

    res.json({ message: `${deletedBook.title} deleted` })
}


module.exports = {
    get,
    create,
    update,
    remove
}
