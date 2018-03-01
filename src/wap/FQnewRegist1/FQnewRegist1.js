import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQnewRegist1.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQnewRegist1 from './FQnewRegist1.vue'
var homeVue = new Vue({
    el: '#FQnewRegist1',
    data () {
        return {
            title: '新人活动',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQnewRegist1></FQnewRegist1></div>',
    components: {
        headerCommon: headerCommon,
        'FQnewRegist1': FQnewRegist1
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})