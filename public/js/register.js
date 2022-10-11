function createCookie(name, value, days = 15) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

const form = document.querySelector('#form-register')
// console.log(form)
form.addEventListener('submit', (e) => {
	e.preventDefault()

	

	const formData = new FormData(form)
	// for (let i of formData.entries()) console.log(i)
	if($('#confirm').val() != $('#password').val()) {
		alert('Mật khẩu không trùng với nhau')
		return
	}

	fetch('/auth/register', {
		method: 'POST',
		body: formData,
	})
		.then((response) => response.json())
		.then((result) => {
			console.log('Success:', result)
			if ((result.status == 'fail')) alert('User đã tồn tại')
			else {
				createCookie('tokenId', result.data.token)
				alert('Đăng kí thành công')
				window.location.href = '/'
				// window.location.href = '/auth/login'
			}
		})
		.catch((error) => {
			console.log('Error:', error)
		})
})
