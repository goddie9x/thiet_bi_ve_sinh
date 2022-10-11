// formatDate
function formatDate(time) {
	const date = new Date(time)
	
	return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

// debounce
function debounce(func, timeout = 300) {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
		}, timeout)
	}
}

function showPagination(totalPages, page) {
	const containerPagination = document.querySelector('.pagination')
	let html = ''
	for (let i = 1; i <= totalPages; i++) {
		html += `
			<a href="/admin/${page}?page=${i}" onclick="handlePagination(event)">
				${i}
			</a>
		`
	}
	containerPagination.innerHTML = html
}

const lazy = document.querySelector('.lazy-loading')
function showLazy() {
	lazy.classList.remove('hide')
}

function hideLazy() {
	lazy.classList.add('hide')
}

function createTable(nameTable, html, length) {
	// create tbody
	const tbody = document.createElement('tbody')
	tbody.innerHTML = html

	const table = document.querySelector(`.${nameTable} table`)

	const oldTableBody = table.querySelector('tbody')
	oldTableBody && oldTableBody.remove()

	table.appendChild(tbody)

	if (length === 0) {
		table.querySelector('tbody').innerHTML =
			'<h2 style="margin-top: 10px;">Không tìm thấy dữ liệu</h2>'
	}
}

function checkOnline() {
	return navigator.onLine
}


function formatMoney(money){
	return money.toLocaleString()
}