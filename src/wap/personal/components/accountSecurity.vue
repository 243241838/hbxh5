<template>  
    <div id="body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div class="g_account_list">
             <router-link :to="{name:nextPageLogin}">
                <div class="item flexbox align-items">
                    <div class="flex">
                        <p class="first">登录密码</p>
                        <p class="last">建议您定期更改密码以保护账户安全</p>
                    </div>
                    <i class="iconfont">&#xe61d;</i>
                </div>
            </router-link>
            <router-link :to="{name:nextPagePay}">
                <div class="item flexbox align-items">
                    <div class="flex">
                        <p class="first">支付密码</p>
                        <p class="last">使用账户资产、积分时，用于验证支付</p>
                    </div>
                    <i class="iconfont">&#xe61d;</i>
                </div>
            </router-link>
            <router-link :to="{name:'changePhone'}">
                <div class="item flexbox align-items noborder">
                    <div class="flex">
                        <p class="first">手机验证</p>
                        <p class="last">若您的验证手机丢失或停用，请立即修改更换</p>
                    </div>
                    <i class="iconfont">&#xe61d;</i>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
// 账户安全
import request from 'js/interface/request';
import { Common, valid, storage } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
export default {
    components: {
        headerCommon
    },
    data () {
        return {
            nextPageLogin: '',
            nextPagePay: '',
            title: '账户安全',
            isWeiXin: false
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '账户安全';
    },
    mounted () {
        // 登录密码
        let userInfo = JSON.parse(storage.get('userInfo'));
        let loginPwd = userInfo.loginPwd;
        if (loginPwd === '0') {
            this.nextPageLogin = 'setLoginPassword';
        } else if (loginPwd === '1') {
            this.nextPageLogin = 'modifyPassword';
        } else {
            this.nextPageLogin = '';
        }
        // 支付密码
        let paymentPwd = userInfo.paymentPwd;
        if (paymentPwd === '0') {
            this.nextPagePay = 'setPayPassword';
        } else if (paymentPwd === '1') {
            this.nextPagePay = 'setFinishPayPassword';
        } else {
            this.nextPagePay = '';
        }
        this.$nextTick(() => {
            this.init();
        })
    },
    computed: {
    },
    methods: {
        // 页面跳转
        init () {
            // 登录密码
            let userInfo = JSON.parse(storage.get('userInfo'));
            let loginPwd = userInfo.loginPwd;
            if (loginPwd === '0') {
                this.nextPageLogin = 'setLoginPassword';
            } else if (loginPwd === '1') {
                this.nextPageLogin = 'modifyPassword';
            } else {
                this.nextPageLogin = '';
            }
            // 支付密码
            let paymentPwd = userInfo.paymentPwd;
            if (paymentPwd === '0') {
                this.nextPagePay = 'setPayPassword';
            } else if (paymentPwd === '1') {
                this.nextPagePay = 'setFinishPayPassword';
            } else {
                this.nextPagePay = '';
            }
        }
    }
}
</script>
