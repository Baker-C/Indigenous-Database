const express = require('express')
const router = express.Router()
const groupsController = require('../controllers/groupsController.js')
const verifyJWT = require('../middleware/verifyJWT')

// adds to all routes
// router.use(verifyJWT)

router.route('/')
    .get(groupsController.get)
    .post(groupsController.create)
    .patch(groupsController.update)
    .delete(groupsController.remove)

module.exports = router