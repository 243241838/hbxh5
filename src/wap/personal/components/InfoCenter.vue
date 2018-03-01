<template>  
    <div id="body" class="Info_body" >
        <headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon>
        <div class="Info_box" :class="{isWeiXin:isWeiXin}">
            <div class="container" v-if="output">
            <div class="Info_title">{{output.infoTitle}}</div>
            <div class="Info_content" v-html="productPrompt">{{output.content}}</div>
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
// 账户安全
import request from 'js/interface/request';
import { Common, valid, storage } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
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
            output: '', // 数据
            loading: true,
            title: '帮助中心',
            isWeiXin: false,
            infoId: '',
            productPrompt: ''
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '帮助中心';
        this.infoId = this.$route.params.id;
        this.getData();
        this.resetBody();
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        // 关闭提示框
        closetoast () {
            this.toast.isshow = false;
        },
        getData () {
            var data = {
                infoId: this.infoId
            }
            request.getServiceInfo(data, (response) => {
                this.loading = false;
                if (response.data.respCode === '000000') {
                    this.output=response.data.output;
                    this.productPrompt=response.data.output.content;
                    this.$nextTick(() => {
                        let by = document.getElementById('body')
                        console.log(1)
                        Common.setFullScreen(by);
                    })
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.loading = false;
                this.showTotast(error, true);
            })
        },
        resetBody () {
            this.$nextTick(() => {
                setTimeout(() => {
                    Common.setFullScreen()
                }, 0)
            })
        }
    }
}
</script>