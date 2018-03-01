import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/FQgreenHands.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQgreenHands from './FQgreenHands.vue'
var homeVue = new Vue({
    el: '#FQgreenHands',
    data () {
        return {
            title: '新手引导',
            isWeiXin: false
        }
    },
    template: '<div class="container"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true" :none="true"></headerCommon><FQgreenHands></FQgreenHands></div>',
    components: {
        headerCommon: headerCommon,
        'FQgreenHands': FQgreenHands
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
        this.$nextTick(() => {
            if (!this.isWeiXin) {
                document.getElementById('body').style.paddingTop = '0.88rem';
            }
        })
    }
})