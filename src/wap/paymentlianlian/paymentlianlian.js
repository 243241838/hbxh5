import { Vue } from 'js/base'
import './scss/paymentlianlian.scss'
import {valid} from 'js/common';
import headerCommon from '../../components/headerCommon.vue';
import paymentlianlian from './paymentlianlian.vue';
var homeVue = new Vue({
    el: '#paymentlianlian',
    data () {
        return {
            title: '连连支付',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><paymentlianlian></paymentlianlian></div>',
    components: {
        headerCommon: headerCommon,
        paymentlianlian: paymentlianlian
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    methods: {
    }
})