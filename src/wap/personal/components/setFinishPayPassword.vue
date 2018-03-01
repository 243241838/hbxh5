<template>  
    <div class="g-setFinishPayPassword_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div style="height:0.34rem;"></div>
        <div class="cell-list">
            <router-link to="verifyPassword">
                <div class="cell">
                    <div class="cell-input">修改支付密码</div>
                    <span class="right_jiantou">  
                        <i class="iconfont">&#xe61d;</i>
                    </span>
                </div>
            </router-link>
            <router-link to="verifyPhone">
                <div class="cell bordertop">
                    <div class="cell-input">忘记支付密码</div>
                    <span class="right_jiantou">  
                        <i class="iconfont">&#xe61d;</i>
                    </span>
                </div>
            </router-link>
        </div>
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
import headerCommon from '../../../components/headerCommon.vue';
export default {
    components: {
        totast,
        loading,
        headerCommon
    },
    data () {
        return {
            totast: { // totast引用
                isshow: false,
                message: ''
            },
            loading: false,
            password: '', // 密码
            isWeiXin: false,
            title: '支付密码'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '支付密码';
    },
    mounted () {
    },
    computed: {
    },
    methods: {
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
