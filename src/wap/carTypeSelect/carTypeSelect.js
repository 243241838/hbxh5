import { Vue, Common } from 'js/base'
import {valid} from 'js/common';
import './scss/carTypeSelect.scss'
import headerCommon from '../../components/headerCommon.vue';
import carTypeSelect from './carTypeSelect.vue'
var homeVue = new Vue({
    el: '#carTypeSelect',
    data () {
        return {
            title: '选择车型',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon><car-insure></car-insure></div>',
    components: {
        headerCommon: headerCommon,
        'car-insure': carTypeSelect
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})