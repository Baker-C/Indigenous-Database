const express = require('express')
const router = express.Router()
const collectionController = require('../controllers/collectionController')

router.route('/')
    .get(collectionController.get)
    .post(collectionController.create)
    .patch(collectionController.update)
    .delete(collectionController.remove)

module.exports = router