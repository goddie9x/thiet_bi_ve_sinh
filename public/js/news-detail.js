  //send mail
  const form = document.querySelector('form');
  const formData = new FormData();    
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    formData.set('email',$('input[name="email"]').val()); 
    const result = await $.ajax({
        url: '/news/send-mail',
        method: 'POST',
        body: formData,
    })
    console.log(result)
})
