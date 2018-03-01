import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/adjust.scss'
import headerCommon from '../../components/headerCommon.vue';
import adjust from './adjust.vue'
var homeVue = new Vue({
    el: '#adjust',
    data () {
        return {
            title: '调整投保方案',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon><adjust></adjust></div>',
    components: {
        headerCommon: headerCommon,
        'adjust': adjust
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})