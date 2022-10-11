activeNavItem('products')

let productCodes = [],
	total = 0,
	totalPages = 0,
	search = '',
	page = 1,
	// filter
	date = '',
	cost = '',
	left = ''

function handlePagination(e) {
	e.preventDefault()
	page = +e.target.innerHTML
	getProducts()
}

// firstly, call api list of products
async function getProducts() {
	if (!checkOnline()) {
		alert('Không có kết nối internet')
		return
	}

	showLazy()

	const result = await $.ajax({
		url: `/products/api?page=${page}&search=${search}&date=${date}&cost=${cost}&left=${left}`,
		method: 'GET',
	})

	productCodes = result.productCodes
	total = result.total
	totalPages = result.totalPages

	renderListOfProducts(productCodes)
	showPagination(totalPages, 'products')
	document.querySelector('.total-products span').innerHTML = total

	hideLazy()
}

getProducts()

// click add product button
document.querySelector('.action-add').addEventListener('click', (e) => {
	window.location.href = '/admin/add-product'
})

// render list of products
function renderListOfProducts(productCodes) {
	let html = ''
	productCodes.forEach((productCode, index) => {
		let productHTML = ''
		productCode.products.forEach((item) => {
			productHTML += `
                <tr>
                    <td>${item.color}</td>
                    <td>${item.size}</td>
                    <td>${item.total}</td>
                </tr>
            `
		})

		html += `
        <tr>
        <td class="stt-product">${index + 1}</td>
        <td class="id-product">
            <a href="/admin/products/${productCode._id}">${productCode._id}</a>
        </td>
        <td class="cover-product">
            <img
                src="${productCode.images[0]}"
                alt=""
            />
        </td>
        <td class="name-product">${productCode.name}</td>
        <td>${formatDate(productCode.createdAt)}</td>
        <td class="cost-product">${productCode.cost.toLocaleString()}</td>
        <td class="sold-product">${productCode.type}</td>
        <td class="last-product">${productCode.total}</td>
        <td class="action-product">
            <button onclick="showMoreProduct(event)">
                <i class="fas fa-chevron-down"></i>
            </button>
            <a href="/admin/products/${productCode._id}">
                <button>
                    <i class="fas fa-edit"></i>
                </button>
            </a>
            <a href="#" onclick="deleteProductCode(event)">
                <button>
                    <i class="far fa-trash-alt"></i>
                </button>
            </a>
            
        </td>
    </tr>
    <tr class="more-product-table">
        <td></td>
        <td></td>
        <td colspan="3">
            <table class="table table-border">
                <tr>
                    <th>Màu sắc</th>
                    <th>Kích thước</th>
                    <th>Số lượng</th>
                </tr>
                ${productHTML}
            </table>
        </td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    `
	})
	createTable('admin-products', html, productCodes.length)
}

// show more product
function showMoreProduct(event) {
	const moreProduct = event.currentTarget.closest('tr').nextElementSibling
	// console.log(moreProduct)
	$(moreProduct).toggle(100)
}

async function deleteProductCode(event) {
	event.preventDefault()

	const tr = event.target.closest('tr')
	// console.log(tr)

	const idProduct = tr.querySelector('.id-product a').innerText
	// console.log(idProduct)
	const conf = confirm('Bạn chắc chắn muốn xóa sản phẩm')
	// console.log(conf)
	if (!conf) return

	// add lazing add product
	showLazy()

	const res = await fetch(`/products/code/api/${idProduct}`, {
		method: 'DELETE',
	}).then((response) => response.json())

	hideLazy()
	console.log(res)

	// console.log(res.status == 'success')
	if (res.status == 'success') {
		// lazy.classList.toggle('hide')
		alert(res.message)
		tr.nextElementSibling.remove()
		tr.remove()

		document.querySelector('.total-products span').innerHTML--
	} else {
		alert(res.message)
	}
}

const processChange = debounce(() => searchProduct())

// search products
let inputSearch = $('.products-action .action-search input')
function searchProduct() {
	search = inputSearch.val()
	page = 1
	getProducts()
}

$('.products-action .action-search input').on('keyup', processChange)
// $('.products-action .action-search i').on('click', processChange)

// filter follow cost
let statusCost = ''
const actionCost = document.querySelector('.action-cost')
actionCost.addEventListener('click', handleActionCost)
function handleActionCost() {
	if (statusCost == 'down' || statusCost == '') {
		productCodes = productCodes.sort((a, b) => a.cost - b.cost)
		statusCost = 'up'

		actionCost.querySelector('span').innerHTML =
			"<i class='fas fa-sort-amount-down-alt'></i>"
	} else if (statusCost == 'up') {
		productCodes = productCodes.sort((a, b) => b.cost - a.cost)
		statusCost = 'down'
		actionCost.querySelector('span').innerHTML =
			'<i class="fas fa-sort-amount-up"></i>'
	}

	renderListOfProducts(productCodes)
}

// filter follow date
let statusDate = ''
const actionDate = document.querySelector('.action-date')
actionDate.addEventListener('click', handleActionDate)
function handleActionDate() {
	if (statusDate == 'down' || statusDate == '') {
		productCodes = productCodes.sort(function (a, b) {
			return new Date(a.createdAt) - new Date(b.createdAt)
		})
		statusDate = 'up'
		actionDate.querySelector('span').innerHTML =
			'<i class="fas fa-sort-amount-down-alt"></i>'
	} else if (statusDate == 'up') {
		productCodes = productCodes.sort(function (a, b) {
			return new Date(b.createdAt) - new Date(a.createdAt)
		})

		statusDate = 'down'

		actionDate.querySelector('span').innerHTML =
			'<i class="fas fa-sort-amount-up"></i>'
	}

	renderListOfProducts(productCodes)
}

// filter follow left
let statusLeft = ''
const actionLeft = document.querySelector('.action-left')
actionLeft.addEventListener('click', handleActionLeft)
function handleActionLeft() {
	if (statusLeft == 'down' || statusLeft == '') {
		productCodes.sort((a, b) => a.total - b.total)

		statusLeft = 'up'

		actionLeft.querySelector('span').innerHTML =
			"<i class='fas fa-sort-amount-down-alt'></i>"
	} else if (statusLeft == 'up') {
		productCodes.sort((a, b) => b.total - a.total)
		statusLeft = 'down'
		actionLeft.querySelector('span').innerHTML =
			'<i class="fas fa-sort-amount-up"></i>'
	}

	renderListOfProducts(productCodes)
}

// handle filter select
function handleFilter(obj) {
	// console.log(obj.value)
	const [filter, value] = obj.value.split('-')
	date = cost = left = ''
	// console.log(filter, value)
	if (filter == 'left') left = value
	if (filter == 'cost') cost = value
	if (filter == 'date') date = value
	// console.log(date)
	// console.log(cost)
	// console.log(left)

	// call api
	page = 1
	getProducts()
}
