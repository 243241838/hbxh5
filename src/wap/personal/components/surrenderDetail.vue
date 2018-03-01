<template>
    <div id="body" class="g_homePolicy_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon>
        <div class="surrenderDetail_box" :class="{isWeiXin:isWeiXin}">
            <div class="shy1_box">
                <div class="item">
                    {{list.productName}}
                </div>
                <div class="item_info">
                    <p class="progressQuery_item">理赔单号：{{list.cancelId}}</p>
                    <p class="progressQuery_item">申请日期：{{list.cancelApplyTime}}</p>
                </div>
            </div>
            <div class="shy_baodanStatus">
                <i class="iconfont sts10" v-if="cancelSts===10">&#xe692;</i>
                <i class="iconfont" v-if="cancelSts===20">&#xe693;</i>
                <i class="iconfont" v-if="cancelSts===30">&#xe690;</i>
            </div>
        </div>
        <div class="process">审核流程</div>
        <!-- 退保 中 -->
        <div class="shy_contain1" v-if="cancelSts===10">
            <div class="ing">
                <div class="left">
                    <div class="left_icon1"><i class="iconfont">&#xe681;</i></div>
                    <div class="left_icon2"><i class="iconfont">&#xe682;</i></div>
                </div>
                <div class="right">
                    <div class="top">发起退保申请</div>
                    <div class="middle">{{list.insuredStartTime}}</div>
                    <div class="bottom">稍后返回申请结果</div>
                </div>
            </div>
            <!-- 撤销申请  -->
            <!-- <div class="cancel">
                撤销申请
            </div> -->
        </div>
        <!-- 退保失败 -->
        <div class="shy_contain2" v-if="cancelSts===30">
            <div class="ing">
                <div class="left">
                    <div class="left_icon1"><i class="iconfont">&#xe681;</i></div>
                    <div class="left_icon2"><i class="iconfont">&#xe684;</i></div>
                </div>
                <div class="right">
                    <div class="top">发起退保申请</div>
                    <div class="middle">{{list.insuredStartTime}}</div>
                    <div class="bottom">退保失败</div>
                    <div class="middle1">{{list.handleEndTime}}</div>
                    <div class="detail">{{list.cancelDesc}}</div>
                </div>
            </div>
        </div>
        <!-- 退保成功 -->
        <div class="shy_contain3" v-if="cancelSts===20">
            <div class="ing">
                <div class="left">
                    <div class="left_icon1"><i class="iconfont">&#xe681;</i></div>
                    <div class="left_icon2"><i class="iconfont">&#xe68d;</i></div>
                    <div class="left_icon3"><i class="iconfont">&#xe68b;</i></div>
                </div>
                <div class="right">
                    <div class="top">发起退保申请</div>
                    <div class="middle">{{list.insuredStartTime}}</div>
                    <div class="bottom">退保审核通过待打款</div>
                    <div class="middle1">11-14 11:05</div>
                    <div class="bottom">退保成功</div>
                    <div class="middle2">{{list.handleEndTime}}</div>
                    <div class="price">退保金额:{{list.cancelAmount}}</div>
                </div>
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import myPromise from 'js/tools.js';
import request from 'js/interface/request'
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
import { Common, storage, valid } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
export default {
    components: {
        toast,
        loading,
        headerCommon
    },
    data() {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            output: '', // 数据
            loading: false,
            head_border: 1,
            pageIndex: 1,
            pageSize: 10,
            first_list: true, // 第一次1
            policy_url: '',
            classType: 2,
            isWeiXin: false,
            title: '退保详情',
            listDetail: {},   //退保申请列表
            isShow1: false,  //退保中显示
            isShow2: false, //退保失败显示
            isShow3: true, //退保成功显示
            cancelSts: '', //退保状态
            list: '',  //绑定的数据
            cancelId: '' //退保单号
        }
    },
    created() {
        this.isWeiXin = valid.isWeiXin();
        this.getList();
        document.getElementsByTagName('title')[0].innerText = '退保详情';
        // console.log(window.dropload)
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        //获取列表数据
        getList() {
            this.cancelId = this.$route.query.cancelId;
            var data = {
                userId: Common.getUserId(), // 用户id
                cancelId: this.cancelId // cancelId退保单号
            }
            request.getCancelInsuredList(data, (response) => {
                if (response.data.respCode === '000000') {
                    this.cancelSts = response.data.output.cancelListRecords[0].cancelSts;
                    this.list = response.data.output.cancelListRecords[0];
                    this.list.cancelApplyTime = this.list.cancelApplyTime.substr(0, 10);
                    this.list.insuredStartTime = this.list.insuredStartTime.substr(0, 19);
                    this.list.handleEndTime = this.list.handleEndTime.substr(0, 19);
                } else {
                    this.showtoast(response.data.respMsg, true)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        //点击退保申请按钮
        goSurrender() {
            window.location.href = 'personal.html#/surrenderDetail'
        },
        refreshData(me) {
            me.resetload();
            console.log(1)
        },
        resetBody() {
            this.$nextTick(() => {
                setTimeout(() => {
                    Common.setFullScreen()
                }, 0)
            })
        },
        // 显示提示框
        showtoast(msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        // 关闭提示框
        closetoast() {
            this.toast.isshow = false;
        },
        goUrl(item) {
            console.log(item)
            // this.policy_url = 'javascript:;'
            if (item.classType === 2) {
                window.location.href = './policyDetail.html?detailId=' + item.detailId;
            } else {
                window.location.href = './policyDetail2.html?detailId=' + item.detailId;
            }
        }
    },
    filters: {
        timeFilter(value) {
            value = value.substr(0, 10);
            return value;
        }
    }
}
</script>
