<template>
    <div id="body" class="applyClaims_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon>
        <div class="top"></div>
        <div class="banner" :class="{'isWeiXin': isWeiXin}"></div>
        <div class="seach">
            <router-link :to="{name:'myClaims'}"> 
                <div>理赔历史查询</div>
            </router-link>
        </div>
        <div class="applyClaims_list" v-show="output.length > 0">
            <!--已承保-->
            <div v-for="(item,index) in output" >
                <a href="javascript:;">
                    <div class="item">
                        <div @click="goUrl(item)">
                            <div class="applyClaims_top flexbox">
                                <div class="left">
                                    <div class="numberCar" v-show="item.classType==2" v-text="item.productName"></div>
                                    <div class="numberCar" v-show="item.classType==1" v-for="itm in item.insuredList" v-text="itm.licenseNo!=0 ? itm.licenseNo : '新车未上牌'"></div>
                                    <div><img :src="item.insurerLogo"></div>
                                </div>
                                <div class="right flex flexbox flex-right">
                                    <!--
                                    <img src="../images/img1.png" alt="" v-show="item.sts<20">
                                    <img src="../images/img2.png" alt="" v-show="item.sts==20">
                                    <img src="../images/img3.png" alt="" v-show="item.sts==30">
                                    <img src="../images/img4.png" alt="" v-show="item.sts==40">
                                    -->
                                    保障中
                                </div>
                            </div>
                            <div class="applyClaims_center">
                                <div v-if="item.sts<20">
                                    保单号：
                                    <span>暂无保单号</span>
                                </div>
                                <div v-else>
                                    保单号：
                                    <span v-text="item.policyId"></span>
                                </div>
                                <div>
                                    被保人：
                                    <span v-for="itm in item.insuredList" v-text="itm.insuredName"></span>
                                </div>
                                <div>
                                    投保人：
                                    <span v-text="item.applicant"></span>
                                </div>
                                <div v-show="item.classType==2">
                                    保险期间：
                                    <span v-text="item.startTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.endTime"></span>
                                </div>
                                <div v-show="item.classType==1">
                                    交强险起期：
                                    <span v-text="item.jqxStartTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.jqxEndTime"></span>
                                </div>
                                <div v-show="item.classType==1">
                                    商业险起期：
                                    <span v-text="item.startTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.endTime"></span>
                                </div>
                            </div>
                        </div>
                        <div class="applyClaims_bottom flexbox align-items">
                            <div>
                                保单金额：
                                <span v-text="(item.payAmount/100).toFixed(2)"></span>
                                元
                            </div>
                            <div class="flexbox align-items justify-content">
                                 <router-link :to="{name:'apply', query: {output: JSON.stringify(item)}}">

                                    <div>申请理赔</div>
                                </router-link>
                            </div>
                        </div>
                        <!--item-->
                    </div>
                </a>     
            </div> 
            <!--list-->
        </div>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
        <nodata v-show="output.length===0":infomessage="infomessage" :buttonmessage="buttonmessage" :url="url"></nodata>
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
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            output: '', //数据
            loading: false,
            pageIndex: 1,
            pageSize: 10,
            first_list: true, // 第一次
            policy_url: '',
            classType: 2,
            isWeiXin: false,
            title: '申请理赔',
            infomessage: '您暂时没有可申请理赔的保单',
            buttonmessage: '立即获取保障',
            url: 'index.html'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '申请理赔';
        window.dropload = new Mydropload('body', this.refreshData, this.getData);
        this.getData();
    },
    mounted () {
        this.$nextTick(() => {
            this.resetBody();
        })
    },
    computed: {
    },
    methods: {
        //获取数据
        getData (me) {
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
                // requestType: 1,
                userId: Common.getUserId(), // 用户id
                policySts: 100, // // 状态 0：全部10：核保中；20：已承保； 30: 已退保40：已过期 100: 保障中
                classType: this.classType, // 1:车险；2：个险
                pageIndex: this.pageIndex, // pageIndex
                pageSize: this.pageSize // pageSize
            }
            console.log(data)
            let p = myPromise.pagination(data, 'getPolicies', this.output, 'policyList', window.dropload);
            p.then((obj) => {
                this.output = obj.productList;
                console.log(this.output)
                this.$nextTick(() => {
                    let by = document.getElementById('body')
                    Common.setFullScreen(by);
                    document.querySelector('.dropload-down').style.paddingTop = Common.getStyle(by, 'height');
                    window.dropload.direction = 'up';
                    window.dropload.resetload();
                    // Common.setFullScreen(document.getElementById('body'))
                    // window.dropload.direction = 'up';
                    // window.dropload.resetload();
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
        },
        //发起申请
        applyClaims (item) {
            console.log(item)
        },
        goUrl (item) {
            console.log(item)
            // this.policy_url = 'javascript:;'
            if (item.classType === 2) {
                window.location.href = './policyDetail.html?detailId=' + item.detailId;
            } else {
                window.location.href = './policyDetail2.html?detailId=' + item.detailId;
            }
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
        refreshData (me) {
            // me.resetload();
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
