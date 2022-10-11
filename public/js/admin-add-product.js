const moreProductItem = `<div class="col-3">
<label class="mb-1">Chọn màu sắc</label>
<div class="wrap-color d-flex align-items-center">
    <div class="preview-color"></div>
    <input
        type="text"
        name="color"
        class="product-color"
        placeholder="Màu sản phẩm"
        required
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
/>
</div>
<div class="col-3 more-product-delete-btn mt-3">
<button type="button" onclick="$(this).parent().parent().remove()">
    Xóa
</button>
</div>`

function createMoreProductItem(){
	const moreProduct = document.createElement('div')
		moreProduct.className = 'row more-product-item d-flex align-items-center'
		moreProduct.innerHTML = moreProductItem // Insert text
		document.querySelector('.more-product-wrap').appendChild(moreProduct)
}


const form = document.querySelector('form')
const formData = new FormData()
createMoreProductItem()

// change color
const colorInput = document.querySelector('.product-color')

colorInput.addEventListener('input', () => {
	const previewColor = colorInput.previousElementSibling
	// console.log(previewColor)
	previewColor.style.backgroundColor = colorInput.value
})


// add images
$('#product-images').on('change', function () {
	let files = this.files
	// console.log(files)
	if (files.length == 0) return

	const previewImages = $('.preview-images')

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

document
	.querySelector('.more-product-btn button')
	.addEventListener('click', function (e) {
		createMoreProductItem()

		// change color
		const colorInputs = document.querySelectorAll('.product-color')

		colorInputs.forEach((item, index) => {
			item.addEventListener('input', () => {
				// console.log(index, item)
				const previewColor = item.previousElementSibling
				// console.log(previewColor)
				previewColor.style.backgroundColor = item.value
			})
		})
	})

// add product
form.addEventListener('submit', async (e) => {
	e.preventDefault()

	// báo lỗi nếu không có sản phẩm được tạo
	const products = document.querySelectorAll(
		'.more-product-wrap .more-product-item'
	)
	// console.log(products)
	if (products.length == 0) {
		alert('Vui lòng thêm chi tiết sản phẩm: màu sắc, size và số lượng...')
		return
	}

	const name = document.querySelector('#product-name')
	const cost = document.querySelector('#product-cost')
	const type = document.querySelector('#product-type')

	const description = document.querySelector('#product-description')

	formData.set('name', name.value)
	formData.set('cost', cost.value)
	formData.set('type', type.value)
	formData.set('description', description.value)

	const previewImages = $('.preview-images img')
	if (previewImages.length == 0) {
		alert('Vui lòng chọn ảnh sản phẩm')
		return
	}

	// console.log(formData.entries())

	// add lazing add product
	showLazy()

	// firstly, create productCode, then create product

	let response = await fetch('/products/api/code', {
		method: 'POST',
		body: formData,
	})
	let result = await response.json()
	// console.log(result)
	const idProductCode = result.data.productCode._id
    const postStatus = true

	for (let item of products) {
		const color = item.querySelector('.product-color').value
		const size = item.querySelector('.product-size').value
		const total = item.querySelector('.product-total').value

		// console.log(color, size, total)

        let result = await $.ajax({
            url: '/products/api',
            data: {color, size, total, idProductCode},
            type: 'POST',
        })
        // console.log(result)
        // nếu có 1 sản phẩm không thành công thì cũng báo lỗi
        if(result.status == 'fail')
            postStatus = false
	}

	// // console.log(result)
    hideLazy()
	if (postStatus) alert('Thêm sản phẩm thành công')
    else alert('Vui lòng kiểm tra và tiến hành tạo sản phẩm lại, vì do có 1 vài sản phẩm tạo lỗi')

})
