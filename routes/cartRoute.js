const cartRouter = require('express').Router()
const cartController = require('../controllers/cartController')

// cart page
cartRouter.get('/', cartController.renderCart)

// get detail cart
cartRouter.get('/detailCart', cartController.detailCart)

// create cart
cartRouter.post('/', cartController.createCart)

// update cart
// cartRouter.put('/', cartController.updateCart)

// delete cart
// cartRouter.delete('/', cartController.deleteCart)



// get cart
cartRouter.get('/api', cartController.getAllCart)

// put cart
cartRouter.put('/api/:id', cartController.updateCart)

cartRouter.delete('/api/:id', cartController.deleteCart)


module.exports = cartRouter
