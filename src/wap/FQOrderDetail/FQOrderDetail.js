import { Vue } from 'js/base';
import './scss/FQOrderDetail.scss';
import {valid, Common} from 'js/common';
import headerCommon from '../../components/headerCommon.vue';
import FQOrderDetail from './FQOrderDetail.vue';
var homeVue = new Vue({
    el: '#FQOrderDetail',
    data () {
        return {
            title: '订单详情',
            isWeiXin: false,
            url: '#'
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :url="url"></headerCommon><order-detail></order-detail></div>',
    components: {
        headerCommon: headerCommon,
        'order-detail': FQOrderDetail
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        if (Common.getQueryString('FQOrerList') === 'true') {
            this.url = './FQOrerList.html';
        } else if (Common.getQueryString('FQOrerList') === 'false') {
            this.url = './FQQuotationList.html';
        } else {
            this.url = './FQOrerList.html';
        }
    }
})