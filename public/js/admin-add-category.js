const dataList = document.getElementById('categories');

const getCategories = (async function() {
    const result = await $.ajax({
        url: `/admin/categories`,
        method: 'GET',
    });
    const allcategories = result.allcategories;

    renderMenu(allcategories, dataList, 0);
})()

function renderMenu(menus, container, parent_id, crrLayer = 0) {
    const renderMenus = menus.filter(menu => menu.parentId == parent_id);
    const childMenus = menus.filter(menu => menu.parentId != parent_id);
    let sub = '';
    for (let i = 1; i <= crrLayer; i++) {
        sub += i + '.';
    }
    if (renderMenus.length > 0) {
        renderMenus.forEach((menu, index) => {
            container.innerHTML += `<option data-value="${menu._id}" >${sub+(index+1)+'.'} ${menu.categoryName}</option>`;
            renderMenu(childMenus, container, menu._id, crrLayer + 1);
        })
    }

}