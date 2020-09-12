<template>
  <div class="main">
    <!-- 在最外层的div再嵌套一层div，用于循环创建 -->
    <div v-for="(item,index) in sideMenu" :key="index">
      <!-- 如果当前的item有children，那么就进入这里进行递归 -->
      <el-submenu :index="item.path" v-if="item.children&&item.children.length>0">
        <!-- 当前item项渲染一级菜单 -->
        <template slot="title">
          <!-- iconfont -->
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="item.meta.icon" />
          </svg>
          <span slot="title">{{item.meta.name}}</span>
        </template>
        <!-- 子组件进行递归，渲染成父组件的二级菜单 -->
        <el-menu-item-group>
          <!-- 这里的标签名必须和下面定义的name属性一致才可以完成递归 -->
          <!-- sub-to-menu就是组件本身，调用本身就是开始递归，在递归前保存当前一级菜单的路由 -->
          <sub-to-menu :sideMenu="item.children" :parentPath="'/'+item.path"></sub-to-menu>
        </el-menu-item-group>
      </el-submenu>
      <!-- 如果没有children，那么就直接渲染成一级菜单 -->
      <el-menu-item :index="parentPath+'/'+item.path" @click="jump(item.name)" v-else>
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="item.meta.icon" />
        </svg>
        <span slot="title">{{item.meta.name}}</span>
      </el-menu-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "sub-to-menu", // 对应的是需要递归的组件名称
  // 通过props接收父组件传递过来的sideMenu
  props: {
    sideMenu: {
      type: true,
      default: () => []
    },
    parentPath: {
      type: String,
      default: ""
    }
  },
  methods: {
    // 使用编程式导航进行路由跳转
    jump(name) {
      this.$router.push({ name });
    }
  }
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>