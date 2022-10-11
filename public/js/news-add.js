const formData = new FormData();
const form = document.querySelector('form');

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
      $('.news-banner img').css('display','block');
      $('.news-banner svg').css('display','none');
      //append file to formdata
      formData.set('banner',file)
    }
})

function adding(){
    $('#add-news').addClass('hide');
    $('.loading-button').removeClass('hide');
}

function stopAdd(){
    $('#add-news').removeClass('hide');
    $('.loading-button').addClass('hide');
}


//call api to add news
form.addEventListener('submit', async function(e){
    e.preventDefault();
    adding()
    //append title to formdata
    formData.set('title', $('#input-title').val());

    formData.set('slug', $('#input-title').val().replace(/\s+/g,"-").toLowerCase())
    //append description to formdata
    formData.set('description', CKEDITOR.instances.editor.getData());
    // for (let i of formData.entries()) console.log(i)
    const res = await fetch('/admin/add-news', {
        method: 'POST',
        body: formData
    })

    if(res.status == 200){
        alert('Thêm tin tức thành công')
        window.location.href ='/admin/news'
    }else {
        alert('Thêm tin tức thất bại')
        stopAdd()
    }
})