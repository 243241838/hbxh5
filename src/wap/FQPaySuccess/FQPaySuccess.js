import { Vue } from 'js/base'
import './scss/FQPaySuccess.scss'
import {valid} from 'js/common';
import headerCommon from '../../components/headerCommon.vue';
import FQPaySuccess from './FQPaySuccess.vue';
var homeVue = new Vue({
    el: '#FQPaySuccess',
    data () {
        return {
            title: '订单提交成功',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :none="true"></headerCommon><payment-success></payment-success></div>',
    components: {
        headerCommon: headerCommon,
        'payment-success': FQPaySuccess
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    methods: {
    }
})