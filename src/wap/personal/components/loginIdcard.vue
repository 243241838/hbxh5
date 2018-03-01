<template>  
    <div class="g_loginIdcard_body">
       <div class="g_home_head flexbox align-items">
            <i class="iconfont">&#xe61c;</i>
            <span>输入登录密码，完成身份验证</span>
        </div>
        <div class="cell-list">
            <div class="cell">
                 <input class="cell-input" type="password" v-model="password" placeholder="登录密码">
            </div>
        </div>  
        <div style="height:30px;"></div>
        <div class="button" @click="subm">验证后绑定新手机</div>
           <!--toasts提示组件-->
        <totast class="g_modify_top" :isshow="totast.isshow" @ontoastback="closetoast">{{ totast.message}}</totast>
    </div>
</template>
<script>
// 修改密码
import request from 'js/interface/request';
import totast from '../../../components/toast' // totast引用
import loading from '../../../components/loading.vue';
import { Common, valid } from 'js/common.js';
export default {
    components: {
        totast,
        loading
    },
    data () {
        return {
            totast: { // totast引用
                isshow: false,
                message: ''
            },
            loading: false,
            password: '' // 密码
        }
    },
    created () {
        document.getElementsByTagName('title')[0].innerText = '身份验证';
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        subm () {
            if (this.password.length < 1) {
                this.showTotast('请输入登录密码', true);
                return;
            }
            if (this.password !== '5') {
                this.showTotast('登录密码错误', true);
                return;
            }
        },
        // 显示提示框
        showTotast (msg, isshow) { // totast引用：3.显示
            this.totast.message = msg;
            this.totast.isshow = isshow;
        },
        // 关闭提示框
        closetoast () {
            this.totast.isshow = false;
        }
    }
}
</script>
