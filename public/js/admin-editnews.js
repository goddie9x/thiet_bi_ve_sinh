async function deleteNews(id){
    try {
        if (confirm('Are you sure you want to delete this news?')) {
        const res = await fetch(`/admin/delete-news/${id}`,{
            method: 'DELETE'
        })
        console.log(res)
        if(res.status === 200){
            alert('Đã xóa thành công');
            location.reload();
        }
    }
    } catch (error) {
        console.log(error)
    }
}