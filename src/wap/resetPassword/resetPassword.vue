<template>
    <div class="container">
        <div class="form">
            <p class="pass_word">
                <span class="fl">
                    <i class="iconfont ico1">&#xe634;</i>
                </span>
                <input @keyup="keyup" v-show="!icon1" type="text" placeholder="请输入密码" v-model="loginPwd1">
                <input @keyup="keyup" v-show="icon1" type="password" placeholder="请输入密码" v-model="loginPwd1">
                <span class="place" v-show="loginPwd1.length==0">（6-20位数字、字母组合）</span>
                <span class="fr" @click="icon1=!icon1">
                    <i class="iconfont ico1" v-show="icon1">&#xe635;</i>
                    <i class="iconfont ico1" v-show="!icon1">&#xe636;</i>  
                </span>
            </p>
            <p class="pass_word" id="bordertop">
                <span class="fl">
                    <i class="iconfont ico1">&#xe634;</i>
                </span>
                <input @keyup="keyup" v-show="!icon2" type="text" placeholder="请输入密码" v-model="loginPwd2">
                <input @keyup="keyup" v-show="icon2" type="password" placeholder="请输入密码" v-model="loginPwd2">
                <span class="place" v-show="loginPwd2.length==0">（6-20位数字、字母组合）</span>
                <span class="fr" @click="icon2=!icon2">
                    <i class="iconfont ico1" v-show="icon2">&#xe635;</i>
                    <i class="iconfont ico1" v-show="!icon2">&#xe636;</i>  
                </span>
            </p>
        </div>
        <div style="height:30px;"></div>
        <div class="btn" @click="findPassword" :class="{green:green}">完成</div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import { valid, Common, storage } from 'js/common.js';
import request from 'js/interface/request';
import toast from '../../components/toast' // toast引用
import loading from '../../components/loading';
import Cookies from 'js/Cookies/Cookies.js';
export default {
    components: {
        toast
    },
    data () {
        return {
            toast: {
                isshow: false,
                message: ''
            },
            output: '',
            icon1: true,
            icon2: true,
            loginPwd1: '', // 登录密码
            loginPwd2: '',
            green: false,
            isGeting: true, // 验证码切换
            loading: false, // 加载中
            referrerUserId: ''
        }
    },
    created () {
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        keyup () {
            if (this.loginPwd1.length > 0 && this.loginPwd2.length > 0) {
                this.green = true;
            } else {
                this.green = false;
            }
        },
        // 登录
        findPassword () {
            if (this.green) {
                if (this.loginPwd1 !== this.loginPwd2) {
                    this.showtoast('两次密码不一致', true);
                    return;
                }
                if (!valid.password(this.loginPwd1)) {
                    this.showtoast('密码格式错误', true);
                    return;
                }
                var data = {
                    userName: Common.getQueryString('userName'), // 手机号码
                    findPassword: this.loginPwd1,
                    findPassword2: this.loginPwd2,
                    findPasswordMD5After: Common.getQueryString('findPasswordMD5After'),
                    bizType: '12'
                }
                request.findPassword(data, (response) => {
                    if (response.data.respCode === '000000') {
                        window.location.href = './login.html';
                    } else {
                        this.showtoast(response.data.respMsg, true)
                    }
                }, (error) => {
                    this.showtoast(error, true);
                })
            }
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        }
    }
}
</script>