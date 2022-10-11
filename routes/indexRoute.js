const router = require("express").Router();
const controller = require("../controllers/homeController");

router.get('/', controller.getAllData)
router.post('/', controller.getSearchData)

router.get('/invoices/:id', controller.getDetailBill)


//exports
module.exports = router;
