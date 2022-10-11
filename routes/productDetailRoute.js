const router = require('express').Router()
const { createProductDetail, getAllProductDetails, getProductDetaiById, deleteProductDetail } = require('../controllers/productDetailController')

// get all product detail
router.get('/get-all-product-detail', getAllProductDetails);

// get product detail by id
router.get('/get-product-detail-by-id', getProductDetaiById);

//create product detail
router.post('/create-product-detail', createProductDetail)

// delete a product detail
router.delete('/delete-product-detail', deleteProductDetail)

module.exports = router