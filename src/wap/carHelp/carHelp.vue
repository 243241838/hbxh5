<template>
    <div id='body' :class="{isWeiXin:isWeiXin}">
        <div class="head">
            <div class="buy-cars">
                 买车险无法报价怎么办？
            </div>
            <div class="issue">
                 不能报价的6个“报价提示”及对应解决方案如下：
            </div>
        </div>
        <div class="list">
            <div class="item">
                 <div class="list-head">
                    <i class="iconfont">&#xe657;</i>
                    <span>检查车辆信息信息</span>
                 </div>
                 <div class="text">
                    检查车辆信息是否有误，确保信息正确后可尝试重新报价
                 </div>
            </div>
            <div class="item">
                 <div class="list-head">
                    <i class="iconfont">&#xe657;</i>
                    <span>检查车辆信息</span>
                 </div>
                 <div class="text">
                     车辆是否匹配，选择正确车型后可尝试重新报价
                 </div>
            </div>
            <div class="item">
                 <div class="list-head">
                    <i class="iconfont">&#xe657;</i>
                    <span>检查车辆情况是否匹配保险公司要求</span>
                 </div>
                 <div class="text">
                     检查车型和投保地区是否在保障范围内
                 </div>
            </div>
             <div class="item">
                 <div class="list-head">
                    <i class="iconfont">&#xe657;</i>
                    <span>调整时间</span>
                 </div>
                 <div class="text">
                     若您购买车险时选择的且“起保时间”仍在保障中，是无法购买的，建议到投保期后操作购买
                 </div>
            </div>
             <div class="item">
                 <div class="list-head">
                    <i class="iconfont">&#xe657;</i>
                    <span>核对保障期限</span>
                 </div>
                 <div class="text">
                     若您已购买车险，是无法购买的，建议到投保期后操作购买
                 </div>
            </div>
             <div class="item">
                 <div class="list-head">
                    <i class="iconfont">&#xe657;</i>
                    <span>调整方案</span>
                 </div>
                 <div class="text">
                     若是没有报价，建议您优先确认是否在投保器内。若在，建议您到期后再操作购买；若不在，请尝试调整方案后尝试，或更换保险公司在进行尝试
                 </div>
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import Swiper from 'swiper';
import {Common, valid, storage} from 'js/common'
import request from 'js/interface/request'
import toast from '../../components/toast' // totast引用：
import loading from '../../components/loading';
export default {
    components: {
        toast,
        loading
    },
    data () {
        return {
            toast: { // totast引用
                isshow: false,
                message: ''
            },
            isWeiXin: ''
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        }
    },
    filters: {
        overWan (value) {
            if (value < 10000) {
                return value;
            } else {
                return value / 10000 + '万';
            }
        }
    }
}
</script>