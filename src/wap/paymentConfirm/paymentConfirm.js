import { Vue } from 'js/base'
import './scss/paymentConfirm.scss'
import {valid} from 'js/common';
import headerCommon from '../../components/headerCommon.vue';
import paymentConfirm from './paymentConfirm.vue';
var homeVue = new Vue({
    el: '#paymentConfirm',
    data () {
        return {
            title: '确认支付',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :isFiexd="true" :rem="true"></headerCommon><paymentConfirm></paymentConfirm></div>',
    components: {
        headerCommon: headerCommon,
        paymentConfirm: paymentConfirm
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    methods: {
    }
})