import { Vue } from 'js/base'
import {valid, Common} from 'js/common';
import './scss/insureNotice.scss'
import headerCommon from '../../components/headerCommon.vue';
import insureNotice from './insureNotice.vue'
var homeVue = new Vue({
    el: '#insureNotice',
    data () {
        return {
            title: '投保须知',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><hot-index></hot-index></div>',
    components: {
        headerCommon: headerCommon,
        'hot-index': insureNotice
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        // app嵌入
        if (Common.getQueryString('isApp')) {
            this.isWeiXin = true;
        }
    }
})
