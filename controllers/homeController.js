const ProductCode = require('../models/productCodeModel')
const jwt = require('jsonwebtoken')
const Cart = require('../models/CartModel')
const slides = require('../public/data/sliderData')
const cards = require('../public/data/cardData')
const Order = require('../models/OrderModel')
const Product = require('../models/productModel')

module.exports.getAllData = async (req, res) => {
	try {
		const products = await ProductCode.find().lean()
		// const arr = Array.from(Array(products.length).keys())

		// var hotIndexes = getRandom(arr, 4)
		// var newIndexes = getRandom(arr, 8)
		// var popularIndexes = getRandom(arr, 8)

		// function getRandom(arr, n) {
		// 	var result = new Array(n),
		// 		len = arr.length,
		// 		taken = new Array(len)
		// 	if (n > len)
		// 		throw new RangeError('getRandom: more elements taken than available')
		// 	while (n--) {
		// 		var x = Math.floor(Math.random() * len)
		// 		result[n] = arr[x in taken ? taken[x] : x]
		// 		taken[x] = --len in taken ? taken[len] : len
		// 	}
		// 	return result
		// }

		res.render('pages/home', {
			slides,
			cards,
			// hotIndexes,
			// newIndexes,
			// popularIndexes,
			products,
		})

		// res.render('pages/home')
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.getSearchData = async (req, res) => {
	try {
		const name = req.query.name
		// const products = await ProductCode.find({ name: { $regex: name, $options: 'i'} })
		const products = await ProductCode.find().lean()
		res.status(200).json({
			products,
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.getDetailBill = async (req, res) => {
	// try {
	var order = await Order.findById(req.params.id).lean()
	for (let product of order.products) {
		const pro = await Product.findById(product.productId)

		if (!pro) {
			product.name = 'Sản phẩm đã bị xóa'
			product.price = 0
		} else {
			const productCode = await ProductCode.findById(pro.idProductCode)
			product.name = `${productCode.name} - ${pro.color} - ${pro.size}`
			product.price = productCode.cost
		}
	}
	res.render('pages/bill', { order })
	// } catch (error) {
	// 	res.status(500).json({
	// 		status: 'fail',
	// 		message: 'Lỗi server',
	// 	})
	// }
}
