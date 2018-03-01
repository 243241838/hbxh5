<template>
    <div class="container" :class="{'isWeiXin': isWeiXin}">
        <div v-if="isShowPage">
            <div class="body page1" v-if="currentPage==1">
                <div class="box flexbox justify-content align-items">      
                    <div class="form">
                        <div class="item">
                            <span class="fl">
                                <i class="iconfont ico">&#xe66b;</i>
                            </span>
                            <input @keyup="keyup" type="text" placeholder="请输入姓名" v-model="userName"/>
                        </div>
                        <div class="item bordertop">
                            <span class="fl">
                                <i class="iconfont ico">&#xe633;</i>
                            </span>
                            <input @keyup="keyup" type="text" placeholder="请输入手机号码" v-model="mobile"/>
                        </div>
                        <div class="item pass_word bordertop">
                            <span class="fl">
                                <i class="iconfont ico1">&#xe638;</i>
                            </span>
                            <input @keyup="keyup" type="text" class="pass" v-model="smsCode" placeholder="请输入验证码">
                            <span class="borderleft"></span>
                            <span v-show="isGeting" class="fr verifyinfo" :class="{'yellow':mobile.length>=11 && userName.length}"  @click="verify">获取验证码</span>
                            <span v-show="!isGeting" class="fr verifyinfo"><span v-text="time.seconds"></span>秒</span>
                        </div>
                        <div v-if="yellow" class="btn yellow" @click="commit">加入汇保险</div>
                        <div v-else class="btn">加入汇保险</div>
                    </div>
                </div>
            </div>
            <div class="body page2" v-if="currentPage==2">
                <div class="big" v-if="showrealName" v-text="showrealName"></div>
                <div class="big" v-else-if="shownickName" v-text="shownickName"></div>
                <div class="big" v-else="showuserName" v-text="showuserName"></div>
                <div v-text="showmobile"></div>
                <div class="button"><div @click="page2Commit"></div></div>
            </div>
            <div class="body page3" :class="{'isWeiXin':isWeiXin}" v-if="currentPage==3">
                <div class="big" v-if="showrealName" v-text="showrealName"></div>
                <div class="big" v-else-if="shownickName" v-text="shownickName"></div>
                <div class="big" v-else="showuserName" v-text="showuserName"></div>
                <div v-text="showmobile"></div>
                <div class="button"><div @click="goToPromotion"></div></div>
            </div>
            <div class="body page4" :class="{'isWeiXin':isWeiXin}" v-if="currentPage==4">
            </div>
            <div class="body page5" :class="{'isWeiXin':isWeiXin}" v-if="currentPage==5">
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
        <multiAlert :multiResponse="multiResponse" :multiShow="multiShow"></multiAlert>
    </div>
</template>
<script>
import request from 'js/interface/request';
import loading from 'components/loading';
import { Common, valid, storage } from 'js/common';
import toast from 'components/toast';
import weixinSDK from 'js/weixinSDK';
import multiAlert from '../../components/multiAlert';
export default {
    components: {
        toast,
        loading,
        multiAlert
    },
    data () {
        return {
            multiResponse: {},
            multiShow: false,
            isShowPage: false,
            currentPage: Common.getQueryString('currentPage') || 1,
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            loading: false,
            isWeiXin: false,
            isGeting: true,
            smsCode: '',
            time: {
                seconds: ''
            },
            userName: '',
            mobile: '',
            yellow: false,
            isCommit: false,
            endTime: 0,
            userInfo: {}
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        // 微信端
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
    },
    mounted () {
    },
    computed: {
        showrealName () {
            return this.userInfo.realName;
        },
        shownickName () {
            return this.userInfo.nickName;
        },
        showuserName () {
            return this.userInfo.userName;
        },
        showmobile () {
            return this.userInfo.mobile;
        }
    },
    methods: {
        // 获得申请状态
        getApplyAgentStatus () {
            let obj = {
                userId: storage.get('userId')
            }
            request.getApplyAgentStatus(obj, (response) => {
                // window.alert(JSON.stringify('response'));
                if (response.data.respCode === '000000') {
                    let applySts = response.data.output.applySts;
                    // 0:未申请，1：申请中，2：申请成功，3：申请失败
                    if (applySts === 1) {
                        this.currentPage = 4;
                    } else if (applySts === 2) {
                        this.currentPage = 3;
                    } else if (applySts === 3) {
                        this.currentPage = 5;
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                this.isShowPage = true;
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        initPage () {
            if (storage.get('mobile') && storage.get('unionId')) {
                let userInfo = JSON.parse(storage.get('userInfo'))
                if (userInfo) {
                    this.userInfo = userInfo;
                }
                this.currentPage = 2;
                this.getApplyAgentStatus();
                return true;
            } else {
                return false;
            }
        },
        initWeixinSDK () {
            // 已经登录过
            if (this.initPage()) {
                return;
            }
            let obj = {
                url: window.location.href
            }
            // window.alert(JSON.stringify(obj))
            if (Common.getQueryString('code')) {
                this.userAccess(storage.get('appId'));
            } else {
                request.getWXJsAPISignature(obj, (response) => {
                    // window.alert(JSON.stringify(response))
                    if (response.data.respCode === '000000') {
                        this.userAccess(response.data.output.appId);
                        storage.set('appId', response.data.output.appId)
                    }
                }, () => {
                    this.showtoast('网络错误，请查看网络是否连接', true);
                })
            }
        },
        userAccess (appId) {
            let mobile = storage.get('mobile');
            let unionId = storage.get('unionId');
            // 有code
            // window.alert(mobile)
            // window.alert(unionId)
            if (Common.getQueryString('code')) {
                if (mobile) {
                    // code+mobile
                    this.wxAuthLogin(Common.getQueryString('code'), mobile)
                } else {
                    this.wxAuthLogin(Common.getQueryString('code'));
                }
            } else { // 没有code
                // 已经授权
                if (unionId) {
                    // 没有手机号
                    if (!mobile) {
                        this.currentPage = 1;
                    } else {
                        this.currentPage = 2;
                    }
                } else {
                    // 未授权 (老用户) 当前页面授权
                    // 有手机号 (code+mobile)
                    if (mobile) {
                        let link = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + window.encodeURIComponent(window.location.href + '?currentPage=2') + '&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect';
                        window.location.href = link;
                    } else {
                        let link = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + window.encodeURIComponent(window.location.href + '?currentPage=1') + '&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect';
                        window.location.href = link;
                    }
                }
            }
        },
        wxAuthLogin (code, mobile) {
            let data = {
                code: code
            }
            if (mobile) {
                data.mobile = mobile;
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
                    if (output && output.mobile) {
                        storage.set('mobile', output.mobile);
                        storage.set('sessionId', output.sessionId);
                        storage.set('userInfo', JSON.stringify(output));
                        storage.set('userId', output.userId);
                        storage.set('unionId', output.unionId);
                    } else if (!output.mobile) {
                        storage.set('unionId', output.unionId);
                        this.currentPage = 1;
                    }
                    window.headers.sessionId = output.sessionId;
                    if (!this.initPage()) {
                        this.getApplyAgentStatus();
                    }
                } else {
                    // window.alert(response.data.respMsg);
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        verify () {
            // 判断是否为手机号码
            if (this.mobile.length >= 11) {
                if (valid.phone(this.mobile.trim())) {
                    this.getVerifyCode();
                } else {
                    if (this.mobile.length === 0) {
                        this.showtoast('请输入手机号码', true)
                    } else {
                        this.showtoast('手机号码格式有误', true)
                    }
                }
            }
        },
        getEndTime () {
            let sTime = storage.get('promotionTime');
            var endTime = '';
            if (sTime) {
                endTime = new Date().getTime() >= sTime ? new Date().getTime() + 60 * 1000 : sTime;
            } else {
                endTime = new Date().getTime() + 60 * 1000;
            }
            storage.set('promotionTime', endTime);
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
                mobile: this.mobile.trim(),
                codeType: '1' // 短信验证码
            }
            // 微信登录
            if (valid.isWeiXin()) {
                data.bizType = '15';
            }
            this.time60();// 倒计时
            window.headers.sessionId = storage.get('sessionId') ? storage.get('sessionId') : '';
            request.getVerifyCode(data, (response) => {
                // window.alert(JSON.stringify(response))
                if (response.data.respCode === '000000') {
                    console.log(response.data.output.smsCode)
                    this.showtoast('获得验证码成功，请注意查收', true)
                } else {
                    this.showtoast('获得验证码失败', true)
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        keyup () {
            if (this.mobile.length > 0 && this.smsCode.length > 0 && this.userName.length > 0) {
                this.yellow = true;
            } else {
                this.yellow = false;
            }
        },
        // 新用户提交
        commit () {
            if (this.isCommit) {
                return;
            }
            if (!valid.userName(this.userName)) {
                this.showtoast('名字必须为中文', true)
                return;
            }
            if (!valid.phone(this.mobile)) {
                this.showtoast('手机号码格式不正确', true)
                return;
            }
            if (!this.smsCode) {
                this.showtoast('验证码不能为空', true)
                return;
            }
            this.loading = true;
            this.isCommit = true;
            if (valid.isWeiXin()) {
                let obj = {
                    unionId: storage.get('unionId'),
                    mobile: this.mobile,
                    loginType: '2', // 短信
                    smsCode: this.smsCode,
                    isAgentApply: '1',
                    nickName: this.userName
                }
                // window.alert(JSON.stringify(obj));
                request.wxBindMobile(obj, (response) => {
                    if (response.data.respCode === '000000') {
                        this.output = response.data.output;
                        if (this.output) {
                            storage.set('mobile', this.output.mobile);
                            storage.set('sessionId', this.output.sessionId);
                            storage.set('userInfo', JSON.stringify(this.output));
                            storage.set('userId', this.output.userId);
                        }
                        storage.remove('promotionTime');
                        this.currentPage = 4;
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
            }
        },
        // 老用户提交
        page2Commit () {
            let obj = {
                userId: storage.get('userId')
            }
            this.isCommit = true;
            this.loading = true;
            // window.alert(JSON.stringify(obj))
            request.applyAgent(obj, (response) => {
                // window.alert(JSON.stringify(response))
                if (response.data.respCode === '000000') {
                    this.getApplyAgentStatus();
                } else if (response.data.respCode === '100000') {
                    this.currentPage = 3;
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
        },
        // 推广人员通过审核
        goToPromotion () {
            window.location.href = './FQcarInfo.html';
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