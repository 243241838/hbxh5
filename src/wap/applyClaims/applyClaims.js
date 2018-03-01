import { Vue, Common } from 'js/base'
import {valid} from 'js/common';
import './scss/applyClaims.scss'
import headerCommon from '../../components/headerCommon.vue';
import applyClaims from './applyClaims.vue'
var homeVue = new Vue({
    el: '#applyClaims',
    data () {
        return {
            title: '申请理赔',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon><choose-policy></choose-policy></div>',
    components: {
        headerCommon: headerCommon,
        'choose-policy': applyClaims
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
