import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQcarAdjust.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQcarAdjust from './FQcarAdjust.vue'
var homeVue = new Vue({
    el: '#FQcarAdjust',
    data () {
        return {
            title: '调整投保方案',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon><FQcarAdjust></FQcarAdjust></div>',
    components: {
        headerCommon: headerCommon,
        'FQcarAdjust': FQcarAdjust
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})