import { Vue } from 'js/base'
import {valid, Common} from 'js/common';
import './scss/FQLogin.scss';
import headerCommon from '../../components/headerCommon.vue';
import FQLogin from './FQLogin.vue'
var homeVue = new Vue({
    el: '#FQLogin',
    data () {
        return {
            title: '登录',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><FQLogin></FQLogin></div>',
    components: {
        headerCommon: headerCommon,
        'FQLogin': FQLogin
    },
    mounted () {
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        // app内嵌不带头
        if (Common.getQueryString('app')) {
            this.isWeiXin = true;
        }
    }
})
