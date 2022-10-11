const { productDetail } = require('../models/productDetailModel')
const { checkCategory } = require("../services/brandService");
const path = require("path");

// get all product details
exports.getAllProductDetails = async (req, res) => {
    try {
        const productDetails = await productDetail.find();
        res.status(200).json({ productDetails });
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
}

// get product details by id
exports.getProductDetaiById = async (req, res) => {
    try {
        const productDetails = await productDetail.findById(req.body.productDetailId);
        res.status(200).json({ productDetails });
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
}

// create a brand
exports.createProductDetail = async (req, res) => {
    try {
        const checkCategoryId = await checkCategory(req.body.categoryId);
        console.log(req.body.categoryId);
        console.log(req.body.productDetailName);
        if (checkCategoryId) {
            const newProductDetail = await productDetail.create({
                productDetailName: req.body.productDetailName,
                listCategoryId: { _id: req.body.categoryId }
            });
            res.status(200).json({ newProductDetail });
        } else {
            res.status(500).json({ message: "server error" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error", error });
    }
};

// delete a product detail by id
exports.deleteProductDetail = async (req, res) => {
    try {
        const product = await productDetail.deleteOne({ _id: req.body.productDetailId });
        return res.status(200).json({ message: "delete success", product });
    } catch (error) {
        res.status(500).json({ message: "server error", error });
    }
};
