import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQPolicyList.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQPolicyList from './FQPolicyList.vue';
var homeVue = new Vue({
    el: '#FQPolicyList',
    data () {
        return {
            title: '我的保单',
            isWeiXin: false
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQPolicyList></FQPolicyList></div>',
    components: {
        headerCommon: headerCommon,
        'FQPolicyList': FQPolicyList
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})