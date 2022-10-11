const router = require('express').Router()
const controller =  require('../controllers/adminController')
const {checkAdmin} = require('../middlewares/checkAdmin')
const upload = require('../middlewares/uploadImgOfUser')

router.use(checkAdmin)

// render dashboard
router.get('/', controller.adminDashboard)

// render products
router.get('/products', controller.adminProducts)

// add product
router.get('/add-product', controller.adminAddProduct)

// see and edit product
router.get('/products/:id', controller.adminEditProduct)

// router.get('/products/:id', controller.adminEditProductCode)

// customers
router.get('/customers', controller.adminCustomers)

// see and edit product
router.get('/customers/:id', controller.adminEditCustomer)



// order
router.get('/orders', controller.adminOrder)
router.get('/orders/:id', controller.adminDetailOrder)


// news
router.get('/news/:page', controller.getNews);
router.get('/news/', controller.getNews);

router.get('/add-news', controller.getAddNewPage);
router.get('/all-news/:page', controller.getAllNews);
router.post('/add-news', upload.single('banner'), controller.addNews);

router.get('/edit-news/:slug', controller.getEditNews);
router.put('/edit-news/:id', upload.single('banner'), controller.editNews)

router.delete('/delete-news/:id', controller.deleteNews)



// account
router.get('/account', controller.adminAccount)



// category
router.get('/categories', controller.adminGetCategories)
router.get('/add-category', controller.adminAddCategory)




module.exports = router