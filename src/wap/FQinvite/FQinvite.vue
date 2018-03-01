<template>  
    <div id="body" :class="{isShow:!isWeiXin}">
        <div v-show="!loading" class="text" :class="{isB:isB=='false'}">
            <div id="qrcode" class="flexbox justify-content"></div>
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <toast :isshow='toast.isshow' @ontoastback='closetoast'>{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import {Common, valid, storage} from 'js/common'
import toast from '../../components/toast' // toast引用：
import loading from '../../components/loading';
import request from 'js/interface/request';
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        toast,
        loading,
        layer
    },
    data () {
        return {
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
            loading: true,
            isWeiXin: '',
            isB: ''
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
        if (storage.get('userInfo')) {
            this.isB = JSON.parse(storage.get('userInfo')).isBClient;
        }
        this.$nextTick(() => {
            this.getData();
            if (valid.isWeiXin()) {
                this.initWeixinSDK();
            }
        })
    },
    computed: {
    },
    methods: {
        initWeixinSDK () {
            let obj = {
                url: window.location.href
            }
            request.getWXJsAPISignature(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (window.wx) {
                        // 微信配置
                        weixinSDK.config(window.wx, output);
                        weixinSDK.ready(window.wx, () => {
                            // 判断当前客户端版本是否支持指定JS接口
                            weixinSDK.checkJsApi(window.wx);
                            // 分享
                            let params = '';
                            if (storage.get('userInfo')) {
                                if (JSON.parse(storage.get('userInfo')).isBClient === 'true') {
                                    params = Common.getUserId();
                                }
                            }
                            weixinSDK.initShare(window.wx, 2, params);
                        });
                    }
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        getData () {
            var obj = {
                userId: storage.get('userId')
            }
            request.getUserQRCodeUrl(obj, (response) => {
                console.log(response)
                // 账户已经在其他设备上登录
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let userQrcode = '';
                    if (response.data.output) {
                        userQrcode = response.data.output.userQrcode;
                    }
                    // console.log(window.QRCode)
                    var qrcode = new window.QRCode(document.getElementById('qrcode'), {
                        text: userQrcode
                    });
                    let img = window.$('#qrcode').find('img');
                    // console.log(img)
                    let timer = setInterval(() => {
                        // console.log(timer)
                        if (parseInt(img.width()) > 1) {
                            this.loading = false;
                            clearInterval(timer);
                        }
                    }, 1000)
                }
            }, () => {
                this.loading = false;
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
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
        alertShow (value) { // alert实例
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    window.location.href = './FQLogin.html';
                    return false;
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
        // 多点登录
        multiLogin (response) {
            if (response.data.respCode === '100106') {
                this.loading = false;
                if (valid.isWeiXin()) {
                    weixinSDK.getAccessNone(window.location.href);
                } else {
                    this.alertShow(response.data.respMsg)
                }
                return false;
            } else if (response.data.respCode !== '000000') {
                this.showtoast(response.data.respMsg, true);
            }
        }
    }
}
</script>
