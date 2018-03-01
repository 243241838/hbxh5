<template>  
    <div id="body">
         <headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon>
        <div class="order_box" v-show="render" :class="{isWeiXin:isWeiXin}">
             <div class="order_head flexbox" :class="{isWeiXin:isWeiXin}">
                    <div class="flex flexbox justify-content">
                        <div class="item" :class="{border:head_border==1}" @click="tabChange('1')">
                            全部
                        </div>
                    </div>
                   <div class="flex flexbox justify-content">
                       <div class="item" :class="{border:head_border==2}" @click="tabChange('2')">
                           待支付
                       </div>
                   </div>
                   <div class="flex flexbox justify-content">
                        <div class="item" :class="{border:head_border==3}" @click="tabChange('3')">
                           待出单
                        </div>
                   </div>
                   <div class="flex flexbox justify-content">
                       <div class="item" :class="{border:head_border==4}" @click="tabChange('4')">
                           已完成
                       </div>
                   </div>
            </div>
            <!--全部-->
            <div class="order_list">
                <div v-for="(item,index) in tradeList">
                    <div class="list_head" v-text="item.tradeDate"></div>
                    <div class="item" @click="orderUrl(item)">
                        <div class="order_top flexbox">
                            <div class="left">
                                <div v-if="item.classType==1" class="numberCar" v-for="itm in item.insuredList" v-text="itm.licenseNo!=0 ? itm.licenseNo : '新车未上牌'"></div>
                               <div v-else class="numberCar"  v-text="item.productName"></div>
                               <div><img :src="item.insurerLogo" alt=""></div>
                            </div>
                            <div class="right flex flexbox flex-right">
                                <div v-show="item.sts==7"  class="noborder">核保中</div>
                                <div v-show="item.sts==10">去支付</div>
                                <div v-show="item.sts==20" class="noborder">已支付</div>
                                <div v-show="item.sts==35" class="noborder">已完成</div>
                                <div v-show="item.sts==50" class="noborder">已退款</div>
                                <div v-show="item.sts==-11" class="noborder">已失效</div>
                                <div v-show="item.sts==60" class="noborder color">待出单</div>
                            </div>
                        </div>
                        <div class="order_center">
                            <div>
                                订单号：
                                <span v-text="item.tradeId"></span>
                            </div>
                            <div>
                                被保人：
                                <span v-for="itm in item.insuredList" v-text="itm.insuredName"></span>
                            </div>
                            <div v-if="item.classType==1">
                                 <div>
                                    交强险起期：
                                    <span v-text="item.jqxStartTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.jqxEndTim"></span>
                                </div>
                                <div>
                                    商业险起期：
                                    <span v-text="item.startTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.endTime"></span>
                                </div>
                            </div>
                            <div v-else>
                                <div>
                                    投保人：
                                    <span v-text="item.policyHolderName"></span>
                                </div>
                                <div>
                                     保险期间:
                                    <span v-text="item.startTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.endTime"></span>
                                </div>
                            </div>
                        </div>
                        <div class="order_bottom flexbox">
                           <div>
                              订单金额：
                              <span v-text="(item.payAmount/100).toFixed(2)"></span>
                              元
                           </div>
                           <div class="flex flexbox flex-right">
                               推广费：
                               <span v-text="((item.payAmount*item.commisionValue1)/100).toFixed(2)"></span>
                               元
                           </div>
                        </div>
                        <!--item-->
                    </div>
                </div>
                <!--list-->
            </div>
            <!--待支付-->
            <div class="order_list" v-show="false">
                 <div v-for="(item,index) in tradeList">
                    <div class="list_head" v-text="item.tradeDate"></div>
                    <div class="item" @click="orderUrl(item)">
                        <div class="order_top flexbox">
                            <div class="left">
                                <div v-if="item.classType==1" class="numberCar" v-for="itm in item.insuredList" v-text="itm.licenseNo!=0 ? itm.licenseNo : '新车未上牌'"></div>
                               <div v-else class="numberCar"  v-text="item.productName"></div>
                               <div><img :src="item.insurerLogo" alt=""></div>
                            </div>
                            <div class="right flex flexbox flex-right">
                                <div v-show="item.sts==10"><a href="javascript:;">去支付</a></div>
                                <div v-show="item.sts==20" class="noborder">已支付</div>
                                <div v-show="item.sts==35" class="noborder">已完成</div>
                                <div v-show="item.sts==50" class="noborder">已退款</div>
                                <div v-show="item.sts==-11" class="noborder">已失效</div>
                                <div v-show="item.sts==60" class="noborder">待出单</div>
                            </div>
                        </div>
                        <div class="order_center">
                            <div>
                                订单号：
                                <span v-text="item.tradeId"></span>
                            </div>
                            <div>
                                被保人：
                                <span v-for="itm in item.insuredList" v-text="itm.insuredName"></span>
                            </div>
                            <div v-if="item.classType==1">
                                 <div>
                                    交强险起期：
                                    <span v-text="item.jqxStartTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.jqxEndTim"></span>
                                </div>
                                <div>
                                    商业险起期：
                                    <span v-text="item.startTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.endTime"></span>
                                </div>
                            </div>
                            <div v-else>
                                <div>
                                    投保人：
                                    <span v-text="item.policyHolderName"></span>
                                </div>
                                <div>
                                     保险期间:
                                    <span v-text="item.startTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.endTime"></span>
                                </div>
                            </div>
                        </div>
                        <div class="order_bottom flexbox">
                           <div>
                              订单金额：
                              <span v-text="(item.payAmount/100).toFixed(2)"></span>
                              元
                           </div>
                           <div class="flex flexbox flex-right">
                               推广费：
                               <span v-text="((item.payAmount*item.commisionValue1)/100).toFixed(2)"></span>
                               元
                           </div>
                        </div>
                        <!--item-->
                    </div>
                </div>
                <!--list-->
            </div>
             <!--完成-->
            <div class="order_list" v-show="false">
                 <div v-for="(item,index) in tradeList">
                    <div class="list_head" v-text="item.tradeDate"></div>
                    <div class="item" @click="orderUrl(item)">
                        <div class="order_top flexbox">
                            <div class="left">
                                <div v-if="item.classType==1" class="numberCar" v-for="itm in item.insuredList" v-text="itm.licenseNo!=0 ? itm.licenseNo : '新车未上牌'"></div>
                               <div v-else class="numberCar"  v-text="item.productName"></div>
                               <div><img :src="item.insurerLogo" alt=""></div>
                            </div>
                            <div class="right flex flexbox flex-right">
                               <div v-show="item.sts==10"><a href="javascript:;">去支付</a></div>
                                <div v-show="item.sts==20" class="noborder">已支付</div>
                                <div v-show="item.sts==35" class="noborder">已完成</div>
                                <div v-show="item.sts==50" class="noborder">已退款</div>
                                <div v-show="item.sts==-11" class="noborder">已失效</div>
                                
                            </div>
                        </div>
                        <div class="order_center">
                            <div>
                                订单号：
                                <span v-text="item.tradeId"></span>
                            </div>
                            <div>
                                被保人：
                                <span v-for="itm in item.insuredList" v-text="itm.insuredName"></span>
                            </div>
                            <div v-if="item.classType==1">
                                 <div>
                                    交强险起期：
                                    <span v-text="item.jqxStartTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.jqxEndTim"></span>
                                </div>
                                <div>
                                    商业险起期：
                                    <span v-text="item.startTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.endTime"></span>
                                </div>
                            </div>
                            <div v-else>
                                <div>
                                    投保人：
                                    <span v-text="item.policyHolderName"></span>
                                </div>
                                <div>
                                     保险期间:
                                    <span v-text="item.startTime"></span>
                                    <span class="br">至</span>
                                    <span v-text="item.endTime"></span>
                                </div>
                            </div>
                        </div>
                        <div class="order_bottom flexbox">
                           <div>
                              订单金额：
                              <span v-text="(item.payAmount/100).toFixed(2)"></span>
                              元
                           </div>
                           <div class="flex flexbox flex-right">
                               推广费：
                               <span v-text="((item.payAmount*item.commisionValue1)/100).toFixed(2)"></span>
                               元
                           </div>
                        </div>
                        <!--item-->
                    </div>
                </div>
                <!--list-->
            </div>
            <!--box-->
        </div>
         <!--toasts提示组件-->
        <totast :isshow="totast.isshow" @ontoastback="closetoast">{{ totast.message}}</totast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import myPromise from 'js/tools.js';
import request from 'js/interface/request'
import totast from '../../../components/toast' // totast引用
import loading from '../../../components/loading.vue';
import { Common, valid } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
export default {
    components: {
        totast,
        loading,
        headerCommon
    },
    data () {
        return {
            totast: { // totast引用
                isshow: false,
                message: ''
            },
            render: true,
            loading: false,
            isFirst: true,
            head_border: '1',
            pageIndex: 1, // 页码
            pageSize: 10, // 数量
            tradeList: [],
            tradeSts: '0',
            isWeiXin: false,
            title: '我的订单'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '我的订单';
        window.dropload = new Mydropload('body', this.refreshData, this.getData);
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        getData (me) {
            if (me) {
                window.dropload = me;
            } else {
                // 解锁
                window.dropload.isLockDown = false;
                window.dropload.isData = true;
            }
            var obj = {
                userId: Common.getUserId(),
                tradeSts: this.tradeSts,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            }
            let p = myPromise.pagination(obj, 'getTrades', this.tradeList, 'tradeList', window.dropload);
            p.then((obj) => {
                this.tradeList = obj.productList;
                this.$nextTick(() => {
                    let by = document.getElementById('body')
                    Common.setFullScreen(by)
                    document.querySelector('.dropload-down').style.paddingTop = Common.getStyle(by, 'height');
                    window.dropload.direction = 'up';
                    window.dropload.resetload();
                })
                this.pageIndex = obj.pageIndex;
            }, (error) => {
                this.showTotast(error, true);
            });
        },
        // tab切换
        tabChange (type) {
            this.pageIndex = 1;
            this.tradeList = [];
            if (type === '1') {
                this.tradeSts = '0'
                this.getData();
            } else if (type === '2') {
                this.tradeSts = '10'
                this.getData();
            } else if (type === '3') {
                this.tradeSts = '60'
                this.getData();
            } else {
                this.tradeSts = '35'
                this.getData();
            }
            this.head_border = type;
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
        orderUrl (item) {
            let tradeId = item.tradeId
            console.log(item)
            if (item.classType === 2) {
                window.location.href = './orderDetailGe.html?tradeId=' + tradeId + '&classType=' + item.classType;
            } else if (item.classType === 1) {
                window.location.href = './orderDetailChe.html?tradeId=' + tradeId + '&classType=' + item.classType;
            } else if (item.classType === 3) {
                window.location.href = './FQOrderDetail.html?tradeId=' + tradeId + '&classType=' + item.classType;
            }
        },
        // 显示提示框
        showTotast (msg, isshow) { // totast引用：3.显示
            this.totast.message = msg;
            this.totast.isshow = isshow;
        },
        // 关闭提示框
        closetoast () {
            this.totast.isshow = false;
        }
        // resetBody () {
        //     setTimeout(() => {
        //         Common.setFullScreen();
        //     }, 0)
        // }
    }
}
</script>
