<template>
    <div class="multiAlert" v-if="multiShow">
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>

<script>
import layer from './layer';
import toast from './toast';
import {storage, valid} from '../assets/js/common.js';
import weixinSDK from '../assets/js/weixinSDK.js';
export default {
    components: {
        layer,
        toast
    },
    props: {
        multiResponse: Object,
        multiShow: Boolean
    },
    data () {
        return {
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            toast: {
                isshow: false,
                message: ''
            }
        }
    },
    methods: {
        showLayer (msg, options) {
            // layer引用：3.显示弹框
            this.layer.type = options.type;
            this.layer.message = msg;
            this.layer.isshow = true;
            this.layer.shadeClose = options.shadeClose;
            this.layer.btns = options.btns;
            this.layer.yes = options.yes;
            this.layer.no = options.no;
        },
        closeLayer (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        alertShow (value) { // alert实例
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    let url = window.location.href.split('/wap/')[1];
                    storage.set('prevPage', url);
                    window.location.href = './login.html';
                    return false;
                }
            })
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        }
    },
    watch: {
        multiShow () {
            if (this.multiShow) {
                if (this.multiResponse.data.respCode === '100106') {
                    if (valid.isWeiXin()) {
                        weixinSDK.getAccessNone(window.location.href);
                    } else {
                        this.alertShow(this.multiResponse.data.respMsg)
                    }
                    return false;
                } else if (this.multiResponse.data.respCode !== '000000') {
                    this.showtoast(this.multiResponse.data.respMsg, true);
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@charset "utf-8";
@import "../assets/scss/usage/layout/reset.scss";
.multiAlert{
    
}
</style>

