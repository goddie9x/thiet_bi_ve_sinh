const { Categories } = require('../models/categoryModel')
const { checkCategory } = require("../services/brandService");
const path = require('path')

// get all category
exports.getAllCategory = async(req, res) => {
    try {
        const category = await Categories.find();
        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
}

// get category by id
exports.getCategoryById = async(req, res) => {
    try {
        const category = await Categories.findById(req.params.categoryId);
        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
}

// create a new category
exports.createCategory = async(req, res) => {
    try {
        const checkCategoryId = await checkCategory(req.body.categoryId);
        if (checkCategoryId) {
            const newChildCategory = await Categories.create({
                categoryName: req.body.categoryName,
                parentId: { _id: req.body.categoryId }
            });
            res.status(200).json({ newChildCategory });
        } else {
            const newCategory = await Categories.create({...req.body })
            res.status(200).json({ newCategory });
        }
    } catch (error) {
        res.status(500).json({ message: "server error", error });
    }
};

// update a category
exports.updateCategoryName = async(req, res) => {
        try {
            const updateCategory = await Categories.findOneAndUpdate({ _id: req.params.categoryId }, { categoryName: req.body.categoryName })
            res.status(200).json({ message: 'update successfull', updateCategory });
        } catch (error) {
            res.status(500).json({ message: "server error", error });
        }
    }
    // delete a category
exports.deleteCategory = async(req, res) => {
    try {
        const category = await Categories.deleteOne({ _id: req.params.categoryId });
        return res.status(200).json({ message: "delete success", category });
    } catch (error) {
        res.status(500).json({ message: "server error", error });
    }
};