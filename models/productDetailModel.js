const mongoose = require('mongoose');

let productDetailSchema = mongoose.Schema({
    productDetailName: String,
    logo: String,
    categoryId: String
},{
    collection: 'productDetail'
})

// tạo model
const productDetail = mongoose.model("productDetail", productDetailSchema);

// export
module.exports.productDetail = productDetail;

