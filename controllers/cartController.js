const Cart = require('../models/CartModel')
const Product = require('../models/productModel')
const ProductCode = require('../models/productCodeModel')

module.exports.renderCart = (req, res) => {
	res.render('pages/cart')
}

module.exports.detailCart = async (req, res) => {
	try {
		const userId = req.user._id
		const cart = await Cart.findOne({ userId }).lean()
		// console.log(cart)

		if (!cart) {
			return res.status(200).json({
				status: 'fail',
				message: 'Không tìm thấy cart',
			})
		}

		res.status(200).json({
			status: 'success',
			cart,
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.createCart = async (req, res) => {
	try {
		const userId = req.user._id
		const cart = await Cart.findOne({ userId })
		if (!cart) {
			const cart1 = await Cart.create({
				userId,
				products: req.body.products,
			})
			if (!cart1)
				return res.status(400).json({
					status: 'fail',
					message: 'Không tạo được cart',
				})
		}

		const _cart = await Cart.findOne({
			$and: [{ userId }, { 'products.productId': req.body._productId }],
		})
		if (!_cart) {
			const cart_ = await Cart.findOneAndUpdate(
				{ userId },
				{
					$push: {
						products: {
							productId: req.body._productId,
							quantity: req.body._quantity,
						},
					},
				}
			)
		} else {
			const cart_ = await Cart.findOneAndUpdate(
				{ userId, 'products.productId': req.body._productId },
				{ $set: { 'products.$.quantity': req.body._sl } }
			)
		}

		res.status(200).json({
			status: 'success',
			message: 'Create cart thành công',
			cart,
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.updateCart = async (req, res) => {
	try {
		const userId = req.user._id
		const idProduct = req.params.id

		const cart = await Cart.findOne({ userId: userId })

		if (!cart)
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy cart',
			})

		const quantity = req.body.quantity
		for (let product of cart.products) {
			if (product.productId == idProduct) {
				product.quantity = quantity

				await cart.save()
				break
			}
		}

		res.status(200).json({
			status: 'success',
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.deleteCart = async (req, res) => {
	try {
		const userId = req.user._id
		const idProduct = req.params.id

		const cart = await Cart.findOneAndUpdate(
			{ userId },
			{ $pull: { products: { productId: idProduct } } }
		)
		if (!cart)
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy cart',
			})

		res.status(200).json({
			status: 'success',
			message: 'Delete cart thành công',
			cart,
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.getAllCart = async (req, res) => {
	try {
		if (!req.user) {
			let cart = {
				products: [],
			}
			return res.status(200).json({
				status: 'success',
				data: {
					cart,
				},
			})
		}

		const cart = await Cart.findOne({ userId: req.user._id }).lean()

		// console.log(cart)
		if (!cart) {
			return res.status(200).json({
				status: 'fail',
				message: 'Bạn chưa có cart',
			})
		}

		const products = []
		for (let product of cart.products) {
			const pro = await Product.findById(product.productId).lean()
			const productCode = await ProductCode.findById(pro.idProductCode).lean()

			pro.idProductCode = productCode

			products.push({ ...pro, quantity: product.quantity })
		}

		cart.products = products

		res.status(200).json({
			status: 'success',
			data: {
				cart,
			},
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}
