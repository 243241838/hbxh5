import { Vue } from 'js/base'
import './scss/FQQuotationDetail.scss'
import {valid} from 'js/common';
import headerCommon from '../../components/headerCommon.vue';
import FQQuotationDetail from './FQQuotationDetail.vue'
var fq = new Vue({
    el: '#FQQuotationDetail',
    data () {
        return {
            title: '车辆询价详情',
            isWeiXin: false,
            url: 'FQQuotationList.html'
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :url="url"></headerCommon><FQQuotationDetail v-on:changeTitle="changeTitle"></FQQuotationDetail></div>',
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    components: {
        headerCommon: headerCommon,
        'FQQuotationDetail': FQQuotationDetail
    },
    methods: {
        changeTitle (value) {
            this.title = value;
        }
    }
})
