const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const imgbbUploader = require('imgbb-uploader')
const path = require('path')
const { removeVI } = require('jsrmvi')
const dateFormat = require('date-and-time')
const Order = require('../models/OrderModel')

module.exports.getAllUser = async (req, res) => {
	try {
		const perPage = 5
		const option = { replaceSpecialCharacters: false }

		let { page, search, date } = req.query

		page = !page ? 1 : page
		search = removeVI(search, option)

		// filter follow search
		let users = await User.find().lean()
		users = users.filter((item) => {
			return (
				removeVI(item.name, option).includes(search) ||
				dateFormat.format(item.createdAt, 'DD/MM/YYYY').includes(search) ||
				item.phoneNumber.includes(search)
			)
		})

		let totalUsers = await User.countDocuments()
		let totalPages = Math.ceil(users.length / perPage)

		// pagination
		let begin = (page - 1) * perPage
		let end = page * perPage
		// console.log(begin, end)
		users = users.slice(begin, end)

		res.status(200).json({
			users,
			total: totalUsers,
			totalPages,
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

// edit user
module.exports.editUser = async (req, res) => {
	const idUser = req.params.id
	try {
		const user = await User.findById(idUser).lean()
		if (!user)
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy user',
			})

		// update user
		if (req.file) {
			const upload = await imgbbUploader(process.env.IMGBB_KEY, req.file.path)

			req.body.avatar = upload.url
		}

		await User.updateOne({ _id: idUser }, req.body)

		res.status(200).json({
			status: 'success',
			data: { user },
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.deleteUser = async (req, res) => {
	const idUser = req.params.id
	try {
		const user = await User.findById(idUser).lean()
		if (!user)
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy user',
			})

		// check user, nếu họ đang có order thì không xóa được
		const orders = await Order.find({ userId: user._id, status: 'waiting' }).lean()

		if (orders.length > 0)
			return res.status(400).json({
				status: 'fail',
				message: 'User đang có đơn hàng',
			})

		await User.findByIdAndDelete(user._id)

		res.status(200).json({
			status: 'success',
			message: 'Xóa user thành công',
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.getDetailUser = async (req, res) => {
	const idUser = req.params.id
	try {
		const user = await User.findById(idUser)
		if (!user)
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy user',
			})

		res.status(200).json({
			status: 'success',
			user,
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

// include search
