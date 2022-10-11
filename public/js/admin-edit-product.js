function createMoreProductItem(color = '', size = '', total = '', _id = '') {
	const moreProductItem = `<div class="col-3">
<label class="mb-1">Chọn màu sắc</label>
<div class="wrap-color d-flex align-items-center">
    <div class="preview-color" style="background-color:${color};"></div>
    <input
        type="text"
        name="color"
        class="product-color"
        placeholder="Màu sản phẩm"
        required
		value="${color}"
    />
</div>
</div>
<div class="col-3">
<label class="mb-1">Chọn size</label>
<select name="type" required class="product-size">
    <option value="" selected disabled>Chọn size trang phục</option>
    <option value="S">S</option>
    <option value="M">M</option>
    <option value="L">L</option>
    <option value="XL">XL</option>
    <option value="XLL">XLL</option>
</select>
</div>
<div class="col-3">
<label class="mb-1">Số lượng</label>
<input
    type="number"
    name="total"
    class="product-total"
    placeholder="Số lượng"
    required
	value="${total}"
/>
</div>
<div class="col-3 more-product-delete-btn mt-3">
<button type="button" onclick="$(this).parent().parent().remove()">
    Xóa
</button>
</div>`

	const moreProduct = document.createElement('div')
	moreProduct.className = 'row more-product-item d-flex align-items-center'
	moreProduct.setAttribute('data-id', _id)
	moreProduct.innerHTML = moreProductItem // Insert text
	document.querySelector('.more-product-wrap').appendChild(moreProduct)
	return moreProduct
}

const name = document.querySelector('#product-name')
const cost = document.querySelector('#product-cost')
const type = document.querySelector('#product-type')
const description = document.querySelector('#product-description')
const images = document.querySelector('#product-images')

const formData = new FormData()
const form = document.querySelector('form')
const previewImages = $('.preview-images')


const url = window.location.href.split('/')
let idProductCode = url[url.length - 1]

// load data productCode and products of code
async function getInfoProduct() {
	const response = await fetch(`/products/api/${idProductCode}`)

	let result = await response.json()
	productCode = result.data.productCode
	// console.log(productCode)

	// add product to html
	document.querySelector('.title-header').innerHTML = 'Thông tin sản phẩm'
	document.querySelector('.add-product-button').innerHTML = 'Sửa sản phẩm'

	name.value = productCode.name
	cost.value = productCode.cost
	type.value = productCode.type
	description.value = productCode.description

	// add products
	for (let product of productCode.products) {
		const moreProduct = createMoreProductItem(product.color, product.size, product.total, product._id)
		moreProduct.querySelector('.product-size').value = product.size
	}

	// change color
	const colorInputs = document.querySelectorAll('.product-color')

	colorInputs.forEach((item, index) => {
		item.addEventListener('input', () => {
			const previewColor = item.previousElementSibling
			previewColor.style.backgroundColor = item.value
		})
	})

	// images
	const files = productCode.images
	for (let i = 0; i < files.length; i++) {
		$('<img />', {
			src: files[i],
		}).appendTo(previewImages)
	}
}

getInfoProduct()


document
	.querySelector('.more-product-btn button')
	.addEventListener('click', function (e) {
		createMoreProductItem()

		// change color
		const colorInputs = document.querySelectorAll('.product-color')

		colorInputs.forEach((item, index) => {
			item.addEventListener('input', () => {
				const previewColor = item.previousElementSibling
				previewColor.style.backgroundColor = item.value
			})
		})
	})

// add images
$('#product-images').on('change', function () {
	let files = this.files
	if (files.length == 0) return

	previewImages.empty()
	formData.delete('images')

	for (let i = 0; i < files.length; i++) {
		$('<img />', {
			src: URL.createObjectURL(files[i]),
		}).appendTo(previewImages)

		// append img to formData
		formData.append('images', files[i])
	}
})

// add product
form.addEventListener('submit', async (e) => {
	e.preventDefault()

	const products = document.querySelectorAll(
		'.more-product-wrap .more-product-item'
	)
	if (products.length == 0) {
		alert('Vui lòng thêm chi tiết sản phẩm: màu sắc, size và số lượng...')
		return
	}


	formData.set('name', name.value)
	formData.set('cost', cost.value)
	formData.set('type', type.value)

	formData.set('description', description.value)

	// warning when missing images of the product
	const previewImages = $('.preview-images img')
	if (previewImages.length == 0) {
		alert('Vui lòng chọn ảnh sản phẩm')
		return
	}

	// add lazing add product
	showLazy()

	// firstly, edit productCode, then edit products

	let response = await fetch('/products/api/' + idProductCode, {
		method: 'PUT',
		body: formData,
	})
	let result = await response.json()

	// const idProductCode = result.data.productCode._id
    const postStatus = true

	// edit products
	for (let item of products) {
		const color = item.querySelector('.product-color').value
		const size = item.querySelector('.product-size').value
		const total = item.querySelector('.product-total').value
		const _id = item.getAttribute('data-id')


        let result = await $.ajax({
            url: '/products/api',
            data: {color, size, total, idProductCode, _id},
            type: 'POST',
        })
        // console.log(result)
        // nếu có 1 sản phẩm không thành công thì cũng báo lỗi
        if(result.status == 'fail')
            postStatus = false
	}

	// // console.log(result)
    hideLazy()

	if (postStatus) alert('Update sản phẩm thành công')
    else alert('Vui lòng kiểm tra và tiến hành tạo sản phẩm lại, vì do có 1 vài sản phẩm tạo lỗi')
})
