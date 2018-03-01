<template>
    <div class="container">
        <div class="logo">
            <img src="./images/logo_g.jpg" alt="">
        </div>
        <div class="container_center">
            <div class="form">
                <div class="flexbox box">
                    <div class="flexbox align-items">
                        <i class="iconfont ico">&#xe633;</i>
                    </div>
                    <div class="flex flexbox flex-left align-items">
                        <input class="nop" type="text" placeholder="请输入手机密码" @keyup="keyup" v-model="userName"/>
                    </div>
                </div>
                <div class="item">
                    <span class="fl">
                        <i class="iconfont ico1">&#xe638;</i>
                    </span>
                    <input type="text" class="pass" v-model="smsCode" @keyup="keyup" placeholder="请输入验证密码">
                    <span v-show="isGeting" class="fr yanzhengma" @click="verify" :class="{blue:userName.length>=11}">获取验证码</span>
                    <span v-show="!isGeting" class="fr time"><span v-text="time.seconds"></span>秒</span>
                </div>
                <div class="item pass_word" >
                    <span class="fl">
                        <i class="iconfont ico1">&#xe634;</i>
                    </span>
                    <input v-show="icon1" type="text" @keyup="keyup" placeholder="请输入密码" v-model="loginPwd">
                    <input v-show="!icon1" type="password" @keyup="keyup" placeholder="请输入密码" v-model="loginPwd">
                    <span class="place" v-show="loginPwd.length==0">（6-20位数字、字母组合）</span>
                    <span class="fr" @click="icon1=!icon1">
                        <i class="iconfont ico1" v-show="!icon1">&#xe635;</i>
                        <i class="iconfont ico1" v-show="icon1">&#xe636;</i>
                    </span>
                </div>
            </div>
            <div class="read">
                <span class="read_icon" @click="check=!check">
                    <img class="icon1" v-show="!check" src="../../assets/images/weigouxuan.png" alt="">
                    <img class="icon1" v-show="check"  src="../../assets/images/gouxuan.png" alt="">
                </span>
                <span class="read_a">
                    已阅读并同意<a href="registProtocol.html">《汇保险注册协议》</a>
                </span>
            </div>
            <div class="btn" @click="regUser" :class="{green:green}">立即注册</div>
            <div class="bottom">
                <a href="./login.html">已有账号，去登陆</a>
            </div>
        </div>     
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import { valid, Common, storage } from 'js/common.js';
import request from 'js/interface/request';
import toast from '../../components/toast' // toast引用
import Cookies from 'js/Cookies/Cookies.js'
export default {
    components: {
        toast
    },
    data () {
        return {
            check: true,
            icon1: false,
            isGeting: true, // 验证码切换
            time: { // 倒计时
                seconds: ''
            },
            endTime: 0,
            isTimeout: false, // 是否超时
            userName: '', // phone
            loginPwd: '', // 登录密码
            green: '', // 三个框是否全部不为空
            smsCode: '', // 验证码
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            referrerUserId: ''
        }
    },
    created () {
        this.initTime();
    },
    mounted () {
        this.referrerUserId = Common.getQueryString('referrerUserId');
    },
    computed: {
    },
    methods: {
        // 初始化倒计时
        initTime () {
            let t = storage.get('registTime');
            let ct = new Date().getTime();
            if (ct < t) {
                this.time60();
            }
        },
        verify () {
            // 判断是否为手机号码
            if (this.userName.length >= 11) {
                if (valid.phone(this.userName.trim())) {
                    this.getVerifyCode();
                } else {
                    if (this.userName.length === 0) {
                        this.showtoast('请输入手机号码', true)
                    } else {
                        this.showtoast('手机号码格式有误', true)
                    }
                }
            }
        },
        // 获得验证码
        getVerifyCode () {
            var data = {
                bizType: '10',
                mobile: this.userName.trim(),
                codeType: '1'
            }
            this.time60();
            request.getVerifyCode(data, (response) => {
                if (response.data.respCode === '000000') {
                    console.log(response.data.output.smsCode)
                    this.showtoast('获得验证码成功', true)
                } else {
                    this.showtoast('获得验证码失败', true)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
         // 注册
        regUser () {
            if (this.green && this.check) {
                if (!valid.phone(this.userName.trim())) {
                    if (this.userName.length === 0) {
                        this.showtoast('请输入手机号码', true)
                    } else {
                        this.showtoast('手机号码格式有误', true)
                    }
                    return;
                }
                if (!valid.password(this.loginPwd)) {
                    this.showtoast('密码必须包含数字和字母', true);
                    return;
                }
                if (this.isTimeout) {
                    this.showtoast('请重新获取验证码', true);
                    return;
                }
                var data = {
                    userName: this.userName,
                    loginPwd: this.loginPwd,
                    smsCode: this.smsCode,
                    referrerUserId: this.referrerUserId
                }
                request.regUser(data, (response) => {
                    if (response.data.respCode === '000000') {
                        this.showtoast('注册成功', true)
                        storage.remove('registTime');
                        this.login();
                    } else {
                        this.showtoast(response.data.respMsg, true);
                    }
                }, (error) => {
                    this.showtoast(error, true);
                })
            } else {
                if (!this.green) {
                    return;
                }
                if (!valid.phone(this.userName)) {
                    this.showtoast('手机号码格式不正确', true)
                    return;
                }
                if (!this.smsCode) {
                    this.showtoast('验证码不能为空', true)
                    return;
                }
                if (!this.loginPwd) {
                    this.showtoast('密码不能为空', true);
                    return;
                }
                if (!this.check) {
                    this.showtoast('请勾选汇报险注册协议', true)
                    return;
                }
            }
        },
        // 登录
        login () {
            if (this.isTimeout) {
                this.showtoast('请重新获取验证码', true);
                return;
            }
            var data = {
                loginType: '1',
                userName: this.userName,
                loginPwd: this.loginPwd
            }
            request.login(data, (response) => {
                if (response.data.respCode === '000000') {
                    console.log('登录成功')
                    this.output = response.data.output;
                    Cookies.setSessionId(this.output.sessionId);// 保存会话id
                    Common.setUserId(this.output.userId);// 保存用户id
                    storage.set('userInfo', JSON.stringify(this.output)); // 保存用户信息
                    this.goto();
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        goto () {
            let prevPage = storage.get('prevPage');
            if (prevPage) {
                window.location.href = prevPage;
                storage.remove('prevPage');
            } else {
                window.location.href = 'index.html';
            }
            return false;
        },
        // 过期时间
        getEndTime () {
            let sTime = storage.get('registTime');
            let endTime = '';
            if (sTime) {
                endTime = new Date().getTime() >= sTime ? new Date().getTime() + 60 * 1000 : sTime;
            } else {
                endTime = new Date().getTime() + 60 * 1000;
            }
            storage.set('registTime', endTime);
            return endTime;
        },
        // 倒计时
        time60 () {
            // 毫秒
            this.endTime = this.getEndTime();
            this.isGeting = false;// 切换倒计时和获得验证码
            this.isTimeout = false;// 是否超时
            Common.countdown(this.time, this.endTime, this.isTimeout, (time, isTimeout) => {
                this.time = time;
                this.isTimeout = isTimeout;
                if (this.isTimeout) {
                    this.isGeting = true;
                }
            });
        },
        keyup () {
            if (this.userName.length > 0 && this.loginPwd.length > 0 && this.smsCode.length > 0) {
                this.green = true;
            } else {
                this.green = false;
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