const Product = require('../models/productModel')
const ProductCode = require('../models/productCodeModel')
const imgbbUploader = require('imgbb-uploader')
const { removeVI } = require('jsrmvi')
const dateFormat = require('date-and-time')
const Order = require('../models/OrderModel')

// example:
// /products/api?search=""&filter=""
module.exports.getAllProduct = async (req, res) => {
	try {
		let perPage = 5
		const option = { replaceSpecialCharacters: false }
		// get query
		let { page, search, date, cost, left } = req.query
		// console.log(req.query)

		// setup
		page = !page ? 1 : page
		search = removeVI(search, option)

		// filter follow search
		let productCodes = await ProductCode.find().lean()
		productCodes = productCodes.filter((item) => {
			return (
				removeVI(item.name, option).includes(search) ||
				dateFormat.format(item.createdAt, 'DD/MM/YYYY').includes(search) ||
				item.cost.toString().includes(search) ||
				item.type.includes(search)
			)
		})

		// console.log(productCodes)

		// đếm số lượng sản phẩm trong productCodes và gán products vào productCodes
		for (let item of productCodes) {
			const products = await Product.find(
				{ idProductCode: item._id },
				{ total: 1, color: 1, size: 1 }
			).lean()
			let totalProductsOfCode = 0
			products.forEach((item) => {
				totalProductsOfCode += item.total
			})

			item.total = totalProductsOfCode
			item.products = products
		}

		// filter sort: date, cost, left
		if (date && !cost && !left) {
			if (date == 'down')
				productCodes = productCodes.sort(function (a, b) {
					return new Date(a.createdAt) - new Date(b.createdAt)
				})
			else
				productCodes = productCodes.sort(function (a, b) {
					return new Date(b.createdAt) - new Date(a.createdAt)
				})
		}
		if (!date && cost && !left) {
			if (cost == 'down')
				productCodes = productCodes.sort(function (a, b) {
					return a.cost - b.cost
				})
			else productCodes = productCodes.sort((a, b) => b.cost - a.cost)
		}
		if (!date && !cost && left) {
			if (left == 'down')
				productCodes = productCodes.sort((a, b) => a.total - b.total)
			else productCodes = productCodes.sort((a, b) => b.total - a.total)
		}

		// productCodes = productCodes.sort(function (a, b){
		// 	return a.cost - b.cost
		// })

		let totalProducts = await ProductCode.countDocuments()
		let totalPages = Math.ceil(productCodes.length / perPage)

		// pagination
		if (!req.query.input) {
			let begin = (page - 1) * perPage
			let end = page * perPage
			productCodes = productCodes.slice(begin, end)
		}

		// let totalProducts = await ProductCode.countDocuments()

		// console.log(90, productCodes.length)
		res.status(200).json({
			productCodes,
			total: totalProducts,
			totalPages,
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.addProductCode = async (req, res) => {
	try {
		// console.log(req.body)
		const { name, cost, brandId, categoryId, productDetailId, description, type } = req.body

		// console.log(req.files)

		// get images of product
		let images = req.files.map((file) => {
			return file.path
		})

		// upload img to host
		images = await Promise.all(
			images.map(async (file) => {
				const upload = await imgbbUploader(process.env.IMGBB_KEY, file)
				return upload.url
			})
		)

		let productCode = await ProductCode.findOne({
			name,
			cost,
			description,
			type,
			images: [...images],
		})

		if (!productCode) {
			productCode = new ProductCode({
				name,
				cost,
				description,
				brandId, 
				categoryId, 
				productDetailId,
				type,
				images,
			})
			await productCode.save()
		}

		// create product
		// const product = new Product({
		// 	idProductCode: productCode._id,
		// 	color,
		// 	size,
		// 	total,
		// })

		// await product.save()
		// await product.populate('idProductCode')

		// respond the result
		res.status(200).json({
			status: 'success',
			data: {
				productCode,
			},
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.addProduct = async (req, res) => {
	// try {
	const { color, size, total, idProductCode, _id } = req.body

	// tìm kiếm xem đã tồn tại hay chưa
	// chua co thi tao moi
	// co roi thi update
	let newProduct = null

	if (_id == '' || _id == undefined) {
		newProduct = new Product({ color, total, idProductCode, size })
		await newProduct.save()
	} else {
		newProduct = await Product.findByIdAndUpdate(
			_id,
			{
				color,
				size,
				total,
			}
		)

		if (!newProduct)
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy sản phẩm',
			})
	}

	res.status(200).json({
		status: 'success',
		product: newProduct,
	})
	// } catch (error) {
	// 	res.status(400).json({
	// 		status: 'fail',
	// 		message: 'Lỗi server',
	// 	})
	// }
}

module.exports.editProductCode = async (req, res) => {
	// get id of product
	const idProductCode = req.params.id

	try {
		// find product
		let productCode = await ProductCode.findById(idProductCode)

		// console.log(productCode)

		if (!productCode) {
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy sản phẩm',
			})
		}

		// get images if admin changes images
		let images = req.files.map((file) => {
			return file.path
		})

		if (images.length > 0) {
			// images = images.map((file) => file.filename)
			// console.log('vao doi')
			// upload img to host
			images = await Promise.all(
				images.map(async (file) => {
					// console.log(file)
					const upload = await imgbbUploader(process.env.IMGBB_KEY, file)
					return upload.url
				})
			)
			productCode.images = images
			// console.log(productCode)
			// await productCode.save()
		}

		// merge product code object
		for (let item in req.body) {
			// if (product[item]) product[item] = req.body[item]
			if (productCode[item]) productCode[item] = req.body[item]
		}

		// await product.save()
		await productCode.save()

		// respond
		res.status(200).json({
			status: 'success',
			data: {
				productCode,
			},
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.deleteProductCode = async (req, res) => {
	try {
		const productCode = await ProductCode.findById(req.params.id)

		if (!productCode) {
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy sản phẩm',
			})
		}

		// tìm xem có order nào đang có hay không
		// tim product thuoc productCode -> tim order ma co 'waiting' va co product
		const products = await Product.find({
			idProductCode: productCode._id,
		}).lean()
		const arrId = products.map((item) => item._id)
		const orders = await Order.find({
			status: 'waiting',
			'products.productId': { $in: arrId },
		}).lean()

		if (orders.length > 0)
			return res.status(400).json({
				status: 'fail',
				message: 'Sản phẩm đang nằm trong danh sách order',
			})

		// tìm và xóa tất cả các product thuộc productCode đó
		await Product.deleteMany({ idProductCode: productCode._id })

		await ProductCode.findByIdAndDelete(req.params.id)

		res.status(200).json({
			status: 'success',
			message: 'Xóa sản phẩm thành công',
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Xóa sản phẩm thất bại',
		})
	}
}

module.exports.deleteProduct = async (req, res) => {
	// get id of product
	const idProduct = req.params.id

	try {
		await Product.findByIdAndDelete(idProduct)

		res.status(200).json({
			status: 'success',
			message: 'Xóa sản phẩm thành công',
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.getDetail_Product = async (req, res) => {
	try {
		// find product
		const product = await Product.findOne({
			$and: [
				{ idProductCode: req.body.idProductCode },
				{ size: req.body.size },
				{ color: req.body.color },
			],
		}).populate('idProductCode')

		// respond
		if (product)
			return res.status(200).json({
				status: 'success',
				product,
			})
		res.status(400).json({
			status: 'fail',
			message: 'Không tìm thấy sản phẩm',
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.getDetailProduct = async (req, res) => {
	// get id of product
	const idProduct = req.params.id

	try {
		// find product
		const product = await Product.findById(idProduct).populate('idProductCode')

		if (product) {
			return res.status(200).json({
				status: 'success',
				data: {
					product,
				},
			})
		}

		return res.status(400).json({
			status: 'fail',
			message: 'Không tìm thấy sản phẩm',
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.getDetailProductCode = async (req, res) => {
	// get id of product
	const idProductCode = req.params.id

	try {
		// find product code
		const productCode = await ProductCode.findById(idProductCode).lean()

		if (!productCode) {
			return res.status(400).json({
				status: 'fail',
				message: 'Không tìm thấy sản phẩm',
			})
		}

		// find the list of products
		const products = await Product.find(
			{ idProductCode: productCode._id },
			{ color: 1, size: 1, total: 1 }
		).lean()

		productCode.products = products
		// console.log(productCode)
		return res.status(200).json({
			status: 'success',
			data: {
				productCode,
			},
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

// add product to cart
module.exports.userAddProduct = async (req, res) => {
	// console.log('hello')
	try {
		const _id = req.params.id
		const product = await Product.findById(_id).populate('idProductCode')

		const cartItem = {
			_id,
			color: req.query.color,
			size: req.query.size,
			quantity: +req.query.quantity,
			image: product.idProductCode.images[0],
			name: product.idProductCode.name,
		}

		const cart = req.session.cart || []
		let totalMoney = +req.session.totalMoney || 0

		// kiểm tra xem sản phẩm đã được thêm vào trước đó không
		// nếu đã được thêm thì chỉ cần tăng số lượng product
		// nếu chưa thêm thì thêm
		let newProduct = true
		for (let i = 0; i < cart.length; i++) {
			if (
				cart[i]._id == cartItem._id &&
				cart[i].size == cartItem.size &&
				cart[i].color == cartItem.color
			) {
				// them so luong san pham va them tien
				cart[i].quantity += cartItem.quantity
				totalMoney += cartItem.quantity * product.idProductCode.cost

				newProduct = false
				break
			}
		}

		if (newProduct) {
			cart.push(cartItem)
			totalMoney += cartItem.quantity * product.idProductCode.cost
		}

		req.session.cart = cart
		req.session.totalMoney = totalMoney
		// console.log(req.session.cart)
		// console.log(req.session.totalMoney)
		res.status(200).json({
			status: 'success',
			message: 'Đã thêm sản phẩm vào giỏ hàng',
		})
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: 'Không tìm thấy id sản phẩm',
		})
	}
}

// ===========================================================================
exports.createProductCode = async (req, res) => {
    try {
		const newProductCode = await ProductCode.create({...req.body})
        res.status(200).json({ newProductCode });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error", error });
    }
};
