import { Vue } from 'js/base'
import {valid, Common} from 'js/common';
import './scss/protectRange.scss'
import headerCommon from '../../components/headerCommon.vue';
import protectRange from './protectRange.vue'
var homeVue = new Vue({
    el: '#protectRange',
    data () {
        return {
            title: '保障范围',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><hot-index></hot-index></div>',
    components: {
        headerCommon: headerCommon,
        'hot-index': protectRange
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        // app嵌入
        if (Common.getQueryString('isApp')) {
            this.isWeiXin = true;
        }
    }
})
