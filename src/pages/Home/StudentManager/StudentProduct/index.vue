<template>
  <div class="body">
    <div class="search">
      <!-- 搜索下拉框 -->
      <el-select
        v-model="searchValue"
        filterable
        clearable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        @change="changeSearchList"
        @blur="searchBlur"
        :remote-method="remoteMethod"
        :loading="loading"
      >
        <el-option v-for="item in searchList" :key="item.sId" :label="item.name" :value="item.name"></el-option>
      </el-select>
      <!-- 搜索按钮 -->
      <el-button type="primary" icon="el-icon-search" plain @click="searchButton"></el-button>
      <!-- 添加按钮 -->
      <el-button type="primary" v-hasbtn="'add'" @click="addStuList" class="addBtn">添加项目</el-button>

      <!-- 班级选择 -->
      <div class="select-class">
        <!-- 框框 -->
        <el-form>
          <el-form-item label="选择班级:">
            <el-select
              v-model="classes"
              filterable
              @visible-change="classVisible"
              @change="classChange"
              placeholder="请选择"
            >
              <el-option label="全部" value="all"></el-option>
              <el-option
                v-for="(item,index) in classOptions"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="dialog">
        <template>
          <!-- dialog窗口 用于添加和编辑的弹窗-->
          <el-dialog :title="dialogInfo.title" :visible.sync="dialogVisible">
            <el-form :model="stuForm" :rules="stuRules" ref="addStuRuleForm">
              <el-form-item label="头像">
                <el-upload
                  class="uploadAvatar"
                  ref="uploadAvatar"
                  action="http://chst.vip/students/uploadStuAvatar"
                  list-type="picture-card"
                  :on-success="uploadSuccess"
                  :on-remove="removeAvatar"
                  :limit="1"
                  name="headimgurl"
                  :multiple="false"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="stuForm.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="项目地址" prop="productUrl">
                <el-input v-model="stuForm.productUrl" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="班级" prop="class">
                <el-input v-model="stuForm.class" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="年龄" prop="age">
                <el-input v-model="stuForm.age" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="城市" prop="city">
                <el-input v-model="stuForm.city" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="学历" prop="degree">
                <el-input v-model="stuForm.degree" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input v-model="stuForm.description" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmClick('addStuRuleForm')">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </div>
    </div>

    <div class="exportExcel">
      <el-button icon="iconfont icon-excel" @click="exportExcel">导出excel数据</el-button>
    </div>
    <!-- 表格 -->
    <div class="table">
      <template>
        <el-table v-loading="loading" :data="stuList" border style="width: 100%">
          <el-table-column prop="headimgurl" label="头像" width="80" align="center">
            <template scope="scope">
              <el-avatar shape="square" :size="35" fit="fill" :src="scope.row.headimgurl"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
          <el-table-column prop="class" label="班级" width="150" align="center"></el-table-column>
          <el-table-column prop="productUrl" label="项目" align="center"></el-table-column>
          <el-table-column align="center" label="操作">
            <template scope="{row}">
              <el-button
                v-hasbtn="'read'"
                type="primary"
                class="btn"
                icon="el-icon-view"
                @click="$router.push({path:'/StudentManager/studentProfile'})"
              >查看</el-button>
              <el-button
                type="primary"
                v-hasbtn="'edit'"
                class="btn"
                icon="el-icon-edit"
                @click="changeStu(row)"
              >编辑</el-button>
              <el-button
                type="danger"
                v-hasbtn="'delete'"
                class="btn"
                icon="el-icon-delete"
                @click="deleteStu(row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-if="total>1"
          background
          hide-on-single-page
          layout="prev, pager, next"
          @current-change="changePage"
          :total="total"
          :page-size="dataCount"
        ></el-pagination>
      </template>
    </div>
  </div>
</template>

<script>
import qee from "qf-export-excel";
import { getStuList, delStu, searchStu, getClasses } from "@/api";
const api = require("@/api");

export default {
  data() {
    return {
      params: {
        class: "",
        count: 5
      }, //搜索学员传递的信息
      dataCount: 5, //分页器一页显示的数量
      dataPage: "",
      total: 0, //分页器的页数
      stuList: [], //table列表的信息
      loading: true, //加载动画的布尔值
      // dialog
      dialogInfo: {
        title: "增加学员信息",
        requestName: "",
        editSuccessMsg: "增加成功",
        editerrorMsg: "增加失败"
      },
      showAvatar: true,
      dialogVisible: false, //控制dialog的显示和隐藏
      stuRules: {
        name: [{ required: true, message: "请输入名字", trigger: "blur" }],
        class: [{ required: true, message: "请输入班级", trigger: "blur" }],
        degree: [{ required: true, message: "请输入学历", trigger: "blur" }],
        city: [{ required: true, message: "请输入城市", trigger: "blur" }],
        productUrl: [
          { required: true, message: "请输入项目地址", trigger: "blur" }
        ],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        description: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ]
      },
      stuForm: {
        name: "",
        productUrl: "",
        headimgurl: "",
        class: "",
        age: "",
        city: "",
        degree: "",
        description: ""
      },
      searchList: [], //input下拉框中展示的值
      searchValue: "", //input框中的值
      blurValue: "", //失去焦点时需要显示的值
      classes: "",
      classOptions: [] //班级下拉框的可能值
    };
  },
  methods: {
    //更新table列表的函数
    updataStuList(params) {
      this.loading = true;
      params = this.params;
      params.count = this.dataCount || "";
      params.page = this.dataPage || "";
      getStuList(params)
        .then(res => {
          if (res.data && res.data.state) {
            this.stuList = res.data.data;
            this.total = res.data.total;
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    uploadSuccess(r) {
      // 上传成功 给stuForm添加一条 headimgurl的属性
      this.stuForm.headimgurl = r.headimgurl;
      console.log(r);
    },
    removeAvatar(r) {
      this.stuForm.headimgurl = "";
    },
    addStuList() {
      // 点击添加按钮，让dialog显示出来
      this.dialogVisible = true;
      // 修改dialog显示信息，当前是在增加数据
      this.dialogInfo.title = "增加学员信息";
      this.dialogInfo.requestName = "addStu";
      this.dialogInfo.editSuccessMsg = "增加成功";
      this.dialogInfo.editerrorMsg = "增加失败";
    },

    changeStu(row) {
      // 点击修改按钮，让dialog显示出来
      this.dialogVisible = true;
      // 修改dialog显示信息，当前是在修改数据
      this.dialogInfo.title = "修改学员信息";
      this.dialogInfo.requestName = "updateStu";
      // 由于是引用数据类型，如果不遍历存储，当前dialog里面的值发生改变，外面table里的值也会发生改变
      this.stuForm = { ...row };
      this.dialogInfo.editSuccessMsg = "修改成功";
      this.dialogInfo.editerrorMsg = "修改失败";
    },
    // dialog中的点击事件
    confirmClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 本地表单校验通 将表单信息提交到后台
          // 关闭 dialog
          this.dialogVisible = false;
          //增加或者编辑
          api[this.dialogInfo.requestName](this.stuForm)
            .then(res => {
              if (res.data && res.data.state) {
                // 提示添加成功 更新表格
                this.$message.success(this.dialogInfo.editSuccessMsg);
                this.updataStuList();
                // 清空stuForm数据对象
                if (this.stuForm["_id"]) delete this.stuForm["_id"]; //清理_id字段 防止bug
                Object.keys(this.stuForm).forEach(
                  key => (this.stuForm[key] = "")
                );
                this.$refs["uploadAvatar"].clearFiles(); //清空上传文件
              } else {
                this.$message.warning(this.dialogInfo.editerrorMsg);
              }
            })
            .catch(err => {
              console.log(err);
              this.$message.error("登入过期网络错误");
            });
          //编辑
        } else {
          this.$message.error("请将内容填写完整");
        }
      });
    },
    // 删除按钮
    deleteStu(row) {
      // 提示框
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }) // 如果用户选择的是确定，那么就进入这个
        .then(() => {
          delStu(row.sId).then(res => {
            if (res.data && res.data.state) {
              // console.log(res.data);
              this.updataStuList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message.warning("删除出错了");
            }
          });
        }) // 如果点击的是取消，那么就提示取消删除
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //搜索框
    // input框中的值发生改变的时候
    remoteMethod(query) {
      const key = query;
      const count = this.dataCount;
      const params = {
        key,
        count
      };
      // 存储当前输入框的值
      this.blurValue = query;
      searchStu(params)
        .then(res => {
          if (res.data && res.data.state) {
            this.searchList = res.data.data;
            this.$message.success("搜索成功");
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error("搜索出错");
        });
    },
    // input框中的选项被点击的时候
    changeSearchList(searchValue) {
      const key = this.searchValue;
      const count = this.dataCount;
      const params = {
        key,
        count
      };
      searchStu(params)
        .then(res => {
          if (res.data && res.data.state) {
            this.stuList = res.data.data;
            this.total = res.data.total; // 对total分页总数进行更改
            this.$message.success("搜索成功");
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error("搜索出错");
        });
    },
    // 点击搜索按钮
    searchButton() {
      this.loading = true;
      const key = this.searchValue;
      const count = this.dataCount;
      const page = this.dataPage;
      const params = {
        key,
        count,
        page
      };
      searchStu(params)
        .then(res => {
          if (res.data && res.data.state) {
            // 更改表格数据对象
            this.stuList = res.data.data;
            this.total = res.data.total; // 对total分页总数进行更改
            this.loading = false;
          } else {
            this.$message.warning("搜索失败");
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error("搜索出错");
        });
    },
    // 输入框失去焦点的时候，让输入框保持上次输入的值
    searchBlur() {
      // 使用中间变量转储上次输入的值
      this.searchValue = this.blurValue;
    },

    //班级选择
    classVisible(isVisible) {
      if (!isVisible) return;
      this.dataPage = 1;
      getClasses()
        .then(res => {
          if (res.data && res.data.state) {
            this.classOptions = res.data.data;
            // this.$message.success("搜索班级成功")
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.success("搜索出错");
        });
    },
    //班级下拉框选中
    classChange(input) {
      if (!input) return;
      const count = this.dataCount;
      this.params = input === "all" ? { count } : { class: input, count };
      this.updataStuList(this.params);
    },

    //分页器
    changePage(page) {
      this.dataPage = page;
      // 点击分页切换的时候 需要判断是否搜索了 如果搜索了 那么就应该在搜索结果中 进入第后面页码数据
      if (this.searchValue) {
        this.searchButton();
        return;
      }
      this.updataStuList(this.params);
    },
    //导出到excel
    exportExcel() {
      const titleList = [
        {
          title: "头像",
          key: "headimgurl"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "班级",
          key: "class"
        },
        {
          title: "项目",
          key: "productUrl"
        }
      ];
      const dataSource = this.stuList;
      qee(titleList, dataSource, "学员数据");
    }
  },
  mounted() {
    // 请求数据，渲染页面
    this.updataStuList();
  }
};
</script>

<style>
.uploadAvatar {
  text-align: left;
}
.el-upload-list__item.is-success,
.el-upload--picture-card {
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
}
.el-dialog_header {
  padding: 0 !important;
  line-height: 60px;
}
.select-class {
  line-height: 40px;
  text-align: left;
  margin-bottom: 20px;
}
.stu-table .btn {
  width: 65px;
  height: 25px;
  padding: 0;
}
.pagination {
  margin-top: 20px;
}

.el-form {
  margin: 10px;
}

.search {
  margin: 10px !important;
  text-align: left;
}

.exportExcel {
  text-align: right;
}

.exportExcel .el-button {
  color: wheat;
  background-color: green;
}
</style>