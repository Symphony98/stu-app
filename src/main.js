import Vue from "vue";
import App from "./App.vue";
// import router from "./router/router";
import router from "./router"

import store from "./store";
// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import "./assets/style/el-reset.css"
import "./assets/style/all-reset.css"
// 引入iconfont
import "./assets/iconFont/iconfont.js"

import has from "./utils/has"

// use
Vue.use(ElementUI)

Vue.prototype.$has = has

//自定义指令处理鉴权
Vue.directive("hasbtn", {
  bind(el, binding, VNode) {
    let buttons = JSON.parse(localStorage.getItem("user-button"))
    if (!has(buttons, binding.value)) {
      let className = el.className
      el.className = className + " " + "is-disabled"
      console.log(className);
      el.disabled = true
    }
  }
})

Vue.config.productionTip = false;
// 路由导航守卫钩子
router.beforeEach((to, from, next) => {
  // 如果当前路径是登录页，那么就不需要拦截，直接放行
  if (to.path === "/login") {
    next()
  } else {
    // 从localStorage中取出token，如果没有token直接跳转到登录页面登录
    const token = localStorage.getItem("qf-token")
    // 如果有token
    if (token) {
      // 验证当前的用户是否创建了权限菜单，如果没有
      if (!store.state.sideMenu.length) {
        // 通过调用store的actions中的函数动态添加权限菜单
        store.dispatch('FETCH_MENULIST')
          .then(() => {
            //这里要注意, next里面要传参数即要进入的页面的路由信息，因为next传参数后，当前要进入的路由会
            //被废止，转而进入参数对应的路由，虽然是同一个路由，这么做主要是为了确保addRoutes生效了。
            next({ path: to.path })
          })
        // .catch(err => console.log(err))
      }
      next()
    } else {
      next({ path: "/login" })
    }
  }
})
// 路由后置钩子，页面跳转完成后触发
router.afterEach((to, form) => {
  store.commit('SET_CRUMB', to.matched)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
