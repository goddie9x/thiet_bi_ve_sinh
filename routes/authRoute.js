const router = require('express').Router()
const controller = require('../controllers/authController')
const upload = require('../middlewares/uploadImgOfUser')
const {checkLogging} = require('../middlewares/checkLogging')

// register
router.post('/register', upload.none(), controller.register)
router.get('/register', checkLogging ,controller.getRegister)

// login
router.post('/login', controller.login)
router.get('/login', checkLogging ,controller.getLogin)

module.exports = router
