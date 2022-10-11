const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			ref: 'User',
		},
		receiverName: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: false,
		},
		address: {
			type: String,
			required: true,
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
		}],
		totalCost: {
			type: Number,
            required: true,
		},
		status: {
			type: String,
			enum: ['waiting', 'cancelled', 'done'],
			default: 'waiting'
		},
		payment: {
			type: String,
			enum: ['transfer', 'cod'],
			default: 'cod'
		}
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Order', OrderSchema)