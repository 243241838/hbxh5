import { Vue } from 'js/base';
import './scss/FQSubmitInfo.scss';
import {valid} from 'js/common';
import headerCommon from '../../components/headerCommon.vue';
import FQSubmitInfo from './FQSubmitInfo.vue';
var fq = new Vue({
    el: '#FQSubmitInfo',
    data () {
        return {
            title: '证件信息',
            isWeiXin: false
        }
    },
    template: '<div><headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon><FQSubmitInfo></FQSubmitInfo></div>',
    components: {
        headerCommon: headerCommon,
        'FQSubmitInfo': FQSubmitInfo
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})
