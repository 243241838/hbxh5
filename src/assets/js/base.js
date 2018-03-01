import Vue from 'vue'
import VueRouter from 'vue-router';
import axios from 'axios'
Vue.use(VueRouter);
// import wx from 'wx';
// 导入全局css,scss路径在webpack.base.confi.js配置了别名
module.exports = {
    Vue, axios
}
