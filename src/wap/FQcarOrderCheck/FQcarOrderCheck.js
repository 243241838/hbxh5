import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/FQcarOrderCheck.scss';
import headerCommon from '../../components/headerCommon.vue';
import FQcarOrderCheck from './FQcarOrderCheck.vue'
var homeVue = new Vue({
    el: '#FQcarOrderCheck',
    data () {
        return {
            title: '报价结果',
            isWeiXin: false
        }
    },
    template: '<div class="container"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon><FQcarOrderCheck></FQcarOrderCheck></div>',
    components: {
        headerCommon: headerCommon,
        'FQcarOrderCheck': FQcarOrderCheck
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