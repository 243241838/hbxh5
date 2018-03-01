import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQmanageCustomer.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQmanageCustomer from './FQmanageCustomer.vue';
var homeVue = new Vue({
    el: '#FQmanageCustomer',
    data () {
        return {
            title: '客户管理',
            isWeiXin: false,
            url: 'FQcustomer.html'
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true" :url="url"></headerCommon><FQmanageCustomer></FQmanageCustomer></div>',
    components: {
        headerCommon: headerCommon,
        'FQmanageCustomer': FQmanageCustomer
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})