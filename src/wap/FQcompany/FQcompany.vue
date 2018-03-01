<template>  
    <div id="body" :class="{isshow:!isWeiXin}">
        <div class="list" v-show="render">
            <div class="item flexbox" v-for= "(item,index) in output.insurerList" :class="{no_border:index==output.insurerList.length-1}" @click="subfun(item)">
                <div class="left flex flexbox align-items">
                    <div>
                        <div class="box flexbox align-items justify-content">
                            <img :src="item.insurerLogo" alt="">
                        </div>
                    </div>
                    <div class="flex flexbox align-items" v-text="item.insurerName"></div>
                </div> 
                <div class="right flexbox align-items">
                    <i class="iconfont">&#xe61d;</i>
                </div>
            </div>
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toasts提示组件-->
        <toast :isshow='toast.isshow' @ontoastback='closetoast'>{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import {Common, valid, storage} from 'js/common'
import toast from '../../components/toast' // toast引用：
import loading from '../../components/loading';
import request from 'js/interface/request';
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        toast,
        loading,
        layer
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            time: {
                seconds: 0
            },
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            render: false, // 页面渲染
            loading: false,
            output: [],
            tradeId: '',
            benefitList: [], // 方案
            carDetail: {}, // 个人信息
            isWeiXin: ''

        }
    },
    created () {
        if (storage.get('FQcarDetail')) {
            this.carDetail = JSON.parse(storage.get('FQcarDetail'));
        }
        // console.log(this.carDetail)
        this.isWeiXin = valid.isWeiXin();
        // console.log(this.isWeiXin)
    },
    mounted () {
        this.getData();
        this.formatter(); // 转化方案的他提交后台格式
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
    },
    computed: {
    },
    methods: {
        initWeixinSDK () {
            let obj = {
                url: window.location.href
            }
            request.getWXJsAPISignature(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (window.wx) {
                        // 微信配置
                        weixinSDK.config(window.wx, output);
                        weixinSDK.ready(window.wx, () => {
                            // 判断当前客户端版本是否支持指定JS接口
                            weixinSDK.checkJsApi(window.wx);
                            // 分享
                            weixinSDK.initShare(window.wx, 1);
                        });
                    }
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // 获取方案
        formatter () {
            let benefitList = storage.get('FQcarTypeSelect');
            if (benefitList) {
                benefitList = JSON.parse(storage.get('FQcarTypeSelect'));
                 // console.log(benefitList)
                // console.log(this.carDetail)
                let syxList = benefitList.syxList;
                let fjxList = benefitList.fjxList;
                let jqxList = benefitList.jqxList;
                this.formatter1(syxList);
                this.formatter1(fjxList);
                this.formatter1(jqxList);
                // console.log(this.benefitList)
            }
        },
        // 格式化提交方案的格式
        formatter1 (arr) {
            for (let i = 0; i < arr.length; i++) {
                let obj = {
                    typeName: arr[i].itemType, // 保障利益分类名称
                    benefitName: arr[i].itemName, //保障利益项目名称
                    insureCount: '1', //投保份数
                    insuredAmount: arr[i].chooseAmount, // 保障额度
                    productPremium: '0', // 保费
                    settAmount: '', // 与供应商的结算价格
                    benefitDesc: '', // benefitDesc
                    franchiseFlag: arr[i].franchiseFlag, // 不计免赔标识
                    benefitCode: arr[i].itemCode // 保障条款的代码
                }
                this.benefitList.push(obj)
            }
        },
        getData () {
            let domainCode = storage.get('userInfo')?JSON.parse(storage.get('userInfo')).domainId:'';
            let data = {
                userId: storage.get('userId'),
                domainCode: domainCode,
                'insurerType': '21'
            }
            this.loading = true;
            request.getInsurersCar(data, (response) => {
                console.log(data)
                console.log(response.data)
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    this.output = response.data.output;
                }
                Common.setFullScreen()
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
            this.loading = false;
            this.render = true;
        },
        // 点击提交报价信息
        subfun (item) {
            let obj = {
                businessBenefit: this.benefitList, // 方案
                userId: storage.get('userId'),
                licenseNo: this.carDetail.licenseNo, //车牌号
                vinNo: this.carDetail.vinNo, // 车架号
                idNo: this.carDetail.idNo, // 身份证
                driverName: this.carDetail.driverName, // 车主姓名
                mobile: this.carDetail.mobile, // 手机
                syStartTime: this.carDetail.syStartTime1, //商业险时间
                jqStartTime: this.carDetail.jqStartTime1, // 交强险时间
                serialId: Common.getQueryString('serialId'), // 判断流水号
                insurerPriceRecord: [
                    {
                        insurerId: item.insurerId, //保险公司ID
                        insurerCode: item.insurerCode // 保险公司代码
                    }
                ]
            }
            console.log(obj)
            if (!this.loading) {
                this.loading = true;
                request.submitInsureBenefits(obj, (response) => {
                    console.log(response.data)
                    this.loading = false;
                    this.multiLogin(response);
                    if (response.data.respCode === '900001') {
                        this.alertShow(response.data.respMsg, 1)
                        return false;
                    }
                    if (response.data.respCode === '000000') {
                        let serialId = response.data.output.serialId;
                        storage.set('FQcompany', JSON.stringify(item));
                        window.location.href = 'FQcarOrderCheck.html?serialId=' + Common.getQueryString('serialId');
                    }
                }, () => {
                    this.loading = false;
                    this.showtoast('网络错误，请查看网络是否连接', true);
                })
            }
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        showLayer (msg, options) {
            // layer引用：3.显示弹框
            this.layer.type = options.type;
            this.layer.message = msg;
            this.layer.isshow = true;
            this.layer.shadeClose = options.shadeClose;
            this.layer.btns = options.btns;
            this.layer.yes = options.yes;
            this.layer.no = options.no;
        },
        alertShow (value, number) { // alert实例
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    if (number === 1) {
                        // 跳转询价详情列表
                        // userId queryIdNo身份证号 vinNo车架号 licenseNo车牌号
                        storage.set('FQlicenseNo', this.carDetail.licenseNo)
                        window.location.href = 'FQQuotationDetail.html?userId=' + storage.get('userId') + '&queryIdNo=' + this.carDetail.idNo + '&vinNo=' + this.carDetail.vinNo;
                        return false;
                    } else {
                        storage.set('prevPage', './FQcompany.html?serialId=' + Common.getQueryString('serialId'));
                        window.location.href = './FQLogin.html';
                        return false;
                    }
                }
            })
        },
        closeLayer (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        alertShow2 (value) {
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    storage.set('prevPage', './FQcompany.html?serialId=' + Common.getQueryString('serialId'));
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        multiLogin (response) {
            if (response.data.respCode === '100106') {
                this.loading = false;
                if (valid.isWeiXin()) {
                    weixinSDK.getAccessNone(window.location.href);
                } else {
                    this.alertShow2(response.data.respMsg)
                }
                return false;
            } else if (response.data.respCode !== '000000' && response.data.respCode !== '900001') {
                this.showtoast(response.data.respMsg, true);
            }
        }
    }
}
</script>
