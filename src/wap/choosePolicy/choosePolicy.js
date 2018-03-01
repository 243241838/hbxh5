import { Vue, Common } from 'js/base'
import {valid} from 'js/common';
import './scss/choosePolicy.scss'
import headerCommon from '../../components/headerCommon.vue';
import choosePolicy from './choosePolicy.vue'
var homeVue = new Vue({
    el: '#choosePolicy',
    data () {
        return {
            title: '选择投保方案',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon><choose-policy></choose-policy></div>',
    components: {
        headerCommon: headerCommon,
        'choose-policy': choosePolicy
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
