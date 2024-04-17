const express = require('express')
const router = express.Router()
const booksController = require('../controllers/booksController')

router.route('/')
    .get(booksController.getAll)
    .post(booksController.create)
    .patch(booksController.update)
    .patch(booksController.addGenres)
    .patch(booksController.deleteGenres)
    .delete(booksController.deleteBook)

module.exports = router
