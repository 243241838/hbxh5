<template>
    <div class="container">
        <div class="form">
            <p>
                <span class="fl">
                    <i class="iconfont ico">&#xe633;</i>
                </span>
                <input @keyup="keyup" type="text" placeholder="请输入手机号码" v-model="userName"/>
            </p>
            <p class="pass_word">
                <span class="fl">
                    <i class="iconfont ico1">&#xe638;</i>
                </span>
                <input @keyup="keyup" type="text" class="pass" v-model="smsCode" placeholder="请输入验证密码">
                <span v-show="isGeting" class="fr" :class="{blue:userName.length>=11}"  @click="verify">获取验证码</span>
                <span v-show="!isGeting" class="fr"><span v-text="time.seconds"></span>秒</span>
            </p>
        </div>
        <div style="height:30px;"></div>
        <div class="btn" @click="findPasswordVerify" :class="{green:green}">下一步</div>
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
            check: true,
            icon1: true, //
            time: { // 倒计时
                seconds: ''
            },
            endTime: 0,
            isTimeout: false, // 是否超时
            userName: '', // phone
            loginPwd: '', // 登录密码
            green: false,
            isGeting: true, // 验证码切换
            smsCode: '', // 验证码
            loading: false, // 加载中
            isWinXin: true, // 是否是微信端
            referrerUserId: ''
        }
    },
    created () {
        this.initTime();
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        // 初始化倒计时
        initTime () {
            let t = storage.get('forgetPwdTime');
            let ct = new Date().getTime();
            if (ct < t) {
                this.time60();
            }
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
                bizType: '12', // 找回密码
                mobile: this.userName.trim(),
                codeType: '1' // 短信验证码
            }
            console.log(data)
            this.time60();// 倒计时
            request.getVerifyCode(data, (response) => {
                if (response.data.respCode === '000000') {
                    console.log(response.data.output.smsCode)
                    this.showtoast('获得验证码成功，请注意查收', true)
                } else {
                    this.showtoast('获得验证码失败', true)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        keyup () {
            if (this.userName.length > 0 && (this.smsCode.length > 0 || this.loginPwd.length > 0)) {
                this.green = true;
            } else {
                this.green = false;
            }
        },
        // 倒计时
        // 过期时间
        getEndTime () {
            let sTime = storage.get('forgetPwdTime');
            let endTime = '';
            if (sTime) {
                endTime = new Date().getTime() >= sTime ? new Date().getTime() + 60 * 1000 : sTime;
            } else {
                endTime = new Date().getTime() + 60 * 1000;
            }
            storage.set('forgetPwdTime', endTime);
            return endTime;
        },
        // 登录
        findPasswordVerify () {
            if (this.isTimeout) {
                this.showtoast('请重新获取验证码', true);
                return;
            }
            if (this.green) {
                if (!valid.phone(this.userName)) {
                    this.showtoast('手机号码格式不正确', true)
                    return;
                }
                if (!this.smsCode) {
                    this.showtoast('验证码不能为空', true)
                    return;
                }
                let data = {
                    userName: this.userName,
                    smsCode: this.smsCode,
                    bizType: '12'
                }
                request.findPasswordVerify(data, (response) => {
                    if (response.data.respCode === '000000') {
                        if (response.data.output.userSts !== '0') {
                            this.showtoast(response.data.output.stsDesc, true);
                        } else {
                            window.location.href = './resetPassword.html?findPasswordMD5After=' + response.data.output.findPasswordMD5After + '&userName=' + this.userName;
                        }
                    } else {
                        this.showtoast(response.data.respMsg, true);
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