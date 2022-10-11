const mongoose = require('mongoose')

const ProductCodeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    brandId: String,
    categoryId: String,
    productDetailId: String,

    images: {
        type: Array,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('ProductCode', ProductCodeSchema)