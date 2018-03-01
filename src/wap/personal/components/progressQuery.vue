<template>
    <div id="body" class="g_homePolicy_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon>
        <div class="progressQuery_box" :class="{isWeiXin:isWeiXin}">
            如有疑问，请详询 4001101866
        </div>
        <div class="progressQuery1_box" v-for="(item,index) in output" @click="detail(item.cancelId)">
            <div class="item">
                {{item.productName}}
            </div>
            <div class="item_info">
                <p class="progressQuery_item">理赔单号:{{item.tradeId}}</p>
                <p class="progressQuery_item">申请日期:{{item.cancelApplyTime | timeFilter}}</p>
            </div>
            <div class="shy_baodanSts">
                <i class="iconfont sts10" v-if="item.cancelSts===10">&#xe692;</i>
                <i class="iconfont" v-if="item.cancelSts===20">&#xe693;</i>
                <i class="iconfont" v-if="item.cancelSts===30">&#xe690;</i>
            </div>
        </div>
        <nodata v-show="output.length===0" :infomessage="infomessage" :buttonmessage="buttonmessage" :url="url"></nodata>
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
import nodata from '../../../components/nodata';
export default {
    components: {
        toast,
        loading,
        headerCommon,
        nodata
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
            first_list: true, //第一次
            policy_url: '',
            classType: 2,
            isWeiXin: false,
            title: '进度查询',
            infomessage: '您还没有发起过退保噢',
            buttonmessage: '',
            url: 'index.html'
        }
    },
    created() {
        this.isWeiXin = valid.isWeiXin();
        //this.getList();
        document.getElementsByTagName('title')[0].innerText = '进度查询';
        window.dropload = new Mydropload('body', this.refreshData, this.getData)
        console.log(window.dropload)
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        //获取列表数据
        getList() {
            var data = {
                userId: Common.getUserId(), // 用户id1111
                pageIndex: this.pageIndex //页码
            }
            request.getCancelInsuredList(data, (response) => {
                if (response.data.respCode === '000000') {
                    this.list = response.data.output.cancelListRecords;
                } else {
                    this.showtoast(response.data.respMsg, true)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        //获取数据
        getData(me) {
            if (this.first_list) {
                this.loading = true;
            }
            if (me) {
                window.dropload = me;
            } else {
                // 解锁
                window.dropload.isLockDown = false;
                window.dropload.isData = true;
            }
            var data = {
                userId: Common.getUserId(), // 用户的id
                pageIndex: this.pageIndex //页码
            }
            console.log(data)
            let p = myPromise.pagination(data, 'getCancelInsuredList', this.output, 'cancelListRecords', window.dropload);
            p.then((obj) => {
                this.output = obj.productList;
                console.log(this.output);
                this.$nextTick(() => {
                    let by = document.getElementById('body')
                    Common.setFullScreen(by);
                    document.querySelector('.dropload-down').style.paddingTop = Common.getStyle(by, 'height');
                    window.dropload.direction = 'up';
                    window.dropload.resetload();
                })
                this.pageIndex = obj.pageIndex;
                this.loading = false;
                this.first_list = false;
            }, (error) => {
                this.showtoast(error, true);
                this.loading = false;
                this.first_list = false;
            });
            Common.setFullScreen(document.getElementById('body'))
            console.log(this.loading);
            this.loading = false;
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
        //点击进入详情页
        detail(val) {
            this.$router.push({ path: '/surrenderDetail', query: { cancelId: val } });
            //window.location.href = './personal.html#/surrenderDetail?cancelId=' + val;
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
