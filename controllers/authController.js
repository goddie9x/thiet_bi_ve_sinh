const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const imgbbUploader = require('imgbb-uploader')

module.exports.register = async (req, res) => {
	// check if user is exists
	// try {
		// console.log('register', req.body)
		const { email, phoneNumber } = req.body
		const user = await User.findOne({ $or: [{ email }, { phoneNumber }] })

		// console.log(user)

		if (user)
			return res
				.status(400)
				.json({ status: 'fail', message: 'User đã tồn tại.' })

		// hash password and register user
		req.body.password = await bcrypt.hash(req.body.password, 10)
		const newUser = new User({
			...req.body,
		})

		await newUser.save()
		newUser.password = ''

		// tao token
		const token = jwt.sign({ userId: newUser._id }, process.env.TOKEN_KEY)


		// respond
		res.status(200).json({
			status: 'success',
			data: { newUser, token },
		})
	// } catch (error) {
	// 	res.status(500).json({
	// 		status: 'fail',
	// 		message: 'Lỗi server',
	// 	})
	// }
}

// login
module.exports.login = async (req, res) => {
	// console.log('vao login')

	// lay email or phone, va password
	const { email, phoneNumber, password } = req.body
	// console.log(req.body)


	// tim user
	const user = await User.findOne({ $or: [{ email }, { phoneNumber }] }).select('+password')
	// user.select('+password')


	// ko user => tra loi
	if (!user)
		return res.status(400).json({
			status: 400,
			message: 'User khong ton tai'
		})

	// console.log(user)

	// user => check password
	const isPassword = await bcrypt.compare(password, user.password)

	// password khong dung
	if (!isPassword)
		return res.status(400).json({
			status: 400,
			message: 'Mật khẩu hoặc email dùng không đúng'
		})

	// password dung 

	// tao token
	const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY)

	// toke

	user.password = ''
	res.status(200).json({
		status: 200,
		data: {
			user: user,
			token
		}
	})

}

// get login

module.exports.getLogin = (req, res) => {
	// console.log('login')
	res.render('pages/login')
}


//register
module.exports.getRegister = (req, res) => {
	return res.render('pages/register')
}
