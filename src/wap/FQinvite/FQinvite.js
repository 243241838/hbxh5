import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQinvite.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQinvite from './FQinvite.vue'
var homeVue = new Vue({
    el: '#FQinvite',
    data () {
        return {
            title: '邀请好友',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQinvite></FQinvite></div>',
    components: {
        headerCommon: headerCommon,
        'FQinvite': FQinvite
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})