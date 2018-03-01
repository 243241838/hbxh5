import { Vue } from 'js/base'
import {valid, Common} from 'js/common';
import './scss/promotion.scss'
import headerCommon from '../../components/headerCommon.vue';
import promotion from './promotion.vue'
var homeVue = new Vue({
    el: '#promotion',
    data () {
        return {
            title: '成为推广人员',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon><hot-index></hot-index></div>',
    components: {
        headerCommon: headerCommon,
        'hot-index': promotion
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        if (!this.isWeiXin) {
            window.location.href = './login.html';
        }
    }
})
