import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)
// import dynamicRoutes from "./dynamicRoutes"

const routes = [
    {
        path: "/login",
        name: "login",
        component: () => import(/* webpackChunkName:"login" */ "../pages/Login")
    },
    // ...dynamicRoutes
]
// console.log(routes);

const router = new VueRouter({
    routes
})
// 解决当第二次以后点击路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router