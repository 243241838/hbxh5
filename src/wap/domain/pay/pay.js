import { Vue } from 'js/base'
import './scss/pay.scss'
import {valid} from 'js/common';
import headerCommon from 'components/headerCommon.vue';
import pay from './pay.vue';
var homeVue = new Vue({
    el: '#pay',
    data () {
        return {
            title: '确认支付',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :isFiexd="true" :rem="true"></headerCommon><pay></pay></div>',
    components: {
        headerCommon: headerCommon,
        pay: pay
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    methods: {
    }
})