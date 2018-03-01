import { Vue, Common } from 'js/base';
import {valid} from 'js/common';
import './scss/FQcarInsure.scss'
import headerCommon from '../../components/headerCommon.vue';
import carInsure from './FQcarInsure.vue'
var homeVue = new Vue({
    el: '#carInsure',
    data () {
        return {
            title: '信息填写',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><car-insure></car-insure></div>',
    components: {
        headerCommon: headerCommon,
        'car-insure': carInsure
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