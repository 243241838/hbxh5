<template>
    <div id="body" class="myClaims_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon>
        <div class="top"></div>
        <div class="head">
            如有疑问，请详询 4001101866
        </div>
        <div class="myClaims_list" v-show="output.length > 0" >
            <div class="item flexbox" v-for="item in output">
                <div class="left flex">
                    <p>{{item.productName.length > 13 ? item.productName.substring(0, 13) + '...' : item.productName}}</p>
                    <p>理赔单号：<span v-text="item.claimId"></span></p>
                    <p>申请日期：<span v-text="item.createTimeStr"></span></p>
                </div>
                <div class="right">
                     <!--理赔状态状态，10：待审核（理赔中）；-20：审核失败； 30：审核通过待打款；40：审核通过已打款-->
                     <!--
                     <img src="../images/img1.png" alt="" v-show="item.state==10">
                     <img src="../images/img2.png" alt="" v-show="item.state==-20">
                     <img src="../images/img3.png" alt="" v-show="item.state==30">
                     <img src="../images/img4.png" alt="" v-show="item.state==40">
                     -->
                     <i class="iconfont" v-show="item.state==10">&#xe68f;</i>
                     <i class="iconfont gray" v-show="item.state==-20" >&#xe68e;</i>
                     <i class="iconfont" v-show="item.state==30">&#xe691;</i>
                     <i class="iconfont gray" v-show="item.state==40" >&#xe694;</i>
                </div>
            </div>
        </div>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
        <nodata v-show="output.length===0":infomessage="infomessage" :buttonmessage="buttonmessage" :url="url"></nodata>
    </div>
</template>
<script>
import request from 'js/interface/request'
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
import { Common, storage, valid } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
import nodata from '../../../components/nodata';
export default {
    components: {
        toast,
        loading,
        headerCommon,
        nodata
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            loading: false,
            output: '', //数据
            isWeiXin: false,
            infomessage: '您还没有发起过理赔噢',
            buttonmessage: '',
            title: '我的理赔'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '我的理赔';
    },
    mounted () {
        this.$nextTick(() => {
            this.resetBody();
        })
        this.getData();
    },
    computed: {
    },
    methods: {
        //获取数据
        getData () {
            let obj = {
                userId: Common.getUserId()
            }
            console.log(obj)
            request.findClaimMsg(obj, (response) => {
                console.log(response.data.output)
                if (response.data.respCode === '000000') {
                    this.output = response.data.output;
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 显示提示框
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        // 关闭提示框
        closetoast () {
            this.toast.isshow = false;
        },
        resetBody () {
            this.$nextTick(() => {
                setTimeout(() => {
                    Common.setFullScreen()
                }, 0)
            })
        }
    }
}
</script>
