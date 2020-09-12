<template>
  <div class="home">
    <el-container>
      <!-- 左侧菜单栏 -->
      <el-aside width="200">
        <h1 class="logo" style="height:60px;background-color:red">万锋智慧</h1>
        <!-- 给需要高亮的列表添加动态的值，这个值就是当前文件所在的路由值 -->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :collapse="isTarget">
          <!-- 通过父传子将需要渲染的数据传递 -->
          <subMenu :sideMenu="$store.state.sideMenu"></subMenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 右侧头部 -->
        <el-header>
          <!-- 左侧图标 -->
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="6" class="left-col">
              <div class="grid-content" @click="isTarget=!isTarget">
                <svg class="icon" aria-hidden="true" v-if="isTarget">
                  <use xlink:href="#icon-shouye" />
                </svg>

                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#icon-icon_huabanfuben" />
                </svg>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">千峰学员管理系统</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-avatar
                  :size="40"
                  fit="fit"
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                ></el-avatar>
                <span>欢迎您：</span>
                <!-- <span class="name">{{nickname}}</span> -->
                <span class="name">{{userInfo.nickname}}</span>
                <span class="quit" @click="quit">退出</span>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-for="(item,index) in crumb"
              :key="index"
              :to="{ path: item.path || '/Welcome' }"
            >{{item.meta.name || "首页"}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getLoginLog, getMenuList } from "@/api";
import subMenu from "@/components/subMenu";
import { mapState } from "vuex";

export default {
  data() {
    return {
      isTarget: false
    };
  },
  components: {
    subMenu
  },
  computed: {
    // nickname() {
    //   let nickname = this.$store.state.userInfo.nickname;
    //   return nickname === "" ? "" : nickname;
    // },
    ...mapState(["crumb", "userInfo"])
  },
  created() {
    this.$store.dispatch("FETCH_MENULIST");
  },
  methods: {
    // 退出按钮
    quit() {
      localStorage.removeItem("qf-token");
      localStorage.removeItem("user-button")
      // localStorage.removeItem("userInfo");
      this.$router.push("/login");
      // 强制刷新页面，解决用户路由错乱
      window.location.reload();
    }
  }
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-header {
  background: linear-gradient(135deg, #4c67ff, #5635df);
}

.el-header .left-col {
  cursor: pointer;
  width: 50px;
  margin-right: 100px;
}

.el-aside {
  background: linear-gradient(135deg, #5635df, #4c67ff);
  background-color: #d3dce6;
  color: #333;
  /* text-align: center; */
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 500px;
}
/* logo样式 */
.logo {
  text-align: center;
  line-height: 60px;
  background: linear-gradient(135deg, #4c67ff, #5635df);
}

/* header */
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  background: linear-gradient(135deg, #4c67ff, #5635df);
  background-color: #b3c0d1;
}
/* 导航栏最右边的样式 */
.grid-content {
  color: #fff;
}

.el-avatar {
  margin: 5px;
  vertical-align: middle;
}
.quit {
  margin: 10px;
  display: inline-block;
  cursor: pointer;
  border: 1px solid saddlebrown;
  background-color: saddlebrown;
  color: red;
  width: 40px;
  font-size: 14px;
  line-height: 30px;
}

.name {
  font-size: 18px;
  color: orangered;
}
</style>
