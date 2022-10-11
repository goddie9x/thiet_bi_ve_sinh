const router = require('express').Router()
const { createBrand, updateBrandName, deleteBrand, getAllBrand, getBrandById, deleteBrandByName, addBrandIntoCategory } = require('../controllers/brandController')
const upload = require('../middlewares/uploadImgOfUser');

// get all brand
router.get('/get-all-brand', getAllBrand);

// get brand by id
router.get('/get-brand-by-id/:brandId', getBrandById);

//create a new brand
router.post('/create-brand/:categoryId', createBrand)

// update the brand
router.patch('/update-brand/:brandId', updateBrandName)

//add brand to the category
router.patch('/add-brand-to-category/:brandId', addBrandIntoCategory)

// delete a brand
router.delete('/delete-brand/:brandId', deleteBrand)

// delete a brand by name
router.delete('/delete-brand-by-name', deleteBrandByName)

module.exports = router