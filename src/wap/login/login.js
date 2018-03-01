import { Vue } from 'js/base'
import {valid} from 'js/common';
import './scss/login.scss';
import headerCommon from '../../components/headerCommon.vue';
import login from './login.vue'
var homeVue = new Vue({
    el: '#login',
    data () {
        return {
            title: '登录',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><login></login></div>',
    components: {
        headerCommon: headerCommon,
        'login': login
    },
    mounted () {
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
