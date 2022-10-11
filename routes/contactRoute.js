const router = require('express').Router()
const controller = require('../controllers/contactController')

router.get('/', controller.getContact)

module.exports = router