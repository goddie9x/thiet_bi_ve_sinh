require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const morgan = require('morgan')
const compression = require('compression')

const app = express()

// add middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(compression())

// session middleware
app.use(require('./config/session'))

// setup view
app.set('view engine', 'ejs')
app.set('views', 'views')

// setup public folder
app.use('/public', express.static(path.join(__dirname, 'public')))


require('./config/connectDB')

const router = require("./routes/index")
app.use(router)

// listening
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log('Listening...')
})
