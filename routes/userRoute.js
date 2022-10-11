const router = require('express').Router()
const controller = require('../controllers/userController')
const upload = require('../middlewares/uploadImgOfUser');
const userModel = require('../models/userModel');

// edit user
router.put('/:id', upload.single('avatar'), controller.editUser)

// delete user
router.delete('/:id', controller.deleteUser)

// get detail user
router.get('/:id', controller.getDetailUser)

// get all user
router.get('/', controller.getAllUser)

module.exports = router
