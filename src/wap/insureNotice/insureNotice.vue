<template>
    <div class="container" :class="{isWeiXin:isWeiXin}">
        <div id="body">
            <div class="nitem">
                <p v-html="output.clause"></p>
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import {Common, valid} from 'js/common'
import request from 'js/interface/request'
import toast from '../../components/toast' // toast引用：
export default {
    components: {
        toast
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            output: '',
            isWeiXin: false
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        // app嵌入
        if (Common.getQueryString('isApp')) {
            this.isWeiXin = true;
        }
        this.getproductClause();
    },
    mounted () {
        this.$nextTick(() => {
            Common.setFullScreen();
        })
    },
    computed: {
    },
    methods: {
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        getproductClause () {
            var obj = {
                productId: Common.getQueryString('productId')
            }
            request.getProductClause(obj, (response) => {
                console.log(response)
                if (response.data.respCode === '000000') {
                    this.output = response.data.output;
                    console.log(response)
                    Common.setFullScreen();
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        }
    }
}
</script>