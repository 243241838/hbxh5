import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/FQpolicyDetailCar.scss';
import headerCommon from '../../components/headerCommon.vue';
import FQpolicyDetailCar from './FQpolicyDetailCar.vue'
var homeVue = new Vue({
    el: '#FQpolicyDetailCar',
    data () {
        return {
            title: '保单详情',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><policy-detail></policy-detail></div>',
    components: {
        headerCommon: headerCommon,
        'policy-detail': FQpolicyDetailCar
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
    }
})