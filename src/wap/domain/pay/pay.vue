<template>
    <div class="container">
        <div v-if="!loading">
            <div id="body" :class="{'isWeiXin': isWeiXin}">
                <form id="form" style="display:none;" action="https://wap.lianlianpay.com/authpay.htm">
                    <input id="requestData" type="text" name="req_data" value='' />
                    <input type="submit" vlaue="submit"/>
                </form>
                <div class="session" v-if="output">
                    <div v-if="!isTimeout" class="time" :class="{'isWeiXin': isWeiXin}">
                        <b style="margin:0;padding:0;">请在</b><span v-text="time.hours"></span><b>时</b><span v-text="time.minutes"></span><b>分</b><span v-text="time.seconds"></span><b>秒内完成支付，逾期将自动取消订单</b>
                    </div>
                    <div v-if="isTimeout" class="time" :class="{'isWeiXin': isWeiXin}">
                        <span>订单已经过期</span>
                    </div>
                    <div class="list">
                        <div class="item">
                            <span>订单总价：</span>
                            <span class="moneyFont">{{output.payPrice | formatMoney}}</span>
                        </div>
                    </div>
                    <div class="head">
                        选择支付方式
                    </div>
                    <template v-for="(item,index) in output.payments">
                        <div class="payment" @click="payment(item,index)" :class="{noBorder:index==0}">
                            <i class="iconfont guoxuan" :class="index==paywaySelected?'green':'gray'">&#xe628;</i>
                            <span v-text="item.paymentName"></span>
                        </div>
                    </template>
                </div>
            </div>
            <footer class="footer" v-if="output">
                <a v-if="!isTimeout" href="javascript:void(0);" @click="commit">确认支付</a>
                <a v-else class="gray">确认支付</a>
            </footer>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import request from 'js/interface/request'
import { Common, valid, storage } from 'js/common.js';
import toast from 'components/toast';
import loading from 'components/loading';
export default {
    components: {
        toast,
        loading
    },
    data () {
        return {
            loading: false,
            isWeiXin: false,
            output: '',
            time: { // 倒计时
                days: '',
                hours: '',
                minutes: '',
                seconds: ''
            },
            paywaySelected: 0, // 默认支付选中样式
            paymentId: '', // 支付方式(连连，微信，支付宝)
            isTimeout: false, // 订单是否过期
            toast: { // toast引用
                isshow: false,
                message: ''
            }
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        if (!Common.getQueryString('notifyUrl')) {
            this.showtoast('notifyUrl: null', true);
        } else if (!Common.getQueryString('returnUrl')) {
            this.showtoast('returnUrl: null', true);
        } else {
            storage.set('notifyUrl', Common.getQueryString('notifyUrl'));
            storage.set('returnUrl', Common.getQueryString('returnUrl'));
            this.getTradePayment();// 获取订单支付信息
        }
        Common.setFullScreen();
    },
    mounted () {
    },
    filters: {
        formatMoney (value) {
            if (value || value === 0) {
                return '￥' + (value / 100).toFixed(2);
            } else {
                return value
            }
        }
    },
    methods: {
        // 获取订单支付信息 6.1.5
        getTradePayment () {
            var obj = {
                tradeId: Common.getQueryString('tradeId'),
                domainPay: '1'
            }
            console.log(obj);
            this.loading = true;
            request.getTradePayment(obj, (response) => {
                console.log(response)
                if (response.data.respCode === '000000') {
                    this.output = response.data.output;
                    this.paymentId = this.output.payments[0].paymentId;
                    this.setTime();
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                this.loading = false;
                Common.setFullScreen();
            }, () => {
                this.loading = false;
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // 支付方式
        payment (item, index) {
            this.paywaySelected = index;
            this.paymentId = item.paymentId;
        },
        // 获取支付签名信息 6.1.6
        commit () {
            // 连连支付
            if (this.paymentId === '30') {
                window.location.href = './lianlian.html?tradeId=' + Common.getQueryString('tradeId') + '&paymentId=' + this.paymentId;
            } else if (this.paymentId === '20') {
                // request.getPaySign(obj, (response) => {
                //     console.log(response);
                // }, (error) => {
                //     this.showtoast(error, true);
                // })
                // 微信支付
            } else if (this.paymentId === '10') {
                // 支付宝
            }
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
        }
    }
}
</script>
