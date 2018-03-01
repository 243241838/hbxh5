import { Vue, Common } from 'js/base'
import {valid} from 'js/common';
import './scss/productGhl.scss'
import headerCommon from 'components/headerCommon.vue';
import productGhl from './productGhl.vue'
var homeVue = new Vue({
    el: '#productGhl',
    data () {
        return {
            title: '康运一生A款',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true" :none="true"></headerCommon><productGhl></productGhl></div>',
    components: {
        headerCommon: headerCommon,
        'productGhl': productGhl
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
