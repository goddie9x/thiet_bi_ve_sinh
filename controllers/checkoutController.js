const Order = require('../models/OrderModel')
const Cart = require('../models/CartModel')
const Product = require('../models/productModel')
const ProductCode = require('../models/productCodeModel')

module.exports.renderOrder = async (req, res) => {
	// nếu chưa đăng nhập, không cho vào
	if (!req.user) return res.redirect('/')

	// nếu cart không có gì, không cho checkout
	const cart = await Cart.findOne({ userId: req.user._id })
	if (!cart || cart.products.length === 0) return res.redirect('/')

	// Lấy lịch sử order trước để tự động điền
	let order = await Order.findOne({userId: req.user._id}).sort({ createdAt: -1 }).lean()
	if (!order)
		order = {
			receiverName: '',
			phoneNumber: '',
			address: '',
		}
	res.render('pages/checkout', { order })
}

module.exports.detailOrder = async (req, res) => {
	try {
		const userId = req.user._id
		const order = await Order.findOne({ userId }).lean()

		if (!order)
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy order',
			})

		res.status(200).json({
			status: 'success',
			order,
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.createOrder = async (req, res) => {
	// try {
	const userId = req.user._id

	// get order
	const cart = await Cart.findOne({ userId })

	// handle totalCost
	let totalCost = 0
	for (let item of cart.products) {
		// let productCode = await ProductCode.findById()
		let product = await Product.findById(item.productId).lean()

		let productCode = await ProductCode.findById(product.idProductCode).lean()
		totalCost += productCode.cost * item.quantity

		// kiem tra xem con hang khong
		if (product.total < item.quantity)
			return res.status(400).json({
				status: 'fail',
				message: `Xin lỗi sản phẩm ${productCode.name} - ${product.color} - ${product.size} hiện chỉ còn ${product.total} trong kho. Vui lòng quay lại trang cart!`,
			})
	}

	// phi ship
	totalCost += 30000

	const order = await Order.create({
		userId: userId,
		receiverName: req.body._receiverName,
		phoneNumber: req.body._phoneNumber,
		message: req.body._message,
		address: req.body._address,
		products: cart.products,
		totalCost,
		payment: req.body._payment,
	})
	if (!order)
		return res.status(400).json({
			status: 'fail',
			message: 'Không tạo được order',
		})

	// tru so luong san pham
	for (let product of cart.products) {
		const pro = await Product.findById(product.productId)
		pro.total = pro.total - product.quantity
		// await pro.update()
		await Product.updateOne({ _id: pro._id }, { total: pro.total })
	}

	await cart.remove()

	res.status(200).json({
		status: 'success',
		message: 'Create new order thành công',
		order,
	})
	// } catch (error) {
	// 	res.status(500).json({
	// 		status: 'fail',
	// 		message: 'Lỗi server',
	// 	})
	// }
}

module.exports.create_Order = async (req, res) => {
	try {
		const userId = req.user._id

		const order = await Order.findOneAndUpdate(
			{ userId },
			{
				$push: {
					products: {
						productId: req.body._productId,
						quantity: req.body._quantity,
					},
				},
			}
			// { safe: true, upsert: true },
		)
		if (!order)
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy order',
			})

		res.status(200).json({
			status: 'success',
			message: 'Create order thành công!!!',
			order,
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}
