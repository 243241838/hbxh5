import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQSeecarAdjust.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQSeecarAdjust from './FQSeecarAdjust.vue'
var homeVue = new Vue({
    el: '#FQSeecarAdjust',
    data () {
        return {
            title: '调整投保方案',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon><FQSeecarAdjust></FQSeecarAdjust></div>',
    components: {
        headerCommon: headerCommon,
        'FQSeecarAdjust': FQSeecarAdjust
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})