import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQpolicyHistory.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQpolicyHistory from './FQpolicyHistory.vue';
var homeVue = new Vue({
    el: '#FQpolicyHistory',
    data () {
        return {
            title: '历史保单',
            isWeiXin: false
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQpolicyHistory></FQpolicyHistory></div>',
    components: {
        headerCommon: headerCommon,
        'FQpolicyHistory': FQpolicyHistory
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})