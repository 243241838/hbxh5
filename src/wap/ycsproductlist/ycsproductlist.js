import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/ycsproductlist.scss'
import headerCommon from '../../components/headerCommon.vue';
import ycsproductlist from './ycsproductlist.vue'
var homeVue = new Vue({
    el: '#ycsproductlist',
    data () {
        return {
            title: '汇保险',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true" :none="true"></headerCommon><ycsproductlist-index></ycsproductlist-index></div>',
    components: {
        headerCommon: headerCommon,
        'ycsproductlist-index': ycsproductlist
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
        this.$nextTick(() => {
            if (!this.isWeiXin) {
                document.getElementById('body').style.paddingTop = '1.7rem';
            } else {
                document.getElementById('body').style.paddingTop = '0.82rem';
            }
        });
    }
})
