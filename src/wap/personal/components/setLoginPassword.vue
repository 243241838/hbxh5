<template>  
    <div class="g_setLoginPass_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div class="g_setLoginPass_head flexbox align-items">
            <span>
                <i class="iconfont">&#xe61c;</i>
                设置登录密码后，您可以使用手机号+密码登录，请牢记
            </span>
        </div>
        <div class="cell-list">
            <div class="cell">
                <input v-show="seepassword" class="cell-input" type="password" v-model="password" placeholder="密码（6-20位数字、字母组合）">
                <input v-show="!seepassword" class="cell-input" type="text" v-model="password" placeholder="密码（6-20位数字、字母组合）">
                <span class="right_span" @click="seepassword=!seepassword">
                    <i class="iconfont" v-show="seepassword">&#xe636;</i>
                    <i class="iconfont" v-show="!seepassword">&#xe635;</i>
                </span>
            </div>
        </div>
        <div style="height:31px;width:0;"></div>
        <div class="button" @click="subm">确定</div>
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
            seepassword: 'true',
            password: '', // 密码
            isWeiXin: false,
            title: '设置登录密码'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '设置登录密码';
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        subm () {
            if (this.password.length < 1) {
                this.showtoast('请输入登录密码', true);
                return;
            }
            if (!valid.password(this.password)) {
                this.showtoast('密码格式不正确,不能是纯数字或纯英文', true);
                return;
            }
            var obj = {
                userId: Common.getUserId(), // 用户ID
                newPwd: this.password, // 现在登录密码
                resetType: 1, // 1：未设置过登录密码不要求传验证码2：已设置登录密码必须要求传验证码
                smsCode: ''
            }
            request.resetLoginPwd(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.showtoast(response.data.respMsg, true);
                    let userInfo = JSON.parse(storage.get('userInfo'));
                    userInfo.loginPwd = '1';
                    storage.set('userInfo', JSON.stringify(userInfo))
                    setTimeout(() => {
                        this.$router.replace('accountSecurity');
                    }, 1800)
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
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
