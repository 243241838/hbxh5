<template>
    <div class="container">
        <div id="body" v-if="!loading">
            <ul class="list">
                <li v-for="(item,index) in priceDetailRecord" @click="goToNextPage(item)">
                    <div class="head">
                        <span class="day">{{item.queryTime | formatTime1}}</span>
                        <span>{{item.queryTime | formatTime2}}</span>
                    </div>
                    <div class="item flexbox">
                        <div class="left flexbox justify-content align-items">
                            <div class="flexbox justify-content align-items">
                                <img :src="item.insurerLogo" alt="">
                            </div>
                        </div>
                        <div class="flex center" v-text="item.insurerName"></div>
                        <div v-if="item.querySts == 10" class="right">报价中</div>
                        <div v-else-if="item.querySts == 20" class="right">
                            <span class="small">￥</span>
                            <span class="money">{{item.insuredAmount | formatMoney1}}.</span>
                            <span class="small">{{item.insuredAmount | formatMoney2}}</span>
                        </div>
                        <div v-else-if="item.querySts == -20" class="right">暂无报价</div>
                        <span class="right_font">
                            <i class="iconfont next-icon">&#xe61d;</i>
                        </span>
                        <div v-if="item.isOverTime == '0' && item.isWaitToPay == '1'" class="fixedIcon">待支付</div>
                        <div v-if="item.isOverTime == '1'" class="fixedIcon gray">已失效</div>
                    </div>
                </li>
            </ul>
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import {Common, storage, valid} from 'js/common';
import toast from '../../components/toast'; // toast引用
import request from 'js/interface/request';
import layer from '../../components/layer';
import loading from '../../components/loading';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        toast,
        layer,
        loading
    },
    data () {
        return {
            loading: false,
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
            priceDetailRecord: []
        }
    },
    created () {
        this.getData();
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
    },
    mounted () {
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
                            weixinSDK.initShare(window.wx, 1);
                        });
                    }
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        getData () {
            var obj = {
                userId: Common.getQueryString('userId'),
                queryIdNo: Common.getQueryString('queryIdNo'),
                vinNo: Common.getQueryString('vinNo'),
                licenseNo: storage.get('FQlicenseNo')
            }
            console.log(obj);
            if (obj.licenseNo === '0') {
                this.$emit('changeTitle', '新车未上牌');
                document.getElementsByTagName('title')[0].innerText = '新车未上牌';
            }
            this.loading = true;
            request.getPriceListDetail(obj, (response) => {
                console.log(response)
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    this.priceDetailRecord = response.data.output.priceDetailRecord;
                    if (this.priceDetailRecord.length === 0) {
                        console.log('询价详情数据空');
                        return;
                    }
                    if (obj.licenseNo !== '0') {
                        this.$emit('changeTitle', this.priceDetailRecord[0].licenseNo);
                        document.getElementsByTagName('title')[0].innerText = this.priceDetailRecord[0].licenseNo;
                    }
                }
                this.loading = false;
            }, () => {
                this.loading = false;
                this.showtoast('网络错误，请查看网络是否连接', true);
            });
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        goToNextPage (item) {
            console.log(item);
            // 报价中 || 暂无报价
            if (parseInt(item.querySts) === 10 || parseInt(item.querySts) === -20) {
                storage.set('FQcompany', JSON.stringify({licenseNo: item.licenseNo, insurerName: item.insurerName}));
                window.location.href = './FQcarOrderCheck.html?querySts=' + item.querySts + '&serialId=' + item.serialId;
                return false;
            }
            // 已失效
            if (item.isOverTime === '1') {
                return;
            }
            if (item.hasOrder === '0') {
                storage.set('FQenquiry', JSON.stringify(item));
                window.location.href = './FQOrderConfirm.html?sts=true&serialId=' + item.serialId;
                return false;
            } else if (item.hasOrder === '1') {
                window.location.href = './FQOrderDetail.html?tradeId=' + item.tradeId + '&FQOrerList=false';
                return false;
            }
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
                    storage.set('prevPage', './FQQuotationDetail.html');
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
    },
    filters: {
        // 格式化时间
        formatTime1 (value) {
            let time = new Date(value);
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            let date = time.getDate();
            if (JSON.stringify(year).length === 1) {
                year = '0' + year;
            }
            if (JSON.stringify(month).length === 1) {
                month = '0' + month;
            }
            if (JSON.stringify(date).length === 1) {
                date = '0' + date;
            }
            return year + '-' + month + '-' + date;
        },
        formatTime2 (value) {
            let time = new Date(value);
            let hours = time.getHours();
            let minutes = time.getMinutes();
            let seconds = time.getSeconds();
            if (JSON.stringify(hours).length === 1) {
                hours = '0' + hours;
            }
            if (JSON.stringify(minutes).length === 1) {
                minutes = '0' + minutes;
            }
            if (JSON.stringify(seconds).length === 1) {
                seconds = '0' + seconds;
            }
            return hours + ':' + minutes + ':' + seconds;
        },
        formatMoney1 (value) {
            if (!value) {
                return '';
            }
            let s = (value / 100).toFixed(2);
            return s.split('.')[0];
        },
        formatMoney2 (value) {
            if (!value) {
                return '';
            }
            let s = (value / 100).toFixed(2);
            return s.split('.')[1];
        }
    }
}
</script>
