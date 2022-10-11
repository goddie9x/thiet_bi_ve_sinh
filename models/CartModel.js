const mongoose = require('mongoose')

const CartSchema = mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			ref: 'User',
		},
		products: [{ 
			productId: {
				type: String,
				required: true,
				ref: 'Product'
			},
			quantity: {
				type: Number,
				required: true,
			}
		}]
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Cart', CartSchema)