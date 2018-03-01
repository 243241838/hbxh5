<template>
    <div id="body">
        <div class="item-title">
            车辆信息
           <span class="fr red" @click="showExample">在哪看车辆信息？</span>
        </div>
        <div class="gray-bg gray-bg2" v-if="isExamle">
            <div class="example">
                <p class="big">行驶证信息实例</p>
                <p>请对照红框选择区域进行填写</p>
                <img src="./images/example.png" alt=""><br>
                <div class="ui-btn-group" style="padding: 20px 0;" v-show="camera">
                    <a class="ui-btn"><label for="file1">试试拍照获取</label></a>
                </div>
                <i class="iconfont close" @click="hideExample">&#xe62a;</i>
            </div>
        </div>
        <div class="gray-bg" v-show="isTakeShow">    
            <div class="example">
                <p class="big">拍摄获取行驶证相关信息</p>
                <img id="imgSrc" src="./images/example1.png" alt="">
                <p class="">调整拍摄角度，避免光影响</p>
                <p>确保图像清晰，可以提高识别正确率</p>
                <div class="ui-btn-group" style="padding: 20px 0;">
                    <a class="ui-btn">拍摄</a>
                    <input class="file" id="file1" type="file" accept="image/*" capture="camera" @change="addListenerUP($event)">
                </div>
                <i class="iconfont close" @click="cameraHide">&#xe62a;</i>
            </div>
        </div>
        <div class="gray-bg gray-bg1" v-show="carstart" >
            <div class="start_img" :class="{isWeiXin:!isWeiXin}">
                <img class="start" src="./images/start.png" alt="" >
                <div class="start1"  @click="start_img()"></div>
            </div>
        </div> 
        <ul class="car-insure">
            <li class="cinsure-item flexbox align-items">
                <label for="" class="title">品牌型号</label>
                <div class="content flex">
                    <input type="text" placeholder="请输入车辆型号" v-model="modelType" @blur="setValue(modelType, 'modelType')" @keyup="Case(modelType, 'modelType')" maxlength="13">
                    <span class="camera" @click="cameraShow" v-show="camera">
                        <i class="iconfont">&#xe626;</i>
                    </span>
                </div>
            </li>
            <li class="cinsure-item flexbox">
                <label for="" class="title">车辆识别代码</label>
                <div class="content flex">
                    <input type="text" placeholder="请输入17位车辆识别代码" v-model="vinNo" @blur="setValue(vinNo, 'vinNo')" @input="Case(vinNo, 'vinNo')" maxlength="17" >
                </div>
            </li>
            <li class="cinsure-item flexbox">
                <label for="" class="title">发动机号</label>
                <div class="content flex">
                    <input type="text" placeholder="请输入发动机号" v-model="engineNo" @blur="setValue(engineNo, 'engineNo')" @input="Case(engineNo, 'engineNo')" maxlength="17">
                </div>
            </li>
            <li class="cinsure-item flexbox">
                <label for="" class="title">注册时间</label>
                <div class="content content-tip flex">
                    <datepicker :disabled="disabled"  placeholder="请选择" language="zh" format="yyyy-MM-dd" v-model="firstRegDate" @change="setValue(firstRegDate,'firstRegDate')"></datepicker>
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">核载人数</label>
                <div class="content">
                    <input type="text" maxlength="2" placeholder="请输入" v-model="seats" @input="inputSeats" @blur="setValue(seats,'seats')">
                </div>
            </li>
      <!--      <li class="cinsure-item">
                <label for="" class="title">交强险起保时间</label>
                <div class="content content-tip">
                    <datepicker :disabled="disabled" placeholder="请选择" language="zh" format="yyyy-MM-dd" v-model="jqStartTime"></datepicker>
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">商业险起保时间</label>
                <div class="content content-tip">
                    <datepicker :disabled="disabled" placeholder="请选择" language="zh" format="yyyy-MM-dd" v-model="syStartTime" @blur="setValue(syStartTime,'syStartTime')"></datepicker>
                </div>
            </li>
      -->      
            <li class="cinsure-item">
                <span class="green" @click="chooseSecond">
                    <i class="iconfont fl" v-if="!isSecond">&#xe6ad;</i>
                    <i class="iconfont fl" v-else>&#xe628;</i>
                    <span class="fl" style="margin-left:0.09rem;font-size:0.28rem;">过户车辆首次投保</span>
                </span>
            </li>
            <li class="cinsure-item" v-if="isSecond">
                <label for="" class="title">过户时间</label>
                <div class="content-tip">
                    <datepicker :disabled="disabled" placeholder="请选择" language="zh" format="yyyy-MM-dd" v-model="transferDate"></datepicker>
                </div>
            </li>
        </ul>
        <div class="item-title">
            车主信息
            <!--<span class="fr green" v-if="isCompany" @click="companyFun">个人车辆</span>
            <span class="fr green" v-if="isPersonal" @click="personalFun">企业车辆</span>-->
          <!--  <span class="fr green" v-if="isPersonal">个人车辆</span> -->
        </div>
        <ul class="car-insure" v-if="isPersonal">
            <li class="cinsure-item flexbox">
                <label for="" class="title">车主姓名</label>
                <div class="content flex">
                    <input type="text" maxlength="8" placeholder="请输入车主姓名" v-model="driverName" @blur="setValue(driverName,'driverName')">
                </div>
            </li>
            <li class="cinsure-item flexbox no_border">
                <label for="" class="title">身份证号</label>
                <div class="content flex">
                    <input type="text" placeholder="请输入身份证号" v-model="idNo" @blur="setValue(idNo,'idNo')">
                </div>
            </li>
            <li class="bottom"></li>
            <li class="cinsure-item flexbox">
                <label for="" class="title userInfo_phone">联系电话</label>
                <div class="content flex">
                    <input v-show="isInput" type="text" placeholder="请输入电话号码" v-model="mobile" maxlength="11" @blur="setValue(mobile,'mobile')" style="display:none;">
                    <div v-show="!isInput" v-text="mobile" class="userInfo_phone"></div>
                </div>
            </li>
        </ul>
        <ul class="car-insure" v-if="isCompany">
            <li class="cinsure-item">
                <label for="" class="title">企业名称</label>
                <div class="content">
                    <input type="text" placeholder="请输入企业名称" v-model="companyName" @blur="setValue(companyName,'companyName')">
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">组织机构代码证</label>
                <div class="content">
                    <input type="text" placeholder="请输入组织机构代码证" v-model="companyIdno" @blur="setValue(companyIdno,'companyIdno')">
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">联系电话</label>
                <div class="content">
                    <input type="text" placeholder="请输入电话号码" maxlength="11" v-model="companyTel" @blur="setValue(companyTel,'companyTel')">
                </div>
            </li>
        </ul>
        <div class="ui-btn-group">
            <a class="ui-btn" @click="submitFun">提交</a>
        </div>
        <layer1 :layer-options="layer1" v-on:onlayerback="closeLayer1" ></layer1>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import axios from 'axios'
import {Common, valid, storage} from 'js/common'
import md5 from 'md5'
import request from 'js/interface/request'
import Datepicker from 'vuejs-datepicker'
import toast from '../../components/toast' // toast引用：
import loading from '../../components/loading';
import layer1 from '../../components/layer1' // layer引用
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        Datepicker,
        toast,
        loading,
        layer1,
        layer
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            disabled: {
                // to: new Date(this.GetDateStr(-1)),
                from: new Date()
            },
            disabled_to: '',
            disabled_from: '',
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            layer1: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            loading: false, // 加载中
            isExamle: false, // 在哪看车辆信息
            isTakeShow: false, // 拍照示例
            isCompany: false, // 是企业车辆
            isPersonal: true, // 是个人车辆
            isSecond: false, // 是否过户车
            city: '', // 城市code
            licenseNo: '', // 车牌号
            newCarFlag: '', // 新车标识
            serialId: '', // 报价流水号
            userId: '', // 用户编号
            modelType: '', // 车辆型号
            transferFlag: 0, // 是否过户车
            transferDate: '', // 过户时间
            vinNo: '', // 车辆识别代码
            engineNo: '', // 发动机代码
            firstRegDate: '', // 注册时间
            syStartTime: '', // 商业险起保时间
            jqStartTime: '', // 交强险起保时间
            firstRegDate1: '', // 注册时间1
            transferDate1: '', // 过户时间1
            syStartTime1: '', // 商业险起保时间1
            jqStartTime1: '', // 交强险起保时间1
            seats: '', // 荷载人数
            driverName: '', // 个人车主姓名
            idNo: '', // 个人证件号
            mobile: '', // 个人电话号码
            productType: '', // 车险type
            carDetail: {
                'modelType': '',
                'vinNo': '',
                'engineNo': '',
                'firstRegDate': '',
                'seats': '',
                'syStartTime': '',
                'jqStartTime': '',
                'transferFlag': 0,
                'transferDate': '',
                'driverName': '',
                'idNo': '',
                'mobile': '',
                'productType': '',
                carDetailInfo: ''
            },
            isInput: false,
            carstart: false, // 开始引导
            isWeiXin: false,
            camera: false // 相机显示
        }
    },
    computed: {
    },
    created () {
        this.first_start(); // 判断是否为第一次引导
        // this.carstart = true;
        this.isWeiXin = valid.isWeiXin();
        // this.confirmFun1(); // 有报价时显示cofim弹框
    },
    mounted () {
        this.insCarInfo(); // 初始化上一页数据
        this.ins(); // 返回记住数据（个人信息）
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
    },
    watch: {
    },
    methods: {
        //初始化上一页数据
        insCarInfo () {
            let carInfo = storage.get('FQcarInfo');
            if (carInfo) {
                carInfo = JSON.parse(carInfo);
                this.licenseNo = carInfo.licenseNo;
                this.city = carInfo.areaCode;
                this.newCarFlag = carInfo.newCarFlag;
            }
            let userInfo = storage.get('userInfo')
            if (userInfo) {
                userInfo = JSON.parse(userInfo);
                if (userInfo.mobile) {
                    this.mobile = userInfo.mobile;
                } else {
                    this.isInput = true;
                }
            }
            this.userId = Common.getUserId('userId');
        },
        // 判断是否位第一次引导
        first_start () {
            if (!storage.get('FQcarDetail')) {
                this.camera = true; // 相机
            } else {
                this.carstart = false; // 新手引导
                return false;
            }
            //是否用过相机
            if (storage.get('FQfirstimg')) {
                this.carstart = false;
            } else {
                this.carstart = true;
            }
        },
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
        //转换大小写
        Case (text, name) {
            this[name] = text.toUpperCase();
        },
        formatDate (value) { // 日期格式过滤
            console.log(value)
            if (value.length !== 8) {
                console.log('日期格式失败');
                return '错误日期';
            }
            let data = value.substring(0, 4);
            let data1 = value.substring(4, 6);
            // 1 - 12
            if (parseInt(data1) <= 0 || parseInt(data1) >= 13) {
                return false;
            }
            let data2 = value.substring(6, 8);
            if (parseInt(data2) <= 0 || parseInt(data2) >= 32) {
                return false;
            }
            data = data + '/' + data1 + '/' + data2;
            return data;
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        // 初始化客户资料
        ins () {
            var carDetail = JSON.parse(storage.get('FQcarDetail'));
            console.log(carDetail)
            if (carDetail) {
                this.carDetail = carDetail;
                this.modelType = carDetail.modelType; // 车辆品牌
                this.vinNo = carDetail.vinNo; // 车辆识别代码
                this.engineNo = carDetail.engineNo; // 发动机代码
                this.seats = carDetail.seats?carDetail.seats:''; // 荷载人数
                this.firstRegDate = carDetail.firstRegDate?new Date(carDetail.firstRegDate):''; // 注册时间
                this.transferFlag = carDetail.transferFlag?carDetail.transferFlag:this.transferFlag; // 过户状态
                this.transferDate = carDetail.transferDate?new Date(carDetail.transferDate):''; // 过户时间
                this.driverName = carDetail.driverName; // 车主姓名
                this.idNo = carDetail.idNo?carDetail.idNo:''; // 身份证号
                // this.mobile = carDetail.mobile; // 手机号牌
                if (this.transferFlag === 1) {
                    this.isSecond = true;
                } else {
                    this.isSecond = false;
                }
                // console.log(this.isSecond)
            }
        },
        // input事件
        setValue (val, name) {
            let value = Common.Trim(val); // 去前后空格
            this[name] = value;
            this.carDetail[name] = value;
            // storage.set('FQcarDetail', JSON.stringify(this.carDetail));
        },
        inputSeats () {
            this.seats = this.seats.replace(/\D/g, '');
        },
        showExample () {
            this.isExamle = true;
        },
        hideExample () {
            this.isExamle = false;
        },
        cameraShow () {
            this.isTakeShow = true;
        },
        cameraHide () {
            this.isTakeShow = false;
        },
        personalFun () {
            this.isCompany = true;
            this.isPersonal = false;
        },
        companyFun () {
            this.isCompany = false;
            this.isPersonal = true;
        },
        //点击过户
        chooseSecond () {
            this.isSecond = !this.isSecond;
            if (this.isSecond) {
                this.transferFlag = 1;
                this.carDetail.transferFlag = 1;
            } else {
                this.transferFlag = 0;
                this.carDetail.transferFlag = 0;
            }
            // storage.set('FQcarDetail', JSON.stringify(this.carDetail));
        },
        submitFun () {  // 提交
            if (!this.modelType) {
                this.showtoast('请检查品牌型号', true);
                return false;
            } else if (!valid.CarBrand(this.modelType)) {
                this.showtoast('车辆品牌允许输入字母、数字、中文', true);
                return false;
            } else if (this.vinNo.length !== 17) {
                this.showtoast('车辆识别代码长度为17位', true);
                return false;
            } else if (!valid.CarNumber(this.vinNo)) {
                this.showtoast('车辆识别代码只允许输入大写字母和数字', true);
                return false;
            } else if (!this.engineNo) {
                this.showtoast('请检查发动机号', true);
                return false;
            } else if (!valid.CarNumber(this.engineNo)) {
                this.showtoast('发动机号只允许输入大写字母和数字', true);
            } else if (!this.firstRegDate) {
                this.showtoast('请检查注册时间', true);
                return false;
            } else if (!this.seats) {
                this.showtoast('请检查荷载人数', true);
                return false;
            } else if (!this.transferDate && this.isSecond) {
                this.showtoast('请检查过户时间', true);
                return false;
            } else if (!this.driverName) {
                this.showtoast('请检查车主姓名', true);
                return false;
            } else if (!valid.userName(this.driverName)) {
                this.showtoast('车主姓名为2-8位中文', true);
                return false;
            } else if (!valid.ID(this.idNo)) {
                this.showtoast('请检查车主身份证号', true);
                return false;
            } else if (!valid.phone(this.mobile)) {
                this.showtoast('请检查车主联系电话', true);
                return false;
            } else {
                this.interaction(); // 交互
            }
        },
        //提交以后交互
        interaction () {
            var firstRegDate = Common.formatNewDate(this.firstRegDate);
            console.log(firstRegDate)
            this.carDetail.firstRegDate = firstRegDate;
            this.loading = true;
            var transferDate = '';
            if (this.isSecond) {
                transferDate = Common.formatNewDate(this.transferDate);
                this.carDetail.transferDate = transferDate;
            }
            this.carDetail.licenseNo = this.licenseNo;
            this.carDetail.productType = this.productType;
            var data = {
                userId: this.userId, // 用户Id
                city: this.city, //城市代码
                licenseNo: this.licenseNo, // 车牌号
                'modelType': this.modelType, // 品牌型号
                'vinNo': this.vinNo, // 车辆识别代码
                'engineNo': this.engineNo, // 发动机编号
                'firstRegDate': firstRegDate, // 车辆初登日期
                'seats': this.seats, // 荷载人数
                // 'syStartDate': '', // 商业险起保时间
                // 'jqStartDate': '', // 交强险起保时间
                'transferFlag': this.transferFlag, // 是否过户车
                'transferDate': transferDate, // 过户日期
                'driverName': this.driverName, // 车主姓名
                'idNo': this.idNo, // 身份证号码
                'mobile': this.mobile, // 车主手机
                'newCarFlag': this.newCarFlag, // 新车标识
                carDetailInfo: this.carDetail.carDetailInfo?this.carDetail.carDetailInfo:'' // 车辆补充信息
            }
            var data1 = {
                userId: this.userId, // 用户Id
                city: this.city, //城市代码
                licenseNo: this.licenseNo, // 车牌号
                'modelType': this.modelType, // 品牌型号
                'vinNo': this.vinNo, // 车辆识别代码
                'engineNo': this.engineNo, // 发动机编号
                // 本页面用的日期默认显示
                'firstRegDate': Common.formatNewDate1(this.firstRegDate), // 车辆初登日期
                'seats': this.seats, // 荷载人数
                // 'syStartTime': '', // 商业险起保时间
                // 'jqStartTime': '', // 交强险起保时间
                'transferFlag': this.transferFlag, // 是否过户车
                'transferDate': !transferDate ? '' : Common.formatNewDate1(this.transferDate), // 过户日期
                'driverName': this.driverName, // 车主姓名
                // 在选择险企的时候用
                'firstRegDate1': firstRegDate, // 车辆初登日期
                // 'syStartTime1': '', // 商业险起保时间1
                // 'jqStartTime1': '', // 交强险起保时间1
                'transferDate1': transferDate, // 过户日期
                'idNo': this.idNo, // 身份证号码
                'mobile': this.mobile, // 车主手机
                'newCarFlag': this.newCarFlag, // 新车标识
                carDetailInfo: this.carDetail.carDetailInfo?this.carDetail.carDetailInfo:'' // 车辆补充信息
            }
            console.log(data1)
            storage.set('FQcarDetail', JSON.stringify(data1)); // 存入storage
            request.submitPriceInfo(data, (response) => {
                this.loading = false;
                console.log(response.data)
                // 账户已经在其他设备上登录
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    this.serialId = output.serialId;
                    console.log(output);
                    if (this.licenseNo === 0) {
                            //如果有订单跳转至订单详情
                        if (output.getTradeListRecordList[0].tradeId !=='') {
                            let tradeId = output.getTradeListRecordList[0].tradeId
                            window.location.href = 'FQOrderDetail.html?tradeId=' + tradeId;
                            return false;
                        }
                        // 如果有报价时弹框 0：无;1:有
                        if (output.isPrice === '1') {
                            this.confirmFun1(); // 有报价时显示cofim弹框
                            return false;
                        }
                        if (output.isPrice === '0') {
                            window.location.href = 'FQcarAdjust.html?serialId=' + this.serialId;
                            return false;
                        }
                        window.location.href = 'FQcarAdjust.html?serialId=' + this.serialId;
                        return false;
                    } else {
                        window.location.href = 'FQcarAdjust.html?serialId=' + this.serialId;
                        return false;
                    }
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        multiLogin (response) {
            if (response.data.respCode === '100106') {
                this.loading = false;
                if (valid.isWeiXin()) {
                    weixinSDK.getAccessNone(window.location.href);
                } else {
                    this.alertShow(response.data.respMsg)
                }
                return false;
            } else if (response.data.respCode !== '000000') {
                this.loading = false;
                this.showtoast(response.data.respMsg, true);
            }
        },
        // 点击重新报价去调整方案
        Re_Quote () {
            window.location.href = 'FQcarAdjust.html?serialId=' + this.serialId;
            return false;
        },
        // 去报价列表
        mony_lsit() {
            let FQcarDetail = storage.get('FQcarDetail'); // 存入storage
            if (FQcarDetail) {
                FQcarDetail = JSON.parse(FQcarDetail);
                storage.set('FQlicenseNo', FQcarDetail.licenseNo);
                window.location.href = 'FQQuotationDetail.html?userId=' + storage.get('userId') + '&queryIdNo=' + FQcarDetail.idNo + '&vinNo=' + FQcarDetail.vinNo;
            }
        },
        // 开始引导
        start_img () {
            this.carstart = false;
            this.isTakeShow = true;
            storage.set('FQfirstimg', 'true'); // 存储第一次
        },
        // 图片选择
        addListenerUP (e) {
            this.loading = true;
            this.isTakeShow = false;
            this.isExamle = false;
            let file = e.target.files[0];
            let maxSize = 1000 * 1024;// 1MB
            let isCompress = true;// 默认压缩
            if (file.size <= maxSize) {
                isCompress = false;
            }
            let reader = new window.FileReader();
            let that = this;
            reader.onload = function (e) {
                that.compress(this.result, isCompress);
            }
            reader.readAsDataURL(file);
        },
        // 压缩
        compress (res, isCompress) {
            if (!isCompress) {
                // 不压缩
                // document.getElementById('imgSrc').src = res;
                this.scanCredentialImgInfo(res);
                return;
            } else {
                // 压缩
                let img = new window.Image();
                let maxW = 600;
                img.src = res;
                img.onload = () => {
                    let cvs = document.createElement('canvas');
                    let ctx = cvs.getContext('2d');
                    if (img.width > maxW) {
                        img.height *= maxW / img.width;
                        img.width = maxW;
                    }
                    cvs.width = img.width;
                    cvs.height = img.height;
                    ctx.clearRect(0, 0, cvs.width, cvs.height);
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    var dataUrl = cvs.toDataURL('image/jpg', 1);
                    // document.getElementById('imgSrc').src = dataUrl;
                    this.scanCredentialImgInfo(dataUrl); // 上传图片
                };
            }
        },
        // 上传图片
        scanCredentialImgInfo (base64Code) {
            if (!Common.isLogin()) {
                window.location.href = 'FQLogin.html';
                return false;
            }
            let obj = {
                credentialType: '1',
                credentialImgBase64: base64Code,
                userId: Common.getUserId()
            }
            // console.log(base64Code.replace(/\+/g, '%2B'))
            // console.log(base64Code.replace('+', '%2B'))
            request.scanCredentialImgInfo(obj, (response) => {
                this.multiLogin(response);
                console.log(response)
                if (response.data.respCode === '000000') {
                    console.log(response)
                    let output = response.data.output.data.item;
                    if (output) {
                        //注册时间
                        if (valid.time(output.registerDate)) {
                            let date = this.formatDate(output.registerDate)
                            if (date) {
                                this.firstRegDate = new Date(date)
                            }
                        } else {
                            this.firstRegDate = '';
                        }
                        this.driverName = output.name; // 车主
                        this.modelType = output.model; //车辆型号
                        this.vinNo = output.vin; // 车辆识别代码
                        this.engineNo = output.enginePN; // 发动机号
                        this.showtoast('请核对识别内容，确保车辆信息正确', true);
                    }
                }
                this.loading = false;
            }, () => {
                this.loading = false;
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // 点击确定弹窗
        confirmFun1 () {
            this.confirmShow1('此车已有报价结果');
        },
        confirmShow1 (val) { // confirm实例
            let that = this;
            this.showLayer1(val, {
                type: 'confirm',
                btns: ['重新报价', '去看看'],
                yes: function () {
                    that.mony_lsit()
                },
                no: function () {
                    that.Re_Quote();
                }
            })
        },
        showLayer1 (msg, options) {
            // layer引用：3.显示弹框
            this.layer1.type = options.type;
            this.layer1.message = msg;
            this.layer1.isshow = true;
            this.layer1.shadeClose = options.shadeClose;
            this.layer1.btns = options.btns;
            this.layer1.yes = options.yes;
            this.layer1.no = options.no;
        },
        closeLayer1 (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer1.no && this.layer1.no();
            } else {
                this.layer1.yes && this.layer1.yes();
            }
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
        alertShow (value) { // alert实例
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    storage.set('prevPage', './FQcarInsure.html');
                    window.location.href = './FQLogin.html';
                    return false;
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
        }
    },
    filters: {
    }
}
</script>
