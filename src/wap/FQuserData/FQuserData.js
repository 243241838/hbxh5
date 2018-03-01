import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQuserData.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQuserData from './FQuserData.vue';
var homeVue = new Vue({
    el: '#FQuserData',
    data () {
        return {
            title: '个人资料设置',
            isWeiXin: false
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQuserData></FQuserData></div>',
    components: {
        headerCommon: headerCommon,
        'FQuserData': FQuserData
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})