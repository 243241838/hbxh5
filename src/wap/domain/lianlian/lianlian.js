import { Vue } from 'js/base'
import './scss/lianlian.scss'
import {valid} from 'js/common';
import headerCommon from 'components/headerCommon.vue';
import lianlian from './lianlian.vue';
var homeVue = new Vue({
    el: '#lianlian',
    data () {
        return {
            title: '连连支付',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><lianlian></lianlian></div>',
    components: {
        headerCommon: headerCommon,
        lianlian: lianlian
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    methods: {
    }
})