const checkoutRouter = require('express').Router()
const checkoutController = require('../controllers/checkoutController')

// order page
checkoutRouter.get('/', checkoutController.renderOrder)

// get detail order
checkoutRouter.get('/detailOrder', checkoutController.detailOrder)

// create order
checkoutRouter.post('/', checkoutController.createOrder)
checkoutRouter.put('/create', checkoutController.create_Order)     // add products 

module.exports = checkoutRouter
