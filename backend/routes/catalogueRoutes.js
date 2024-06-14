const express = require('express')
const router = express.Router()
const cataloguesController = require('../controllers/cataloguesController.js')
const verifyJWT = require('../middleware/verifyJWT')

// adds to all routes
// router.use(verifyJWT)

router.route('/')
    .get(cataloguesController.get)
    .post(cataloguesController.create)
    .patch(cataloguesController.update)
    .delete(cataloguesController.remove)

module.exports = router