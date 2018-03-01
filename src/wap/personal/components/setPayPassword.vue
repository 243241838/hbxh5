<template>  
    <div class="g_setPayPass_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div class="g_setPayPass_head flexbox align-items">
            <span>
                <i class="iconfont">&#xe61c;</i>
                为了交易安全，设置支付密码用户交易确认，支付密码由6至12位数字、字母组成，字母区分大小写
            </span>
        </div>
        <div class="cell-list">
            <div class="cell">
                <span class="left_span">支付密码</span>
                <input class="cell-input" type="password" v-model="payPwd" placeholder="请输入密码">
            </div>
            <div class="cell bordertop">
                <span class="left_span">再次输入</span>
                <input class="cell-input" type="password" v-model="payPwd_one" placeholder="请再次输入">
            </div>
        </div>
        <div class="g_setParPass_partition flexbox align-items">
            验证是否为本人操作
        </div>
        <div class="cell-list">
            <div class="cell">
                <span class="left_span">手机号</span>
                <div class="cell-input" v-text="mobile"></div>
            </div>
            <div class="cell bordertop">
                <span class="left_span">验证码</span>
                <input class="cell-input" type="text" v-model="smsCode" placeholder="请输入验证码">
                <span class="green-span" v-show="isGeting" @click="getVerifyCode">获取验证码</span>
                <span class="green-span" v-show="!isGeting"><span v-text="time"></span>秒</span>
            </div>
        </div>
        <div style="height:31px;width:0;"></div>
        <div class="button" @click="commit">确定</div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
// 修改密码
import request from 'js/interface/request';
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
import { Common, valid, storage } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
export default {
    components: {
        toast,
        loading,
        headerCommon
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            loading: false,
            isGeting: true, // 获取验证码
            time: 60, // 倒计时
            isTimeout: false, // 是否超时
            seepayPwd: 'true',
            payPwd: '', // 密码
            payPwd_one: '', // 二次输入密码
            smsCode: '', // 验证码
            mobile: '', // 手机号
            isWeiXin: false,
            title: '设置支付密码'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '设置支付密码';
        this.mobile = JSON.parse(storage.get('userInfo')).mobile;
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        // 获得验证码
        getVerifyCode () {
            var data = {
                bizType: '14',
                mobile: this.mobile,
                codeType: '1'
            }
            request.getVerifyCode(data, (response) => {
                if (response.data.respCode === '000000') {
                    console.log(response.data.output.smsCode)
                    this.showtoast('获得验证码成功', true)
                    this.time60();
                } else {
                    this.showtoast('获得验证码失败', true)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 倒计时
        time60 () {
            this.isGeting = false;// 切换倒计时和获得验证码
            this.isTimeout = false;// 是否超时
            let timer = setInterval(() => {
                this.time--;
                if (this.time === 0) {
                    this.time = 60;
                    this.isGeting = true;
                    this.isTimeout = true;// 超时
                    clearInterval(timer);
                }
            }, 1000);
        },
        commit () {
            if (this.verify()) {
                let obj = {
                    userId: Common.getUserId(),
                    payPwd: this.payPwd,
                    smsCode: this.smsCode
                }
                // 设置支付密码
                request.setPayPwd(obj, (response) => {
                    if (response.data.respCode === '000000') {
                        this.showtoast(response.data.respMsg, true);
                        this.updateUserInfo();
                        setTimeout(() => {
                            this.$router.replace({name: 'accountSecurity'});
                        }, 1800)
                    } else {
                        this.showtoast(response.data.respMsg, true);
                    }
                }, (error) => {
                    this.showtoast(error, true);
                })
            }
        },
        // 取得用户信息
        updateUserInfo () {
            let userInfo = JSON.parse(storage.get('userInfo'));
            userInfo.paymentPwd = '1';
            storage.set('userInfo', JSON.stringify(userInfo));
        },
        // 验证
        verify () {
            if (this.isTimeout) {
                this.showtoast('请重新获取验证码', true);
                return false;
            }
            if (this.payPwd.length < 1) {
                this.showtoast('请输入支付密码', true);
                return false;
            }
            if (!valid.PayPassword(this.payPwd)) {
                this.showtoast('密码必须是6-12位数字字母组成', true);
                return false;
            }
            if (this.payPwd_one.length < 1) {
                this.showtoast('请再次输入密码', true);
                return false;
            }
            if (this.payPwd_one !== this.payPwd) {
                this.showtoast('两次密码不一致', true);
                return false;
            }
            if (this.smsCode.length < 1) {
                this.showtoast('请输入验证码', true);
                return false;
            }
            return true;
        },
        // 显示提示框
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        // 关闭提示框
        closetoast () {
            this.toast.isshow = false;
        }
    }
}
</script>
