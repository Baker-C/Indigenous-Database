const express = require('express')
const router = express.Router()
const booksController = require('../controllers/booksController')

router.route('/')
    .get(booksController.get)
    .post(booksController.create)
    .patch(booksController.update)
    .delete(booksController.remove)

module.exports = router
