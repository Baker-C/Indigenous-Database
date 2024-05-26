const express = require('express')
const router = express.Router()
const cataloguesController = require('../controllers/catalogueController.js')

router.route('/')
    .get(cataloguesController.get)
    .post(cataloguesController.create)
    .patch(cataloguesController.update)
    .delete(cataloguesController.remove)

module.exports = router