import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/FQmortgageChoice.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQmortgageChoice from './FQmortgageChoice.vue'
var homeVue = new Vue({
    el: '#FQmortgageChoice',
    data () {
        return {
            title: '选择险企',
            isWeiXin: false
        }
    },
    template: '<div class="container"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><FQmortgageChoice></FQmortgageChoice></div>',
    components: {
        headerCommon: headerCommon,
        'FQmortgageChoice': FQmortgageChoice
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})