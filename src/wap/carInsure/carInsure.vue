<template>
    <div id="body">
        <div class="item-title">
            车辆信息
            <span class="fr green" @click="showExample">在哪看车辆信息</span>
        </div>
        <div class="gray-bg" v-if="isExamle">
            <div class="example">
               <!-- <p class="big">拍摄获取行驶证相关信息</p> -->
                <p>请对照红框选择区域进行填写</p>
                <img src="./images/example.png" alt=""><br>
                <i class="iconfont close" @click="hideExample">&#xe62a;</i>
            </div>
        </div>
        <div class="gray-bg" v-if="isTakeShow">    
            <div class="example">
                <p class="big">拍摄获取行驶证相关信息</p>
                <img src="./images/example1.png" alt="">
                <p class="">调整拍摄角度，避免光影响</p>
                <p>确保图像清晰，可以提高识别正确率</p>
                <div class="ui-btn-group" style="padding: 20px 0;">
                    <a class="ui-btn">拍摄</a>
                </div>
                <i class="iconfont close" @click="cameraHide">&#xe62a;</i>
            </div>
        </div>
        <ul class="car-insure">
            <li class="cinsure-item">
                <label for="" class="title">品牌型号</label>
                <div class="content">
                    <input type="text" maxlength="13" placeholder="请输入车辆型号" v-model="modelType" @blur="setValue(modelType, 'modelType')" @input="Case(modelType, 'modelType')">
                    <!-- <span class="camera" @click="cameraShow">
                        <i class="iconfont">&#xe626;</i>
                    </span> -->
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">车辆识别代码</label>
                <div class="content">
                    <input type="text" placeholder="请输入17位车辆识别代码" v-model="vinNo" @blur="setValue(vinNo, 'vinNo')" @input="Case(vinNo, 'vinNo')" maxlength="17" >
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">发动机号</label>
                <div class="content">
                    <input type="number" placeholder="请输入发动机号" v-model="engineNo" @blur="setValue(engineNo, 'engineNo')" @input="Case(engineNo, 'engineNo')" maxlength="17">
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">注册时间</label>
                <div class="content content-tip">
                    <datepicker :disabled="disabled" placeholder="请选择" language="zh" format="yyyy-MM-dd" v-model="firstRegDate" @change="setValue(firstRegDate,'firstRegDate')"></datepicker>
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">核载人数</label>
                <div class="content">
                    <input type="text" maxlength="2" placeholder="请输入" v-model="seats" @input="inputSeats" @blur="setValue(seats,'seats')">
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">交强险起保时间</label>
                <div class="content content-tip">
                    <datepicker :disabled="disabled1" placeholder="请选择" language="zh" format="yyyy-MM-dd" v-model="jqStartDate" @blur="setValue(jqStartDate,'jqStartDate')"></datepicker>
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">商业险起保时间</label>
                <div class="content content-tip">
                    <datepicker :disabled="disabled1" placeholder="请选择" language="zh" format="yyyy-MM-dd" v-model="syStartDate" @blur="setValue(syStartDate,'syStartDate')"></datepicker>
                </div>
            </li>
            <li class="cinsure-item">
                <span class="green" @click="chooseSecond">
                    <i class="iconfont fl" v-if="!isSecond">&#xe6ad;</i>
                    <i class="iconfont fl" v-else>&#xe628;</i>
                    <span class="fl" style="margin-left:0.09rem;font-size:0.28rem;">过户车辆首次投保</span>
                </span>
            </li>
            <li class="cinsure-item" v-if="isSecond">
                <label for="" class="title">过户时间</label>
                <div class="content content-tip">
                    <datepicker placeholder="请选择" language="zh" format="yyyy-MM-dd" v-model="transferDate"></datepicker>
                </div>
            </li>
        </ul>
        <div class="item-title">
            车主信息
            <!--<span class="fr green" v-if="isCompany" @click="companyFun">个人车辆</span>
            <span class="fr green" v-if="isPersonal" @click="personalFun">企业车辆</span>-->
            <span class="fr green" v-if="isPersonal">个人车辆</span>
        </div>
        <ul class="car-insure" v-if="isPersonal">
            <li class="cinsure-item">
                <label for="" class="title">车主姓名</label>
                <div class="content">
                    <input type="text" maxlength="8" placeholder="请输入车主姓名" v-model="driveName" @blur="setValue(driveName,'driveName')">
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">身份证号</label>
                <div class="content">
                    <input type="text" placeholder="请输入身份证号" v-model="idNo" @blur="setValue(idNo,'idNo')">
                </div>
            </li>
            <li class="cinsure-item">
                <label for="" class="title">联系电话</label>
                <div class="content">
                    <input type="text" placeholder="请输入电话号码" v-model="mobile" maxlength="11" @blur="setValue(mobile,'mobile')">
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
        <!--验证码 -->
        <div class="layer-shade code flexbox align-items justify-content" v-show="codeiSshow">
               <div class="center">
                    <div class="top"><div @click="off_code()">x</div></div>
                    <p>请输入验证码获取报价</p>
                    <div class="bottom flexbox">
                        <div class="number flex flexbox align-items">
                            <input type="text" v-model="checkCode" placeholder="输入验证码" maxlength="6">
                        </div>
                        <div class="img_code flexbox align-items justify-content">
                            <img :src="img_code"> 
                        </div>
                        <div @click="interaction(undefined, 'load')" class="load flexbox align-items justify-content">
                            <img src="./images/load.png" alt="">
                        </div>
                    </div>
                    <div class="foot flexbox">
                          <div class="flex" @click="off_code()">取消</div>
                          <div class="flex" @click="interaction(true)">确定</div>
                    </div>
               </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow='toast.isshow' @ontoastback='closetoast'>{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import axios from 'axios'
import {Common, valid, storage} from 'js/common'
import md5 from 'md5'
import request from 'js/interface/request'
import Datepicker from 'vuejs-datepicker'
import toast from '../../components/toast' // totast引用：
import loading from '../../components/loading';
export default {
    components: {
        Datepicker,
        toast,
        loading
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
            disabled1: {
                to: new Date(),
                from: new Date(Common.GetDateStr(60))
            },
            loading: false, // 加载中
            isExamle: false, // 在哪看车辆信息
            isTakeShow: false, // 拍照示例
            isCompany: false, // 是企业车辆
            isPersonal: true, // 是个人车辆
            isSecond: false, // 是否过户车
            cityCode: '', // 城市code
            licenseNo: '', // 车牌号
            serialId: '', // 报价流水号
            userId: '', // 用户编号
            modelType: '', // 车辆型号
            transferFlag: 0, // 是否过户车
            vinNo: '', // 车辆识别代码
            engineNo: '', // 发动机代码
            firstRegDate: '', // 注册时间
            seats: '', // 荷载人数
            syStartDate: '', // 商业险起保时间
            jqStartDate: '', // 交强险起保时间
            driveName: '', // 个人车主姓名
            idNo: '', // 个人证件号
            mobile: '', // 个人电话号码
            companyName: '', // 企业车主姓名
            companyIdno: '', // 企业证件号
            companyTel: '', // 企业电话号码
            checkNo: '', // 车辆交管查询码 大地江苏地区查询车型会返回
            checkCode: '', // 车辆交管验证码 大地江苏地区查询车型会返回
            carDetail: {},
            codeiSshow: false, //江苏大地地区会出现二维码
            img_code: '', // 二维码
            isDadi: false // 是否是大地江苏
        }
    },
    computed: {
    },
    created () {
        this.serialId = Common.getQueryString('serialId');
        this.cityCode = Common.getQueryString('areaCode');
        let carInfo = JSON.parse(storage.get('carInfo'));
        this.licenseNo = carInfo.licenseNo;
        this.userId = Common.getUserId('userId');
        this.ins(); // 返回记住数据
    },
    mounted () {
    },
    watch: {
    },
    methods: {
        //转换大小写
        Case (text, name) {
            this[name] = text.toUpperCase();
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        ins () {
            var carDetail = JSON.parse(storage.get('carDetail'));
            if (carDetail) {
                this.modelType = carDetail.modelType;
                this.vinNo = carDetail.vinNo;
                this.engineNo = carDetail.engineNo;
                this.seats = carDetail.seats;
                // this.firstRegDate = carDetail.firstRegDate1;
                // this.syStartDate = carDetail.syStartDate1;
                // this.jqStartDate = carDetail.jqStartDate1;
                //0：否;1：是
                if (carDetail.transferFlag) {
                    this.transferFlag = carDetail.transferFlag;
                } else {
                    this.transferFlag = 0;
                }
                this.driveName = carDetail.driveName;
                this.idNo = carDetail.idNo;
                this.mobile = carDetail.mobile;
                this.companyName = carDetail.companyName;
                this.companyIdno = carDetail.companyIdno;
                this.companyTel = carDetail.companyTel;
                // 过户状态
                if (this.transferFlag === 1) {
                    this.isSecond = true;
                    // this.transferDate = carDetail.transferDate;
                } else {
                    this.isSecond = false;
                    this.transferDate = '';
                }
            }
        },
         // input事件
        setValue (val, name) {
            let value = Common.Trim(val); // 去前后空格
            this[name] = value;
            this.carDetail[name] = value;
            storage.set('FQcarDetail', JSON.stringify(this.carDetail));
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
        chooseSecond () {
            this.isSecond = !this.isSecond;
            if (this.isSecond) {
                this.transferFlag = 1;
                this.carDetail.transferFlag = 1;
            } else {
                this.transferFlag = 0;
                this.carDetail.transferFlag = 0;
            }
            storage.set('carDetail', JSON.stringify(this.carDetail));
        },
        submitFun () {  // 提交
            if (!this.modelType) {
                this.showtoast('请检查品牌型号', true);
                return false;
            } else if (!valid.CarBrand(this.modelType)) {
                this.showtoast('车辆品牌允许输入字母、数字、中文', true);
                return false;
            } else if (this.vinNo.length < 17) {
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
            } else if (!this.jqStartDate) {
                this.showtoast('请检查交强险起保时间', true);
                return false;
            } else if (!this.syStartDate) {
                this.showtoast('请检查商业险起保时间', true);
                return false;
            } else if (!this.transferDate && this.isSecond) {
                this.showtoast('请检查过户时间', true);
                return false;
            } else if (!this.driveName) {
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
        // 交互
        interaction (isD, load) {
            //刷新清空验证码
            if (load) {
                this.empty();
            }
            if (isD) {
                this.isDadi = true;
                if (this.checkCode.length === 0) {
                    this.showtoast('验证码不能为空', true);
                }
            }
            var firstRegDate = Common.formatNewDate(this.firstRegDate);
            var syStartDate = Common.formatNewDate(this.syStartDate);
            var jqStartDate = Common.formatNewDate(this.jqStartDate);
            this.loading = true;
            var transferDate = '';
            if (this.isSecond) {
                transferDate = Common.formatNewDate(this.transferDate);
            }
            var data = {
                'serialId': this.serialId, // 流水号
                'modelType': this.modelType, //品牌型号
                'vinNo': this.vinNo, //车辆识别代码
                'engineNo': this.engineNo, // 发动机编号
                'firstRegDate': firstRegDate, // 车辆初登日期 yyyyMMdd
                // 'firstRegDate1': this.firstRegDate, // 备份记录 yyyy-MM-dd
                'seats': this.seats, // 荷载人数
                'syStartDate': syStartDate, // 商业险起保时间 yyyyMMdd
                // 'syStartDate1': this.syStartDate, // 备份记录 yyyy-MM-dd
                'jqStartDate': jqStartDate, // 交强险起保时间 yyyyMMdd
                // 'jqStartDate1': this.jqStartDate, // 备份记录 yyyy-MM-dd
                'transferFlag': this.transferFlag, //是否过户车 0：否;1：是
                'transferDate': transferDate, // 过户日期 yyyyMMdd
                // 'transferDate1': this.transferDate, // // 备份记录 yyyy-MM-dd
                'driveName': this.driveName, //车主姓名
                'idNo': this.idNo, // 身份证号码
                'mobile': this.mobile, // 车主手机
                extractComp: '0',
                userId: this.userId,
                licenseNo: this.licenseNo,
                cityCode: this.cityCode,
                extractCarProps: [],
                checkCode: this.checkCode,
                checkNo: this.checkNo
            }
            console.log(data);
            storage.set('carDetail', JSON.stringify(data)); // 存入storage
            request.compCarProps(data, (response) => {
                this.loading = false;
                console.log(response.data.output)
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    // -1：暂不支持投保
                    // 0：可以投保，需额外补充车辆信息（继续调用本接口，除extractCarProps以外的参数可不传递）
                    // 1：可直接报价（调用车险保费计算接口）
                    if (output.state === '-1') {
                        this.showtoast('此车辆暂不支持投保', true);
                    } else {
                        if (output.checkCode && output.checkNo) {
                            this.checkNo = output.checkNo; // 大地江苏地区查询车型会返回
                            this.code(output.checkCode); // 大地江苏地区要验证码
                        } else {
                            storage.set('extractCarProps', output.extractCarProps);
                            storage.set('carInsure', JSON.stringify(output));
                            if (output.state === '0') {
                                window.location.href = 'carTypeSelect.html?serialId=' + this.serialId + '&isDadi=' + this.isDadi;
                            } else {
                                window.location.href = 'carTypeSelect.html?serialId=' + this.serialId + '&isDadi=' + this.isDadi;
                                // window.location.href = 'choosePolicy.html?serialId=' + this.serialId;
                            }
                        }
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        //清空验证码
        empty () {
            this.checkCode = '';
            this.checkNo = '';
        },
        // 关闭
        off_code () {
            this.codeiSshow = false; // 关闭
            this.empty(); // 验证码清空
        },
        //大地江苏地区要验证码
        code (checkCode, checkNo) {
            this.img_code = 'data:image/jpeg;base64,' + checkCode;
            this.codeiSshow = true;
        }
    },
    filters: {
    }
}
</script>
