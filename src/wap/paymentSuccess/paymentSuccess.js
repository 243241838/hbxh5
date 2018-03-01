import { Vue } from 'js/base'
import './scss/paymentSuccess.scss'
import paymentSuccess from './paymentSuccess.vue';
var homeVue = new Vue({
    el: '#paymentSuccess',
    data () {
        return {
        }
    },
    template: '<div class="pageview"><payment-success></payment-success></div>',
    components: {
        'payment-success': paymentSuccess
    },
    methods: {
    }
})