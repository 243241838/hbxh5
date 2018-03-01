import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQcompany.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQcompany from './FQcompany.vue'
var homeVue = new Vue({
    el: '#FQcompany',
    data () {
        return {
            title: '选择险企',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQcompany></FQcompany></div>',
    components: {
        headerCommon: headerCommon,
        'FQcompany': FQcompany
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})