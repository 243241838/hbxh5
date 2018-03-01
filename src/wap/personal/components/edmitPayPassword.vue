<template>  
    <div class="g-setPassword_body">
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
                <input class="cell-input" placeholder="请输入密码" type="password" v-model="password">
            </div>
            <div class="cell bordertop">
                <span class="left_span">再次输入</span>
                <input class="cell-input" type="password" placeholder="请再次输入" v-model="password_one">
            </div>
        </div>
        <div style="height:30px"></div>
        <div class="button" @click="commit">确定</div>
        <!--toasts提示组件-->
        <toast class="g_modify_top" :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
// 修改密码
import request from 'js/interface/request';
import toast from '../../../components/toast' // toast引用
import { Common, valid, storage } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
export default {
    components: {
        toast,
        headerCommon
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            password: '', // 密码
            password_one: '', // 二次输入
            isWeiXin: false,
            title: '设置支付密码'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '设置支付密码';
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        commit () {
            if (this.verify()) {
                // 上一个页面不同
                if (this.$route.query.prevPage === 'verifyPhone') {
                    this.forgetPayPwd();
                } else if (this.$route.query.tradeId) {
                    this.forgetPayPwd(true);
                } else {
                    this.modPayPwd();
                }
            }
        },
        // 重新设置忘记的密码
        forgetPayPwd (isPaymentConfirm) {
            let obj = {
                userId: Common.getUserId(),
                payPwd: this.password
            }
            request.forgetPayPwd(obj, (response) => {
                if (response.data.respCode === '000000') {
                    if (isPaymentConfirm) {
                        this.showtoast('密码设置成功', true);
                        storage.set('paymentConfirmType', this.$route.query.type);
                    } else {
                        this.showtoast(response.data.respMsg, true);
                    }
                    setTimeout(() => {
                        if (isPaymentConfirm) {
                            window.history.go(-2);
                        } else {
                            this.$router.replace({name: 'accountSecurity'});
                        }
                    }, 1800)
                } else {
                    this.showtoast(response.data.respMsg, true)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 修改支付密码
        modPayPwd () {
            let obj = {
                userId: Common.getUserId(),
                oldPayPwd: this.$route.query.oldPayPwd,
                newPayPwd: this.password
            }
            // 修改支付密码
            request.modPayPwd(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.showtoast(response.data.respMsg, true);
                    setTimeout(() => {
                        this.$router.replace({name: 'accountSecurity'});
                    }, 1800)
                } else {
                    this.showtoast(response.data.respMsg, true)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 验证输入
        verify () {
            if (this.password.length < 1) {
                this.showtoast('请设置支付密码', true);
                return false;
            }
            if (!valid.PayPassword(this.password)) {
                this.showtoast('密码格式错误', true);
                return false;
            }
            if (this.password_one.length < 1) {
                this.showtoast('请再次输入支付密码', true);
                return false;
            }
            if (this.password_one !== this.password) {
                this.showtoast('两次输入密码不一样', true);
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
