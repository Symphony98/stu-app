module.exports = {
  lintOnSave: false,
  devServer :{
    host:"0.0.0.0", // 允许所有的主机访问当前项目
      proxy:{
          '/api':{ // 正则匹配到以这个开头的时候 就用代理
              target:"http://chst.vip", // 指向的是目标服务器
              pathRewrite:{
                  '^/api':""
              }
          }
      }
  }
};
