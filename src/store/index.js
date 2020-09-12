import Vue from "vue";
import Vuex from "vuex";

import { getMenuList } from "@/api";  // 从后台获取当前所有列表
import dynamicRoutes from "@/router/dynamicRoutes";
import recursionRoutes from "@/utils/recursionRoutes";
import allRoutes from "@/router/allRoutes";
import router from "@/router";

Vue.use(Vuex);

let userInfo = JSON.parse(localStorage.getItem("userInfo"))

export default new Vuex.Store({
  state: {
    // 存储用户信息
    userInfo,
    // 存储用户菜单
    sideMenu: [],
    // 存储面包屑
    crumb: [],
    //鉴权按钮
    permission: []
  },
  mutations: {
    // 获取用户信息
    SET_USERINFO(state, payload) {
      state.userInfo = payload
    },
    // 该函数的作用是将递归出来的用户菜单，存入路由和sideMenu中
    SET_MENULIST(state, payload) {
      // 为当前的sideMenu赋值
      state.sideMenu = payload
      // 由于dynamicRoutes中包含了多个配置路由，我们需要找的的是 / 路径的路由
      let target = dynamicRoutes.find(item => item.path === "/")
      // 找到 / 后，为该路由配置children
      target.children = [...payload]
      // 通过动态的方式加入到routes中 用addRoutes()
      router.addRoutes(dynamicRoutes)
    },
    // 存储鉴权按钮
    SET_PERMISSION_BUTTONS(state, payload) {
      state.permission = payload
    },
    // 设置面包屑的值
    SET_CRUMB(state, payload) {
      state.crumb = payload
    }
  },
  actions: {
    async FETCH_MENULIST({ commit }) {
      // 获取当前用户权限菜单
      let res = await getMenuList()
      // console.log(res);
      if (res && res.data) {
        // 实际包含了权限菜单的数组，但是该数组中只有name属性，不是真正的路由
        let menuList = res.data.menuList;
        // 通过调用定义好的递归函数，求出当前登录用户的权限菜单，该数组是实际用户权限菜单的路由
        let userMenu = recursionRoutes(allRoutes, menuList)
        // 调用mutations的函数
        commit("SET_MENULIST", userMenu)
      }
    }
  }
});
