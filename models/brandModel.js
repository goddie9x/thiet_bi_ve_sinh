const mongoose = require('mongoose');

let brandSchema = mongoose.Schema({
    brandName: String,
    logo: String,
    listCategoryId: [
        {categoryId: String}
    ]
},{
    collection: 'Brand'
})

// tạo model
const Brand = mongoose.model("Brand", brandSchema);

// export
module.exports.Brand = Brand;

