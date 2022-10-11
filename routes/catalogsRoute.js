const router = require("express").Router();
const controller = require("../controllers/catalogsController");

// get one detail product
router.get("/detail/:id", controller.getProductDetail);

router.get('/', controller.getFilter)
router.post('/', controller.renderProduct)

router.post('/detail/:id',controller.getVariantTotal);
router.post('/detail',controller.getAllInfoProduct)

//add cart
router.put('/add',controller.addToCart)

module.exports = router;
