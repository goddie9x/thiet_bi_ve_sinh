const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    categoryName: String,
    parentId: String
}, {
    collection: 'Categories',
})

// tạo model
const Categories = mongoose.model("Categories", categorySchema);

// export
module.exports.Categories = Categories;