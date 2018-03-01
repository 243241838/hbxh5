import { Vue } from 'js/base'
import './scss/redPacket.scss'
import redPacket from './redPacket.vue'
var homeVue = new Vue({
    el: '#redPacket',
    data () {
        return {
        }
    },
    template: '<div class="pageview"><policy-detail></policy-detail></div>',
    components: {
        'policy-detail': redPacket
    }
})