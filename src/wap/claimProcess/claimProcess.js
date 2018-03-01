import { Vue } from 'js/base';
import {valid, Common} from 'js/common';
import './scss/claimProcess.scss'
import headerCommon from '../../components/headerCommon.vue';
import claimProcess from './claimProcess.vue'
var homeVue = new Vue({
    el: '#claimProcess',
    data () {
        return {
            title: '理赔流程',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :isFiexd="true" :title="title" :rem="true"></headerCommon><hot-index></hot-index></div>',
    components: {
        headerCommon: headerCommon,
        'hot-index': claimProcess
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        // app嵌入
        if (Common.getQueryString('isApp')) {
            this.isWeiXin = true;
        }
    }
})
