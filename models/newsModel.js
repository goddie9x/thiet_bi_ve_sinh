const mongoose = require('mongoose')

const NewsSchema = mongoose.Schema(
	{
		banner: {
			type: String,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		slug: {
			type: String
		},
		description: {
			type: String,
            required: true
		}
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('News', NewsSchema)
