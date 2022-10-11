const formData = new FormData();
const form = document.querySelector('form');

CKEDITOR.instances['editor'].setData($('#editor').text())
formData.set('isNew', false);
formData.set('banner',$('.news-banner img').attr('src'))
//upload image
$('.upload-icon').click(function(){
    $('#banner').click();
})
//change preview banner when upload images
$('#banner').change(function(){
    let [file] = this.files
      if (file) {
          // preview banner
      $('.news-banner img').attr('src', URL.createObjectURL(file));
      //append file to formdata
      formData.set('banner',file)
    }
    formData.set('isNew', true)
})


//call api to add news
form.addEventListener('submit', async function(e){
    e.preventDefault();
    const id = $('.news-container').attr('id');
    //append title to formdata
    formData.set('title', $('#input-title').val());
    var slug = $('#input-title').val().replace(/\s+/g,"-").toLowerCase();
    formData.set('slug', slug)
    //append description to formdata
    formData.set('description', CKEDITOR.instances.editor.getData());
    // for (let i of formData.entries()) console.log(i)
    const res = await fetch(`/admin/edit-news/${id}`, {
        method: 'PUT',
        body: formData
    })

    if(res.status == 200){
        alert('Sửa tin tức thành công')
        window.location.href = '/admin/news'
    }else {
        alert('Sửa tin tức thất bại')
    }
})