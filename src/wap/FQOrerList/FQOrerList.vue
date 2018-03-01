<template>  
    <div id="body">
        <div class="order_box" v-show="render">
             <div class="order_head flexbox" :class="{'isWeixin':isWeixin}">
                    <div class="flex flexbox justify-content">
                        <div class="item" :class="{border:head_border==1}" @click="tabChange('1')">
                            全部
                        </div>
                    </div>
                   <div class="flex flexbox justify-content">
                       <div class="item" :class="{border:head_border==2}" @click="tabChange('2')">
                           待支付
                       </div>
                   </div>
                   <div class="flex flexbox justify-content">
                       <div class="item" :class="{border:head_border==3}" @click="tabChange('3')">
                           已完成
                       </div>
                   </div>
                    <div class="flexbox justify-content">
                       <div class="item" :class="{border:head_border==4}" @click="tabChange('4')">
                           资料待补充
                           <span v-text="span_number" v-show="span_number!=0"></span>
                       </div>
                   </div>
            </div>
            <!--全部-->
            <div class="order_list" :class="{'isWeixin':isWeixin,'isTop':tradeList.length>0}">
                <a :href="url" v-for="(item,index) in tradeList">
                    <div class="list_head" v-text="item.tradeDate"></div>
                    <div class="item" @click="orderUrl(item)">
                        <div class="order_top flexbox">
                            <div class="left"><img :src="item.insurerLogo" alt=""></div>
                            <div class="numberCar flex"  v-text="item.insurerName"></div>
                            <div class="right">
                                <div v-show="item.sts==10"><a href="javascript:;">去支付</a></div>
                                <div v-show="item.sts==20" class="noborder">已支付</div>
                                <div v-show="item.sts==35" class="noborder">已完成</div>
                                <div v-show="item.sts==50" class="noborder">已退款</div>
                                <div v-show="item.sts==-11" class="noborder">已失效</div>
                            </div>
                        </div>
                        <div class="order_center">
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
                                <span v-for="itm in item.insuredList" v-text="itm.insuredName"></span>
                            </div>
                            <div v-if="item.classType==3">
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
                            <div v-else>
                                <div>
                                    投保人：
                                    <span v-text="item.policyHolderName"></span>
                                </div>
                                <div>
                                     保险期间:
                                    <span v-text="item.startTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.endTime"></span>
                                </div>
                            </div>
                        </div>
                        <div class="order_bottom flexbox">
                           <div>
                              订单金额：
                              <span v-text="(item.payAmount/100).toFixed(2)"></span>
                              元
                           </div>
                           <div class="flex flexbox flex-right">
                             <!--  推广费：
                               <span v-text="((item.payAmount*item.commisionValue1)/100).toFixed(2)"></span>
                               元
                               -->
                               <span v-show="tradeSts=='88'">资料待补充</span>
                           </div>
                        </div>
                        <!--item-->
                    </div>
                </a>
                <!--list-->
            </div>
          
            <!--box-->
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
         <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import myPromise from 'js/tools.js';
import request from 'js/interface/request'
import toast from '../../components/toast' // toast引用
import loading from '../../components/loading.vue';
import layer from '../../components/layer'
import { Common, valid, storage } from 'js/common.js';
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
            isWeixin: false,
            render: true,
            loading: false,
            isFirst: true,
            span_number: '', //补充资料数量
            head_border: '1',
            pageIndex: 1, // 页码
            pageSize: 10, // 数量
            tradeList: [],
            url: 'javascript:;',
            tradeSts: '0',
            first_list: true // 第一次
        }
    },
    created () {
        this.isWeixin = valid.isWeiXin();
        window.dropload = new Mydropload('body', this.refreshData, this.getData);
    },
    mounted () {
        this.getData1();// 取补充车辆的条数
        Common.setFullScreen(document.getElementById('body'))
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
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
                            weixinSDK.initShare(window.wx, 1);
                        });
                    }
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        //补充车辆number
        getData1 () {
            var obj = {
                userId: Common.getUserId(),
                tradeSts: 88,
                pageIndex: 1,
                pageSize: 10
            }
            request.getCarTrades(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    this.span_number = response.data.output.totalCount
                }
            }, () => {
                this.loading = false;
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
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
            var obj = {
                userId: Common.getUserId(),
                tradeSts: this.tradeSts,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            }
            let p = myPromise.pagination(obj, 'getCarTrades', this.tradeList, 'cartradeList', window.dropload);
            p.then((obj) => {
                this.tradeList = obj.productList;
                console.log(obj)
                this.$nextTick(() => {
                    Common.setFullScreen(document.getElementById('body'))
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
            Common.setFullScreen(document.getElementById('body'))
        },
        // tab切换
        tabChange (type) {
            this.pageIndex = 1;
            this.tradeList = [];
            if (type === '1') {
                this.tradeSts = '0'
                this.getData();
            } else if (type === '2') {
                this.tradeSts = '10'
                this.getData();
            } else if (type === '3') {
                this.tradeSts = '35'
                this.getData();
            } else {
                this.tradeSts = '88'
                this.getData();
            }
            this.head_border = type;
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
        orderUrl (item) {
            if (this.tradeSts === '88') {
                let obj = {
                    frontIdCardImg: item.frontIdCardImg, // 身份证正面
                    frontIdCardSts: item.frontIdCardSts, // 省份证正面状态
                    backIdCardImg: item.backIdCardImg, //证件照反面
                    backIdCardSts: item.backIdCardSts, // 证件照反面状态
                    travelLicenseImg: item.travelLicenseImg, // 驾照
                    travelLicenseSts: item.travelLicenseSts // 驾照状态
                }
                storage.set('FQOrerList', JSON.stringify(obj));
                window.location.href = 'FQSubmitInfo.html?tradeId=' + item.tradeId;
                return false;
            } else {
                window.location.href = 'FQOrderDetail.html?tradeId=' + item.tradeId + '&FQOrerList=true';
                return false;
            }
        },
        // 显示提示框
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        // 关闭提示框
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
                    storage.set('prevPage', './FQOrerList.html');
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
