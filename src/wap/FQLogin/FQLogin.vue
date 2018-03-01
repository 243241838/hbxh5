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
                <div class="item pass_word">
                    <span class="fl">
                        <i class="iconfont ico1">&#xe638;</i>
                    </span>
                    <input @keyup="keyup" type="text" class="pass" v-model="smsCode" placeholder="请输入验证码">
                    <span v-show="isGeting" class="fr" :class="{'blue':userName.length>=11}"  @click="verify">获取验证码</span>
                    <span v-show="!isGeting" class="fr"><span v-text="time.seconds"></span>秒</span>
                </div>
            </div>
        </div>
        <div v-if="isWeiXin" class="isWeiXin"></div>
        <div class="read" v-if="!isWeiXin">
            <div class="fl flexbox">
                <span class="read_icon" @click="check=!check;keyup();">
                    <img class="icon1" v-show="!check" src="../../assets/images/weigouxuan.png" alt="">
                    <img class="icon1" v-show="check"  src="../../assets/images/gouxuan.png" alt="">
                </span>
                <span class="read_a">
                    已阅读并同意<a href="FQRegistProtocol.html">《汇保险注册协议》</a>
                </span>
            </div>
        </div>
        <div v-if="isWeiXin" class="btn" @click="login" :class="{green:green}">确定</div>
        <div v-else class="btn" @click="login" :class="{green:green}">立即登录</div>
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
import weixinSDK from 'js/weixinSDK';
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
            isGeting: true, // 验证码切换
            smsCode: '', // 验证码
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            loading: false, // 加载中
            referrerUserId: '',
            isCommit: false,
            isWeiXin: false
        }
    },
    created () {
        this.initTime();
        if (Common.getQueryString('referrerUserId')) {
            this.referrerUserId = Common.getQueryString('referrerUserId');
        }
    },
    mounted () {
        // 微信端
        if (valid.isWeiXin()) {
            this.isWeiXin = true;
            document.getElementsByTagName('title')[0].innerText = '完善信息';
        }
        if (valid.isWeiXin()) {
            this.userAccess();
            this.initWeixinSDK();
        }
    },
    computed: {
    },
    methods: {
        userAccess () {
            if (Common.getQueryString('code')) {
                this.wxAuthLogin(Common.getQueryString('code'));
            }
        },
        wxAuthLogin (code) {
            let data = {
                code: code
            }
            if (storage.get('domainId')) {
                data.domainId = storage.get('domainId');
                storage.remove('domainId')
            } else if (storage.get('referrerUserId')) {
                data.referrerUserId = storage.get('referrerUserId');
                storage.remove('referrerUserId')
            }
            // window.alert(JSON.stringify(data))
            request.wxAuthLogin(data, (response) => {
                // window.alert(JSON.stringify(response))
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (output) {
                        storage.set('unionId', output.unionId);
                    }
                } else {
                    // window.alert(response.data.respMsg);
                }
            }, (err) => {
                console.log(JSON.stringify(err));
            })
        },
        initWeixinSDK () {
            let obj = {
                url: window.location.href
            }
            request.getWXJsAPISignature(obj, (response) => {
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (window.wx) {
                        // 微信配置
                        weixinSDK.config(window.wx, output);
                        weixinSDK.ready(window.wx, () => {
                            // 判断当前客户端版本是否支持指定JS接口
                            weixinSDK.checkJsApi(window.wx);
                            // 分享
                            weixinSDK.initShare(window.wx, 1);
                        });
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // 初始化倒计时
        initTime () {
            let t = storage.get('loginTime');
            let ct = new Date().getTime();
            if (t) {
                if (ct < t) {
                    this.time60();
                }
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
            var endTime = '';
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
            // 微信登录
            if (this.isWeiXin) {
                data.bizType = '15';
            }
            this.time60();// 倒计时
            window.headers.sessionId = storage.get('sessionId') ? storage.get('sessionId') : '';
            request.getVerifyCode(data, (response) => {
                if (response.data.respCode === '000000') {
                    console.log(response.data.output.smsCode)
                    // window.alert(response.data.output.smsCode)
                    this.showtoast('获得验证码成功，请注意查收', true)
                } else {
                    this.showtoast('获得验证码失败', true)
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // 登录
        login () {
            // if (this.isTimeout) {
            //     this.showtoast('请重新获取验证码', true);
            //     return;
            // }
            // 时间到也能继续登录
            this.messageLogin();
        },
        // 短信登录
        messageLogin () {
            if (this.isCommit) {
                return;
            }
            if (this.green && this.check) {
                if (!valid.phone(this.userName)) {
                    this.showtoast('手机号码格式不正确', true)
                    return;
                }
                if (!this.smsCode) {
                    this.showtoast('验证码不能为空', true)
                    return;
                }
                if (!this.check) {
                    this.showtoast('请勾选汇报险注册协议', true)
                    return;
                }
                let data = {
                    userName: this.userName,
                    loginType: '2', // 短信
                    smsCode: this.smsCode,
                    referrerUserId: this.referrerUserId,
                    domainId: Common.getQueryString('domainId') ? Common.getQueryString('domainId') : ''
                }
                // window.alert('commit');
                this.loading = true;
                this.isCommit = true;// 防止重复提交
                if (this.isWeiXin) {
                    // window.alert(storage.get('unionId'))
                    let unionId = storage.get('unionId');
                    let data = {
                        unionId: unionId,
                        mobile: this.userName,
                        loginType: '2', // 短信
                        smsCode: this.smsCode
                    }
                    window.headers.sessionId = storage.get('sessionId') ? storage.get('sessionId') : '';
                    request.wxBindMobile(data, (response) => {
                        // window.alert(JSON.stringify(response))
                        if (response.data.respCode === '000000') {
                            this.output = response.data.output;
                            if (this.output) {
                                storage.set('mobile', this.output.mobile);
                                storage.set('sessionId', this.output.sessionId);
                                storage.set('userInfo', JSON.stringify(this.output));
                                storage.set('userId', this.output.userId);
                            }
                            storage.remove('loginTime');
                            this.goto();
                        } else {
                            this.showtoast(response.data.respMsg, true);
                        }
                        this.isCommit = false;
                        this.loading = false;
                    }, () => {
                        this.isCommit = false;
                        this.loading = false;
                        this.showtoast('网络错误，请查看网络是否连接', true);
                    })
                } else {
                    // window.alert('浏览器');
                    window.headers.sessionId = storage.get('sessionId') ? storage.get('sessionId') : '';
                    request.login(data, (response) => {
                        if (response.data.respCode === '000000') {
                            this.output = response.data.output;
                            storage.set('sessionId', this.output.sessionId);// 保存会话id
                            storage.set('userId', this.output.userId);// 保存用户id
                            storage.set('userInfo', JSON.stringify(this.output)); // 保存用户信息
                            storage.set('mobile', this.output.mobile)
                            storage.remove('loginTime');
                            this.goto();
                        } else {
                            this.showtoast(response.data.respMsg, true);
                        }
                        this.isCommit = false;
                        this.loading = false;
                    }, () => {
                        this.isCommit = false;
                        this.loading = false;
                        this.showtoast('网络错误，请查看网络是否连接', true);
                    })
                }
            }
        },
        goto () {
            let prevPage = storage.get('prevPage');
            if (prevPage) {
                window.location.href = prevPage;
                storage.remove('prevPage');
            } else {
                window.location.href = 'FQcarInfo.html';
            }
            return false;
        },
        keyup () {
            if (this.userName.length > 0 && this.smsCode.length > 0 && this.check) {
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
