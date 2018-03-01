import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/FQcarInfo.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQFooter from '../../components/FQFooter.vue';
import FQcarInfo from './FQcarInfo.vue';
var homeVue = new Vue({
    el: '#FQcarInfo',
    data () {
        return {
            title: '查询投保',
            isWeiXin: false
        }
    },
    template: '<div class="container"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true" :none="true"></headerCommon><FQcarInfo></FQcarInfo><FQFooter :selected="0"></FQFooter></div>',
    components: {
        headerCommon: headerCommon,
        'FQcarInfo': FQcarInfo,
        FQFooter: FQFooter
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
        this.$nextTick(() => {
            if (!this.isWeiXin) {
                document.getElementById('body').style.paddingTop = '0.88rem';
            }
        });
    },
    methods: {
    }
})