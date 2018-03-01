<template>
    <div id="body" :class="{isWeixin:!isWeixin}">
        <img src="./images/s1.png" alt="">
        <img src="./images/s2.png" alt="">
        <img src="./images/s3.png" alt="">
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import request from 'js/interface/request';
import { Common, valid } from 'js/common.js';
import toast from 'components/toast';
export default {
    components: {
        toast
    },
    data () {
        return {
            isWeixin: ''
        }
    },
    created () {
        this.isWeixin = valid.isWeiXin();
    },
    mounted () {
    },
    computed: {
    },
    methods: {
    },
    filters: {
    }
}
</script>