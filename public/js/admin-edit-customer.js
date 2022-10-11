document.querySelector('#product-role').value = user.role

const form = document.querySelector('form')
const formData = new FormData()
const previewImage = $('.preview-image')

// add images
$('#customer-image').on('change', function () {
	let [file] = this.files
	if (file) {
		// clear preview img area
		previewImage.empty()
		$('<img />', {
			src: URL.createObjectURL(file),
		}).appendTo(previewImage)

		// append img to formData
		formData.set('avatar', file)
	}
})

form.addEventListener('submit', async (e) => {
	e.preventDefault()
	const newFormData = new FormData(form)

	// if formData is empty
	if(formData.get('avatar'))
	{
		newFormData.set('avatar', formData.get('avatar'))
	}
	// for (let i of newFormData.entries()) console.log(i)

	// add lazing add product
	showLazy()

    let response = await fetch('/users/' + user._id, {
		method: 'PUT',
		body: newFormData,
	})
	let result = await response.json()

	console.log(result)
	if (response.status == 200) {
		alert('Sửa thông tin khách hàng thành công')
        // window.location.href = '/admin/products'
	} else {
		alert('Sửa thông tin khách hàng thất bại')
	}

	hideLazy()
})
