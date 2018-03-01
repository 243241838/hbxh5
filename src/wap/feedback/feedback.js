import { Vue, Common } from 'js/base'
import {valid} from 'js/common';
import './scss/feedback.scss'
import headerCommon from '../../components/headerCommon.vue';
import feedback from './feedback.vue'
var homeVue = new Vue({
    el: '#feedback',
    data () {
        return {
            title: '意见反馈',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><feedback></feedback></div>',
    components: {
        headerCommon: headerCommon,
        'feedback': feedback
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
