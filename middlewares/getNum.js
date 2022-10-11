const Cart = require('../models/CartModel');
const jwt = require('jsonwebtoken')

module.exports.getLog = async (req, res, next) => {
    try {
        const user = req.user;
        if(user){
            const cartNum = await Cart.findOne({userId: user._id}).lean()
            res.locals.cartNum = {
                cartNum:cartNum
            }
            res.locals.logging = true;
        }else{
            res.locals.cartNum = {
                cartNum: {
                    products:[]
                }
            };
            res.locals.logging = false;
        }
        next()
    } catch (error) {
        console.log(error)
        next()
    }
}