import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/productList.scss'
import headerPersonal from '../../components/headerPersonal'
import productList from './productList.vue'
var homeVue = new Vue({
    el: '#productList',
    data () {
        return {
            title: '车险服务',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerPersonal v-if="!isWeiXin" :title="title"></headerPersonal><product-list></product-list></div>',
    components: {
        'headerPersonal': headerPersonal,
        'product-list': productList
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})