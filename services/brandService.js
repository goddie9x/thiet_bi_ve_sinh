const { Brand } = require('../models/brandModel')
<<<<<<< Updated upstream
const { Categories } = require('../models/categoryModel')

exports.checkCategory = async (categoryId) =>{
    try{
        const checkCategoryId = await Categories.findById(categoryId)
=======
const { Category } = require('../models/categoryModel')

exports.checkCategory = async (categoryId) =>{
    try{
        const checkCategoryId = await Category.findById(categoryId)
>>>>>>> Stashed changes
        if(checkCategoryId){
            return checkCategoryId
        }else{
            return null
        }
    }catch(error){
        return {error}
    }
}