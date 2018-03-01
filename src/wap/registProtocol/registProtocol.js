import { Vue, Common } from 'js/base'
import {valid} from 'js/common';
import './scss/registProtocol.scss'
import headerCommon from '../../components/headerCommon.vue';
import registProtocol from './registProtocol.vue'
var homeVue = new Vue({
    el: '#registProtocol',
    data () {
        return {
            title: '汇保险注册协议',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><registProtocol></registProtocol></div>',
    components: {
        headerCommon: headerCommon,
        'registProtocol': registProtocol
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
