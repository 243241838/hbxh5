import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQnewRegist.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQnewRegist from './FQnewRegist.vue'
var homeVue = new Vue({
    el: '#FQnewRegist',
    data () {
        return {
            title: '新人活动',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :none="true" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQnewRegist></FQnewRegist></div>',
    components: {
        headerCommon: headerCommon,
        'FQnewRegist': FQnewRegist
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})