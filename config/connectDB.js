// connect to database
const mongoose = require('mongoose')

async function connectDB() {
	await mongoose.connect(
		`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster-dienlanh.jbnlx0b.mongodb.net/?retryWrites=true&w=majority`
		)
	// await mongoose.connect('mongodb://localhost/my_database')
}

connectDB()
