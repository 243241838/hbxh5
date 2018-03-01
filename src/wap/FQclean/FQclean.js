import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/FQclean.scss';
import headerCommon from '../../components/headerCommon.vue';
import FQclean from './FQclean.vue'
var homeVue = new Vue({
    el: '#FQclean',
    data () {
        return {
            title: '报价结果',
            isWeiXin: false
        }
    },
    template: '<div class="container"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon><FQclean></FQclean></div>',
    components: {
        headerCommon: headerCommon,
        'FQclean': FQclean
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