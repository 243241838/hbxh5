import { Vue } from 'js/base'
import './scss/FQQuotationList.scss'
import {valid} from 'js/common';
import headerCommon from '../../components/headerCommon.vue';
import FQQuotationList from './FQQuotationList.vue'
import FQFooter from '../../components/FQFooter.vue';
var fq = new Vue({
    el: '#FQQuotationList',
    data () {
        return {
            title: '报价列表',
            isWeiXin: false
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :none="true"></headerCommon><FQFooter :selected="1"></FQFooter><FQQuotationList></FQQuotationList></div>',
    components: {
        headerCommon: headerCommon,
        'FQQuotationList': FQQuotationList,
        FQFooter: FQFooter
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
