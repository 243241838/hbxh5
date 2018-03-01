import { Vue, Common } from 'js/base'
import {valid} from 'js/common';
import './scss/clause.scss'
import headerCommon from '../../components/headerCommon.vue';
import clause from './clause.vue'
var homeVue = new Vue({
    el: '#clause',
    data () {
        return {
            title: '保险条款',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true" ></headerCommon><clause></clause></div>',
    components: {
        headerCommon: headerCommon,
        'clause': clause
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
