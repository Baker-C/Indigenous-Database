const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

router.route('/')
    .get(usersController.get)
    .post(usersController.create)
    .patch(usersController.update)
    .delete(usersController.remove)

module.exports = router
