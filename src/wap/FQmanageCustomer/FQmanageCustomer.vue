<template>
    <div class="container">  
        <div id="body" class="body" :class="{isWeiXin:isWeiXin}">
            <div class="flexbox align-items user" @click="gotoFQclienteleData">
                <div class="img">
                    <img v-if="userRemarksPoRecord.userLogo" :src="userRemarksPoRecord.userLogo" alt="">
                    <img v-else src="./images/img.png" alt="">
                </div>
                <div class="flex">
                    <p class="name" v-if="userRemarksPoRecord.remarkNickame" v-text="userRemarksPoRecord.remarkNickame"></p>
                    <p class="name" v-else-if="userRemarksPoRecord.userNickname" v-text="userRemarksPoRecord.userNickname"></p>
                    <p class="name" v-else>hbx{{userRemarksPoRecord.userName}}</p>
                    <p v-text="userRemarksPoRecord.userName"></p>
                </div>
                <i class="iconfont next-icon">&#xe667;</i>
            </div>
            <div class="list">
                <!--已承保--> 
                <div v-for="(item,index) in cartradeList" @click="goUrl(item)">
                    <div class="list_head" v-text="item.tradeDate"></div>
                    <div class="item">
                        <div class="top flexbox">
                            <div class="left"><img :src="item.insurerLogo" alt=""></div>
                            <div class="numberCar flex" v-text="item.insurerName"></div>
                        </div>
                        <div class="center" >
                            <div>
                                车牌号：
                                <span v-for="itm in item.insuredList" v-text="itm.licenseNo==0?'新车未上牌':itm.licenseNo"></span>
                            </div>
                            <div>
                                订单号：
                                <span v-text="item.tradeId"></span>
                            </div>
                            <div>
                                被保人：
                                <span v-for="(itm,index) in item.insuredList" v-if="index==0" v-text="itm.insuredName"></span>
                            </div>
                            <div v-show="item.jqxStartTime">
                                交强险起期：
                                <span v-text="item.jqxStartTime"></span>
                                <span class="br">至</span>
                                <span v-text="item.jqxEndTime"></span>
                            </div>
                            <div>
                                商业险起期：
                                <span v-text="item.startTime"></span>
                                <span class="br">至</span>
                                <span v-text="item.endTime"></span>
                            </div>
                        </div>
                        <div class="flexbox bottom">
                            <div>
                                保单金额：
                                <span v-text="(item.payAmount/100).toFixed(2)" ></span>
                                元
                            </div>
                            <div class="flex"></div>
                            <div>
                                推广费：
                                <span v-text="(item.income/100).toFixed(2)" ></span>
                                元
                            </div>
                        </div>
                        <!--item-->
                    </div>  
                </div>
                <!--list-->
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
import toast from '../../components/toast';
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
            cartradeList: '',
            loading: false,
            pageIndex: 1,
            pageSize: 10,
            isWeiXin: false,
            first_list: true, // 第一次
            userRemarksPoRecord: ''
        }
    },
    created () {
        this.getCarUserInfo();
    },
    mounted () {
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
        this.isWeiXin = valid.isWeiXin();
        window.dropload = new Mydropload('body', this.refreshData, this.getData);
    },
    computed: {
    },
    methods: {
        //获取数据
        getData (me) {
            if (this.first_list) {
                this.loading = true;
            }
            if (me) {
                window.dropload = me;
            } else {
                // 解锁
                window.dropload.isLockDown = false;
                window.dropload.isData = true;
            }
            var data = {
                userId: Common.getQueryString('userId'),
                tradeSts: '35', // 已完成
                pageIndex: this.pageIndex,
                pageSize: '10',
                ownerId: Common.getUserId()
            }
            console.log(data)
            let p = myPromise.pagination(data, 'getCarTrades', this.cartradeList, 'cartradeList', window.dropload);
            p.then((obj) => {
                this.cartradeList = obj.productList;
                console.log(this.cartradeList)
                this.$nextTick(() => {
                    Common.setFullScreen()
                    window.dropload.direction = 'up';
                    window.dropload.resetload();
                })
                this.pageIndex = obj.pageIndex;
                this.loading = false;
                this.first_list = false;
            }, (response) => {
                this.multiLogin(response);
                this.loading = false;
                this.first_list = false;
            });
            Common.setFullScreen()
        },
        getCarUserInfo () {
            let obj = {
                userId: Common.getQueryString('userId'),
                ownerId: Common.getUserId()
            }
            console.log(obj)
            request.getCarUserInfo(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    this.userRemarksPoRecord = response.data.output.userRemarksPoRecord[0];
                    storage.set('userRemarksPoRecord', JSON.stringify(this.userRemarksPoRecord))
                    console.log(this.userRemarksPoRecord)
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        gotoFQclienteleData () {
            if (this.userRemarksPoRecord) {
                window.location.href = './FQclienteleData.html';
            }
        },
        // 去订单详情
        goUrl (item) {
            console.log(item);
            window.location.href = 'FQOrderDetail.html?tradeId=' + item.tradeId + '&FQmanageCustomer=' + item.income + '&userId=' + Common.getQueryString('userId');
        },
        //微信授权
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
        refreshData (me) {
            me.resetload();
        },
        resetBody () {
            this.$nextTick(() => {
                setTimeout(() => {
                    Common.setFullScreen()
                }, 0)
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
        closeLayer (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        //弹窗调登录页面
        alertShow (value) {
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    storage.set('prevPage', './FQPolicyList.html');
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        //多点登陆
        multiLogin (response) {
            if (response.data.respCode === '100106') {
                this.loading = false;
                if (valid.isWeiXin()) {
                    weixinSDK.getAccessNone(window.location.href);
                } else {
                    this.alertShow(response.data.respMsg)
                }
                return false;
            } else if (response.data.respCode !== '000000' && response.data.respCode !== '900001') {
                this.showtoast(response.data.respMsg, true);
            }
        }
    }
}
</script>
