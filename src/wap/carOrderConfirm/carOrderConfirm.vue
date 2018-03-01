<template>
    <div id="body" :class="{isWeiXin:isWeiXin}">
        <ul class="info-list">
            <li class="info-item confirm-address">
                <div class="add-location flexbox align-items" v-if="!isHas" @click="toAddress">
                    <input class="flex" type="text"  readOnly  placeholder="请添加保单邮寄地址">
                    <span class="right"><i class="iconfont">&#xe61d;</i></span>
                </div>
                <div class="confirm-address-detail" v-else @click="toAddress" :class="{succeed:succeed== '1'}">
                    <div class="address1" :class="{succeed:succeed == '1'}">
                        <span>{{address.expressName}}</span>
                        <span class="fr">{{address.expressMobile | ellipsisMobile}}</span>
                    </div>
                    <div class="address2 flexbox align-items" :class="{succeed:succeed == '1'}">
                        <div class="left">
                            <i class="iconfont" :class="{succeed:succeed == '1'}">&#xe624;</i>
                        </div>    
                        <div class="center flex">{{address.expressAddressDetail}}</div>
                        <div class="icon"><i class="iconfont">&#xe61d;</i></div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="item-title">
            车辆信息
        </div>
        <ul class="car-confirm">
            <li class="confirm-item" v-show="carInfo.licenseNo!=0">
                <span class="title gray">
                    车牌：
                </span>
                <span class="content">{{carInfo.licenseNo}}</span>
            </li>
            <li class="confirm-item">
                <span class="title gray">
                    车主：
                </span>
                <span class="content">{{carDetail.driveName}}</span>
            </li>
            <li class="confirm-item">
                <span class="title gray">
                    证件号码：
                </span>
                <span class="content">{{carDetail.idNo}}</span>
            </li>
            <li class="confirm-item">
                <span class="title gray">
                    联系电话：
                </span>
                <span class="content">{{carDetail.mobile}}</span>
            </li>
        </ul>
        <div class="item-title">
            保障详情
        </div>
        <ul class="car-confirm">
            <li class="adjust">
                <a href="javascript:;" @click="carUrl()">调整投保方案</a>
            </li>
            <li class="confirm-item">
                <span class="title">
                    产品详情：
                </span>
                <span class="content productName">{{insurerList.productName}}</span>
            </li>
            <li class="confirm-item">
                <span class="title">
                    投保城市：
                </span>
                <span class="content">{{carInfo.city}}</span>
            </li>
            <li class="confirm-item confirm-item1" v-if="benefitList.jqxList.length!=0">
                <p class="title1">
                    交强险：
                </p>
                <ul class="table">
                    <li class="table-item">
                        <span class="item2">保险项</span>
                        <span class="item2 last">保费</span>
                    </li>
                    <!--
                    <li class="table-item" v-for="item in benefitList.jqxList">
                        <span class="item2">{{item.itemName}}</span>
                        <span class="item2 last" v-show="item.chooseAmount==1">投保</span>
                        <span class="item2 last" v-show="item.chooseAmount==0">不投保</span>
                        <span class="item2 last" v-show="item.chooseAmount!=0&&item.chooseAmount!=1" v-text="item.chooseAmount"></span>
                    </li>
                    -->
                     <li class="table-item">
                        <span class="item2">交强险</span>
                        <span class="item2 last" v-text="totalPreium.jqPreium ?totalPreium.jqPreium : '/'"></span>
                    </li>
                    <li class="table-item last">
                        <span class="item2">代缴车船税</span>
                        <span class="item2 last" v-text="totalPreium.ccsTax ? totalPreium.ccsTax : '/'"></span>
                    </li>
                </ul>
            </li>
            <li class="confirm-item confirm-item1" v-if="benefitList.syxList.length!=0">
                <p class="title1">
                    商业险：
                </p>
                <ul class="table">
                    <li class="table-item">
                        <span class="item4 first">保险项</span>
                        <span class="item4">保额</span>
                        <span class="item4">保费</span>
                        <span class="item4 last">不计免赔</span>
                    </li>
                    <li class="table-item"   v-for="(item,index) in benefitList.syxList">
                        <span class="item4 item-name first">{{item.itemName}}</span>
                        <span class="item4" v-if="item.chooseAmount!=0&&item.chooseAmount!=1&&item.chooseAmount!=2">{{item.chooseAmount | Rounding}}</span>
                        <span class="item4" v-else v-text="item.chooseAmountName"></span>
                        <span class="item4" v-text="item.premium ? item.premium : '/'"></span>
                        <span class="item4 last" v-if="item.franchiseFlag==0 || item.franchiseFlag==1">是</span>
                        <span class="item4 last" v-if="item.franchiseFlag==-1">否</span>
                    </li>
                    <li class="table-item" v-show="totalPreium.totalFranchisePreium">
                         <span class="item4 item-name first">不计免赔费用</span>
                         <span class="item4">/</span>
                         <span class="item4" v-text="totalPreium.totalFranchisePreium"></span>
                         <span class="item4 last">/</span>
                    </li>
                </ul>
            </li>
            <li class="confirm-item confirm-item1" v-if="benefitList.fjxList.length!=0">
                <p class="title1">
                    附加险：
                </p>
                <ul class="table">
                    <li class="table-item">
                        <span class="item4 first">保险项</span>
                        <span class="item4">保额</span>
                        <span class="item4">保费</span>
                        <span class="item4 last">不计免赔</span>
                    </li>
                    <li class="table-item" v-for="(item,index) in benefitList.fjxList" :class="{'last':benefitList.fjxList.length - 1 == index}">
                        <span class="item4 item-name first">{{item.itemName}}</span>
                         <span class="item4" v-if="item.chooseAmount!=0&&item.chooseAmount!=1&&item.chooseAmount!=2">{{item.chooseAmount | Rounding}}</span>
                        <span class="item4" v-else v-text="item.chooseAmountName"></span>
                        <span class="item4" v-text="item.premium ? item.premium : '/'"></span>
                        <span class="item4 last" v-if="item.franchiseFlag==0 || item.franchiseFlag==1">是</span>
                        <span class="item4 last" v-if="item.franchiseFlag==-1">否</span>
                    </li>
                </ul>
            </li>
            <li class="confirm-item confirm-item1" v-if="benefitList.qtxList.length!=0">
                <p class="title1">
                    其他附加险：
                </p>
                <ul class="table">
                    <li class="table-item">
                        <span class="item4 first">保险项</span>
                        <span class="item4">保额</span>
                        <span class="item4">保费</span>
                        <span class="item4 last">不计免赔</span>
                    </li>
                    <li class="table-item" v-for="(item,index) in benefitList.qtxList" :class="{'last':benefitList.qtxList.length - 1 == index}">
                        <span class="item4 item-name first">{{item.itemName}}</span>
                        <span class="item4" v-if="item.chooseAmount!=0&&item.chooseAmount!=1&&item.chooseAmount!=2">{{item.chooseAmount | Rounding}}</span>
                        <span class="item4" v-else v-text="item.chooseAmountName"></span>
                        <span class="item4" v-text="item.premium ? item.premium : '/'"></span>
                        <span class="item4 last" v-if="item.franchiseFlag==0 || item.franchiseFlag==1">是</span>
                        <span class="item4 last" v-if="item.franchiseFlag==-1">否</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="info-tips">
            <img class="info-check" @click="checkFun" v-if="!check" src="../../assets/images/weigouxuan.png" alt="">
            <img class="info-check" @click="checkFun" v-else src="../../assets/images/gouxuan.png" alt="">
            我已阅读<!--<span class="green" @click="notice()">《投保须知》</span>--><span class="green" @click="clause()">《保险条款》</span>，并同意上述协议约定
            <p>温馨提示：本产品由<span v-text="insurerList.insurerName"></span>承保。</p>
            <p>联系电话：<a :href="insurerList_phone">{{insurerList.insurerTels}}</a></p>
        </div>
        <div class="confirm-footer">
            <span class="price">
                价格：
                <span class="orange">￥ {{totalPreium.totalPreium}}</span>
            </span>
            <span class="btn" @click="insure">
                立即核保
            </span>
        </div>
        <!--toasts提示组件-->
        <toast :isshow='toast.isshow' @ontoastback='closetoast'>{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import axios from 'axios'
import {Common, getheader, valid, storage} from 'js/common'
import request from 'js/interface/request'
import toast from '../../components/toast' // toast引用：
import loading from '../../components/loading';
export default {
    components: {
        toast,
        loading
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            loading: false, // 加载中
            serialId: '', //流水号
            check: false, //阅读协议的勾选
            isHas: false, // 是否有地址和是否显示
            oindex: '', // benefitList 的index
            productId: '', // 产品id
            totalPreium: '', // 保费
            carInfo: '', // 获取里边的车险列表的码
            insurerList: '', // 保险公司信息及产品名字
            insurerList_phone: '', //打电话的格式tel: +
            carDetail: '', // 车辆信息
            benefitList: '', // 类型
            address: '', // 详细地址
            'classType': 1,  // 1:车险；2：个险
            isWeiXin: '',
            succeed: '' //是否成功核保，核保页面返回时用
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        this.ins();
    },
    mounted () {
    },
    watch: {
    },
    methods: {
        //初始化
        ins () {
             //核保页面返回时用
            this.succeed = storage.get('carOrderCheck');
            //获取第index个套餐
            this.oindex = Common.getQueryString('id');
            this.serialId = Common.getQueryString('serialId'); // 流水账号
            //获取车辆信息
            let carDetail = storage.get('carDetail');
            if (carDetail) {
                this.carDetail = JSON.parse(carDetail); // 补充车辆信息时存储
            }
            //获取询价时的价钱
            let totalPreium = storage.get('totalPreium');// 保费
            if (totalPreium) {
                this.totalPreium = JSON.parse(totalPreium);
                this.benefitList = this.totalPreium.benefitList;
                console.log(this.totalPreium)
            }
            //保险公司信息及产品名字
            let insuranceCompany = storage.get('insuranceCompany');
            if (insuranceCompany) {
                this.insurerList = JSON.parse(insuranceCompany)
                //打电话格式处理去'-'
                if (this.insurerList.insurerTels) {
                    this.insurerList_phone = 'tel:' + this.insurerList.insurerTels.replace(/-/g, '');
                }
                this.productId = this.insurerList.productId// 产品id
            }
            // 详细地址 个人中心添加地址时村存储
            let address = storage.get('location');
            if (address) {
                this.address = JSON.parse(address);
                this.isHas = true;
            }
           // 获取carInfo (里边有车险列表的类型)
            let carInfo = storage.get('carInfo'); // 投保城市 在投保地时存储
            if (carInfo) {
                this.carInfo = JSON.parse(carInfo)
            }
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        checkFun () {
            this.check = !this.check;
        },
        toAddress () {
            if (this.succeed !== '1') {
                window.location.href = 'addLocation.html';
            }
        },
        insure () { // 核保
            if (!this.isHas) {
                this.showtoast('还未添加投保地址', true);
            } else if (!this.check) {
                this.showtoast('还未阅读协议约定', true);
            } else if (this.succeed === '1') {
                window.location.href = 'carOrderCheck.html?serialId=' + this.serialId;
            } else {
                var data1 = {
                    quotesId: this.totalPreium.quotesId, // 报价编号
                    'userId': storage.get('userId'), // 用户编号
                    'serialId': this.serialId, // 报价流水号
                    'applicantName': this.carDetail.driveName, // 投保人姓名
                    'applicantIdNo': this.carDetail.idNo, // 投保人证件号码
                    'applicantMobile': this.carDetail.mobile, // 投保人手机
                    'insuredName': this.carDetail.driveName, // 被保险人姓名
                    'insuredIdNo': this.carDetail.idNo, // 被保险人证件号码
                    'insuredMobile': this.carDetail.mobile, // 被保险人手机
                    'expressName': this.address.expressName, // 收件人姓名
                    'expressMobile': this.address.expressMobile, // 收件人手机
                    'expressAddress': this.address.expressAddress, // 收件人地址
                    'expressAddressDetail': this.address.expressAddressDetail, // 收件人全地址
                    'expressProvince': this.address.expressProvince, // 快递省份代码
                    'expressCity': this.address.expressCity, // 快递城市代码
                    'expressDistrict': this.address.expressDistrict, // 快递区县代码
                    totalPreium: this.totalPreium.totalPreium, // 保费
                    licenseNo: this.carDetail.licenseNo, // 车牌号
                    carExtras: this.totalPreium.carExtras // 上个页面返回
                }
                console.log(data1)
                this.loading = true;
                request.commitCarIns(data1, (response) => {
                    // console.log(response.data)
                    if (response.data.respCode === '000000') {
                        let obj = {
                            insurerName: this.insurerList.insurerName, // 保险公司
                            phone: this.insurerList.insurerTels, // 保险公司电话
                            totalPreium: this.totalPreium.totalPreium, // 询价的钱
                            licenseNo: this.carDetail.licenseNo // 车牌号
                        }
                        let output = response.data;
                        output.output.obj = obj;
                        storage.set('carOrderConfirm', JSON.stringify(output))
                        window.location.href = 'carOrderCheck.html?serialId=' + this.serialId;
                    } else {
                        this.loading = false;
                        this.showtoast(response.data.respMsg, true);
                    }
                }, (error) => {
                    this.loading = false;
                    this.showtoast(error, true);
                });
            }
        },
        notice () { // 投保须知跳转
            window.location.href = 'insureNotice.html?productId=' + this.productId;
        },
        clause () { // 投保条款
            // window.location.href = 'insureNotice.html?id=' + this.productId;
        },
        carUrl () { // 跳转投保方案
            window.location.href = 'carAdjust.html?index=' + this.oindex + '&serialId=' + this.serialId;
        }
    },
    filters: {
        ellipsisMobile (value) {
            if (value) {
                return value.substr(0, 3) + '****' + value.substr(7, 4);
            } else {
                return value;
            }
        },
        overWan (value) {
            // console.log(typeof value)
            if (value < 10000) {
                return value;
            } else {
                return value / 10000 + '万';
            }
        },
        Rounding (value) {
            if (value) {
                return parseInt(value)
            } else {
                return '/'
            }
        }
    }
}
</script>
