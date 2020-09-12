<template>
  <div class="main">
    <div class="left"></div>
    <video
      src="../../assets/img/login.mp4"
      autoplay="autoplay"
      loop="loop"
      preload="auto"
      muted="muted"
    />
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <h1 class="txt">千峰管理系统</h1>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="text"
          v-model="ruleForm.password"
          autocomplete="off"
          @keydown.enter.native="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" class="btn">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api";
// import { Loading } from "element-ui";

export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ validator: this.validateUsername, trigger: "blur" }],
        password: [{ validator: this.validatePassword, trigger: "blur" }]
      }
    };
  },
  methods: {
    validateUsername(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    },
    validatePassword(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 加入加载动画（Element UI)
          const loading = this.$loading({
            lock: true,
            text: "正在加载中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          // 校验成功，发送登录请求，校验后台数据
          let { username, password } = this.ruleForm;
          login({ username, password })
            .then(res => {
              if (res.data.state) {
                // 存储token
                let { token } = res.data;
                localStorage.setItem("qf-token", token);

                // 登入成功提示框（Element UI)
                this.$message.success("登入成功，正在加载...");
                // 登入成功，即将跳转页面的时候关闭动画
                loading.close();

                localStorage.setItem(
                  "userInfo",
                  JSON.stringify(res.data.userInfo)
                );
                localStorage.setItem(
                  "user-button",
                  JSON.stringify(res.data.permission.buttons)
                );
                this.$store.commit("SET_USERINFO", res.data.userInfo);
                this.$store.commit(
                  "SET_PERMISSION_BUTTONS",
                  res.data.permission.buttons
                );
                // 跳转到首页
                this.$router.push({ path: "/" });
              } else {
                loading.close();
                // 登录发生错误（用户名或密码不正确）（Element UI)
                this.$message.error("用户名或密码不正确");
              }
            })
            .catch(err => console.log(err));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
#app {
  position: relative;
}
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.left {
  width: 50%;
  height: 100%;
  background-image: url("../../assets/img/bg2.png");
  background-repeat: no-repeat;
  background-size: 50%;
  position: absolute;
  opacity: 0.7;
  background-position: 60% 65%;
}
.main .el-form {
  width: 400px;
  height: 487px;
  position: fixed;
  background-color: rgba(255, 255, 255, 0.2);
  right: 180px;
  top: 120px;
  border-radius: 10px;
  text-align: center;
}
.main .el-form labal {
  width: 80px !important;
  padding: 0 !important;
}
.main .el-form .el-form-item__error {
  margin-left: 120px !important;
}

.main .el-form .el-input,
.el-button {
  width: 250px;
}

.main .el-form .txt {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 50px;
  line-height: 164px;
}

.main .el-form .btn {
  background: linear-gradient(90deg, #1596fb, #002dff);
}
</style>