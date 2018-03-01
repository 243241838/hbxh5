import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQclienteleData.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQclienteleData from './FQclienteleData.vue';
var homeVue = new Vue({
    el: '#FQclienteleData',
    data () {
        return {
            title: '资料编辑',
            isWeiXin: false
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQclienteleData></FQclienteleData></div>',
    components: {
        headerCommon: headerCommon,
        'FQclienteleData': FQclienteleData
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})