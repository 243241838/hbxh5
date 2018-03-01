import { Vue, Common } from 'js/base'
import './scss/carOrderConfirm.scss';
import {valid} from 'js/common';
import headerCommon from '../../components/headerCommon.vue';
import carOrderConfirm from './carOrderConfirm.vue'
var homeVue = new Vue({
    el: '#carOrderConfirm',
    data () {
        return {
            title: '订单确认',
            isWeiXin: false
        }
    },
    template: '<div class="container"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><car-info></car-info></div>',
    components: {
        headerCommon: headerCommon,
        'car-info': carOrderConfirm
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})