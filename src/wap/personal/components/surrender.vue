<template>
    <div id="body" class="g_homePolicy_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon>
        <div class="line_height" :class="{isWeiXin:isWeiXin}"></div>
        <div class="surrender_box">
            <div class="shy_flex">
                <a href="tel:4001101866">
                    <div class="shy_icon icon">
                        <i class="iconfont">&#xe695;</i>
                    </div>
                    <div class="item">
                        客服电话
                    </div>
                </a>
            </div>
            <div class="shy_flex1" @click="answers">
                <div class="shy_icon">
                    <i class="iconfont">&#xe696;</i>
                </div>
                <div class="item">
                    疑问解答
                </div>
            </div>
            <div class="shy_flex2" @click="progressQuery">
                <div class="shy_icon">
                    <i class="iconfont">&#xe697;</i>
                </div>
                <div class="item">
                    进度查询
                </div>
            </div>
        </div>
        <div class="shy_baodan" :class="{isWeiXin:isWeiXin}" v-for="(item,index) in output" @click="detail(item.tradeId)">
            <div class="shy_baodanName">{{item.productName}}</div>
            <div class="shy_logo"><img :src="item.insurerLogo" alt="" class="logoPic"></div>
            <div class="shy_message">
                <div class="message_item">订单号：{{item.tradeId}}</div>
                <div class="message_item">被保人：{{item.insuredName}}</div>
                <div class="message_item">投保人：{{item.policyholderName}}</div>
                <div class="message_item">保险期间：{{item.startTime}}至{{item.endTime}}</div>
            </div>
            <div class="line-height"></div>
            <div class="shy_amount">
                保单金额：{{item.sumPremium}}
            </div>
            <div class="baodan_status" v-if="item.tradeSts===35">已完成</div>
            <div class="baodan_apply" @click="apply(item.tradeId)">申请退保</div>
        </div>
        <nodata v-show="output.length===0" :infomessage="infomessage" :buttonmessage="buttonmessage" :url="url"></nodata>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer"></layer>
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
import layer from 'components/layer';
import nodata from '../../../components/nodata';
export default {
    components: {
        toast,
        loading,
        headerCommon,
        layer,
        nodata
    },
    data() {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            layer: { // layer引用：2.属性
                title: '申请已受理',
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function() { }, // 确认回调
                no: function() { } // 取消回调
            },
            output: '', // 数据
            loading: false,
            head_border: 1,
            pageIndex: 1,
            pageSize: 10,
            first_list: true, // 第一次
            policy_url: '',
            classType: 2,
            isWeiXin: false,
            title: '申请退保',
            listDetail: {},   //退保申请列表
            infomessage: '您暂时没有可申请退保的保单',
            buttonmessage: '立即享受保障',
            url: 'index.html'
        }
    },
    created() {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '申请退保';
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
                userId: Common.getUserId(), // 用户的id
                pageIndex: this.pageIndex // pageIndex
            }
            request.getAllowCancelInsuredList(data, (response) => {
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
                userId: Common.getUserId(), // 用户id
                pageIndex: this.pageIndex // pageIndex
            }
            console.log(data)
            let p = myPromise.pagination(data, 'getAllowCancelInsuredList', this.output, 'cancelListRecords', window.dropload);
            p.then((obj) => {
                this.output = obj.productList;
                console.log(this.output);
                this.loading = false;
                this.$nextTick(() => {
                    let by = document.getElementById('body')
                    Common.setFullScreen(by);
                    this.loading = false;
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
        //点击进入疑问解答页面
        answers() {
            this.$router.push({ path: '/helpCenter', query: { table: 3 } });
        },
        //点击前往订单详情页
        detail(val) {
            window.location.href = './orderDetailGe.html?tradeId=' + val;
        },
        //点击进入进度查询
        progressQuery() {
            window.location.href = './personal.html#/progressQuery';
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
        //点击申请退保
        apply(val) {
            this.refund(val);
        },
        showLayer(msg, options) {
            // layer引用：3.显示弹框
            this.layer.type = options.type;
            this.layer.message = msg;
            this.layer.isshow = true;
            this.layer.shadeClose = options.shadeClose;
            this.layer.btns = options.btns;
            this.layer.yes = options.yes;
            this.layer.no = options.no;
        },
        //拨打电话
        alertShow(value) { // alert实例
            this.showLayer(value, {
                type: 'alert', // 必填1
                yes: () => { // 选填
                    window.location.href = './personal.html#/progressQuery';
                    return false;
                }
            })
        },
        closeLayer(type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        //申请退保
        refund(val) {
            var data = {
                userId: Common.getUserId(), // 用户id
                tradeId: val //订单号
            }
            request.cancelOrder(data, (response) => {
                if (response.data.respCode === '000000') {
                    let message = '必填如审核通过将在1-2个工作日内打款请耐心等待！';
                    this.alertShow(message);
                } else {
                    this.showtoast(response.data.respMsg, true)
                }
            }, (error) => {
                this.showtoast(error, true);
            })
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
    }
}
</script>
