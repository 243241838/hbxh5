import { Vue } from 'js/base';
import {valid, Common} from 'js/common';
import './scss/orderDetailGe.scss';
import headerCommon from '../../components/headerCommon.vue';
import footerCommon from '../../components/orderDetail/footerCommon.vue';
import orderDetailGe from './orderDetailGe.vue';
var homeVue = new Vue({
    el: '#orderDetail',
    data () {
        return {
            footer: {
                money: '',
                status: 1,
                isShow: false,
                output: ''
            },
            body: {
                isCommit: false
            },
            title: '订单详情',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><footer-common :footer="footer"></footer-common><order-detail v-on:sumMoney="sumMoney" v-on:status="status" v-on:render="render" v-on:output="output"></order-detail></div>',
    components: {
        headerCommon: headerCommon,
        'order-detail': orderDetailGe,
        'footer-common': footerCommon
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
         // app嵌入
        // if (Common.getQueryString('isApp')) {
        //     this.isWeiXin = true;
        // }
    },
    methods: {
        sumMoney (money) {
            this.footer.money = money;
        },
        status (status) {
            this.footer.status = status;
        },
        render (isShow) {
            this.footer.isShow = isShow;
        },
        output (output) {
            this.footer.output = output;
        }
    }
})