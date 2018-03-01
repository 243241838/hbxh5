<template>
    <div class="container">
        <div id="body" v-if="once" :class="{'isWeiXin': isWeiXin}">
            <form id="form" style="display:none;" action="https://wap.lianlianpay.com/authpay.htm">
                <input id="requestData" type="text" name="req_data" value='' />
                <input type="submit" vlaue="submit"/>
            </form>
            <div class="session">
                <div v-if="!isTimeout" class="time" :class="{'isWeiXin': isWeiXin}">
                    <b style="margin:0;padding:0;">请在</b><span v-text="time.hours"></span><b>时</b><span v-text="time.minutes"></span><b>分</b><span v-text="time.seconds"></span><b>秒内完成支付，逾期将自动取消订单</b>
                </div>
                <div v-if="isTimeout" class="time" :class="{'isWeiXin': isWeiXin}">
                    <span>订单已经过期</span>
                </div>
                <div v-if="!selfPay" class="list">
                    <div class="item">
                        <div class="flexbox">
                            <p class="flex">
                                <span>您的互联网保险顾问：</span>
                                <span v-text="output.userName"></span>
                            </p>
                            <a :href="telephone">
                                <i class="iconfont icon_phone">&#xe61e;</i>
                            </a>
                        </div>
                    </div>
                    <ul class="plan">
                        <li class="planItem" v-text="insureInfo"></li>
                    </ul>
                </div>
                <div v-if="!selfPay" style="height:12px;"></div>
                <div class="list">
                    <div class="item">
                        <span>订单总价：</span>
                        <span class="moneyFont">{{output.payPrice | formatMoney}}</span>
                    </div>
                    <div class="item bordertop">
                        <a :href="orderURL" class="link" @click="goToOrder">
                            <span>成人综合意外险</span>
                            <i class="iconfont icon-xiayibu fr red_icon"></i>
                        </a>
                    </div>
                </div>
                <div v-if="selfPay" class="list" style="margin-top:14px;">
                     <div class="item">
                         <div class="link" @click="goToRedPacket">
                             <span>红包抵扣</span>
                             <span v-show="!couponIsSelected" class="fr red">
                                <span v-if="couponListLength>0">可用红包（{{couponListLength}}）</span>
                                <span v-else>暂无合适红包</span>
                                 <i class="iconfont icon-xiayibu red_icon"></i>
                             </span>
                             <span v-show="couponIsSelected" class="fr red">
                                 <span style="color:#CA4B69;" v-text="couponDisplay"></span>
                                 <i class="iconfont icon-xiayibu red_icon"></i>
                             </span>
                         </div>    
                     </div>
                     <div class="item bordertop flexbox">
                        <span class="flex">
                            可用<span v-text="output.maxUseJF"></span>积分抵扣<span>{{output.deductible | formatMoney}}</span>
                        </span>
                        <i class="iconfont icon_off" v-show="!integral" @click="jifenDeduction">&#xe639;</i><!--不选中-->
                        <i class="iconfont icon_on" v-show="integral" @click="jifenDeduction">&#xe63a;</i><!--选中-->
                     </div>
                     <div class="item bordertop flexbox">
                        <span class="flex">
                            可用余额<span>{{output.maxUseYE | formatMoney}}</span>
                        </span>
                        <i class="iconfont icon_off" v-show="!surplus" @click="yueDeduction">&#xe639;</i>
                        <i class="iconfont icon_on" v-show="surplus" @click="yueDeduction">&#xe63a;</i>    
                     </div>
                     <div class="item bordertop flexbox" v-if="output.couponCode">
                        <span>
                            使用优惠券
                        </span>
                        <span class="flex fc" v-text="output.couponCode"></span>
                        <i class="iconfont icon_off" v-show="!selectedBenefit" @click="benefitDeduction">&#xe639;</i>  
                        <i class="iconfont icon_on" v-show="selectedBenefit"@click="benefitDeduction">&#xe63a;</i> 
                     </div>
                     <div class="item bordertop flexbox" style="border:none;">
                        <span class="flex">仍需支付</span>
                        <span class="orange"><span>{{totalMoney | formatMoney}}</span></span>
                     </div>
                </div>
                <div class="head">
                    选择支付方式
                </div>
                <template v-for="(item,index) in payments">
                    <div class="payment" @click="payment(item,index)" :class="{noBorder:index==0}">
                        <i class="iconfont guoxuan" :class="index==paywaySelected?'green':'gray'">&#xe628;</i>
                        <span v-text="item.name"></span>
                    </div>
                </template>
                <div v-if="selfPay" class="description" style="padding-top:0.36rem;">
                    <div class="prompt">
                        <p class="flexbox">
                            <i class="iconfont guoxuan green">&#xe61c;</i>
                            <span v-text="output.tips.split('。')[0]"></span>
                            <p class="phone" v-text="output.tips.split('。')[1]"></p>
                        </p>
                    </div>
                </div>
                <div v-else class="description">
                    <div class="agreeBox">
                        <i class="iconfont icon_agree" :class="{'no_agree':noAgree}" @click="noAgree=!noAgree">&#xe620;</i>
                        <span class="agreement">我已阅读<a :href="insureNotice" class="green">《投保须知》</a><a href="#" class="green">《保险条款》</a>，并同意上述协议约定</span>
                    </div>
                    <div class="prompt">
                        <p class="flexbox">
                            <span v-text="output.tips.split('。')[0]"></span>
                            <p v-text="output.tips.split('。')[1]"></p>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer" :class="{'selfPay':selfPay}" v-if="once">
            <p v-if="selfPay">
                <span class="s1">合计：</span>
                <span class="money">{{totalMoney | formatMoney}}</span>
                <span class="s2">(已省<span>{{allDeduction | formatMoney}}</span>)</span>
            </p>
            <a v-if="!isTimeout" href="javascript:void(0);" @click="getPaySign">确认支付</a>
            <a v-else href="./index.html">再次购买</a>
        </footer>
        <!--弹出输入密码框-->
        <div class="passwordLayer" v-show="isShowPayModel">
            <div class="box">
                <div class="content">
                    <div class="close">
                        <i class="iconfont" @click="isShowPayModel=false">&#xe623;</i>
                    </div>
                    <div class="head">支付</div>
                    <input class="inputP" type="password" v-model="paymentPwd" placeholder="请输入支付密码">
                    <div class="line"></div>
                    <div class="forgetP" v-if="forgetURL"><a :href="forgetURL">忘记密码？</a></div>
                    <div class="forgetP"><a href="#">忘记密码？</a></div>
                    <div class="btn-box">
                        <div class="btn" @click="verifyPayPwd(forgetURL)">确认</div>
                    </div>
                </div>
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import Data from '../../data/data.js';
import request from 'js/interface/request'
import { Common, valid, storage } from 'js/common.js';
import toast from '../../components/toast' // toast引用
import layer from '../../components/layer' // layer引用
import Cookies from 'js/Cookies/Cookies.js';

export default {
    components: {
        toast,
        layer
    },
    data () {
        return {
            isWeiXin: false,
            insureNotice: '#',
            once: false, // 一次性渲染数据
            output: '',
            couponListLength: '', // 红包个数
            coupon: '', // 红包
            couponIsSelected: false, // 是否选择了红包
            selfPay: true, // 自己付（代付）
            integral: false, // 积分抵扣
            surplus: false, // 余额
            allDeduction: 0, // 所有的抵扣
            selectedBenefit: false, // 是否使用优惠券
            couponCode: '', // 优惠券码
            telephone: 'tel:', // 电话号码
            time: { // 倒计时
                days: '',
                hours: '',
                minutes: '',
                seconds: ''
            },
            paywaySelected: 0, // 默认支付选中样式
            paymentId: '', // 支付方式(连连，微信，支付宝)
            payments: [], // 支付
            noAgree: false, // 是否同意条款
            isTimeout: false, // 订单是否过期
            insureInfo: '', // 被保险人信息
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            orderURL: '#', // 订单详情url
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            isFirstVerify: true, // 是否需要验证(页面刷新就需要)
            havePaymentPwd: false, // 是否已经有支付密码
            isShowPayModel: false,
            forgetURL: '',
            paymentPwd: ''
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        this.couponDeduction();// 红包抵扣
        this.getTradePayment();// 获取订单支付信息
    },
    mounted () {
        if (JSON.parse(storage.get('userInfo')).paymentPwd === '1') {
            this.havePaymentPwd = true;
        }
        Common.setFullScreen();
    },
    filters: {
        formatMoney (value) {
            if (value || value === 0) {
                return '￥' + (value / 100).toFixed(2);
            } else {
                return value
            }
        },
        formatToTwoNumber (value) {
            if (value.lenght === 1) {
                return '0' + value;
            }
            return value;
        }
    },
    computed: {
        // 合计money
        totalMoney () {
            if (!this.output.payPrice) {
                return '';
            }
            let value = parseFloat(this.output.payPrice - this.allDeduction);
            if (value < 0) {
                value = 0;
            }
            return value;
        },
        // 红包显示
        couponDisplay () {
            if (this.coupon) {
                return '省' + parseFloat(this.coupon.couponValue / 100) + '元 |' + ' ' + this.coupon.couponName;
            } else {
                return '';
            }
        }
    },
    methods: {
        // 页面back时，初始化用户操作
        init () {
            let cookie = Cookies.getPaymentInfo();
            if (!cookie) {
                return;
            }
            // ------------------------------设置支付密码
            if (storage.get('paymentConfirmType') === '0') {
                // 积分
                this.isFirstVerify = false;
                cookie.integral = true;
                cookie.selectedBenefit = false;
                storage.remove('paymentConfirmType')
            } else if (storage.get('paymentConfirmType') === '1') {
                // 余额
                this.isFirstVerify = false;
                cookie.surplus = true;
                cookie.selectedBenefit = false;
                storage.remove('paymentConfirmType')
            }
            // --------------------------------
            Cookies.removePaymentInfo();
            // 红包
            let coupon = Cookies.getRedPacket();
            if (coupon) {
                //console.log(coupon)
                // 红包列表里保存的红包
                this.couponDeduction(coupon);
                Cookies.removeRedPacket();
            } else if (cookie.couponIsSelected) {
                this.couponDeduction(cookie.coupon);
            }
            // 积分, 选中它
            if (cookie.integral) {
                this.integral = false;
                this.jifenDeduction();
            }
            // 余额，选中它
            if (cookie.surplus) {
                this.surplus = false;
                this.yueDeduction();
            }
            // 优惠券
            if (cookie.selectedBenefit) {
                this.selectedBenefit = false;
                this.benefitDeduction();
            }
            // 支付方式
            this.payments.map((item) => {
                if (item.paymentId === cookie.paymentId) {
                    this.payment(item, cookie.paywaySelected);
                }
            })
        },
        // 获取订单支付信息 6.1.5
        getTradePayment () {
            let referrerUserId = Common.getQueryString('referrerUserId');
            if (referrerUserId && referrerUserId !== 'null') {
                this.selfPay = false;// 代付
            } else {
                this.selfPay = true;// 自己付
            }
            let obj = {};
            if (!this.selfPay) { // 代付
                obj = {
                    tradeId: Common.getQueryString('tradeId'),
                    applyPaySign: '1',
                    userId: referrerUserId
                }
            } else {
                // 自己付
                obj = {
                    tradeId: Common.getQueryString('tradeId'),
                    applyPaySign: '0',
                    userId: Common.getUserId()
                }
            }
            //console.log(obj)
            request.getTradePayment(obj, (response) => {
                let data = response.data;
                //console.log(data)
                this.updatePage(data);
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 数据渲染
        updatePage (data) {
            if (!data.success) {
                this.showtoast(data.respMsg, true);
                return;
            }
            this.output = data.output;
            // 默认使用优惠券
            if (this.output.couponCode) {
                this.benefitDeduction();
            }
            // 自付
            this.couponListLength = this.output.couponList.length;// 红包个数
            // 代付
            this.telephone = 'tel:' + this.output.mobile;// 电话号码
            // this.insureInfo = '已为' + Common.ellipsisName(this.output.insureName) + '(身份证号：' + Common.ellipsisId(this.output.insureIdNo) + ')做好保险计划并且填好资料，现请您完成保单支付';
            this.insureInfo = '已为' + this.output.insureName + '(身份证号：' + this.output.insureIdNo + ')做好保险计划并且填好资料，现请您完成保单支付';
            // 都有
            this.output.payments.map((item, index) => {
                if (index === 0) {
                    this.paymentId = item.paymentId;
                }
                item.name = item.paymentName;
                this.payments.push(item);
            })
            this.insureNotice = './insureNotice.html?productId=' + this.output.productId;
            // 初始化话用户操作
            this.init();
            // 倒计时
            this.setTime();
            this.once = true;
            this.resetBody();
        },
        // 红包抵扣
        couponDeduction (coupon) {
            // if (this.paymentId === '30') {
            //     return;
            // }
            if (this.selectedBenefit) {
                return;
            }
            this.coupon = coupon;
            if (this.coupon) {
                this.couponIsSelected = true;
            } else {
                this.couponIsSelected = false;
            }
            // 红包抵扣
            if (this.couponIsSelected) {
                if (this.selectedBenefit) {
                    this.selectedBenefit = false;
                    this.allDeduction = 0;
                }
                if (this.coupon&&this.coupon.couponValue&&this.isFirstVerify) {
                    this.allDeduction += parseFloat(this.coupon.couponValue);
                }
                if (this.allDeduction>parseFloat(this.output.payPrice)) {
                    this.allDeduction = parseFloat(this.output.payPrice);
                }
                console.log(this.allDeduction)
                if (parseFloat(this.coupon.couponValue) >= parseFloat(this.output.payPrice)) {
                    this.surplus = false;// 余额
                    this.integral = false;
                    console.log(1)
                } else {
                    if (parseInt(this.output.maxUseYE) !== 0) {
                        if ((parseFloat(this.output.maxUseYE)+parseFloat(this.coupon.couponValue))>parseFloat(this.output.payPrice)) {
                            this.output.maxUseYE = parseFloat(this.output.payPrice)-parseFloat(this.coupon.couponValue);
                        }
                    }
                }
            }
        },
        // 积分抵扣
        jifenDeduction () {
            // if (this.paymentId === '30') {
            //     this.showtoast('连连支付不能使用积分抵扣', true)
            //     return;
            // }
            // 当积分为0时点击不反应
            if (this.output.maxUseJF === 0 || this.output.maxUseJF === '0') {
                return;
            }
            if (this.coupon) {
                if (parseInt(this.coupon.couponValue)>=parseInt(this.output.payPrice)) {
                    return;
                }
            }
            if (this.isFirstVerify) {
                // 是否已经有支付密码
                if (this.havePaymentPwd) {
                    this.isShowPayModel = true;
                    this.forgetURL = './personal.html#/verifyPhone?tradeId=' + Common.getQueryString('tradeId') + '&type=' + 0;
                } else {
                    let obj = {
                        info: '使用积分抵扣和余额抵扣需要设置支付密码',
                        type: 0
                    }
                    this.confirmShow(obj);
                }
            } else {
                this.integral = !this.integral;
                //if (this.integral) {
                    //this.output.maxUseYE = this.output.payPrice-this.output.deductible;
                    //this.allDeduction -= this.output.deductible
                //} else {
                    //this.output.maxUseYE = this.output.payPrice;
                    //this.allDeduction -= this.output.deductible
                //}
                // 选中
                if (this.integral) {
                    // 优惠券是否选择
                    if (this.selectedBenefit) {
                        this.selectedBenefit = false;
                        this.allDeduction = 0;
                    }
                    if (parseInt(this.output.maxUseYE) !== 0) {
                        if (this.coupon&&parseFloat(this.coupon.couponValue)) {
                            if ((parseFloat(this.output.deductible)+parseFloat(this.coupon.couponValue))>parseFloat(this.output.payPrice)) {
                                this.output.maxUseYE = 0;
                            } else {
                                this.output.maxUseYE = parseFloat(this.output.payPrice) -parseFloat(this.output.deductible)-parseFloat(this.coupon.couponValue);
                            }
                        } else {
                            if (parseFloat(this.output.deductible)+parseInt(this.output.maxUseYE)>parseFloat(this.output.payPrice)) {
                                this.output.maxUseYE = parseFloat(this.output.payPrice)-parseFloat(this.output.deductible);
                            }
                        }
                    }
                    if (this.surplus) {
                        this.allDeduction -= parseFloat(this.output.deductible);
                    }
                    this.allDeduction += parseFloat(this.output.deductible);
                } else {
                    this.output.maxUseYE = parseFloat(this.output.maxUseYE)+ parseFloat(this.output.deductible);
                    this.allDeduction -= parseFloat(this.output.deductible);
                    if (this.surplus) {
                        this.allDeduction += parseFloat(this.output.deductible);
                    }
                    //console.log(this.allDeduction)
                    //this.allDeduction -= parseFloat(this.output.deductible);
                    if (parseInt(this.output.maxUseYE) !== 0) {
                        if (this.coupon&&parseFloat(this.coupon.couponValue)) {
                            if (parseFloat(this.coupon.couponValue)>parseFloat(this.output.payPrice)) {
                                this.output.maxUseYE = 0;
                            } else {
                                this.output.maxUseYE = parseFloat(this.output.payPrice)-parseFloat(this.coupon.couponValue);
                            }
                        } else {
                            if (parseInt(this.output.maxUseYE)>parseFloat(this.output.payPrice)) {
                                this.output.maxUseYE = parseFloat(this.output.payPrice);
                            }
                        }
                    }
                }
            }
        },
        // 余额抵扣
        yueDeduction () {
            // if (this.paymentId === '30') {
            //     this.showtoast('连连支付不能使用余额抵扣', true)
            //     return;
            // }
            // 当余额为0时点击不反应
            if (this.output.maxUseYE === 0 || this.output.maxUseYE === '0') {
                return;
            }
            if (this.coupon) {
                if (this.integral) {
                    if (parseFloat(this.coupon.couponValue)+parseFloat(this.output.deductible)>=parseFloat(this.output.payPrice)) {
                        return;
                    }
                } else {
                    if (parseFloat(this.coupon.couponValue)>=parseFloat(this.output.payPrice)) {
                        return;
                    }
                }
            }
            if (this.isFirstVerify) {
                // 是否已经有支付密码
                if (this.havePaymentPwd) {
                    this.isShowPayModel = true;
                    this.forgetURL = './personal.html#/verifyPhone?tradeId=' + Common.getQueryString('tradeId') + '&type=' + 1;
                } else {
                    let obj = {
                        info: '使用积分抵扣和余额抵扣需要设置支付密码',
                        type: 1
                    }
                    this.confirmShow(obj);
                }
            } else {
                this.surplus = !this.surplus;
                if (this.surplus) {
                    // 优惠券使用中
                    if (this.selectedBenefit) {
                        this.selectedBenefit = false;
                        this.allDeduction = 0;
                    }
                    //代表我用了积分
                    this.allDeduction += parseFloat(this.output.maxUseYE);
                } else {
                    this.allDeduction -= parseFloat(this.output.maxUseYE);
                }
            }
        },
        // 优惠券
        benefitDeduction () {
            if (this.paymentId === '30') {
                this.showtoast('连连支付不能使用优惠券', true)
                return;
            }
            this.selectedBenefit = !this.selectedBenefit;
            if (this.selectedBenefit) {
                this.surplus = false;// 余额
                this.integral = false;// 积分
                this.couponIsSelected = false;// 红包
                this.allDeduction = parseFloat(this.output.payPrice);// 抵扣
            } else {
                this.allDeduction = 0;// 抵扣
            }
        },
        // 支付方式
        payment (item, index) {
            this.paywaySelected = index;
            this.paymentId = item.paymentId;
            //连连支付的
            // if (this.paymentId === '30') {
            //     this.integral = false;
            //     this.surplus = false;
            //     this.selectedBenefit = false;
            //     this.couponIsSelected = false;
            //     this.allDeduction = 0;
            // }
        },
        // 获取支付签名信息 6.1.6
        getPaySign () {
            let couponList = [];
            if (this.coupon) {
                couponList.push(this.coupon);
            }
            let obj = {
                userId: Common.getUserId(), // 用户id
                tradeId: Common.getQueryString('tradeId'), // 订单号
                paymentId: this.paymentId, // 支付类型
                acctBalanceJF: this.integral ? this.output.maxUseJF : 0, // 积分
                acctBalanceYE: this.surplus ? this.output.maxUseYE : 0, // 余额
                couponCode: this.selectedBenefit ? this.couponCode : '', // 优惠券
                couponList: this.couponIsSelected ? couponList : [] // 红包列表
            }
            // console.log('支付提交信息：', obj)
            // 连连支付
            if (this.paymentId === '30') {
                // delete obj.acctBalanceJF;
                // delete obj.acctBalanceYE;
                // delete obj.couponCode;
                // delete obj.couponList;
                storage.set('lianlianInfo', JSON.stringify(obj));
                let obj1={
                    userId: Common.getUserId()
                }
                request.getLianLianAuthInfo(obj1, (response) => {
                    //console.log(response.data)
                    if (response.data.respCode === '000000') {
                        if (response.data.output.authSts === 0) {
                            window.location.href='./paymentlianlian.html';
                        } else {
                            let obj2 = JSON.parse(storage.get('lianlianInfo'));
                            obj2.realName = response.data.output.realName;
                            obj2.idenNo = response.data.output.idenNo;
                            request.getPaySign(obj2, (response) => {
                                //console.log(obj2)
                                //console.log(response.data)
                                //当等于000001时，要支付的钱为0，直接支付成功页面
                                if (response.data.respCode === '000001') {
                                    window.location.href = 'paymentSuccess.html?tradeId=' + Common.getQueryString('tradeId');
                                    return false;
                                }
                                if (response.data.respCode === '000000') {
                                    document.getElementById('requestData').value = JSON.stringify(response.data.output);
                                    document.querySelector('#form').submit();
                                } else {
                                    this.showtoast(response.data.respMsg, true);
                                }
                            }, (error) => {
                                this.showtoast(error, true);
                            })
                        }
                    }
                }, (error) => {
                    this.showTotast(error, true);
                })
                return;
            }
            request.getPaySign(obj, (response) => {
                if (obj.paymentId === '20') {
                    // 微信支付
                    //console.log(response)
                } else if (obj.paymentId === '10') {
                    // 支付宝支付
                    //console.log(response)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 跳转到订单
        goToOrder () {
            // 超时订单失效
            if (!this.isTimeout) {
                this.setCookie();
                this.orderURL = './orderDetailGe.html?tradeId=' + Common.getQueryString('tradeId') + '&classType=2' + '&referrerUserId=' + Common.getQueryString('referrerUserId');
            } else {
                this.orderURL = '#';
            }
        },
        // 跳转到红包列表
        goToRedPacket () {
            //if (this.paymentId === '30') {
                //this.showtoast('连连支付不能使用红包', true)
                //return;
            //}
            if (this.selectedBenefit) {
                this.showtoast('优惠券和红包不能同时使用', true);
                return;
            }
            // 超时订单失效
            if (!this.isTimeout && this.couponListLength > 0) {
                this.setCookie();
                window.location.href = './redPacket.html?tradeId=' + Common.getQueryString('tradeId');
            }
        },
        // 保存用户操作
        setCookie () {
            let info = {
                coupon: this.coupon, // 红包
                couponIsSelected: this.couponIsSelected, // 红包
                integral: this.integral, // 积分
                surplus: this.surplus, // 余额
                selectedBenefit: this.selectedBenefit, // 优惠券
                couponCode: this.couponCode, // 优惠券
                paywaySelected: this.paywaySelected, // 支付方式
                paymentId: this.paymentId // 支付方式
            }
            Cookies.setPaymentInfo(info)
        },
        // 倒计时
        setTime () {
            Common.countdown(this.time, this.output.payDeadline, this.isTimeout, (time, isTimeout) => {
                this.time = time;
                this.isTimeout = isTimeout;
            });
        },
        // 显示提示框
        showtoast (msg, isshow) {
            this.toast.isshow = isshow;
            this.toast.message = msg;
        },
        // 关闭提示框
        closetoast () {
            this.toast.isshow = false;
        },
        resetBody () {
            this.$nextTick(() => {
                Common.setFullScreen();
            })
        },
        confirmShow (obj) { // confirm实例
            this.showLayer(obj.info, {
                type: 'confirm',
                btns: ['下次吧', '去设置'],
                yes: () => {
                    this.setCookie();
                    window.location.href = 'personal.html#/verifyPhone?tradeId=' + Common.getQueryString('tradeId') + '&type=' + obj.type;
                },
                no: () => {
                    //console.log('confirm-no');
                }
            })
        },
        showLayer (msg, options) {
            this.layer.type = options.type;
            this.layer.message = msg;
            this.layer.isshow = true;
            this.layer.shadeClose = options.shadeClose;
            this.layer.btns = options.btns;
            this.layer.yes = options.yes;
            this.layer.no = options.no;
        },
        closeLayer (type, shade) {
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        // 校验支付密码
        verifyPayPwd (params) {
            // 6-12位数字字母组成
            if (this.paymentPwd.length === 0) {
                this.showtoast('请输入支付密码', true)
                return;
            }
            let data = {
                userId: Common.getUserId(),
                payPwd: this.paymentPwd
            }
            request.verifyPayPwd(data, (response) => {
                // console.log(response)
                if (response.data.respCode === '000000') {
                    if (params[params.length - 1] === '0') {
                        storage.set('paymentConfirmType', '0');
                    } else {
                        storage.set('paymentConfirmType', '1');
                    }
                    // 首次验证
                    this.isFirstVerify = false;
                    // 隐藏模态框
                    this.isShowPayModel = false;
                    this.setCookie();
                    this.init();
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        }
    }
}
</script>

