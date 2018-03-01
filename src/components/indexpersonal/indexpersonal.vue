<template>
    <footer id="foot"> 
        <div class="close" @click="is()">
            <i class="iconfont">&#xe629;</i>
        </div>
       <div class="head_portrait">
           <div class="top">
               <div class="t_img" @click="isLogin()" :style="{'backgroundImage': 'url(' + logo + ')'}">
               </div>
               <div class="name">
                   <span v-if="output.nickName" v-text="output.nickName"></span>
                   <span v-else="output.mobile" v-text="output.mobile"></span>
                   <span v-show="!output.mobile&&!output.nickName">请登录</span>
               </div> 
           </div>
       </div>
       <div class="list">
           <div class="head">保险商城</div>
            <div class="item flexbox" @click="homepage()">
                <div class="icon flexbox align-items">
                    <i class="iconfont">&#xe64f;</i>
                </div>
                <div class="right flex flexbox align-items">商城主页</div>
            </div>
            <div class="item first flexbox" @click="car_href()">
                <div class="icon flexbox align-items">
                    <i class="iconfont">&#xe64d;</i>
                </div>
                <div class="right flex flexbox align-items">车险商城</div>
            </div>
           <div class="head">我的服务</div>
           <div class="item flexbox" @click="isLogin()">
                <div class="icon flexbox align-items">
                    <i class="iconfont">&#xe653;</i>
                </div>
                <div class="right flex flexbox align-items">个人中心</div>
          </div>
          <div class="item flexbox" @click="policy_url()">
                <div class="icon flexbox align-items">
                    <i class="iconfont">&#xe64b;</i>
                </div>
                <div class="right flex flexbox align-items">我的保单</div>
           </div>
           <div class="item flexbox" @click="claim()">
                <div class="icon flexbox align-items">
                    <i class="iconfont">&#xe650;</i>
                </div>
                <div class="right flex flexbox align-items">我的理赔</div>
           </div>
           <div class="item last flexbox" @click="surrender()">
                <div class="icon flexbox align-items">
                    <i class="iconfont">&#xe650;</i>
                </div>
                <div class="right flex flexbox align-items">退保管理</div>
           </div>
           <div class="head">汇保险</div>
           <!--<a href="http://dl.xzqxzs.com/download/百度h5平台}_51@228318.exe" download>-->
           <a href="javascript:;">
                <div class="item flexbox">
                    <div class="icon flexbox align-items">
                        <i class="iconfont">&#xe654;</i>
                    </div>
                    <div class="right flex flexbox align-items">下载APP</div>
                </div>
           </a>
           <div class="item flexbox" @click="idea()">
                <div class="icon flexbox align-items">
                    <i class="iconfont">&#xe651;</i>
                </div>
                <div class="right flex flexbox align-items">意见反馈</div>
           </div>
           <a href="aboutus.html">
                <div class="item flexbox">
                    <div class="icon flexbox align-items">
                        <i class="iconfont">&#xe64a;</i>
                    </div>
                    <div class="right flex flexbox align-items">关于我们</div>
                </div>
           </a>
           <a href="tel:400-678-6078">
                <div class="item last flexbox">
                    <div class="icon flexbox align-items">
                        <i class="iconfont">&#xe64c;</i>
                    </div>
                    <div class="right flex flexbox align-items">服务热线：<span> 400-110-1866</span></div>
                </div>
           </a>
           <div class="btn" v-if="output.nickName||output.mobile" @click="off()">退出</div>
       </div>
       <!--toasts提示组件-->
       <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </footer>
</template>
<script>
import {Common, storage, valid} from 'js/common';
import request from 'js/interface/request';
import Cookies from 'js/Cookies/Cookies';
import toast from '../toast'; // toast引用
export default {
    components: {
        toast
    },
    name: 'personal',
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            output: '',
            foot: '',
            pos: '',
            url: '',
            list: '',
            logo: require('./images/img.png')
        }
    },
    created () {
        this.ins();
    },
    mounted () {
        this.foot = document.getElementById('foot');
        this.pos = document.getElementById('body');
        this.url = window.location.href.split('/');
        this.list = document.getElementById('ui-scroll')
    },
    watch: {
    },
    methods: {
        //初始化
        ins () {
            this.output = JSON.parse(storage.get('userInfo'))?JSON.parse(storage.get('userInfo')):'';
            if (this.output) {
                if (this.output.logo) {
                    this.logo = this.output.logo;
                }
            }
        },
        off () {
            var data = {
                userId: Common.getUserId()
            }
            let index = this.url.length - 1;
            request.logout(data, (response) => {
                if (response.data.respCode === '000000') {
                    this.showtoast(response.data.respMsg, true)
                    storage.remove('userId');
                    storage.remove('userInfo');
                    storage.remove('mobile');
                    // 浏览器端需要删除sessionId
                    storage.remove('sessionId');
                    this.output = '';
                    this.logo = require('./images/img.png');
                    this.is();
                } else {
                    this.showtoast(response.data.respMsg, true)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        //关闭侧滑
        is () {
            this.foot.style.top = '-17.2rem';
            if (this.pos) {
                this.pos.style.position = 'static';
                if (this.list) {
                    this.list.style.position = 'static';
                }
            }
        },
        // 跳转主页
        homepage () {
            let index = this.url.length - 1;
            if (this.url[index] !== 'index.html') {
                window.location.href = 'index.html';
            } else {
                this.is();
            }
        },
        // 跳转车险商城
        car_href () {
            this.is();
            window.location.href = 'productList.html?productType=103249';
            return false;
        },
        //点击头像 和个人中心
        isLogin () {
            if (this.output) {
                window.location.href = 'personal.html'
            } else {
                this.login_url();
            }
        },
        // 点击我的保单
        policy_url () {
            if (this.output) {
                window.location.href = 'personal.html#/homePolicy'
            } else {
                this.login_url();
            }
        },
        // 点击我的理赔
        claim () {
            if (this.output) {
                window.location.href = 'personal.html#/applyClaims';
            } else {
                this.login_url();
            }
        },
        //点击退保管理
        surrender () {
            if (this.output) {
                window.location.href = 'personal.html#/surrender'
            } else {
                this.login_url();
            }
        },
        // 点击意见反馈
        idea () {
            if (this.output) {
                window.location.href = 'feedback.html'
            } else {
                this.login_url()
            }
        },
        login_url () {
            let index = this.url.length - 1;
            if (this.url[index] !== 'index.html') {
                storage.set('prevPage', this.url[index]);
            }
            window.location.href = 'login.html'
        },
         // toast
        showtoast (msg, isshow) {
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        showpersonal (isshow) {
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        }
    }
}
</script>
<style lang='scss'>
@import "../../assets/scss/usage/layout/reset.scss";
@import "../../assets/scss/usage/layout/common.scss";
footer{
    width:100%;
    height:17.2rem;
    background:#fff;
    position:absolute;
    left:0;
    top:-17.2rem;
    z-index:10;
    opacity:0.95;
    transition: all 0.3s linear;
    .close{
        padding-top:0.35rem;
        padding-bottom:0.33rem;
        padding-left:0.36rem;
        .iconfont{
             font-size:0.28rem;
        }
    }
   .head_portrait{
       .top{
           .t_img{
               width:1rem;
               height:1rem;
               border-radius:50%;
               margin:0 auto;
               background: url('images/img.png') no-repeat center center;
		       background-size: cover;
           }
           .name{
               text-align:center;
               font-size:0.28rem;
               color:#a8afac;
               line-height:0.65rem;
               margin-bottom:0.07rem;
           }
       }
   }
   .list{
       width:100%;
       padding:0 0.72rem;
       .head{
           font-size:0.24rem;
           color:#a8afac;
           line-height:0.5rem;
           @include border(0 0 1px 0,#e3e3e3,solid);
           margin-bottom:0.6rem;
       }
       .item{
           height:0.45rem;
           margin-bottom:0.6rem;
           padding-left:0.25rem;
           div{
               height:100%;
           }
           .icon{
               width:0.71rem;
               .iconfont{
                   font-size:0.44rem;
                   color:#a8afac;
               }
           }
           .right{
               font-size:0.32rem;
               color:#5a5e5c;
               line-height:0.45rem;
               span{
                   color:#2dce8f;
               }
           }
       }
       .first{
           margin-bottom:0.36rem;
       }
       .last{
           margin-bottom:0.28rem;
       }
       .btn{
           margin-top:0.62rem;
           width:100%;
           height:0.88rem;
           text-align:center;
           line-height:0.88rem;
           @include border(1px,#2dce8f,solid,0.1rem);
           font-size:0.36rem;
           color:#2dce8f;
       }
   }
}
</style>