<template>
    <footer class="flexbox" :class="{'isFull':footer.status == 2}" v-show="footer.isShow">
        <div class="money" :class="{'waitPay':footer.status==1||footer.status==4}" v-show="footer.status != 2">
            <span class="name" v-show="footer.status == 2">价格：</span>
            <span class="name" v-show="footer.status == 3">价格：</span>
            <span class="content" :class="{invalid: footer.status == 3}">{{footer.money | formatMoney}}</span>
        </div>
        <div v-show="footer.status == 1" class="cancelOrder" @click="cancel()">取消订单</div>
        <div v-show="footer.status == 4" class="cancelOrder" @click="cancel()">取消订单</div>
        <a v-show="footer.status == 1 && classType == 2" href="javascript:;" class="cancelOrder applyTrade" @click="applyTrade1">
            <span>去支付</span>
        </a>
         <a v-show="footer.status == 1 && classType == 1" href="javascript:;" class="cancelOrder applyTrade" @click="applyTrade">
            <span>去支付</span>
        </a>
        <a v-show="footer.status == 2" href="javascript:;" class="flex greenBtn isRadius" @click="applyTrade">
            <span v-text="paySuccess"></span>
        </a>
        <a v-show="footer.status == 3" href="javascript:;" class="flex greenBtn isRadius" @click="applyTrade">
            <span>再次购买</span>
        </a>
        <a v-show="footer.status == 4 && classType == 1" href="javascript:;" class="cancelOrder applyTrade" @click="applyTrade">
            <span>去支付</span>
        </a>
        <!--toast提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closeToast">{{ toast.message}}</toast>
         <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </footer>
</template>
<script>
import toast from '../../components/toast';
import loading from '../../components/loading.vue';
import request from '../../assets/js/interface/request'
import {Common, storage} from 'js/common';
export default {
    components: {
        toast,
        loading
    },
    props: {
        footer: {
            type: Object,
            default () {
                return {
                    money: String,
                    status: Number, // 1 待支付, 2 已支付, 3 已失效, 4核保中
                    isShow: Boolean,
                    output: String
                }
            }
        }
    },
    data () {
        return {
            url: '#', // 跳转的url
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            tradeId: '',
            classType: '', // 险种类型 1 车险 2 个险
            loading: false,
            paySuccess: '再次购买'
        }
    },
    created () {
        this.tradeId = Common.getQueryString('tradeId');
        this.classType = Common.getQueryString('classType');
        console.log('classType: ' + this.classType)
    },
    mounted () {
        this.$nextTick(() => {
            this.ins();
        })
    },
    methods: {
        ins () {
            //支付成功后跳到该页面设置(支付成功之后没有classType参数)
            if (!Common.getQueryString('classType')) {
                this.paySuccess = '查看保单';
            }
        },
        applyTrade () {
            //判断是否为支付成功后跳到该页面的，有user传参的是支付的
            if (!Common.getQueryString('classType')) {
                let classType = this.footer.output.classType;
                let detailId = this.footer.output.detailId; // 保单编号
                if (parseInt(classType) === 1) {
                    window.location.href = 'policyDetail2.html?detailId=' + detailId;
                } else if (parseInt(classType) === 2) {
                    window.location.href = 'policyDetail.html?detailId=' + detailId;
                }
                return false;
            }
            if (Common.isLogin()) {
                if (this.footer.status === 1) {
                    this.sub();
                } else if (this.footer.status === 2) {
                    window.location.href = './index.html';
                } else if (this.footer.status === 3) {
                    window.location.href = './index.html';
                } else if (this.footer.status === 4) {
                    storage.set('orderDetailChe', JSON.stringify(this.footer.output));
                    // window.location.href = './carOrderCheck.html';
                }
            } else {
                this.showToast('未登录', true);
            }
        },
        applyTrade1 () {
            if (Common.isLogin()) {
                if (this.footer.status === 1) {
                    window.location.href = './paymentConfirm.html?tradeId=' + this.tradeId + '&referrerUserId=' + Common.getQueryString('referrerUserId');
                } else if (this.footer.status === 2) {
                    window.location.href = './index.html';
                } else if (this.footer.status === 3) {
                    window.location.href = './index.html';
                }
            } else {
                this.showToast('未登录', true);
            }
        },
        sub () {
            let obj = {
                userId: storage.get('userId'),
                tradeId: this.tradeId
            }
            this.loading = true;
            request.reqCarInsPay(obj, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    window.location.href = response.data.output.payUrl + '?orderNo=' + Common.getQueryString('serialId') + '&payType=7&pageUrl=' + 'http://10.1.100.144:8083/views/orderDetailChe.html?tradeId=' + this.tradeId + '&wxOpenId=' + '';
                } else {
                    this.showToast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showToast(error, true);
            });
        },
        // 取消订单
        cancel () {
            let data = {
                userId: storage.get('userId'),
                tradeId: this.tradeId
            }
            console.log(data)
            request.cancelTrade(data, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    this.showToast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showToast(error, true);
            })
        },
        showToast (msg, isshow) {
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closeToast () {
            this.toast.isshow = false;
        }
    },
    filters: {
        formatMoney (value) {
            return '￥' + (value / 100).toFixed(2);
        }
    }
}
</script>
<style lang='scss' scoped>
@import "../../assets/scss/usage/layout/reset.scss";
@import "../../assets/scss/usage/layout/common.scss";
.invalid{
    color: #a8afac !important;
}
footer{
    z-index:10000;
    height:1.2rem;
    width:100%;
    @include border(1px 0 0 0,#ddd,solid);
    position:fixed;
    bottom:0;
    left:0;
    background:#fff;
}
.money{
    width: 4.5rem;
    padding-left:0.34rem;
    line-height:1.2rem;
    > .name{
        color:#a8afac;
        font-size:0.28rem;
    }
    > .content{
        color:#ff7d29;
        font-size:0.42rem;
    }
    &.waitPay{
        width:3.8rem;
    }
}
.greenBtn{
    line-height:1.2rem;
    text-align:center;
    background:#1ccf8d; 
    > span{
        color: #fff;
        font-size:0.36rem;
    }
}
.isFull{
    padding:0.1rem 0.36rem;
    .isRadius{
        @include border-radius(0.1rem);
    }
}
.cancelOrder{
    font-size:0.32rem;
    height:0.72rem;
    line-height:0.72rem;
    margin-top:0.24rem;
    @include border(1px, #e3e3e3, solid, 0.08rem);
    width:1.68rem;
    text-align:center;
    color:#a8afac;
    &::after{
        margin-left:0.01rem;
    }
    &.applyTrade{
        @include border(1px, #1ccf8d, solid, 0.08rem);
        color:#1ccf8d;
        margin-left:0.12rem;
    }
}
</style>