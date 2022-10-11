const router = require('express').Router()
const { getAllCategory, getCategoryById, createCategory, updateCategoryName, deleteCategory } = require('../controllers/categoryController')
const upload = require('../middlewares/uploadImgOfUser');

//get all categories
router.get('/get-all-category', getAllCategory)

//get category by id
router.get('/get-category-by-id/:categoryId', getCategoryById)

//create a new category
router.post('/create-category', createCategory)

// update a category
router.patch('/update-category-name/:categoryId', updateCategoryName)

// delete a category
router.delete('/delete-category/:categoryId', deleteCategory)


module.exports = router