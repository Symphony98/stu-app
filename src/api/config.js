import axios from "axios"
import router from "../router"
import ElementUi from "element-ui"
// 引入ElementUI 但不推荐使用
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

axios.create({
    withCredentials: true,
    timeout: 7000
})
let env = process.env.NODE_ENV;
switch (env) {
    case "development":
        axios.defaults.baseURL = "/api"
        break;
    case "production":
        axios.defaults.baseURL = "http://chst.vip"
        break
}

// 设置请求拦截器
// config就是被拦截器拦截掉的请求配置
// return config 拦截器放行
axios.interceptors.request.use(config => {
    if (config.url === "/users/login") {
        return config
    } else {
        // 登入成功后会将token存入localStorage中
        let token = localStorage.getItem("qf-token")
        // 在请求头中添加 authorization 属性给后端用于校验token
        config.headers["authorization"] = token
        return config
    }
})

// 设置响应拦截器
// 达到效果：用户登录超时，或者token被人恶意修改后，还可以继续访问页面，需要做的是跳转到登录页面重新登录
// 注意：校验token需要在发送请求的时候进行，所以如果需要触发这个，需要在页面上发送请求
// 请求的过程中需要携带token进行校验，如果校验通过，那么返回的返回的code值是200
// 如果token不正确，请求不到数据，那么返回的是校验错误的状态码，这里是1004
axios.interceptors.response.use(config => {
    let data = config.data
    // 1004表示校验失败
    // 10022表示登入态失效
    if (data) {
        if (data.code === "1004" || data.code === "10022") {
            ElementUi.Message.error('登入过期')
            localStorage.removeItem('wf-token')//重要
            router.push("/login")
        } else {
            return config
        }
    } else {
        ElementUi.Message.error('请求出错')
    }

})

export default axios;