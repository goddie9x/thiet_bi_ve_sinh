const router = require('express').Router()
const controller = require('../controllers/productController')
const upload = require('../middlewares/uploadImgOfProduct')

// add productCode
router.post('/api/code', upload.array('images', 12), controller.addProductCode)

// add product from productCode
router.post('/api', controller.addProduct )

// edit product
router.put('/api/:id', upload.array('images', 12) ,controller.editProductCode)

// delete product
router.delete('/api/:id', controller.deleteProduct)

// delete product code
router.delete('/code/api/:id', controller.deleteProductCode)

// get all product, it can search and filter
router.get('/api', controller.getAllProduct)

// get one detail product
router.get('/api/:id', controller.getDetailProductCode)
router.get('/api/detail/:id', controller.getDetailProduct)

// get product from productCodeId+size+color
router.put('/detail', controller.getDetail_Product)

router.get('/add/:id', controller.userAddProduct)
// =============================================================================
router.post('/create-product-code', controller.createProductCode)

module.exports = router