import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/carOrderCheck.scss';
import headerCommon from '../../components/headerCommon.vue';
import carOrderCheck from './carOrderCheck.vue'
var homeVue = new Vue({
    el: '#carOrderCheck',
    data () {
        return {
            title: '订单审核',
            isWeiXin: false
        }
    },
    template: '<div class="container"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><car-info></car-info></div>',
    components: {
        headerCommon: headerCommon,
        'car-info': carOrderCheck
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})