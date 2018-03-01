import { Vue, Common } from 'js/base'
import {valid} from 'js/common';
import './scss/carHelp.scss'
import headerCommon from '../../components/headerCommon.vue';
import carHelp from './carHelp.vue'
var homeVue = new Vue({
    el: '#carHelp',
    data () {
        return {
            title: '车险帮助信息',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon><choose-policy></choose-policy></div>',
    components: {
        headerCommon: headerCommon,
        'choose-policy': carHelp
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
