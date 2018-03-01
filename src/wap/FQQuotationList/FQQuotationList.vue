<template>
    <div class="container">
        <div id="body" v-if="!loading">
            <div class="searchBox">
                <div class="search ing">
                    <i class="iconfont searchIcon">&#xe62d;</i>
                    <input type="text" placeholder="请输入车牌号或车主名称" v-model="serachContent" @input="pageIndex=1;getData(false);">
                </div>
            </div>
            <!--
            <div class="nav flexbox">
                <div class="flex flexbox justify-content align-items" @click="tabChange(1)">
                    <i class="iconfont" :class="{'selectedColor':navSelected}">&#xe65f;</i>
                    <span :class="{'selectedColor':navSelected}">询价车辆</span>
                </div>
                <div class="line"></div>
                <div class="flex flexbox justify-content align-items" @click="tabChange(2)">
                    <i class="iconfont" :class="{'selectedColor':!navSelected}">&#xe65c;</i>
                    <span :class="{'selectedColor':!navSelected}">下单车辆</span>
                </div>
            </div>-->
            <ul class="list" v-if="queryRecord.length">
                <li class="item flexbox" :class="{'last':index == queryRecord.length-1}" v-for="(item,index) in queryRecord" @click="goToNextPage(item)">
                    <div v-if="item.licenseNo == '0'" class="left">新车未上牌</div>
                    <div v-else class="left" v-text="item.licenseNo"></div>
                    <div class="center flex" v-text="item.queryRealName"></div>
                    <div v-show="navSelected" class="right flexbox justify-content align-items flex-column">
                        <span>{{item.queryTime | formatTime}}</span>
                        <span>{{item.queryTime | formatTime1}}</span>
                    </div>
                    <div v-show="!navSelected" class="right flexbox justify-content align-items fullHeight">
                        <span>已下单</span>
                    </div>
                    <i class="iconfont next-icon">&#xe61d;</i>
                    <div v-if="item.tradeId" class="fixedIcon">待支付</div>
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
import Mydropload from 'js/mydropload.js';
import myPromise from 'js/tools.js';
import {Common, storage, valid} from 'js/common';
import request from 'js/interface/request';
import toast from '../../components/toast'; // toast引用
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
            firstComeIn: true,
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
            navSelected: true,
            pageIndex: 1,
            queryRecord: [],
            serachContent: '',
            priceType: 1 // 1询价车辆, 2下单车辆
        }
    },
    mounted () {
        window.dropload = new Mydropload('body', this.refreshData, this.getData);
        this.$nextTick(() => {
            if (valid.isWeiXin()) {
                this.initWeixinSDK();
            }
        })
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
        getData (me) {
            if (me) {
                window.dropload = me;
            } else {
                // 解锁
                window.dropload.isLockDown = false;
                window.dropload.isData = true;
            }
            var obj = {
                userId: Common.getUserId(),
                pageIndex: this.pageIndex,
                serachContent: this.serachContent ? this.serachContent : ''
            }
            if (this.firstComeIn) {
                this.loading = true;
            }
            console.log(obj);
            window.headers.sessionId = storage.get('sessionId');
            let p = myPromise.pagination(obj, 'getPriceList', this.queryRecord, 'queryRecord', window.dropload);
            p.then((obj) => {
                this.queryRecord = obj.productList;
                console.log(this.queryRecord);
                this.$nextTick(() => {
                    Common.setFullScreen()
                    window.dropload.direction = 'up';
                    window.dropload.resetload();
                })
                this.pageIndex = obj.pageIndex;
                this.loading = false;
                this.firstComeIn = false;
            }, (error) => {
                this.multiLogin(error);
                this.loading = false;
                this.firstComeIn = false;
            });
            Common.setFullScreen()
        },
        // tab切换
        tabChange (type) {
            // 过滤掉，防止重新刷新列表
            if (this.priceType === type) {
                return;
            }
            // 切换nav按钮样式
            if (type === 1) {
                this.navSelected = true;
            } else {
                this.navSelected = false;
            }
            this.pageIndex = 1;
            this.queryRecord = [];
            this.priceType = type;
            // 更新列表
            this.getData();
        },
        refreshData (me) {
            me.resetload();
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        goToNextPage (item) {
            storage.set('FQlicenseNo', item.licenseNo);
            window.location.href = './FQQuotationDetail.html?userId=' + item.userId + '&queryIdNo=' + item.queryIdNo + '&vinNo=' + item.vinNo;
            return false;
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
                    storage.set('prevPage', './FQQuotationList.html');
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
        formatTime (value) {
            let time = new Date(value);
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            if (JSON.stringify(month).length === 1) {
                month = '0' + month;
            }
            let date = time.getDate();
            if (JSON.stringify(date).length === 1) {
                date = '0' + date;
            }
            let hours = time.getHours();
            if (JSON.stringify(hours).length === 1) {
                hours = '0' + hours;
            }
            let minutes = time.getMinutes();
            if (JSON.stringify(minutes).length === 1) {
                minutes = '0' + minutes;
            }
            return year + '-' + month + '-' + date
        },
        // 格式化时间
        formatTime1 (value) {
            let time = new Date(value);
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            if (JSON.stringify(month).length === 1) {
                month = '0' + month;
            }
            let date = time.getDate();
            if (JSON.stringify(date).length === 1) {
                date = '0' + date;
            }
            let hours = time.getHours();
            if (JSON.stringify(hours).length === 1) {
                hours = '0' + hours;
            }
            let minutes = time.getMinutes();
            if (JSON.stringify(minutes).length === 1) {
                minutes = '0' + minutes;
            }
            return hours + ':' + minutes;
        }
    }
}
</script>
