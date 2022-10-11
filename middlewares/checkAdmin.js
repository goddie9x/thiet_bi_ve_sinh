const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

module.exports.checkAdmin = async (req, res, next) => {
	try {
        // console.log('check admin')
		const token = req.cookies.tokenId
		// verify id
		const result = jwt.verify(token, process.env.TOKEN_KEY)
		// console.log(result)

		const user = await User.findById(result.userId)
        console.log(user)

		// Không tìm thấy user hoặc không có quyền admin, nếu đã đăng nhập thì phải đăng nhập lại với tài khoản admin
		if (!user || user.role !== 'admin')
            return res.redirect('/auth/login')

		req.user = user
        next()
	} catch (error) {
		// invalid token -> redirect to login page
		res.redirect('/auth/login')
	}
}
