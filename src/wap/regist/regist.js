import { Vue } from 'js/base';
import {valid} from 'js/common';
import './scss/regist.scss'
import headerCommon from '../../components/headerCommon.vue';
import regist from './regist.vue'
var homeVue = new Vue({
    el: '#regist',
    data () {
        return {
            title: '注册',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><regist></regist></div>',
    components: {
        headerCommon: headerCommon,
        'regist': regist
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
