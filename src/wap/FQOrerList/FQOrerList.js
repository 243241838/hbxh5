import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/FQOrerList.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQFooter from '../../components/FQFooter.vue';
import FQOrerList from './FQOrerList.vue';
var homeVue = new Vue({
    el: '#FQOrerList',
    data () {
        return {
            title: '我的订单',
            isWeiXin: false
        }
    },
    template: '<div class="container"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true" :none="false"></headerCommon><FQOrerList></FQOrerList><FQFooter :selected="2"></FQFooter></div>',
    components: {
        headerCommon: headerCommon,
        'FQOrerList': FQOrerList,
        FQFooter: FQFooter
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})