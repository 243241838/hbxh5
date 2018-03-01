import { Vue, Common } from 'js/base'
import {valid} from 'js/common';
import './scss/FQRegistProtocol.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQRegistProtocol from './FQRegistProtocol.vue'
var homeVue = new Vue({
    el: '#FQRegistProtocol',
    data () {
        return {
            title: '汇保险注册协议',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><FQRegistProtocol></FQRegistProtocol></div>',
    components: {
        headerCommon: headerCommon,
        'FQRegistProtocol': FQRegistProtocol
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
