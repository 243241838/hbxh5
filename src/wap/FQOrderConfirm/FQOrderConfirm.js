import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQOrderConfirm.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQOrderConfirm from './FQOrderConfirm.vue'
var homeVue = new Vue({
    el: '#FQOrderConfirm',
    data () {
        return {
            title: '订单确认',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQOrderConfirm></FQOrderConfirm></div>',
    components: {
        headerCommon: headerCommon,
        'FQOrderConfirm': FQOrderConfirm
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})