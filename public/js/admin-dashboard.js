const boxes = document.querySelectorAll('.admin-statistical .box')
boxes.forEach((box) => {
	box.addEventListener('click', (e) => {
		window.location.href = '/admin/' + e.currentTarget.getAttribute('name-nav')
	})
})

activeNavItem('dashboard')