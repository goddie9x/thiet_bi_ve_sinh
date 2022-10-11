activeNavItem('orders')

let orders = [],
	total = 0,
	totalPages = 0,
	search = '',
	page = 1,
	// filter
	date = '',
	payment = '',
	status = ''

function handlePagination(e) {
	e.preventDefault()
	page = +e.target.innerHTML
	getOrders()
}

// firstly, call api list of orders
async function getOrders() {
	if (!checkOnline()) {
		alert('Không có kết nối internet')
		return
	}

	showLazy()

	const result = await $.ajax({
		url: `/orders/api?page=${page}&search=${search}&date=${date}&payment=${payment}&status=${status}`,
		method: 'GET',
	})

	orders = result.orders
	totalOrderWaiting = result.totalOrderWaiting
	totalPages = result.totalPages

	renderListOfOrders(orders)
	showPagination(totalPages, 'orders')
	document.querySelector('.total-orders span').innerHTML = totalOrderWaiting

	hideLazy()
}

getOrders()

// render list of orders
function renderListOfOrders(orders) {
	let html = ''
	orders.forEach((order, i) => {
		// console.log(order)
		html += `
        <tr>
                    <td> ${i + 1} </td>
                    <td>
                        ${order.receiverName}
                    </td>
                    <td>
                        ${order.phoneNumber}
                    </td>
                    <td>
                        ${order.products.length} sản phẩm
                    </td>
                    <td> ${formatDate(order.createdAt)}</td>
                    <td> ${order.totalCost.toLocaleString()} </td>
                    <td> ${
											order.payment == 'cod' ? 'Ship cod' : 'Chuyển khoản'
										} </td>
                    <td class="order-status ${order.status}"> ${
			order.status
		} </td>
                    <td class="button-action ${order.status}">
                        <button class="detail-order">
                            <a href="/admin/orders/${order._id}">
                                Chi tiết
                            </a>
                        </button>
                        <button class="delivery-order" onclick="deliveryOrder(event)" data-id="${order._id}">
                            Giao hàng
                        </button>
                        <a href="/invoices/${order._id}" target="_blank">
							<button class="bill-order">
								Hóa đơn
							</button>
						</a>
                        <button class="cancel-order" onclick="cancelOrder(event)" data-id="${order._id}">
                            Hủy đơn
                        </button>
                    </td>
                </tr>
        
        `
	})
	createTable('admin-orders', html, orders.length)
}

async function cancelOrder(event) {
	event.preventDefault()
	const td = event.target.closest('.button-action')

	const conf = confirm('Bạn chắc chắn muốn hủy đơn hàng')
	if (!conf) return

	const idOrder = event.target.getAttribute('data-id')
	// console.log(idOrder)

	// add lazing add product
	showLazy()

	const result = await $.ajax({
		url: `/orders/api/${idOrder}/cancel`,
		type: 'put',
	})

	// console.log(result)

	hideLazy()
	if (result.status == 'success') {
		alert('Huỷ đơn hàng thành công')

		document.querySelector('.total-orders span').innerHTML--

		// set status order again
		setStatusOrder(td, 'cancelled')
	} else {
		alert('Hủy đơn hàng thất bại')
	}
}


async function deliveryOrder(event){
	event.preventDefault()
	const td = event.target.closest('.button-action')

	const conf = confirm('Chuẩn bị giao hàng')
	if (!conf) return

	const idOrder = event.target.getAttribute('data-id')
	// console.log(idOrder)

	// add lazing add product
	showLazy()

	const result = await $.ajax({
		url: `/orders/api/${idOrder}/delivery`,
		type: 'put',
	})

	// console.log(result)

	hideLazy()
	if (result.status == 'success') {
		alert('Giao hàng thành công')

		document.querySelector('.total-orders span').innerHTML--

		// set status order again
		setStatusOrder(td, 'done')

	} else {
		alert('Giao hàng thất bại')
	}
}

function setStatusOrder(td, status){
	td.className = `button-action ${status}`
	const pre = td.previousElementSibling
	pre.className = `order-status ${status}`
	pre.innerHTML = status
}

const processChange = debounce(() => searchOrder())

// search orders
let inputSearch = $('.orders-action .action-search input')
function searchOrder() {
	search = inputSearch.val()
	page = 1
	getOrders()
}

$('.orders-action .action-search input').on('keyup', processChange)

// // filter follow date
let statusDate = ''
const actionDate = document.querySelector('.action-date')
actionDate.addEventListener('click', handleActionDate)
function handleActionDate() {
	if (statusDate == 'down' || statusDate == '') {
		orders = orders.sort(function (a, b) {
			return new Date(a.createdAt) - new Date(b.createdAt)
		})
		statusDate = 'up'
		actionDate.querySelector('span').innerHTML =
			'<i class="fas fa-sort-amount-down-alt"></i>'
	} else if (statusDate == 'up') {
		orders = orders.sort(function (a, b) {
			return new Date(b.createdAt) - new Date(a.createdAt)
		})

		statusDate = 'down'

		actionDate.querySelector('span').innerHTML =
			'<i class="fas fa-sort-amount-up"></i>'
	}

	renderListOfOrders(orders)
}

// handle filter select
function handleFilter(obj) {
	// console.log(obj.value)
	const [filter, value] = obj.value.split('-')
	status = payment = date = ''
	// console.log(filter, value)
	if (filter == 'date') date = value
	if (filter == 'payment') payment = value
	if (filter == 'status') status = value

	// call api
	page = 1
	getOrders()
}
