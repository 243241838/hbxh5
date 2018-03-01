import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/carInfo.scss'
import carInfo from './carInfo.vue'
var homeVue = new Vue({
    el: '#carInfo',
    data () {
        return {
            title: '查询投保',
            isWeiXin: false
        }
    },
    template: '<div class="container"><car-info></car-info></div>',
    components: {
        'car-info': carInfo
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})