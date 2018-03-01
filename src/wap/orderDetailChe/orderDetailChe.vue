<template>
    <div id="body">
        <ul class="session" v-show="render">
            <li>
                <div class="head">
                    <span>保单信息</span>
                </div>
                <ul class="list">
                    <li class="item">
                        <span class="item_title">订单状态：</span>
                        <span class="item_content isOn" :class="{'invalid':orderStatus==3}" v-text="payStatus"></span>
                    </li>
                    <li class="item" v-if="output.refundSts==1">
                        <span class="item_title">保单状态：</span>
                        <span class="item_content isOn" :class="{invalid:orderStatus == 3}">退款申请中</span>
                    </li>
                    <li class="item" v-if="output.refundSts==2">
                        <span class="item_title">保单状态：</span>
                        <span class="item_content isOn" :class="{invalid:orderStatus == 3}">退款成功</span>
                    </li>
                    <li class="item" v-if="output.refundSts==3">
                        <span class="item_title">保单状态：</span>
                        <span class="item_content isOn" :class="{invalid:orderStatus == 3}">退款失败</span>
                    </li>
                    <li class="item">
                        <span class="item_title">订单号：</span>
                        <span class="item_content" :class="{'invalid':orderStatus == 3}" v-text="output.tradeId"></span>
                    </li>
                    <li class="item">
                        <span class="item_title">起保时间：</span>
                        <span class="item_content" :class="{'invalid':orderStatus == 3}" v-text="output.startTime"></span>
                    </li>
                    <li class="item">
                        <span class="item_title">终止时间：</span>
                        <span class="item_content" :class="{'invalid':orderStatus == 3}" v-text="output.endTime"></span>
                    </li>
                </ul>  
            </li>
            <li>
                <div class="head">
                    <span>保单邮寄地址</span>
                </div>
                <ul class="list">
                    <li class="item">
                        <span class="item_title">收件人：</span>
                        <span class="item_content" :class="{invalid:orderStatus == 3}"  v-text="output.applicant"></span>
                    </li>
                    <li class="item">
                        <span class="item_title">联系电话：</span>
                        <span class="item_content" :class="{invalid:orderStatus == 3}"  v-text="output.applicantMobile"></span>
                    </li>
                    <li class="item">
                        <span class="item_title">地址：</span>
                        <span class="item_content" :class="{invalid:orderStatus == 3}"  v-text="output.shippingAddress"></span>
                    </li>
                </ul>
            </li>
            <li v-for="items in info.vehicleInfo">
                <div class="head">
                    <span>车辆信息</span>
                </div>
                <ul class="list">
                    <li class="item" v-for="item in items">
                        <span class="item_title" v-text="item.name"></span>
                        <span class="item_content" :class="{invalid:orderStatus == 3}"  v-text="item.content"></span>
                    </li>
                </ul>
            </li>
            <li>
                <ul>
                    <li class="head">
                        <span>保障详情</span>
                    </li>
                    <li>
                        <div style="padding-top:0.16rem;background: #fff;">
                            <div class="title lowLine-H">
                                <span :class="{invalid:orderStatus == 3}">产品详情:</span>
                                <span class="detail" :class="{invalid:orderStatus == 3}"  v-text="info.productName"></span>
                            </div>
                            <div class="title lowLine-H">
                                <span :class="{invalid:orderStatus == 3}">投保城市:</span>
                                <span class="detail" :class="{invalid:orderStatus == 3}"  v-text="info.cityName"></span>
                            </div>
                        </div>
                        <!--交强险-->
                        <template v-for="item in output.insuredList" v-if="item.carInfo.jqPreium">
                            <div style="padding:0.16rem 0;background: #fff;">
                                <div class="title lowLine-H">
                                    <span :class="{invalid:orderStatus == 3}">交强险</span>
                                </div>
                            </div>
                            <div class="table-box" style="padding-bottom:0.42rem;">
                                <div class="table">
                                    <div class="ui-row">
                                        <div class="ui-col">保险项</div>
                                        <div class="ui-col borderleft">保费</div>
                                    </div>
                                    <div class="ui-row bordertop">
                                        <div class="ui-col">交强险</div>
                                        <div class="ui-col borderleft">{{item.carInfo.jqPreium|formatMoneyN}}</div>
                                    </div>
                                    <div class="ui-row bordertop">
                                        <div class="ui-col">代缴车船税</div>
                                        <div class="ui-col borderleft">{{item.carInfo.ccsPreium|formatMoneyN}}</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <!---->
                        <template v-for="item in output.typeList">
                            <div style="padding:0.16rem 0;background: #fff;">
                                <div class="title lowLine-H">
                                    <span :class="{invalid:orderStatus == 3}"  v-text="item.typeName"></span>
                                </div>
                            </div>
                            <div class="table-box" style="padding-bottom:0.42rem;">
                                <div class="table">
                                    <div class="ui-row" v-if="item.insureList.length>0">
                                        <div class="ui-col">保险项</div>
                                        <div class="ui-col borderleft">保额</div>
                                        <div class="ui-col borderleft">保费</div>
                                        <div class="ui-col borderleft">不计免赔</div>
                                    </div>
                                    <div class="ui-row bordertop" v-for="(innerItem,index) in item.insureList">
                                        <div class="ui-col" v-text="innerItem.insureName"></div>
                                        <div class="ui-col borderleft">{{innerItem.insureAmount | formatInsure}}</div>
                                        <div class="ui-col borderleft">{{innerItem.productPremium | formatMoneyN}}</div>
                                        <div class="ui-col borderleft" v-if="innerItem.extrInsureName">是</div>
                                        <div class="ui-col borderleft" v-else >否</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="payMoney" :class="{finish:orderStatus == 2}">
                            <div class="item">
                                <span class="fl">保费总额</span>
                                <span class="fr">{{output.sumPremium | formatMoney}}</span>
                            </div>
                            <template v-for="item in output.paymentList">
                                <div class="item">
                                    <span class="fl" v-text="item.paymentName"></span>
                                    <span class="fr">{{item.payAmount | formatMoney}}</span>
                                </div>
                            </template>
                        </div>
                        <div class="payMoney payMoneySum" :class="{finish:orderStatus == 2}">
                            <div class="item">
                                <span class="fl">实付金额</span>
                                <span class="fr">{{output.payAmount | formatMoney}}</span>
                            </div>
                        </div>

                        <div class="description">
                            <i class="iconfont icon-tishi"></i>
                            <div>
                                <p><span>温馨提示：</span><span v-text="info.productPrompt"></span></p>
                                <p><span>联系电话：</span><span v-text="info.phone"></span></p>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
        <!--toast提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import Data from '../../data/data.js';
import request from 'js/interface/request'
import loading from '../../components/loading.vue';
import toast from '../../components/toast.vue';
import { Common } from 'js/common.js';
export default {
    components: {
        toast,
        loading
    },
    data () {
        return {
            // 1 待支付, (2 已支付,已退款,已完成), (3 已失效)
            orderStatus: 1, // 订单状态
            output: '',
            info: {
                insureInfo: [// 保单信息
                ],
                insureAddress: [// 保单邮寄地址
                ],
                vehicleInfo: [// 车辆信息
                ],
                insurances: [
                ],
                productName: '',
                cityName: ''
            },
            render: false,
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            loading: true,
            payStatus: ''
        }
    },
    created () {
        this.getData();// 获取数据
    },
    mounted () {
        this.$nextTick(() => {
            Common.setFullScreen();
        })
    },
    filters: {
        formatMoney (value) {
            if (!value) {
                return '';
            }
            return '￥' + (value / 100).toFixed(2);
        },
        formatMoneyN (value) {
            if (!value) {
                return '0.00';
            }
            return (value / 100).toFixed(2);
        },
        formatInsure (value) {
            if (!window.isNaN(value)) {
                return parseInt(value);
            } else {
                return value;
            }
        }
    },
    methods: {
        // 获取数据
        getData () {
            let obj = {
                userId: Common.getUserId(),
                classType: '1',
                tradeId: Common.getQueryString('tradeId')
            }
            console.log(obj);
            request.getTradeDetail(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.updatePage(response.data.output);
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                this.loading = false;
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 获取数据后更新
        updatePage (output) {
            this.output = output;
            // console.log(this.output)
            // 保单信息
            let paymentStatus = Data.paymentStatus;
            for (let i = 0; i < paymentStatus.length; i++) {
                if (JSON.stringify(paymentStatus[i].type) === JSON.stringify(this.output.sts)) {
                    this.payStatus = paymentStatus[i].content;
                }
            }
            switch (this.output.sts) {
            // 待支付
            case '10':
                this.orderStatus = 1;
                break;
            // 已支付,已退款,已完成
            case '20':
            case '50':
            case '35':
                this.orderStatus = 2;
                break;
            // 已失效
            case '-11':
                this.orderStatus = 3;
                break;
            case '7':
            // 核保中
                this.orderStatus = 4;
                break;
            default :
                break;
            }
            // 车辆信息
            let insuredList = this.output.insuredList;
            for (let i = 0; i < insuredList.length; i++) {
                let carInfo = insuredList[i].carInfo;
                let obj = [
                    {name: '车牌:', content: carInfo.engineNo},
                    {name: '车主:', content: insuredList[i].insuredName},
                    {name: '证件号码:', content: insuredList[i].idNo},
                    {name: '联系电话:', content: insuredList[i].mobile}
                ];
                // 投保城市
                this.info.cityName = carInfo.cityName;
                this.info.vehicleInfo.push(obj)
            }
            // 产品详情
            this.info.productName = this.output.productName;
            // 温馨提示
            this.info.productPrompt = '本产品由' + this.output.insurerName + '承保';
            // 联系电话
            this.info.phone = this.output.insurerTels;
            // 总价格
            this.$emit('sumMoney', this.output.payAmount);
            this.$emit('status', this.orderStatus);
            this.$emit('output', this.output);
            this.render = true;
            this.$emit('render', this.render)
            this.resetBody();
        },
        resetBody () {
            this.$nextTick(() => {
                Common.setFullScreen();
            })
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        }
    }
}
</script>
