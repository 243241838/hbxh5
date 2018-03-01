<template>
    <div class="container">
        <div class="logo">
            <img src="./images/login.png" alt="">
        </div>
        <div class="flexbox justify-content align-items">    
            <div class="form">
                <div class="item">
                    <span class="fl">
                        <i class="iconfont ico">&#xe633;</i>
                    </span>
                    <input @keyup="keyup" type="text" placeholder="请输入手机号码" v-model="userName"/>
                </div>
                <div v-if="edit" class="item pass_word">
                    <span class="fl">
                        <i class="iconfont ico1">&#xe638;</i>
                    </span>
                    <input @keyup="keyup" type="text" class="pass" v-model="smsCode" placeholder="请输入验证密码">
                    <span v-show="isGeting" class="fr yanzhengma" :class="{blue:userName.length>=11}"  @click="verify">获取验证码</span>
                    <span v-show="!isGeting" class="fr time"><span v-text="time.seconds"></span>秒</span>
                </div>
                <div class="item pass_word" v-if="!edit">
                    <span class="fl">
                        <i class="iconfont ico1">&#xe634;</i>
                    </span>
                    <input @keyup="keyup" v-show="!icon1" type="text" placeholder="请输入密码" v-model="loginPwd">
                    <input @keyup="keyup" v-show="icon1" type="password" placeholder="请输入密码" v-model="loginPwd">
                    <span class="place" v-show="loginPwd.length==0">（6-20位数字、字母组合）</span>
                    <span class="fr" @click="icon1=!icon1">
                        <i class="iconfont ico1" v-show="icon1">&#xe635;</i>
                        <i class="iconfont ico1" v-show="!icon1">&#xe636;</i>  
                    </span>
                </div>
            </div>
        </div>
        <div v-if="!isWinXin" class="read">
            <div class="fl" v-show="edit">
                <span class="read_icon" @click="check=!check">
                    <img class="icon1" v-show="!check" src="../../assets/images/weigouxuan.png" alt="">
                    <img class="icon1" v-show="check"  src="../../assets/images/gouxuan.png" alt="">
                </span>
                <span class="read_a">
                    已阅读并同意<a href="registProtocol.html">《汇保险注册协议》</a>
                </span>
            </div>
            <div class="fr" v-show="!edit"><a class="forgetP" href="./forgetPassword.html">忘记密码</a></div>
        </div>
        <div v-if="isWinXin" style="height:30px;"></div>
        <div class="btn" @click="login" :class="{green:green}">立即登录</div>
        <div v-if="!isWinXin">
            <div class="bottom">
                <a v-show="!edit" class="note" href="javascript:;" @click="edit=!edit;loginPwd='';green=false;">短信登录</a>
                <a v-show="edit"  class="note" href="javascript:;" @click="edit=!edit;smsCode='';green=false;">密码登录</a>
                <span class="string"></span>
                <a class="regist" href="./regist.html">我要注册</a>
            </div>
            <div class="else">
                <div class="line">
                    <div></div>
                </div>
                <div class="else_div">其他登录方式</div>
                <div class="line">
                    <div></div>
                </div>
            </div>
            <div class="WeChat">
                <i class="iconfont icon1">&#xe637;</i>
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
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
        toast,
        loading
    },
    data () {
        return {
            output: '',
            check: true,
            icon1: true, //
            time: { // 倒计时
                seconds: ''
            },
            endTime: 0,
            isTimeout: false, // 是否超时
            userName: '', // phone
            loginPwd: '', // 登录密码
            green: '',
            edit: true, // true短信登录, false密码登录
            isGeting: true, // 验证码切换
            smsCode: '', // 验证码
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            loading: false, // 加载中
            isWinXin: true, // 是否是微信端
            referrerUserId: '',
            fromUrl: '' //登录前的跳转过来的页面地址
        }
    },
    created () {
        this.initTime();
        this.fromUrl = window.location.href.split('login.html?')[1];  //获取强制跳到登录页前的页面地址
        console.log(this.fromUrl);
        if (Common.getQueryString('referrerUserId')) {
            this.referrerUserId = Common.getQueryString('referrerUserId');
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.isWinXin = valid.isWeiXin();
        })
    },
    methods: {
        // 初始化倒计时
        initTime () {
            let t = storage.get('loginTime');
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
        // 倒计时
        // 过期时间
        getEndTime () {
            let sTime = storage.get('loginTime');
            let endTime = '';
            if (sTime) {
                endTime = new Date().getTime() >= sTime ? new Date().getTime() + 60 * 1000 : sTime;
            } else {
                endTime = new Date().getTime() + 60 * 1000;
            }
            storage.set('loginTime', endTime);
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
        // 获得验证码
        getVerifyCode () {
            var data = {
                bizType: '11', // 登录
                mobile: this.userName.trim(),
                codeType: '1' // 短信验证码
            }
            this.time60();// 倒计时
            request.getVerifyCode(data, (response) => {
                if (response.data.respCode === '000000') {
                    console.log(response.data.output.smsCode)
                    // this.showtoast(response.data.output.smsCode, true);
                    this.showtoast('获得验证码成功，请注意查收', true)
                } else {
                    this.showtoast('获得验证码失败', true)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 登录
        login () {
            if (this.isTimeout) {
                this.showtoast('请重新获取验证码', true);
                return;
            }
            // 微信端
            if (this.isWinXin) {
                this.messageLogin();
            // 浏览器端
            } else {
                // 短信登录
                if (this.edit) {
                    this.messageLogin();
                // 密码登录
                } else if (!this.edit) {
                    this.passwordLogin();
                }
            }
        },
        // 短信登录
        messageLogin () {
            if (this.green && this.check) {
                let data = {
                    userName: this.userName,
                    loginType: '2', // 短信
                    smsCode: this.smsCode,
                    referrerUserId: this.referrerUserId
                }
                request.login(data, (response) => {
                    if (response.data.respCode === '000000') {
                        this.loading = false;
                        this.output = response.data.output;
                        storage.set('sessionId', this.output.sessionId)
                        storage.set('userId', this.output.userId);// 保存用户id
                        storage.set('userInfo', JSON.stringify(this.output)); // 保存用户信息
                        storage.set('mobile', this.output.mobile)
                        storage.remove('loginTime');
                        this.loading = true;
                        this.goto();
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
                if (!this.check && !this.isWinXin) {
                    this.showtoast('请勾选汇报险注册协议', true)
                    return;
                }
            }
        },
        // 密码登录
        passwordLogin () {
            if (this.green) {
                let data = {
                    userName: this.userName,
                    loginType: '1', // 密码
                    loginPwd: this.loginPwd,
                    referrerUserId: this.referrerUserId
                }
                this.loading = true;
                request.login(data, (response) => {
                    if (response.data.respCode === '000000') {
                        this.loading = false;
                        this.output = response.data.output;
                        storage.set('sessionId', this.output.sessionId)
                        storage.set('userId', this.output.userId);// 保存用户id
                        storage.set('userInfo', JSON.stringify(this.output)); // 保存用户信息
                        storage.set('mobile', this.output.mobile)
                        storage.remove('loginTime');
                        this.goto();
                    } else {
                        this.showtoast(response.data.respMsg, true);
                        this.loading = false;
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
                if (!this.loginPwd) {
                    this.showtoast('密码不能为空', true);
                    return;
                }
                if (!valid.password(this.password)) {
                    this.showtoast('密码格式错误', true);
                    return;
                }
            }
        },
        goto () {
            let prevPage = storage.get('prevPage');
            if (prevPage) {
                window.location.href = prevPage;
                storage.remove('prevPage');
            } else {
                if (this.fromUrl) {
                    window.location.href = this.fromUrl;
                } else {
                    window.location.href = 'index.html';
                }
            }
            return false;
        },
        keyup () {
            // 微信端
            if (this.isWeiXin) {
                if (this.userName.length > 0 && this.smsCode.length > 0) {
                    this.green = true;
                } else {
                    this.green = false;
                }
            // 浏览器
            } else {
                if (this.userName.length > 0 && (this.smsCode.length > 0 || this.loginPwd.length > 0)) {
                    this.green = true;
                } else {
                    this.green = false;
                }
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