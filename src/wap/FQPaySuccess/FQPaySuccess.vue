<template>
    <div id="body">
        <div class="session">
            <!--<div class="head">
                <div class="logo"></div>
                <span class="title">汇保险</span>
            </div>-->
            <div class="paymentImg">
                <div class="img"></div>
            </div>
            <div class="successDes"><span>恭喜！您的订单已提交成功</span></div>
            <div class="flexbox justify-content box">
                <div class="content">
                    <div class="tipContent">请尽快将保费打至保险公司指定账户</div>
                    <div class="list">
                        <div class="flexbox item">
                            <span class="left">承保公司：</span>
                            <span class="flex" v-text="output.accountName"></span>
                        </div>
                        <div class="flexbox item">
                            <span class="left">打款银行：</span>
                            <input class="input flex" id="bank" type="text" v-model="output.depositBank" readonly>
                            <button class="btn copy1" data-clipboard-target="#bank">复制</button>
                        </div>
                        <div class="flexbox item">
                            <span class="left">卡<span class="blank"></span>号：</span>
                            <input class="input flex" id="IDNumber" type="text" v-model="output.accountNo" readonly>
                            <button class="btn copy2" data-clipboard-target="#IDNumber">复制</button>
                        </div>
                        <div class="flexbox item">
                            <span class="left">订单金额：</span>
                            <span class="flex money">
                                {{output.payAmount | formatMoney}}元
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="linePhone">
                <span>如有疑问，请联系客服：</span><span>400-678-6078</span>
            </div>
            <div class="flexbox justify-content btnBox">
                <div class="bbb">
                    <a :href="baodanURL" class="button">查看订单详情</a>
                </div>
            </div>
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import { Common, valid, storage } from 'js/common.js';
import toast from '../../components/toast';
import request from 'js/interface/request';
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        layer,
        toast
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            baodanURL: '#',
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            output: ''
        }
    },
    created () {
        this.getBankShow();
    },
    mounted () {
        Common.setFullScreen();
        this.baodanURL = './FQOrderDetail.html?tradeId=' + Common.getQueryString('tradeId') + '&FQOrerList=' + Common.getQueryString('FQOrerList');
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
        this.$nextTick(() => {
            this.initCopy();
        })
    },
    filters: {
        formatMoney (value) {
            if (!value) {
                return '';
            }
            return (value / 100).toFixed(2);
        }
    },
    methods: {
        initCopy () {
            let copy1 = new window.Clipboard('.copy1');
            copy1.on('success', (e) => {
                this.showtoast('复制成功', true);
                e.clearSelection();
            });
            copy1.on('error', (e) => {
                this.showtoast('复制失败', true);
            });
            let copy2 = new window.Clipboard('.copy2');
            copy2.on('success', (e) => {
                this.showtoast('复制成功', true);
                e.clearSelection();
            });
            copy2.on('error', (e) => {
                this.showtoast('复制失败', true);
            });
        },
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
                            weixinSDK.initShare(window.wx, 1);
                        });
                    }
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        getBankShow () {
            let obj = {
                userId: Common.getUserId(),
                tradeId: Common.getQueryString('tradeId')
            }
            request.getBankShow(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    this.output = response.data.output;
                    console.log(this.output)
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
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
                    storage.set('prevPage', './FQPaySuccess.html');
                    window.location.href = './FQLogin.html';
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
