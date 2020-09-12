// 递归获取用户权限菜单
/**
 * 
 * @param {Array} allRoutes 完整的路由配置数组
 * @param {Array} menuList 从服务器获取的当前用户拥有的菜单数组
 */
const recursionRoutes = (allRoutes = [], menuList = []) => {
    let newRouter = []
    allRoutes.forEach(item => {
        menuList.forEach(h => {
            // 如果当前的allRoutes中有一项的name和menuList的name是相等的，那么就push到newRouter中
            if (item.meta.name === h.name) {
                // 如果menuList的某一项有children，那么就进行递归，然后将值赋给当前的第item项
                if (h.children && h.children.length > 0) {
                    item.children = recursionRoutes(item.children, h.children)
                }
                newRouter.push(item)
            }
        })
    })
    return newRouter
}

export default recursionRoutes