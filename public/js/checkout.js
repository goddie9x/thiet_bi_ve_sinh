let tempPrice = 0
let totalPrice = 0

const btn_back = $('.btn-back')

let i = 0
let addDetailOrder = (product, index, _listData) => {
	i++
	let div = `
        <div class="order__text product__info">
            <span>${product.idProductCode.name} - ${product.color} - ${
		product.size
	} (${_listData[index].quantity})</span>
            <span>${(
							product.idProductCode.cost * _listData[index].quantity
						).toLocaleString()} VNĐ</span>
        </div>
    `
	$('.products__info').append(div)
	tempPrice += product.idProductCode.cost * _listData[index].quantity

	if (i == _listData.length) {
		totalPrice = tempPrice + 30000

		$('.temp__price').html(`${tempPrice.toLocaleString()} VNĐ`)
		$('.total__price').html(`${totalPrice.toLocaleString()} VNĐ`)
		$('.price').html(`${totalPrice}`)
		i = 0
	}
}

async function render() {
	try {
		const data = await $.ajax({
			url: '/cart/detailCart',
			type: 'GET',
		})

		$('.products__info').html('')
		data.cart.products.map(async (item, index) => {
			const result = await $.ajax({
				url: `/products/api/detail/${item.productId}`,
				type: 'GET',
			})

			addDetailOrder(result.data.product, index, data.cart.products)
		})
	} catch (error) {
		console.log(error)
	}
}

render()

document.querySelector('.btn-pay').addEventListener('click', async (e) => {
	e.preventDefault()
	// Check input first
	let _receiverName = $('.receiver__name__input').val()
	let _phoneNumber = $('.phone__number__input').val()

	let phoneRegex = /^\(?([0]{1})\)?[-. ]?([0-9]{9})$/

	if (!phoneRegex.test(_phoneNumber))
		return alert('Vui lòng điền đúng số điện thoại!')

	let _message = $('.message__input').val()
	let _address = $('.detail__address__input').val()
	let _payment = $('input[name="pay__type"]:checked').val()

	// check input
	if (!_receiverName || !_phoneNumber || !_address) {
		alert('Vui lòng điền đầy đủ thông tin giao hàng!')
		return
	}

	const res = await fetch(`/checkout`, {
		method: 'POST',
		body: JSON.stringify({
			_receiverName,
			_phoneNumber,
			_message,
			_address,
			_payment,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((response) => response.json())

	if (res.status == 'success') {
		alert('Tạo order thành công!')
		window.location.href = '/products'
	} else {
		alert(res.message)
	}
})

$(btn_back).on('click', (e) => {
	e.preventDefault()
	window.location.href = '/cart'
})
