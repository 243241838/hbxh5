<template>
    <div id="body">
        <div class="ui-scroll" v-show="render">
            <ul class="session" >
                <li>
                    <div class="head">
                        <span>保单信息</span>
                    </div>
                    <ul class="list">
                        <li class="item">
                            <span class="item_title">订单状态：</span>
                            <span class="item_content" v-text="payStatus" :class="{isOn:true, invalid:orderStatus == 3}"></span>
                        </li>
                        <li class="item" v-if="output.refundSts==1">
                            <span class="item_title">保单状态：</span>
                            <span class="item_content" :class="{invalid:orderStatus == 3}">退款申请中</span>
                        </li>
                        <li class="item" v-if="output.refundSts==2">
                            <span class="item_title">保单状态：</span>
                            <span class="item_content" :class="{invalid:orderStatus == 3}">退款成功</span>
                        </li>
                        <li class="item" v-if="output.refundSts==3">
                            <span class="item_title">保单状态：</span>
                            <span class="item_content" :class="{invalid:orderStatus == 3}">退款失败</span>
                        </li>
                        <li class="item">
                            <span class="item_title">订单号：</span>
                            <span class="item_content" v-text="output.tradeId" :class="{invalid:orderStatus == 3}"></span>
                        </li>
                        <li class="item">
                            <span class="item_title">起保时间：</span>
                            <span :class="{invalid:orderStatus == 3}" v-text="output.startTime" class="item_content"></span>
                        </li>
                        <li class="item">
                            <span class="item_title">终止时间：</span>
                            <span :class="{invalid:orderStatus == 3}" v-text="output.endTime" class="item_content"></span>
                        </li>
                    </ul>
                </li>
                <li>
                    <div class="head">
                        <span>投保人信息</span>
                    </div>
                    <ul class="list">
                        <li class="item">
                            <span class="item_title">姓名：</span>
                            <span class="item_content" v-text="output.applicant" :class="{invalid:orderStatus == 3}"></span>
                        </li>
                        <li class="item">
                            <span class="item_title">证件类型：</span>
                            <span class="item_content" v-text="idType" :class="{invalid:orderStatus == 3}"></span>
                        </li>
                        <li class="item">
                            <span class="item_title">证件号码：</span>
                            <span class="item_content" v-text="output.applicantIdNo" :class="{invalid:orderStatus == 3}"></span>
                        </li>
                        <li class="item">
                            <span class="item_title">手机号码：</span>
                            <span class="item_content" v-text="output.applicantMobile" :class="{invalid:orderStatus == 3}"></span>
                        </li>
                    </ul>
                </li>
                <li v-for="item in info.insuredPersonInfo">
                    <div class="head">
                        <span>被保人信息</span>
                    </div>
                    <ul class="list">
                        <template v-if="item.length == 1">
                            <li v-for="value in item">
                                <span class="item_content" v-text="value.content"></span>
                            </li>
                        </template>
                        <template v-else>
                            <li class="item" v-for="value in item">
                                <span class="item_title" v-text="value.name"></span>
                                <span class="item_content" v-text="value.content" :class="{invalid:orderStatus == 3}"></span>
                            </li>
                        </template>
                    </ul> 
                </li>
                <li>
                    <ul>
                        <li class="head">
                            <span>保障内容</span>
                        </li>
                        <li>
                            <div class="list ui-borderBottom">
                                <a href="javascript:;" class="ui-wh title-color" @click="goToProductDetail">
                                    <span class="chengren_icon"></span>
                                    <span class="chengren_title item_content" :class="{invalid:orderStatus == 3}" v-text="output.productName"></span>
                                    <i class="iconfont icon-xiayibu fr"></i>
                                </a>
                            </div>
                            <div class="title">
                                <span :class="{invalid:orderStatus == 3}">保险责任:</span>
                            </div>
                            <div class="table-box">
                                <div class="table">
                                    <div class="ui-row" v-for="(item,index) in info.insureContent" :class="{'ui-borderNone':index == 0,'addone':index==info.insureContent.length-1}">
                                        <div class="ui-col flex7" v-text="item.name"></div>
                                        <div class="ui-col flex3" v-text="item.content"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="title">
                                <div v-for="(item,index) in info.insureName" style="line-height:22px;">
                                    <span v-text="item.name">受益人:</span>
                                    <span v-text="item.content" :class="{'paddingBottom7':index==info.insureName.length-1}">法定受益人</span>
                                </div>
                            </div>
                            
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
        </div>
        <!--toast提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import request from 'js/interface/request';
import Data from '../../data/data.js';
import { Common } from 'js/common.js';
import loading from '../../components/loading.vue';
import toast from '../../components/toast.vue';

export default {
    components: {
        toast,
        loading
    },
    data () {
        return {
            // 1 待支付, (2 已支付,已退款,已完成), (3 已失效)
            orderStatus: 1, // 订单状态
            output: '', // 数据
            payStatus: '', // 支付状态
            idType: '', // 证件类型
            info: {
                insuredPersonInfo: [// 被保险人
                ],
                insureContent: [],
                insureType1: '',
                insureName: [// 受益人
                ],
                productPrompt: '',
                phone: ''
            },
            render: false,
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            loading: true
        }
    },
    created () {
        this.getData();
    },
    mounted () {
    },
    filters: {
        formatDate (value) {
            if (!value) {
                return '';
            }
            let index = 12;
            let flg = [':', ':', ' ', '-', '-'];
            for (let i = 0; i < 5; i++) {
                value = value.substring(0, index) + flg[i] + value.substring(index, value.length);
                index -= 2;
            }
            return value;
        },
        formatMoney (value) {
            if (!value) {
                return '';
            }
            return '￥' + (value / 100).toFixed(2);
        }
    },
    methods: {
        // 获取数据
        getData () {
            let obj = {
                userId: Common.getUserId(), // 用户id
                classType: '2',
                tradeId: Common.getQueryString('tradeId') // 订单号
            }
            // console.log(obj);
            request.getTradeDetail(obj, (response) => {
                // console.log(response)
                if (response.data.respCode === '000000') {
                    this.updatePage(response.data.output);
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                this.loading = false;
                Common.setFullScreen();
            }, (error) => {
                this.showtoast(error, true)
            })
        },
        // 获取数据后更新
        updatePage (output) {
            this.output = output;
            //console.log(output)
            // 保单信息
            let paymentStatus = Data.paymentStatus;
            let payStatus = '';
            for (let i = 0; i < paymentStatus.length; i++) {
                if (JSON.stringify(paymentStatus[i].type) === JSON.stringify(output.sts)) {
                    payStatus = paymentStatus[i].content;
                    break;
                }
            }
            switch (output.sts) {
            // 待支付
            case '10':
                this.orderStatus = 1;
                break;
            // 已支付,已退款,已完成
            case '20':
            case '50':
            case '35':
            case '60':
                this.orderStatus = 2;
                break;
            // 已失效
            case '-11':
                this.orderStatus = 3;
                break;
            default :
                break;
            }
            this.payStatus = payStatus;
            // 证件类型
            this.idType = Data.idTypeArr[parseInt(output.applicantType)]
            // 被保人信息
            // 受益人
            let relationArr = Data.relationArr;
            output.insuredList.map((item) => {
                // 被保人信息
                let relation = '';
                let isSelf = false;// 是否是本人
                for (var i = 0; i < relationArr.length; i++) {
                    // 本人
                    if (item.relation === 1) {
                        relation = relationArr[i].content;
                        isSelf = true;
                        break;
                    }
                    // 非本人
                    if (relationArr[i].type === JSON.stringify(item.relation)) {
                        relation = relationArr[i].content;
                        break;
                    }
                }
                let tempArr = '';
                if (isSelf) {
                    tempArr = [{content: relation}];
                } else {
                    tempArr = [
                        {name: '与投保人关系：', content: relation},
                        {name: '被保人：', content: item.insuredName},
                        {name: '证件类型：', content: Data.idTypeArr[parseInt(item.idType)]},
                        {name: '证件号码：', content: item.idNo}
                    ]
                }
                this.info.insuredPersonInfo.push(tempArr);
                // 受益人
                item.benList.map((item) => {
                    let obj = {
                        name: '受益人：',
                        content: item.benName
                    }
                    this.info.insureName.push(obj);
                })
            })
            // 意外险
            this.info.insureType1 = output.typeList[0].typeName;
            output.typeList[0].insureList.map((item) => {
                let obj = {
                    name: item.insureName,
                    content: item.insureAmount
                }
                this.info.insureContent.push(obj);
            });
            // 温馨提示
            this.info.productPrompt = '本产品由' + output.insurerName + '承保';
            // 联系电话
            this.info.phone = output.insurerTels;
            // 总价格
            this.$emit('sumMoney', output.sumPremium);
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
        goToProductDetail () {
            if (this.output.productId) {
                window.location.href = 'productDetail.html?productId=' + this.output.productId;
            } else {
                window.location.href = '';
            }
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        }
    }
}
</script>
