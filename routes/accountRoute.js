const router = require('express').Router()
const controller = require('../controllers/accountController')
const upload = require('../middlewares/uploadImgOfUser');


//get account page
router.get('/', controller.getAccount)

router.put('/edit-info', controller.editInfoAccount)

router.put('/edit-pass', controller.editPasswordAccount)

router.put('/edit-avatar', upload.single('avatar'), controller.editAvatar)

router.delete('/cancel-order/:id', controller.cancelOrder)

module.exports = router
