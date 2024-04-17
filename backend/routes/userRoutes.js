const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

router.route('/')
    .get(usersController.getAll)
    .post(usersController.create)
    .patch(usersController.update)
    .delete(usersController.deleteUser)

module.exports = router
