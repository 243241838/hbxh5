import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQpersonal.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQpersonal from './FQpersonal.vue';
import FQFooter from '../../components/FQFooter.vue';
var homeVue = new Vue({
    el: '#FQpersonal',
    data () {
        return {
            title: '个人中心',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :none="true" :title="title" :rem= "true" :isFiexd="true" :setting="true"></headerCommon><FQpersonal></FQpersonal><FQFooter :selected="2"></FQFooter></div>',
    components: {
        headerCommon: headerCommon,
        'FQpersonal': FQpersonal,
        FQFooter: FQFooter
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})