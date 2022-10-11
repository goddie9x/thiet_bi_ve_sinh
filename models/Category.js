const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    categoryId: String,
    categoryName: String,
    parent: String
},{
    collection: 'Category',
})

// tạo model
const Category = mongoose.model("Category", categorySchema);

// export
module.exports = Category;