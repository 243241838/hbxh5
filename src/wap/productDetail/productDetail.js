import { Vue } from 'js/base';
import {valid, Common} from 'js/common';
import './scss/productDetail.scss'
import headerCommon from 'components/headerCommon.vue';
import productDetail from './productDetail.vue'
var homeVue = new Vue({
    el: '#productDetail',
    data () {
        return {
            title: '产品详情',
            isWeiXin: false
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title" :isFiexd="true" :rem="true"></headerCommon><product-detail></product-detail></div>',
    components: {
        headerCommon: headerCommon,
        'product-detail': productDetail
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        // app嵌入
        if (Common.getQueryString('isApp')) {
            this.isWeiXin = true;
        }
    }
})