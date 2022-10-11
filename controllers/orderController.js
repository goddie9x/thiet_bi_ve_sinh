const Order = require('../models/OrderModel')
const { removeVI } = require('jsrmvi')
const dateFormat = require('date-and-time')
const Product = require('../models/productModel')
const User = require('../models/userModel')

module.exports.getAllOrders = async (req, res) => {
	try {
		const perPage = 5
		const option = { replaceSpecialCharacters: false }

		let { page, search, date, payment, status } = req.query

		page = !page ? 1 : page
		search = removeVI(search, option)

		// console.log(req.query)

		// filter follow search
		let orders = await Order.find().lean()
		let totalOrders = orders.length
		let totalOrderWaiting = 0

		orders.forEach((item) => {
			if (item.status == 'waiting') totalOrderWaiting++
		})

		// console.log(totalOrderWaiting)

		orders = orders.filter((item) => {
			return (
				removeVI(item.receiverName, option).includes(search) ||
				dateFormat.format(item.createdAt, 'DD/MM/YYYY').includes(search) ||
				item.phoneNumber.includes(search)
			)
		})

		// filter sort: date, payment, status
		if (date) {
			if (date == 'down')
				orders = orders.sort(function (a, b) {
					return new Date(a.createdAt) - new Date(b.createdAt)
				})
			else
				orders = orders.sort(function (a, b) {
					return new Date(b.createdAt) - new Date(a.createdAt)
				})
		}
		if (payment) {
			if (payment == 'transfer')
				orders = orders.filter((item) => item.payment == 'transfer')
			else orders = orders.filter((item) => item.payment == 'cod')
		}
		if (status) {
			if (status == 'waiting')
				orders = orders.filter((item) => item.status == 'waiting')
			else if (status == 'cancelled')
				orders = orders.filter((item) => item.status == 'cancelled')
			else orders = orders.filter((item) => item.status == 'done')
		}

		let totalPages = Math.ceil(orders.length / perPage)

		// pagination
		let begin = (page - 1) * perPage
		let end = page * perPage
		// console.log(begin, end)
		orders = orders.slice(begin, end)

		res.status(200).json({
			orders,
			total: totalOrders,
			totalPages,
			totalOrderWaiting,
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.cancelOrder = async (req, res) => {
	const idOrder = req.params.id

	// try {
	// auth
	const user = await User.findById(req.user._id)

	let order = null

	if (user.role == 'admin')
		order = await Order.findOneAndUpdate(
			{ _id: idOrder, status: 'waiting' },
			{ status: 'cancelled' },
			{ new: true }
		)
	else
		order = await Order.findOneAndUpdate(
			{ _id: idOrder, status: 'waiting', userId: req.user._id },
			{ status: 'cancelled' },
			{ new: true }
		)

	// lấy lại số lượng sản phẩm
	for (let product of order.products) {
		const pro = await Product.findById(product.productId)
		pro.total += product.quantity
		// await pro.updateOne()
		await Product.updateOne({ _id: pro._id }, { total: pro.total })
	}

	res.status(200).json({
		status: 'success',
		message: 'Hủy đơn hàng thành công',
	})
	// } catch (error) {
	// 	res.status(500).json({
	// 		status: 'fail',
	// 		message: 'Hủy đơn hàng thất bại',
	// 	})
	// }
}

module.exports.deliveryOrder = async (req, res) => {
	const idOrder = req.params.id

	try {
		const order = await Order.findOneAndUpdate(
			{ _id: idOrder, status: 'waiting' },
			{ status: 'done' },
			{ new: true }
		)

		// console.log(order)

		res.status(200).json({
			status: 'success',
			message: 'Giao hàng thành công',
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Giao hàng thất bại',
		})
	}
}
