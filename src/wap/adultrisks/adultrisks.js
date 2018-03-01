import { Vue } from 'js/base'
import {valid, storage, Common} from 'js/common';
import './scss/adultrisks.scss'
import headerCommon from '../../components/headerCommon.vue';
import adultrisks from './adultrisks.vue'
var homeVue = new Vue({
    el: '#adultrisks',
    data () {
        return {
            title: '',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><adultrisks></adultrisks></div>',
    components: {
        headerCommon: headerCommon,
        'adultrisks': adultrisks
    },
    created () {
        this.title = storage.get('adultrisks_productName');
        document.querySelector('title').innerHTML = this.title;
        this.isWeiXin = valid.isWeiXin();
        // app嵌入
        if (Common.getQueryString('isApp')) {
            this.isWeiXin = true;
        }
    }
})
