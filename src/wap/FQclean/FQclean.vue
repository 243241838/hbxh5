<template>
    <div id="body">
        <div @click="clean" style="width:100px;height:50px;background:red;color:#fff;font-size:18px;text-align:center;">清空数据</div>
    </div>
</template>
<script>
import {Common, valid, storage} from 'js/common';
import request from 'js/interface/request';
import toast from '../../components/toast' // toast引用：
import loading from '../../components/loading';
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        toast,
        loading,
        layer
    },
    data () {
        return {
        }
    },
    created () {
    },
    mounted () {
    },
    watch: {
    },
    methods: {
        clean () {
            window.localStorage.clear();
            window.alert('清除数据成功');
        }
    }
}
</script>
