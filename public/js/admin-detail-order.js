async function deliveryOrder(event){
	event.preventDefault()
	const orderAction = event.target.closest('.order-action')
    
    const id = orderAction.getAttribute('data-id')
    // console.log(id)
	const conf = confirm('Chuẩn bị giao hàng')
	if (!conf) return

	// add lazing add product
	showLazy()

	const result = await $.ajax({
		url: `/orders/api/${id}/delivery`,
		type: 'put',
	})

	// console.log(result)

	hideLazy()
	if (result.status == 'success') {
		alert('Giao hàng thành công')

		orderAction.className = 'order-action done'
        document.querySelector('.info-order .status span').className = 'done'
	} else {
		alert('Giao hàng thất bại')
	}
}


async function cancelOrder(event) {
	event.preventDefault()
	const orderAction = event.target.closest('.order-action')
    
    const id = orderAction.getAttribute('data-id')
    // console.log(id)
	const conf = confirm('Hủy đơn hàng')
	if (!conf) return

	// add lazing add product
	showLazy()

	const result = await $.ajax({
		url: `/orders/api/${id}/cancel`,
		type: 'put',
	})

	// console.log(result)

	hideLazy()
	if (result.status == 'success') {
		alert('Huỷ đơn hàng thành công')

		orderAction.className = 'order-action cancelled'
        document.querySelector('.info-order .status span').className = 'cancelled'
	} else {
		alert('Hủy đơn hàng thất bại')
	}
}
