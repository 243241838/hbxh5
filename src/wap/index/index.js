import { Vue, Common, Init } from 'js/base'
import './scss/home.scss'
import homeIndex from './index.vue'
var homeVue = new Vue({
    el: '#home',
    data () {
        return {
            footer: {
                isShow1: false
            }
        }
    },
    template: '<div><home-index></home-index></div>',
    components: {
        'home-index': homeIndex
    }
})
