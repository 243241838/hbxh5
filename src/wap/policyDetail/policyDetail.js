import { Vue } from 'js/base';
import {valid, Common} from 'js/common';
import './scss/policyDetail.scss';
import headerCommon from '../../components/headerCommon.vue';
// import footerCommon from '../../components/policyDetail/footerCommon.vue';
import policyDetail from './policyDetail.vue'
var homeVue = new Vue({
    el: '#policyDetail',
    data () {
        return {
            title: '保单详情',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><policy-detail></policy-detail></div>',
    components: {
        headerCommon: headerCommon,
        'policy-detail': policyDetail
        // 'footer-common': footerCommon
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
         // app嵌入
        // if (Common.getQueryString('isApp')) {
        //     this.isWeiXin = true;
        // }
    }
    // methods: {
    //     iphone (number) {
    //         this.footer.number = number;
    //     },
    //     durl (url) {
    //         this.footer.url = url;
    //     }
    // }
})