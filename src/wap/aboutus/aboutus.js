import { Vue, Common } from 'js/base'
import {valid} from 'js/common';
import './scss/aboutus.scss'
import headerCommon from '../../components/headerCommon.vue';
import aboutus from './aboutus.vue'
var homeVue = new Vue({
    el: '#aboutus',
    data () {
        return {
            title: '关于我们',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><aboutus></aboutus></div>',
    components: {
        headerCommon: headerCommon,
        'aboutus': aboutus
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
