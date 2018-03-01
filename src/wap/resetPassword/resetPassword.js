import { Vue } from 'js/base';
import {valid} from 'js/common';
import './scss/resetPassword.scss'
import headerCommon from '../../components/headerCommon.vue';
import resetPassword from './resetPassword.vue'
var homeVue = new Vue({
    el: '#resetPassword',
    data () {
        return {
            title: '重置密码',
            isWeiXin: false
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title"></headerCommon><div class="pageview"><product-detail></product-detail></div></div>',
    components: {
        headerCommon: headerCommon,
        'product-detail': resetPassword
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})