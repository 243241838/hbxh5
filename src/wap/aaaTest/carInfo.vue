<template>
    <div id="body">
        <div class="ui-btn-group">
            <a class="ui-btn" @click="alertFun">alert示例</a>
        </div>
        <div class="ui-btn-group">
            <a class="ui-btn" @click="confirmFun">confirm示例</a>
        </div>
        <div class="ui-btn-group">
            <a class="ui-btn" @click="toastFun">toast示例</a>
        </div>
        <div class="ui-btn-group">
            <a class="ui-btn" @click="storgeFun">localStorage存取删除</a>
        </div>
        <!--弹框组件-->
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toast提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closeToast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import {Common, storage, valid, getheader} from 'js/common'
import md5 from 'md5'
import toast from '../../components/toast' // toast引用：
import layer from '../../components/layer' // layer引用
import loading from '../../components/loading';
export default {
    components: {
        toast,
        layer,
        loading
    },
    data () {
        return {
            loading: true, // 加载中
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            alertShow () { // alert实例
                this.showLayer('alert', {
                    type: 'alert', // 必填
                    btns: ['确定'], // 必填
                    yes: function () { // 选填
                        console.log('alert');
                    }
                })
            },
            confirmShow () { // confirm实例
                this.showLayer('aaa', {
                    type: 'confirm',
                    btns: ['取消', '保存'],
                    yes: function () {
                        console.log('confirm-yes');
                    },
                    no: function () {
                        console.log('confirm-no');
                    }
                });
            }
        }
    },
    created () {
    },
    mounted () {
        setTimeout(() => {
            // this.loading = false;
        }, 2000)
    },
    watch: {
    },
    methods: {
        showToast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closeToast () {
            this.toast.isshow = false;
        },
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
        alertShow (val) { // alert实例
            this.showLayer('val', {
                type: 'alert', // 必填
                btns: ['确定'], // 必填
                yes: function () { // 选填
                    console.log('alert');
                }
            })
        },
        confirmShow (val) { // confirm实例
            this.showLayer(val, {
                type: 'confirm',
                btns: ['取消', '保存'],
                yes: function () {
                    console.log('confirm-yes');
                },
                no: function () {
                    console.log('confirm-no');
                }
            })
        },
        closeLayer (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        alertFun () {
            this.alertShow('dsdsad');
        },
        confirmFun () {
            this.confirmShow('dsdsad');
        },
        toastFun () {
            this.showToast('dsdsad', true);
        },
        storgeFun () {
            storage.set('a', 'asdad');
            console.log(storage.get('a'));
            storage.remove('a');
        }
    },
    filters: {
    }
}
</script>
