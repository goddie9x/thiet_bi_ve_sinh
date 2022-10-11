const router = require('express').Router()
const controller = require('../controllers/orderController')

// get all orders
router.get('/api', controller.getAllOrders)

// cancel order => change status of order
router.put('/api/:id/cancel', controller.cancelOrder)
router.put('/api/:id/delivery', controller.deliveryOrder)


module.exports = router