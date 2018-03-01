import { Vue, Common } from 'js/base'
import './scss/carInfo.scss'
import carInfo from './carInfo.vue'
var homeVue = new Vue({
    el: '#carInfo',
    template: '<div class="container"><car-info></car-info></div>',
    components: {
        'car-info': carInfo
    }
})