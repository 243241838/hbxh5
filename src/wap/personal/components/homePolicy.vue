<template>  
    <div id="body" class="g_homePolicy_body" >
        <headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon>
        <div class="policy_box" :class="{isWeiXin:isWeiXin}">
            <div class="policy_head flexbox" :class="{isWeiXin:isWeiXin}">
                    <div class="flex flexbox justify-content">
                        <div class="item" :class="{border:head_border==1}" @click="head(1)">
                            全部
                        </div>
                    </div>
                <div class="flex flexbox justify-content">
                    <div class="item" :class="{border:head_border==2}" @click="head(2)">
                        已出单
                    </div>
                </div>
                <div class="flex flexbox justify-content">
                    <div class="item" :class="{border:head_border==3}" @click="head(3)">
                        保障中
                    </div>
                </div>
                <div class="flex flexbox justify-content">
                    <div class="item" :class="{border:head_border==4}" @click="head(4)">
                        已失效
                    </div>
                </div>
                <div class="flex flexbox justify-content">
                    <div class="item" :class="{border:head_border==5}" @click="head(5)">
                        已退保
                    </div>
                </div>
            </div>
            <!--个险-->
            <div class="policy_list" v-show="true">
                <!--已承保-->
                <div v-for="(item,index) in output" >
                    <div class="list_head" v-text="item.tradeDate"></div>
                    <a href="javascript:;" @click="goUrl(item)">
                        <div class="item">
                            <div class="policy_top flexbox">
                                <div class="left">
                                    <div class="numberCar" v-show="item.classType==2" :class="{policy_past:item.sts==30||item.sts==40||item.sts==100&&item.claimState==-20||item.sts==100&&item.claimState==40,policy_color:item.sts==100&&item.claimState==0||item.sts==100&&item.claimState==10||item.sts==100&&item.claimState==30||item.sts==20}" v-text="item.productName"></div>
                                    <div class="numberCar" v-show="item.classType==1" :class="{policy_past:item.sts>20}" v-for="itm in item.insuredList" v-text="itm.licenseNo!=0 ? itm.licenseNo : '新车未上牌'"></div>
                                    <div><img :src="item.insurerLogo"></div>
                                </div>
                                <div class="right flex flexbox flex-right">
                                    <i class="iconfont blue" v-show="item.sts==20">&#xe67f;</i> 
                                    <i class="iconfont" v-show="item.sts==30">&#xe693;</i> 
                                    <i class="iconfont" v-show="item.sts==40">&#xe67e;</i> 
                                    <i class="iconfont blue" v-show="item.sts==100&&item.claimState==0">&#xe683;</i> 
                                    <i class="iconfont blue" v-show="item.sts==100&&item.claimState==10">&#xe68f;</i>
                                    <i class="iconfont" v-show="item.sts==100&&item.claimState==-20">&#xe68e;</i>
                                    <i class="iconfont blue" v-show="item.sts==100&&item.claimState==30">&#xe691;</i>
                                    <i class="iconfont" v-show="item.sts==100&&item.claimState==40">&#xe694;</i>
                                </div>
                            </div>
                            <div class="policy_center" :class="{policy_past:item.sts==30||item.sts==40||item.sts==100&&item.claimState==-20||item.sts==100&&item.claimState==40,policy_color:item.sts==100&&item.claimState==0||item.sts==100&&item.claimState==10||item.sts==100&&item.claimState==30||item.sts==20}">
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
                            <div class="policy_bottom">
                            <div :class="{policy_past:item.sts==30||item.sts==40||item.sts==100&&item.claimState==-20||item.sts==100&&item.claimState==40,policy_color:item.sts==100&&item.claimState==0||item.sts==100&&item.claimState==10||item.sts==100&&item.claimState==30||item.sts==20}">
                                保单金额：
                                <span  v-text="(item.payAmount/100).toFixed(2)"></span>
                                元
                            </div>
                            </div>
                            <!--item-->
                        </div>
                    </a>     
                </div> 
                <!--list-->
            </div>
            <!--车险-->
            <div class="policy_list" v-show="false">
                <!--已承保--> 
                <div v-for="(item,index) in output" >
                    <div class="list_head" v-text="item.tradeDate"></div>
                    <a href="javascript:;" @click="goUrl(item)">
                        <div class="item">
                            <div class="policy_top flexbox">
                                <div class="left">
                                    <div class="numberCar" :class="{policy_past:item.sts>20}" v-for="itm in item.insuredList" v-text="itm.licenseNo!=0 ? itm.licenseNo : '新车未上牌'"></div>
                                    <div><img :src="item.insurerLogo" alt=""></div>
                                </div>
                                <div class="right flex flexbox flex-right">
                                    <i class="iconfont" v-show="item.sts==30">&#xe678;</i>
                                    <i class="iconfont" v-show="item.sts==40">&#xe677;</i>
                                    <i class="iconfont blue">&#xe683;</i>
                                    <i class="iconfont blue" v-show="item.sts==100&&item.claimState==0">&#xe683;</i>
                                    <i class="iconfont blue" v-show="item.sts==100&&item.claimState==10">&#xe68f;</i>
                                    <i class="iconfont" v-show="item.sts==100&&item.claimState==-20">&#xe68e;</i>
                                    <i class="iconfont blue" v-show="item.sts==100&&item.claimState==30">&#xe691;</i>
                                    <i class="iconfont" v-show="item.sts==100&&item.claimState==40">&#xe694;</i>
                                </div>
                            </div>
                            <div class="policy_center" :class="{policy_past:item.sts>20}">
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
                            <div class="policy_bottom" :class="{policy_past:item.sts>20}">
                            <div>
                                保单金额：
                                <span v-text="(item.payAmount/100).toFixed(2)" :class="{policy_past:item.sts>20}"></span>
                                元
                            </div>
                            <div></div>
                            </div>
                            <!--item-->
                        </div>
                    </a>
                </div>
                <!--list-->
            </div>
            <!--<footer class="policy_footer">
                <router-link :to="{name:'homePolicy2',query: {classType:classType}}">
                        <div class="btn" @click="subm">查看历史保单</div>
                </router-link>
            </footer>-->
            <!--box-->
        </div>
         <!--toasts提示组件-->
        <nodata v-show="output.length===0":infomessage="infomessage" :buttonmessage="buttonmessage" :url="url"></nodata>
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
    data () {
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
            first_list: true, // 第一次
            policy_url: '',
            classType: 2,
            policySts: 0,
            isWeiXin: false,
            title: '我的保单',
            isshow: true,
            infomessage: '暂无有效保单',
            buttonmessage: '立即享受保障',
            url: 'index.html',
            first: true
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '我的保单';
        window.dropload = new Mydropload('body', this.refreshData, this.getData)
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        //点击头部
        head (number) {
            this.pageIndex = 1;
            this.output = '';
            if (number === 1) {
                this.head_border = 1;
                this.policySts = 0;
            } else if (number === 2) {
                this.head_border = 2;
                this.policySts = 20;
            } else if (number === 3) {
                this.head_border = 3;
                this.policySts = 100;
            } else if (number === 4) {
                this.head_border = 4;
                this.policySts = 40;
            } else if (number ===5) {
                this.head_border = 5;
                this.policySts = 30;
            }
            this.getData();
        },
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
                userId: Common.getUserId(), // 用户id
                policySts: this.policySts, // // 状态 0：全部10：核保中；20：已承保； 30: 已退保40：已过期
                classType: this.classType, // 1:车险；2：个险
                pageIndex: this.pageIndex, // pageIndex
                pageSize: this.pageSize // pageSize
            }
            //console.log(data)
            let p = myPromise.pagination(data, 'getPolicies', this.output, 'policyList', window.dropload);
            p.then((obj) => {
                this.output = obj.productList;
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
        },
        refreshData (me) {
            me.resetload();
        },
        resetBody () {
            this.$nextTick(() => {
                setTimeout(() => {
                    Common.setFullScreen()
                }, 0)
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
        subm () {
            if (this.head_border === 1) {  // 1 车险 2个险
                this.classType = 2;
            } else {
                this.classType = 1;
            }
        },
        goUrl (item) {
            //console.log(item)
            // this.policy_url = 'javascript:;'
            if (item.classType === 2) {
                window.location.href = './policyDetail.html?detailId=' + item.detailId;
            } else {
                window.location.href = './policyDetail2.html?detailId=' + item.detailId;
            }
        }
    }
}
</script>
