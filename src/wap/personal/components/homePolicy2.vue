<template>  
    <div id="body1" class="g_homePolicy_body" >
        <headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon>
        <div class="policy_box" :class="{isWeiXin:isWeiXin}">
            <div class="policy_head flexbox" :class="{isWeiXin:isWeiXin}">
                    <div class="flex flexbox justify-content" :class="{isWeiXin:isWeiXin}">
                        <div class="item" :class="{border:head_border==1}" @click="head(1)">
                            个险保单
                        </div>
                    </div>
                <div class="flex flexbox justify-content">
                    <div class="item" :class="{border:head_border==2}" @click="head(2)">
                        车险保单
                    </div>
                </div>
            </div>
            <!--个险-->
            <div class="policy_list" v-show="true">
                <!--已过期-->
                <div v-for="(item,index) in output" >
                    <div class="list_head" v-text="item.tradeDate"></div>
                    <a href="javascript:;" @click="goUrl(item)">
                        <div class="item">
                            <div class="policy_top flexbox">
                               <div class="left">
                                    <div class="numberCar" v-show="item.classType==2" :class="{policy_past:item.sts>20}" v-text="item.productName"></div>
                                    <div class="numberCar" v-show="item.classType==1" :class="{policy_past:item.sts>20}" v-for="itm in item.insuredList" v-text="itm.licenseNo!=0 ? itm.licenseNo : '新车未上牌'"></div>
                                    <div><img :src="item.insurerLogo"></div>
                                </div>
                                <div class="right flex flexbox flex-right">
                                    <img src="../images/img1.png" alt="" v-show="item.sts<20">
                                    <img src="../images/img2.png" alt="" v-show="item.sts==20">
                                    <img src="../images/img3.png" alt="" v-show="item.sts==30">
                                    <img src="../images/img4.png" alt="" v-show="item.sts==40">
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
                            <div class="policy_bottom" :class="{policy_past:item.sts>20}">
                            <div>
                                保单金额：
                                <span :class="{policy_past:item.sts>20}" v-text="(item.payAmount/100).toFixed(2)"></span>
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
                <!--已过期--> 
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
                                    <img src="../images/img1.png" alt="" v-show="item.sts<20">
                                    <img src="../images/img2.png" alt="" v-show="item.sts==20">
                                    <img src="../images/img3.png" alt="" v-show="item.sts==30">
                                    <img src="../images/img4.png" alt="" v-show="item.sts==40">
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
                                <div>
                                    交强险起期：
                                    <span v-text="item.jqxStartTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.jqxEndTime"></span>
                                </div>
                                <div>
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
                            </div>
                            <!--item-->
                        </div>
                    </a>  
                </div>
                <!--list-->
            </div>
             <footer class="policy_footer" v-show="output.length>0">
                
            </footer>
            <!--box-->
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
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            output: '', // 险已过期
            render: false,
            loading: false,
            isFirst: true,
            head_border: '',
            policySts: 0, // 状态 0：全部10：核保中；20：已承保； 30: 已过期
            pageIndex: 1,
            pageSize: 3,
            policy_url: '',
            classType: '',
            title: '我的历史保单',
            isWeiXin: false,
            first_list: true // 第一次
        }
    },
    created () {
        this.ins();
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '我的历史保单';
    },
    mounted () {
        // document.body.scrollTop = 0;
        this.$nextTick(() => {
            window.dropload = new Mydropload('body', this.refreshData, this.getData)
        })
    },
    computed: {
    },
    methods: {
        //初始化获取
        ins () {
            let index = this.$route.query.classType;
            this.classType = index;
            if (parseInt(index) === 2) {
                this.head_border = 1;
            } else if (parseInt(index) === 1) {
                this.head_border = 2;
            }
        },
         //点击头部
        head (number) {
            this.pageIndex = 1;
            this.output = '';
            if (number === 1) {
                this.head_border = 1;
                this.classType = 2
            } else if (number === 2) {
                this.head_border = 2;
                this.classType = 1;
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
                policySts: 40, // // 状态 0：全部10：核保中；20：已承保； 30: 已退保40：已过期
                classType: this.classType, // 1:车险；2：个险
                pageIndex: this.pageIndex, // pageIndex
                pageSize: this.pageSize // pageSize
            }
            console.log(data)
            let p = myPromise.pagination(data, 'getPolicies', this.output, 'policyList', window.dropload);
            p.then((obj) => {
                this.output = obj.productList;
                this.$nextTick(() => {
                    let by = document.getElementById('body1')
                    Common.setFullScreen(by);
                    console.log(by)
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
            Common.setFullScreen(document.getElementById('body1'))
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
        }
    }
}
</script>
