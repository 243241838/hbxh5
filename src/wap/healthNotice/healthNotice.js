import { Vue } from 'js/base';
import { valid, Common } from 'js/common';
import './scss/healthNotice.scss';
import headerCommon from '../../components/headerCommon.vue';
import healthNotice from './healthNotice.vue';
var homeVue = new Vue({
    el: '#healthNotice',
    data () {
        return {
            title: '健康告知',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><healthNotice></healthNotice></div>',
    components: {
        headerCommon: headerCommon,
        healthNotice: healthNotice
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        // app嵌入
        if (Common.getQueryString('isApp')) {
            this.isWeiXin = true;
        }
    }
})
