const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(usersController.get)
    .post( usersController.create)
    .patch(verifyJWT, usersController.update)
    .delete(verifyJWT, usersController.remove)

module.exports = router
