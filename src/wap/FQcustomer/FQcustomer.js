import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQcustomer.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQcustomer from './FQcustomer.vue'
var homeVue = new Vue({
    el: '#FQcustomer',
    data () {
        return {
            title: '客户管理',
            isWeiXin: false,
            url: 'FQpersonal.html'
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true" :url="url"></headerCommon><FQcustomer></FQcustomer></div>',
    components: {
        headerCommon: headerCommon,
        'FQcustomer': FQcustomer
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})