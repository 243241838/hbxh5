import { Vue } from 'js/base';
import {valid} from 'js/common';
import './scss/forgetPassword.scss'
import headerCommon from '../../components/headerCommon.vue';
import forgetPassword from './forgetPassword.vue'
var homeVue = new Vue({
    el: '#forgetPassword',
    data () {
        return {
            title: '找回密码',
            isWeiXin: false
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title"></headerCommon><div class="pageview"><product-detail></product-detail></div></div>',
    components: {
        headerCommon: headerCommon,
        'product-detail': forgetPassword
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})