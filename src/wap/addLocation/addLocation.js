import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/addLocation.scss'
import headerCommon from '../../components/headerCommon.vue';
import addLocation from './addLocation.vue'
var homeVue = new Vue({
    el: '#addLocation',
    data () {
        return {
            title: '邮寄地址',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><addLocation></addLocation></div>',
    components: {
        headerCommon: headerCommon,
        'addLocation': addLocation
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})