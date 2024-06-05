const express = require('express')
const router = express.Router()
const booksController = require('../controllers/booksController')

const verifyJWT = require('../middleware/verifyJWT')

// adds to all routes
// router.use(verifyJWT)

router.route('/')
    .get(booksController.get)
    .post(booksController.create)
    .patch(booksController.update)
    .delete(booksController.remove)

module.exports = router
