import { Vue, Common } from 'js/base'
import './scss/activity.scss'
import activity from './activity.vue'
var homeVue = new Vue({
    el: '#activity',
    template: '<div class="pageview"><activity></activity></div>',
    components: {
        'activity': activity
    }
})
