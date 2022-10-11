function createCookie(name, value, days = 15) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const user = document.querySelector('#user').value
    let email = phoneNumber = user

    const password = document.querySelector('#password').value

    const result = $.ajax({
        url: '/auth/login',
        type: 'POST',
        data: {
            password, email, phoneNumber
        }
    })
        .then(data => {
            createCookie('tokenId', data.data.token)
            alert('Đăng nhập thành công')

            window.location.href = '/'

            // window.history.back()

        })
        .catch(error => {
            alert('Mật khẩu hoặc email/phone không đúng')
            // window.location.href = '/auth/login'
        })

})

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

btn.addEventListener('click', (e) => {
    e.preventDefault()
    modal.style.display = "block";
})

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}