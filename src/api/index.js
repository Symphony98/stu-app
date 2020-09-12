import axios from "./config"
// 登录验证
export const login = (data) => axios({
    method: "post",
    url: "/users/login",
    data
})
// 获取登录日志
export const getLoginLog = () => axios.get("/getloginlog")
// 获取当前用户的权限菜单
export const getMenuList = () => axios.get("/permission/getMenuList")
// 获取学员项目信息
export const getStuList = (params = {}) => {
    return axios({
        url: "/students/getstulist",
        params
    })
}

export const addStu = (data) => axios({
    method: "post",
    url: "/students/addstu",
    data
})
//删除接口
export const delStu = (sId) => axios.get(`/students/delstu?sId=${sId}`)

// 编辑学员信息
export const updateStu = (updated = {}) => axios({
    url: '/students/updatestu',
    method: 'post',
    data: updated
})

// 搜索学员
export const searchStu = (params) => axios({
    url: "/students/searchstu",
    params
})

// 获取班级
export const getClasses = () => axios.get('/students/getclasses')
