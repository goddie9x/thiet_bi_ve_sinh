const { Brand } = require("../models/brandModel");
const { Categories } = require("../models/categoryModel");
const { checkCategory } = require("../services/brandService");
const path = require("path");
const { checkLogging } = require("../middlewares/checkLogging");

// create a brand
exports.createBrand = async(req, res) => {
    try {
        const checkCategoryId = await checkCategory(req.params.categoryId);
        if (checkCategoryId) {
            const newBrand = await Brand.create({
                brandName: req.body.brandName,
                listCategoryId: { _id: req.params.categoryId }
            });
            // const addCategoryId = await Brand.findOneAndUpdate({_id: newBrand._id}, {$push: {listCategoryId: {_id: req.params.categoryId}}})
            res.status(200).json({ newBrand });
        } else {
            res.status(500).json({ message: "server error" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error", error });
    }
};

// get all brand
exports.getAllBrand = async(req, res) => {
    try {
        const brand = await Brand.find();
        res.status(200).json({ brand });
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
}

// get brand by id
exports.getBrandById = async(req, res) => {
    try {
        const brand = await Brand.findById(req.params.brandId);
        res.status(200).json({ brand });
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
}

// update the brand name
exports.updateBrandName = async(req, res) => {
    try {
        const updateBrand = await Brand.findOneAndUpdate({ _id: req.params.brandId }, { brandName: req.body.brandName })
        res.status(200).json({ message: 'update successfull', updateBrand });
    } catch (error) {
        res.status(500).json({ message: "server error", error });
    }
}

//add brand for category
exports.addBrandIntoCategory = async(req, res) => {
    try {
        const checkCategoryId = await checkCategory(req.body.categoryId);
        if (checkCategoryId) {
            const addCategoryId = await Brand.findOneAndUpdate({ _id: req.params.brandId }, { $push: { listCategoryId: { _id: req.body.categoryId } } })
            res.status(200).json({ addCategoryId });
        } else {
            res.status(500).json({ message: "server error" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error", error });
    }
};

// delete a brand by id
exports.deleteBrand = async(req, res) => {
    try {
        const brandId = await Brand.deleteOne({ _id: req.params.brandId });
        return res.status(200).json({ message: "delete success" });
    } catch (error) {
        res.status(500).json({ message: "server error", error });
    }
};

// delete a brand by name
exports.deleteBrandByName = async(req, res) => {
    try {
        const brandId = await Brand.deleteMany({ brandName: req.body.brandName });
        return res.status(200).json({ message: "delete success" });
    } catch (error) {
        res.status(500).json({ message: "server error", error });
    }
};