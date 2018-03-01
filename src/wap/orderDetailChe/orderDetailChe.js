import { Vue } from 'js/base';
import './scss/orderDetailChe.scss';
import {valid, Common, storage} from 'js/common';
import headerCommon from '../../components/headerCommon.vue';
import footerCommon from '../../components/orderDetail/footerCommon.vue';
import orderDetailChe from './orderDetailChe.vue';
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
            title: '订单详情',
            isWeiXin: false,
            url: ''
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :url="url"></headerCommon><footer-common :footer="footer"></footer-common><order-detail v-on:sumMoney="sumMoney" v-on:status="status" v-on:render="render" v-on:output="output"></order-detail></div>',
    components: {
        headerCommon: headerCommon,
        'order-detail': orderDetailChe,
        'footer-common': footerCommon
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        // app嵌入
        // if (Common.getQueryString('isApp')) {
        //     this.isWeiXin = true;
        // }
        // this.IsparSuccess();
    },
    methods: {
        IsparSuccess () {
            // let userId = Common.getQueryString('userId');
            // if (userId) {
            //     let id = storage.get('insuranceCompany')
            //     if (id) {
            //         id = JSON.parse(id).productId
            //         this.url = 'carInfo.html?id=1131';
            //     }
            // }
        },
        sumMoney (money) {
            this.footer.money = money;
        },
        status (status) {
            this.footer.status = status;
            // console.log('orderStatus: ', status);
        },
        render (isShow) {
            this.footer.isShow = isShow;
        },
        output (output) {
            this.footer.output = output;
        }
    }
})