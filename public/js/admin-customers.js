activeNavItem('customers')

let customers = [],
	total = 0,
	totalPages = 0,
	search = '',
	page = 1,
	date = ''

function handlePagination(e) {
	e.preventDefault()
	page = +e.target.innerHTML
	getCustomers()
}

// firstly, call api list of customers
async function getCustomers() {
	if (!checkOnline()) {
		alert('Không có kết nối internet')
		return
	}

	showLazy()

	const result = await $.ajax({
		url: `/users?page=${page}&search=${search}&date=${date}`,
		type: 'GET',
	})

	customers = result.users
	total = result.total
	totalPages = result.totalPages

	renderListOfCustomers(customers)
	showPagination(totalPages, 'customers')
	document.querySelector('.total-customers span').innerHTML = total

	hideLazy()
}

getCustomers()

// click add product button
// document.querySelector('.action-add').addEventListener('click', (e) => {
// 	window.location.href = '/admin/add-product'
// })

// render list of customers
function renderListOfCustomers(customers) {
	let html = ''
	customers.forEach((customer, index) => {
		html += `
        <tr>
        <td class="stt-customer">${index + 1}</td>
        <td class="id-customer">
            <a href="/admin/customers/${customer._id}">${customer._id}</a>
			
        </td>
        <td class="cover-customer">
            <img
                src="${customer.avatar}"
                alt=""
            />
        </td>
        <td class="name-customer">${customer.name}</td>
        <td class="name-customer">${formatDate(customer.createdAt)}</td>
        <td class="phone-customer">${customer.phoneNumber}</td>
        <!-- <td class="sold-customer">10</td>  -->
        <td class="action-customer">
            <a href="/admin/customers/${customer._id}">
                <button>
                    <i class="far fa-eye"></i>
                </button>
            </a>
            <a href="/admin/customers/${customer._id}">
                <button>
                    <i class="fas fa-edit"></i>
                </button>
            </a>
            <a href="#" onclick="deleteCustomer(event)">
                <button>
                    <i class="far fa-trash-alt"></i>
                </button>
            </a>
            
        </td>
    </tr>
    `
	})
	createTable('admin-customers', html, customers.length)
}

// show more product
// function showMoreProduct(event) {
// 	const moreProduct = event.currentTarget.closest('tr').nextElementSibling
// 	// console.log(moreProduct)
// 	$(moreProduct).toggle(100)
// }

async function deleteCustomer(event) {
	event.preventDefault()

	const tr = event.target.closest('tr')
	// console.log(tr)

	const idCustomer = tr.querySelector('.id-customer a').innerText
	const conf = confirm('Bạn chắc chắn muốn xóa khách hàng')
	// console.log(conf)
	if (!conf) return

	// add lazing add product
	showLazy()

	const res = await fetch(`/users/${idCustomer}`, {
		method: 'DELETE',
	}).then((response) => response.json())

	// console.log(res.status == 'success')
	if (res.status == 'success') {
		alert('Xóa khách hàng thành công')
		tr.remove()

		// update customers
		customers = customers.filter((item) => {
			return item._id !== idProduct
		})

		document.querySelector('.total-products span').innerHTML--
	} else {
		if ((res.message = 'User đang có đơn hàng')) alert('User đang có đơn hàng')
		else alert('Xóa khách hàng thất bại')
	}

	hideLazy()
}

const processChange = debounce(() => searchProduct())

// search customers
let inputSearch = $('.customers-action .action-search input')
function searchProduct() {
	search = inputSearch.val()
	page = 1
	getCustomers()
}

$('.customers-action .action-search input').on('keyup', processChange)

// filter follow date
let statusDate = ''
const actionDate = document.querySelector('.action-date')
actionDate.addEventListener('click', handleActionDate)
function handleActionDate() {
	if (statusDate == 'down' || statusDate == '') {
		customers = customers.sort(function (a, b) {
			return new Date(a.createdAt) - new Date(b.createdAt)
		})
		statusDate = 'up'
		actionDate.querySelector('span').innerHTML =
			'<i class="fas fa-sort-amount-down-alt"></i>'
	} else if (statusDate == 'up') {
		customers = customers.sort(function (a, b) {
			return new Date(b.createdAt) - new Date(a.createdAt)
		})

		statusDate = 'down'

		actionDate.querySelector('span').innerHTML =
			'<i class="fas fa-sort-amount-up"></i>'
	}

	renderListOfCustomers(customers)
}

// // handle filter select
// function handleFilter(obj) {
// 	// console.log(obj.value)
// 	const [filter, value] = obj.value.split('-')
// 	date = cost = left = ''
// 	// console.log(filter, value)
// 	if (filter == 'left') left = value
// 	if (filter == 'cost') cost = value
// 	if (filter == 'date') date = value
// 	// console.log(date)
// 	// console.log(cost)
// 	// console.log(left)

// 	// call api
// 	page = 1
// 	getCustomers()
// }
