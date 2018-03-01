<template>  
    <div class="g-verifyPass_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div class="g_home_head flexbox align-items">
            <i class="iconfont">&#xe61c;</i>
            <span>请输入原支付密码，完成验证</span>
        </div>
        <div class="g_verifyPass_list">
            <div class="item flexbox align-items">
                <input type="password" v-model="password" placeholder="原始支付密码">
            </div>
        </div>
          <footer class="g_verifyPass_footer">
                <div class="btn" @click="commit">下一步</div>
          </footer>
           <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
// 修改密码
import request from 'js/interface/request';
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
import { Common, valid } from 'js/common.js';
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
            password: '', // 密码
            title: '身份验证',
            isWeixin: false
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '身份验证';
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        gets () {
            this.isGeting = !this.isGeting;
            this.time60();
        },
        commit () {
            if (this.password.length === 0) {
                this.showtoast('请输入支付密码', true);
                return;
            }
            let obj = {
                userId: Common.getUserId(), // 用户ID
                payPwd: this.password // 用户支付密码
            }
            request.verifyPayPwd(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.$router.push({name: 'edmitPayPassword', query: {oldPayPwd: this.password}});
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
