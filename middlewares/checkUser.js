const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

module.exports.checkUser = async (req, res, next) => {
	try {
		const token = req.cookies.tokenId
		// verify id
		const result = jwt.verify(token, process.env.TOKEN_KEY)
		// console.log(result)

		const user = await User.findById(result.userId)

        req.user = user
		
		next()
	} catch (error) {
		// invalid token -> redirect to login page
        req.user = null
		next()
	}
}
