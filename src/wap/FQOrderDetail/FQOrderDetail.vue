<template>
    <div id="body">
        <div class="content" v-show="!loading">
            <div v-if="!isTimeout && output.sts == '10'" class="time">
                <b style="margin:0;padding:0;">请在</b><span v-text="time.hours"></span><b>时</b><span v-text="time.minutes"></span><b>分</b><span v-text="time.seconds"></span><b>秒内完成支付，逾期将自动取消订单</b>
            </div>
            <div v-if="isTimeout && output.sts == '10'" class="time">
                <span>订单已经过期</span>
            </div>
            <div class="title">
                保单信息
            </div>
            <div class="list">
                <div class="item flexbox">
                    <span class="left">订单状态：</span>
                    <span class="center yellow" v-show="output.sts == '10'">等待付款</span>
                    <span class="center yellow" v-show="output.sts == '-11'">已失效</span>
                    <span class="center yellow" v-show="output.sts == '20'">已支付</span>
                    <span class="center yellow" v-show="output.sts == '35'">已完成</span>
                    <span class="center yellow" v-show="output.sts == '50'">已退款</span>
                </div>
                <div class="item flexbox">
                    <span class="left" v-if="output.instalmentSts != '0'">分期状态：</span>
                    <span class="center green" v-if="output.instalmentSts == '10'">分期申请中...</span>
                    <span class="center green" v-if="output.instalmentSts == '20'">分期审核中...</span>
                    <span class="center green" v-if="output.instalmentSts == '30'">分期审核通过</span>
                    <span class="center green" v-if="output.instalmentSts == '-20'">分期申请失败</span>
                    <span class="center green" v-if="output.instalmentSts == '-30'">分期审核失败</span>
                    <span class="center green" v-if="output.instalmentSts == '-10'">分期已取消</span>
                </div>
                <div class="item flexbox">
                    <span class="left">订单号：</span>
                    <span class="center" v-text="output.tradeId"></span>
                </div>
                <div class="item flexbox">
                    <span class="left">商业险起保时间：</span>
                    <span class="center" v-text="output.startTime"></span>
                </div>
                <div class="item flexbox">
                    <span class="left">商业险终止时间：</span>
                    <span class="center" v-text="output.endTime"></span>
                </div>
                <div class="item flexbox" v-show="output.jqxStartTime">
                    <span class="left">交强险起保时间：</span>
                    <span class="center" v-text="output.jqxStartTime"></span>
                </div>
                <div class="item flexbox" v-show="output.jqxEndTime">
                    <span class="left">交强险终止时间：</span>
                    <span class="center" v-text="output.jqxEndTime"></span>
                </div>
            </div>
            <div class="title">
                保单邮寄地址
            </div>
            <div class="list">
                <div class="item flexbox">
                    <span class="left">收件人：</span>
                    <span class="center flex" v-text="output.receiverName"></span>
                </div>
                <div class="item flexbox">
                    <span class="left">联系电话：</span>
                    <span class="center flex" v-text="output.receiverMobile"></span>
                </div>
                <div class="item flexbox">
                    <div class="left">地址：</div>
                    <div class="center flex" v-text="output.shippingAddress"></div>
                </div>
            </div>
            <div class="title">
                车辆信息
            </div>
            <div class="list">
                <div class="item flexbox">
                    <span class="left">车牌：</span>
                    <span class="center" v-for="(item,index) in output.insuredList" v-if="index == 0 && item.carInfo.licenseNo != '0'" v-text="item.carInfo.licenseNo"></span>
                    <span class="center" v-for="(item,index) in output.insuredList" v-if="index == 0 && item.carInfo.licenseNo == '0'">新车未上牌</span>
                </div>
                <div class="item flexbox">
                    <span class="left">车主：</span>
                    <span class="center" v-for="(item,index) in output.insuredList" v-if="index == 0" v-text="item.insuredName"></span>
                </div>
                <div class="item flexbox">
                    <span class="left">证件号码：</span>
                    <span class="center" v-for="(item,index) in output.insuredList" v-if="index == 0" v-text="item.idNo"></span>
                </div>
                <div class="item flexbox">
                    <span class="left">联系电话：</span>
                    <span class="center" v-for="(item,index) in output.insuredList" v-if="index == 0" v-text="item.mobile"></span>
                </div>
            </div>
            <div class="title">
                保障详情
            </div>
            <div class="list">
                <div class="item flexbox">
                    <span class="left gray">产品险企：</span>
                    <span class="center" v-text="output.insurerName"></span>
                </div>
                <div class="item flexbox">
                    <span class="left gray">投保城市：</span>
                    <span class="center" v-for="(item,index) in output.insuredList" v-if="index == 0" v-text="item.carInfo.cityName"></span>
                </div>
                <div class="rem01"></div>
                <div class="item flexbox">
                    <span class="left gray">保费详情：</span>
                </div>
                <div class="table">
                    <div class="flexbox row" v-show="output.jqPreium">
                        <div class="flex col">交强险</div>
                        <div class="flex col last">{{output.jqPreium | formatMoney}}</div>
                    </div>
                    <div class="flexbox row" v-show="output.ccsPreium">
                        <div class="flex col">代缴车船险</div>
                        <div class="flex col last">{{output.ccsPreium | formatMoney}}</div>
                    </div>
                    <div class="flexbox row last">
                        <div class="flex col">商业险</div>
                        <div class="flex col last">{{output.syPreium | formatMoney}}</div>
                    </div>
                </div>
                <div class="link" @click="viewDetails">
                    查看详情
                </div>
            </div>
            <div class="imgBox" v-show="showImg" @click="showImg=false;">
                <img v-show="output.syxDetailImg" :src="output.syxDetailImg" alt="">
            </div>
            <div class="description" v-if="output.tips">
                <i class="iconfont icon-tishi"></i>
                <span class="content">{{output.tips | formatDescription1}}</span>
                <!--<div class="content phone">{{output.tips | formatDescription2}}</div>-->
                <div class="content phone">联系电话：400-678-6078</div>
            </div>
            <footer class="footer flexbox" v-if="FQmanageCustomer">
                <div class="flex FQmanageCustomer"><span class="name">保单金额：</span><span>{{output.payAmount | formatMoney}}</span><span class="name"> 元</span></div>
                <div class="FQmanageCustomer"><span class="name">推广费：</span><span>{{FQmanageCustomer | formatMoney}}</span><span class="name"> 元</span></div>
            </footer>
            <footer class="footer flexbox" v-else>
                <div class="moneyBox flex flexbox">
                    <span>￥</span><div class="money">{{output.payAmount | formatMoney}}</div>
                </div>
                <!--分期-->
                <!--分期申请中，待支付-->
                <a v-if="output.instalmentSts == '10' && output.sts == '10'" class="button" @click="cancelOrder">取消订单</a>
                <a v-if="output.instalmentSts == '10' && output.sts == '10'" @click="gotoDispatch" href="#" class="button green last">去分期</a>
                <!--分期审核中，待支付：置灰-->
                <a v-if="output.instalmentSts == '20' && output.sts == '10'" href="#" class="button gray last">分期查询</a>
                <!--分期审核通过, 待支付|已支付|已完成-->
                <a v-if="output.instalmentSts == '30' && output.sts == '10'" @click="divideDetail" class="button">分期查询</a>
                <a v-if="output.instalmentSts == '30' && output.sts == '20'" @click="divideDetail" class="button">分期查询</a>
                <a v-if="output.instalmentSts == '30' && output.sts == '35'" @click="divideDetail" class="button">分期查询</a>
                <!--分期申请失败|分期审核失败|分期取消|分期申请中，已失效-->
                <a v-if="output.instalmentSts == '-10' && output.sts == '-11'" href="./FQcarInfo.html" class="button green last">再次购买</a>
                <a v-if="output.instalmentSts == '-20' && output.sts == '-11'" href="./FQcarInfo.html" class="button green last">再次购买</a>
                <a v-if="output.instalmentSts == '-30' && output.sts == '-11'" href="./FQcarInfo.html" class="button green last">再次购买</a>
                <a v-if="output.instalmentSts == '10' && output.sts == '-11'" href="./FQcarInfo.html" class="button green last">再次购买</a>

                <!--无分期-->
                <a v-if="output.instalmentSts == '0' && output.sts == '10'" class="button" @click="cancelOrder">取消订单</a>
                <a v-if="output.instalmentSts == '0' && output.sts == '10'" href="#" @click="gotoSuccess" class="button green last">去支付</a>
                <a v-if="output.instalmentSts == '0' && output.sts == '20'" href="./FQcarInfo.html" class="button green last">再次购买</a>
                <a v-if="output.instalmentSts == '0' && output.sts == '35'" href="./FQcarInfo.html" class="button green last">再次购买</a>
                <a v-if="output.instalmentSts == '0' && output.sts == '50'" href="./FQcarInfo.html" class="button green last">再次购买</a>
                <a v-if="output.instalmentSts == '0' && output.sts == '-11'" href="./FQcarInfo.html" class="button green last">再次购买</a>
            </footer>
            <form id="form" style="display:none;" action="http://api.51hqb.cn/hbx/enroll" method="post">
                <input id="car_engine" type="text" name="car_engine"/>
                <input id="car_vin" type="text" name="car_vin"/>
                <input id="car_model" type="text" name="car_model"/>
                <input id="car_idCard" type="text" name="car_idCard"/>
                <input id="owner_name" type="text" name="owner_name"/>
                <input id="owner_number" type="text" name="owner_number"/>
                <input id="owner_phone" type="text" name="owner_phone"/>
                <input id="order_no" type="text" name="order_no"/>
                <input id="order_total" type="text" name="order_total"/>
                <input id="order_force" type="text" name="order_force"/>
                <input id="order_tax" type="text" name="order_tax"/>
                <input id="order_com" type="text" name="order_com"/>
                <input id="order_time" type="text" name="order_time"/>
                <input id="return_url" type="text" name="return_url"/>
                <input id="sign" type="text" name="sign"/>
                <input id="owner_idCard1" type="text" name="owner_idCard1">
                <input id="owner_idCard2" type="text" name="owner_idCard2">
                <input id="order_insurance" type="text" name="order_insurance">
            </form>
            <form id="detailForm" style="display:none;" action="http://api.51hqb.cn/hbx/order" method="get">
                <input id="orderNo" type="text" name="orderNo"/>
                <input id="sign2" type="text" name="sign"/>
            </form>
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toast提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import request from 'js/interface/request'
import loading from '../../components/loading.vue';
import layer from '../../components/layer'
import toast from '../../components/toast.vue';
import { Common, storage, valid } from 'js/common.js';
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
            FQmanageCustomer: Common.getQueryString('FQmanageCustomer'),
            output: '',
            showImg: false, // 查看详情
            isTimeout: false,
            time: { // 倒计时
                days: '',
                hours: '',
                minutes: '',
                seconds: ''
            }
        }
    },
    created () {
        this.getData();// 获取数据
    },
    mounted () {
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
    },
    filters: {
        formatDate (value) {
            if (!value) {
                return '';
            }
            let index = 12;
            let flg = [':', ':', ' ', '-', '-'];
            for (let i = 0; i < 5; i++) {
                value = value.substring(0, index) + flg[i] + value.substring(index, value.length);
                index -= 2;
            }
            return value;
        },
        formatMoney (value) {
            if (!value) {
                return '';
            }
            return (value / 100).toFixed(2);
        },
        formatDescription1 (value) {
            let s = value.toString().split('</br>');
            return s[0];
        },
        formatDescription2 (value) {
            let s = value.toString().split('</br>');
            return s[1];
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
        // 获取数据
        getData () {
            let obj = {
                classType: '3',
                userId: Common.getQueryString('userId') || Common.getUserId(),
                tradeId: Common.getQueryString('tradeId')
            }
            console.log(obj);
            request.getCarTradeDetail(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    this.output = response.data.output;
                    console.log(this.output)
                    this.setTime();
                    // 分期状态 instalmentSts: 00：无分期，10：分期申请中，20：分期审核中，30：分期审核通过，-20：分期申请失败，-30：分期审核失败,-10：订单已取消
                    // 订单状态sts 10：待支付, -11：已失效, 20：已支付, 35 ：已完成, 50：已退款
                    this.loading = false;
                    this.resetBody();
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // 查看详情
        viewDetails () {
            this.showImg = true;
        },
        // 取消订单
        cancelOrder () {
            if (this.isTimeout) {
                this.alertShow2('订单已经过期！');
                return;
            }
            this.confirmShow('确认取消订单');
        },
        // 取消
        cancel () {
            let obj = {
                userId: Common.getUserId(),
                tradeId: Common.getQueryString('tradeId')
            }
            request.cancelCarTrade(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    this.showtoast(response.data.respMsg, true);
                    setTimeout(() => {
                        window.location.href = './FQOrerList.html';
                        return false;
                    }, 1000);
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // 去分期
        gotoDispatch () {
            if (this.isTimeout) {
                this.alertShow2('订单已经过期，请重新下单！');
                return;
            }
            let obj = {
                userId: Common.getUserId(),
                tradeId: Common.getQueryString('tradeId')
            }
            request.dispatchToDomin(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    document.getElementById('car_engine').value = output.car_engine;// 车辆发动机号
                    document.getElementById('car_vin').value = output.car_vin;// 车辆识别代码
                    document.getElementById('car_model').value = output.car_model;// 车辆型号，空格用_代替
                    document.getElementById('car_idCard').value = output.car_idCard;// 车辆证件照片URL
                    document.getElementById('owner_name').value = output.owner_name;// 车主姓名
                    document.getElementById('owner_number').value = output.owner_number;// 车主证件号
                    document.getElementById('owner_phone').value = output.owner_phone;// 车主手机号
                    document.getElementById('order_no').value = output.order_no;// 汇报险订单号
                    document.getElementById('order_total').value = output.order_total;// 订单金额
                    document.getElementById('order_force').value = output.order_force;// 交强险金额
                    document.getElementById('order_tax').value = output.order_tax;// 车船税
                    document.getElementById('order_com').value = output.order_com;// 商险金额
                    document.getElementById('order_time').value = output.order_time;// 保单提交时间
                    document.getElementById('return_url').value = output.return_url;// 错误回调URL
                    document.getElementById('sign').value = output.sign;// 签名
                    document.getElementById('owner_idCard1').value = output.owner_idCard1;// 身份证正面照片
                    document.getElementById('owner_idCard2').value = output.owner_idCard2;// 身份证反面照片
                    document.getElementById('order_insurance').value = output.order_insurance;// 保险公司名称
                    document.querySelector('#form').submit();
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        gotoSuccess () {
            if (this.isTimeout) {
                this.alertShow2('订单已经过期，请重新下单！');
                return;
            }
            window.location.href = './FQPaySuccess.html?tradeId=' + this.output.tradeId + '&FQOrerList=' + Common.getQueryString('FQOrerList');
            return false;
        },
        // 分期查询
        divideDetail () {
            let obj = {
                userId: Common.getUserId(),
                tradeId: Common.getQueryString('tradeId')
            }
            this.loading = true;
            request.getInstallmentInfo(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    console.log(response);
                    let output = response.data.output;
                    // document.getElementById('orderNo').value = '20170517150556553382';
                    document.getElementById('orderNo').value = output.orderNo;
                    document.getElementById('sign2').value = output.sign;
                    document.querySelector('#detailForm').submit();
                    // 跳到链钱
                    this.loading = false;
                    this.resetBody();
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // 倒计时
        setTime () {
            Common.countdown(this.time, this.output.payDeadline, this.isTimeout, (time, isTimeout) => {
                this.time = time;
                this.isTimeout = isTimeout;
            });
        },
        resetBody () {
            this.$nextTick(() => {
                Common.setFullScreen();
            })
        },
        confirmShow (val) { // confirm实例
            this.showLayer(val, {
                type: 'confirm',
                btns: ['我再想想', '去意已决'],
                yes: () => {
                    this.cancel();
                },
                no: () => {
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
                    storage.set('prevPage', './FQOrderDetail.html?tradeId=' + Common.getQueryString('tradeId'));
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        alertShow2 (value) { // alert实例
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    return false;
                }
            })
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.isshow = isshow;
            this.toast.message = msg;
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
