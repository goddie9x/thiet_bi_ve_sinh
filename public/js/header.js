function logout() {
    document.cookie = "tokenId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert('Bạn đã đăng xuất')
    window.location.reload();
}

//active css nav-item
var pathName = window.location.pathname
pathName = pathName.slice(1, pathName.length)
switch (pathName) {
	case 'products':
		$('.header-menu #product').addClass('active')
		break
	case 'news':
		$('.header-menu #news').addClass('active')
		break
	case '':
		$('.header-menu #home').addClass('active')
		break
	default:
		break
}

//go top button
const menuLeft = $('.header-menu__left')
const goTop = $('.go-top')

function menuToggle() {
	menuLeft.toggleClass('active')
	disableScroll()
}
//disable scroll event
function disableScroll() {
	if (menuLeft.hasClass('active')) {
		goTop.removeClass('show')
		$('body').css({ margin: '0', height: '100%', overflow: 'hidden' })
	} else {
		goTop.addClass('show')
		$('body').css({ margin: '', height: '%', overflow: '' })
	}
}

disableScroll()

//scroll event
const header = $('#header')
window.addEventListener('scroll', () => {
	if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
		header.addClass('shink')
		// logo.css('height','70px')
		goTop.addClass('show')
	} else {
		header.removeClass('shink')
		goTop.removeClass('show')
		header.css('background-color', '')
	}
})

//open modal with search
// var currentUrl = window.location.pathname + window.location.search
var products = []
function openSearch() {
	$('.modal').addClass('active')
	$('body').css({ margin: '0', height: '100%', overflow: 'hidden' })
    inputSearch.focus()
}

function closeSearch() {
	// history.replaceState(null, null, currentUrl)
	$('.modal').removeClass('active')
	$('body').css({ margin: '', height: '', overflow: '' })
    $('.search-result').html('')
    inputSearch.val('')
}

$('.overlay').on('click', closeSearch)
$('.modal-inner').on('click', (e) => {
	e.stopPropagation()
})

// debounce
function debounce(func, timeout = 200) {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
		}, timeout)
	}
}

const processChange = debounce(() => searchProduct())

$('.search-input input').on('keyup', (e) => {
    if(e.keyCode === 13)
        return window.location.href = `/products?search=${e.target.value}`
    
    processChange()
})

let inputSearch = $('.search-input input')
let oldInputSearch = ''
async function searchProduct() {

    const search = inputSearch.val()
	if (search != '' && oldInputSearch != search) {
		const res = await $.ajax({
			url: `/products/api?search=${search}&input=true`,
			type: 'GET',
		})
		products = res.productCodes
        oldInputSearch = search
        $('.search-result').html('')
        
		if (products.length > 0) {
            console.log(products.length)
			for (let product of products) {
				$('.search-result').append(`
            <a href="/products/detail/${product._id}" class="search-result__item">
                <div class="search-result-item__icon">
                    <img src="${product.images[0]}" loading="lazy"/>
                </div>
                <div class="search-result-item__name">
                    ${product.name}
                </div>
                <div class="search-result-item__price">
                    ${product.cost.toLocaleString()}
                </div>
            </a>
            `)
			}
		} else {
			$('.search-result').append(`
                    <a href="/products" class="search-result__item">
                     Không tìm thấy sản phẩm
                    </a>
            `)
		}
	}
}


const lazy = document.querySelector('.lazy-loading')
function showLazy() {
	lazy.classList.remove('hide')
}

function hideLazy() {
	lazy.classList.add('hide')
}