import { Vue, Common, Init } from 'js/base'
import './scss/hot.scss'
import hot from './hot.vue'
var homeVue = new Vue({
    el: '#hot',
    template: '<div class="pageview"><hot-index></hot-index></div>',
    components: {
        'hot-index': hot
    }
})
