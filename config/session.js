const session = require('express-session')

const payload = {
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	name: 'sessionId',
}

module.exports = session(payload)
