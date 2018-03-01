import { Vue } from 'js/base';
import {valid, Common} from 'js/common';
import './scss/policyDetail2.scss';
import headerCommon from '../../components/headerCommon.vue';
import policyDetail2 from './policyDetail2.vue'
var homeVue = new Vue({
    el: '#policyDetail2',
    data () {
        return {
            title: '保单详情',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><policy-detail></policy-detail></div>',
    components: {
        headerCommon: headerCommon,
        'policy-detail': policyDetail2
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
         // app嵌入
        // if (Common.getQueryString('isApp')) {
        //     this.isWeiXin = true;
        // }
    },
    mounted () {
    }
})