const router = require('express').Router()
const controller = require('../controllers/newsController');
const upload = require('../middlewares/uploadImgOfUser');

router.get('/:page',controller.getAllNews);
router.get('/',controller.getAllNews);

router.get('/detail/:slug',controller.getDetailNews);


router.post('/send-mail', controller.sendMail);
module.exports = router