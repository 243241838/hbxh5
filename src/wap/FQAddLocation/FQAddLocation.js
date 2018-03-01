import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQAddLocation.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQAddLocation from './FQAddLocation.vue'
var homeVue = new Vue({
    el: '#FQAddLocation',
    data () {
        return {
            title: '邮寄地址',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><FQAddLocation></FQAddLocation></div>',
    components: {
        headerCommon: headerCommon,
        'FQAddLocation': FQAddLocation
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})