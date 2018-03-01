<template>  
    <div id="body">
        <div class="container" :class="{'isWeiXin':isWeiXin}">
            <div class="nav flexbox">
                <div class="nav-item flex" :class="{'on':tabIndex==0}"><span @click="tabChange(0)">我的客户</span></div>
                <div class="line"></div>
                <div class="nav-item flex" :class="{'on':tabIndex==1}"><span @click="tabChange(1)">我的业绩</span></div>
            </div>
        </div>
        <div v-show="!isSearching" class="search flexbox align-items">
            <div>
                <div class="search-icon-box text-center">
                    <i class="iconfont search-icon">&#xe62d;</i>
                </div>
                <input @click="clickSearch" class="text-center" type="text" placeholder="搜索">
            </div>
        </div>
        <div v-show="isSearching" class="search flexbox align-items on">
            <div>
                <div class="search-icon-box">
                    <i class="iconfont search-icon">&#xe62d;</i>
                </div>
                <i class="iconfont close-icon" @click="clearContent">&#xe630;</i>
                <button class="button" @click="cancelSearch">取消</button>
                <input @input="search(tabIndex)" v-model="searchContent" id="search-input" type="text">
            </div>
        </div>
        <!--<div v-show="isSearching" class="zhezhao" :class="{'isWeiXin': isWeiXin}" @click="cancelSearch"></div>-->
        <div v-show="tabIndex == 0">
            <ul class="list" v-if="showCustomerManageRecord.length > 0">
                <li v-for="user in showCustomerManageRecord" @click="goToFQmanageCustomer(user)">
                    <div class="flexbox title">
                        <span class="zimu" v-show="true" v-text="user.firstNicknamePinYin"></span>
                        <span class="zimu" v-show="false"></span>
                        <span class="flex line"></span>
                    </div>
                    <div class="item" v-text="user.showNickname"></div>
                </li>
            </ul>
        </div>
        <div v-show="tabIndex == 1">
            <div class="yeji" v-for="item in showTradeDateRecord" @click="goToFQmanageCustomer(item)">
                <div class="head" v-show="item.tradeDate" v-text="item.tradeDate"></div>
                <div class="flexbox item">
                    <div class="img"><img :src="item.insurerLogo" alt=""></div>
                    <div class="carNumber" v-if="item.licenseNo=='0'">新车未上牌</div>
                    <div class="carNumber" v-else v-text="item.licenseNo"></div>
                    <div class="flex"></div>
                    <div class="flexbox flex-column justify-content money">
                        <p class="name">推广费</p>
                        <p>{{item.income | formatMoney}}元</p>
                    </div>
                    <i class="iconfont nextIcon">&#xe667;</i>
                </div>
            </div>
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toasts提示组件-->
        <toast :isshow='toast.isshow' @ontoastback='closetoast'>{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import myPromise from 'js/tools.js';
import {Common, valid, storage} from 'js/common';
import toast from '../../components/toast'; // toast引用：
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
            isWeiXin: true,
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
            loading: false,
            tabIndex: 0,
            isSearching: false,
            searchContent: '',
            pageIndex1: 1,
            pageIndex2: 1,
            customerManageRecord: [], // 我的客户
            showCustomerManageRecord: [],
            tradeDateRecord: [], // 我的业绩
            showTradeDateRecord: [],
            first_list: true
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        if (this.isWeiXin) {
            this.initWeixinSDK();
        }
    },
    mounted () {
        window.dropload = new Mydropload('body', this.refreshData, this.getData);
    },
    computed: {
    },
    filters: {
        formatMoney (money) {
            if (!money) {
                return '0.00';
            }
            return (money / 100).toFixed(2);
        }
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
            if (this.tabIndex === 0) {
                this.getCustomerManage(me)
            } else if (this.tabIndex === 1) {
                this.getUserPerformance(me)
            }
        },
        // 12.21 获取我的客户
        getCustomerManage (me) {
            if (me) {
                window.dropload = me;
            } else {
                // 解锁
                window.dropload.isLockDown = false;
                window.dropload.isData = true;
            }
            let obj = {
                userId: Common.getUserId(),
                pageIndex: this.pageIndex1,
                pageSize: '10',
                serachContent: this.searchContent ? this.searchContent : ''
            }
            console.log(obj);
            let p = myPromise.pagination(obj, 'getCustomerManage', this.customerManageRecord, 'customerManageRecord', window.dropload);
            p.then((obj) => {
                this.customerManageRecord = obj.productList;
                this.showCustomerManageRecord = this.handleCustomerManage(obj.productList);
                console.log(this.customerManageRecord)
                this.$nextTick(() => {
                    Common.setFullScreen()
                    window.dropload.direction = 'up';
                    window.dropload.resetload();
                })
                this.pageIndex1 = obj.pageIndex;
                this.loading = false;
                this.first_list = false;
            }, (error) => {
                this.multiLogin(error);
                this.loading = false;
                this.first_list = false;
            });
        },
        // 我的业绩
        getUserPerformance (me) {
            if (me) {
                window.dropload = me;
            } else {
                // 解锁
                window.dropload.isLockDown = false;
                window.dropload.isData = true;
            }
            let obj = {
                userId: Common.getUserId(),
                pageIndex: this.pageIndex2,
                pageSize: '10',
                serachContent: this.searchContent ? this.searchContent : ''
            }
            console.log(obj)
            let p = myPromise.pagination(obj, 'getUserPerformance', this.tradeDateRecord, 'tradeDateRecord', window.dropload);
            p.then((obj) => {
                this.tradeDateRecord = obj.productList;
                this.showTradeDateRecord = this.handleArr(obj.productList, 'tradeDate');
                console.log(this.tradeDateRecord)
                this.$nextTick(() => {
                    Common.setFullScreen()
                    window.dropload.direction = 'up';
                    window.dropload.resetload();
                })
                this.pageIndex2 = obj.pageIndex;
                this.loading = false;
                this.first_list = false;
            }, (error) => {
                this.multiLogin(error);
                this.loading = false;
                this.first_list = false;
            });
        },
        handleArr (list, attributeName) {
            // deep copy
            let arr = [];
            for (let i = 0; i < list.length; i++) {
                let obj = {}
                for (let key in list[i]) {
                    obj[key] = list[i][key];
                }
                arr.push(obj);
            }
            //
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    if (arr[i][attributeName] === arr[j][attributeName]) {
                        arr[j][attributeName] = '';
                    }
                }
            }
            return arr;
        },
        // 搜索
        search (type) {
            if (type === 0) {
                this.customerManageRecord = [];
                this.pageIndex1 = 1;
                this.getCustomerManage();
            } else if (type === 1) {
                this.tradeDateRecord = [];
                this.pageindex2 = 1;
                this.getUserPerformance();
            }
        },
        // 处理客户信息管理
        handleCustomerManage (list) {
            let arr = [];
            let arr2 = [];
            list.map((item, index) => {
                var re = /^[a-zA-Z]+$/;
                let obj = {
                    firstNicknamePinYin: item.firstNicknamePinYin,
                    showNickname: item.showNickname,
                    showNicknamePinYin: item.showNicknamePinYin,
                    userId: item.userId,
                    userLogo: item.userLogo
                }
                if (re.test(obj.firstNicknamePinYin)) {
                    obj.firstNicknamePinYin = obj.firstNicknamePinYin.toUpperCase();
                    arr.push(obj);
                } else {
                    arr2.push(obj);
                }
            })
            arr = arr.concat(arr2)
            return this.handleArr(arr, 'firstNicknamePinYin');
        },
        // tab切换
        tabChange (type) {
            this.searchContent = '';
            if (type === this.tabIndex) {
                return;
            }
            // 我的客户
            if (type === 0) {
                this.tabIndex = 0;
                this.isSearching = false;
                this.customerManageRecord = [];
                this.pageIndex1 = 1;
                this.getCustomerManage();
            } else if (type === 1) {
                // 我的业绩
                this.tabIndex = 1;
                this.isSearching = false;
                this.tradeDateRecord = [];
                this.pageindex2 = 1;
                this.getUserPerformance();
            }
        },
        goToFQmanageCustomer (user) {
            window.location.href = './FQmanageCustomer.html?userId=' + user.userId;
            return false;
        },
        refreshData (me) {
            me.resetload();
        },
        clickSearch () {
            this.isSearching = true;
            setTimeout(() => {
                document.getElementById('search-input').focus();
            }, 100)
        },
        cancelSearch () {
            console.log('cancelSearch')
            this.isSearching = false;
            this.searchContent = '';
            this.getData();
        },
        clearContent () {
            console.log('clearContent')
            this.searchContent = '';
            this.getData();
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
        alertShow (value, number) { // alert实例
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    if (number === 1) {
                        // 跳转询价详情列表
                        // userId queryIdNo身份证号 vinNo车架号 licenseNo车牌号
                        storage.set('FQlicenseNo', this.carDetail.licenseNo)
                        window.location.href = 'FQQuotationDetail.html?userId=' + storage.get('userId') + '&queryIdNo=' + this.carDetail.idNo + '&vinNo=' + this.carDetail.vinNo;
                        return false;
                    } else {
                        storage.set('prevPage', './FQcompany.html?serialId=' + Common.getQueryString('serialId'));
                        window.location.href = './FQLogin.html';
                        return false;
                    }
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
        alertShow2 (value) {
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    storage.set('prevPage', './FQcompany.html');
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        multiLogin (response) {
            if (response.data.respCode === '100106') {
                this.loading = false;
                if (valid.isWeiXin()) {
                    weixinSDK.getAccessNone(window.location.href);
                } else {
                    this.alertShow2(response.data.respMsg)
                }
                return false;
            } else if (response.data.respCode !== '000000' && response.data.respCode !== '900001') {
                this.showtoast(response.data.respMsg, true);
            }
        }
    }
}
</script>
