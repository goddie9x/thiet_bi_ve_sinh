const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

module.exports.checkLogging = async (req, res, next) => {
	try {
		const token = req.cookies.tokenId
		// verify id
		const result = jwt.verify(token, process.env.TOKEN_KEY)
		// console.log(result)

		const user = await User.findById(result.userId)


		// console.log(user)
		if (!user) next()

		req.user = user
        // Nếu đã đăng nhập -> không cho login/register nữa -> trả lại về trang chủ
		return res.redirect('/')
	} catch (error) {
		// invalid token -> redirect to login page
		next()
	}
}
