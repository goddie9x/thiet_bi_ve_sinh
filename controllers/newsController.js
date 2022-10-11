const News = require('../models/newsModel');
const ProductCode = require('../models/productCodeModel');
const nodemailer = require('nodemailer');
const imgbbUploader = require('imgbb-uploader')



module.exports.getAllNews = async (req, res, next) => {
	// try {
		const products = await ProductCode.find().lean();
		const arr = Array.from(Array(products.length).keys());
		// var featuredIndex = getRandom(arr, 10)
		// so luong bai bao khong du nen chi lay 6
		var featuredIndex = getRandom(arr, 6)

		function getRandom(arr, n) {
			var result = new Array(n),
				len = arr.length,
				taken = new Array(len)
			if (n > len)
				throw new RangeError('getRandom: more elements taken than available')
			while (n--) {
				var x = Math.floor(Math.random() * len)
				result[n] = arr[x in taken ? taken[x] : x]
				taken[x] = --len in taken ? taken[len] : len
			}
			return result
		}

		let perPage = 4; 
		let page = req.params.page || 1;

		News
			.find()
			.skip((perPage * page) - perPage)
			.limit(perPage)
			.exec((err, news) => {
				News.countDocuments((err, count) => { 
					if (err) return next(err);
					res.render('pages/news', {
						products,
						featuredIndex,
						news,
						current: page,
            			pages: Math.ceil(count / perPage)
					})
				});
			});
		
	// } catch (error) {
	// 	res.status(500).json({
	// 		status: 'fail',
	// 		message: 'Lỗi server',
	// 	})
	// }
}

module.exports.getDetailNews = async (req, res) => {
	try {
		//get news's id
		const newSlug = req.params.slug;
		//find news in database
		const newsElement = await News.findOne({slug: newSlug}).lean();
		//get all news
		const news = await News.find().lean();
		
		// var before, after;
		var current = news.findIndex(x => x.slug === newSlug);

		if(current == 0){
			before = news[news.length - 1]._slug;
		}else{
			before = news[current - 1].slug;
		}
		if(current == (news.length - 1)){
			after = news[0].slug;
		}else{
			after = news[current + 1].slug;
		}

		res.render('pages/news-detail', {
			newsElement,
			before,
			after
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.getAddNewPage = async (req, res) => {
	try {
		res.render('pages/add-news')
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.sendMail = async (req, res) => {
	try {
		const userMail = req.body.email;
		// Quá trình gửi email thành công thì gửi về thông báo success cho người dùng
		const adminEmail = process.env.GMAIL_ACCOUNT;
		const adminPassword = process.env.GMAIL_PASSWORD;

		const mailHost = 'smtp.gmail.com';
		const mailPort = 587;

		await sendMail(userMail, 'Welcome to YOLOShop', '<h2>Thanks for using YoLoShop</h2>')
		function sendMail(to, subject, htmlContent) {
			const transporter = nodemailer.createTransport({
				host: mailHost,
				port: mailPort,
				secure: false,
				auth: {
					user: adminEmail,
					pass: adminPassword
				}
			})

			const options = {
				from: adminEmail,
				to: to,
				subject: subject,
				html: htmlContent
			}

			return transporter.sendMail(options)
		}
		res.send('<h3>Your email has been sent successfully.</h3>')
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.addNews = async (req, res) => {
	try {
		console.log(req.file)
		// update banner
		if (req.file) {
			const upload = await imgbbUploader(process.env.IMGBB_KEY, req.file.path)
			req.body.banner = upload.url
		}
		await News.create(req.body)
		res.status(200).json({
			status: 'success'
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.getEditNews = async (req, res) => {
	try {
		const slug = req.params.slug;
		const newsElement = await News.findOne({slug}).lean();
		res.render('pages/edit-news',{
			newsElement
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.editNews = async (req, res) => {
	try {
		const id = req.params.id;
		// update banner
		if(req.body.isNew === 'true') {
			if (req.file) {
				const upload = await imgbbUploader(process.env.IMGBB_KEY, req.file.path)
				req.body.banner = upload.url
			}
		}
		const banner = req.body.banner;
		const slug = req.body.slug;
		const title = req.body.title;
		const description = req.body.description;
		const result = await News.findByIdAndUpdate({_id: id},{title, description, slug, banner});
		
		res.status(200).json({
			status: 'success'
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}

module.exports.deleteNews = async (req, res) => {
	try {
		const id = req.params.id;
		const data = await News.findByIdAndDelete(id);
		res.status(200).json({
			status: 'success',
			data
		})
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Lỗi server',
		})
	}
}