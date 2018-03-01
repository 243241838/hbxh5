<template>
    <div id="body">
       <!--  <div v-if="!isTimeout&&flashSale==1" class="time">
             <div class="time_center">
                   <div class="time_name" v-text="promotionName"></div>
                   <div class="time_d">
                        <b>距结束仅剩</b><span v-text="time.days"></span><b>天</b><span v-text="time.hours"></span><b>时</b><span v-text="time.minutes"></span><b>分</b><span v-text="time.seconds"></span><b>秒</b>
                  </div>
             </div>
        </div>  -->
        <!--轮播图-->
        <!--<div class="head_img" v-show="img_head.length!=3">
           <img src="./images/carinfo.jpg" alt="">
        </div>-->
        <div class="swiper-container" id='swiper-my'>
            <div class='swiper-wrapper'>
                <div class="swiper-slide">
                    <img src="./images/banner1.jpg" alt="">
                </div>
                <div class="swiper-slide">
                    <img src="./images//banner2.jpg" alt="">
                </div>
                <div class="swiper-slide">
                   <img src="./images//banner3.jpg" alt="">
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
        <ul class="car-info">
            <li class="car-item">
                <label for="" class="title">投保城市</label>
                <!-- <div class="content" @click="showChoose"> -->
                <div class="content">
                    <!-- <span class="content-select">
                        <select name="" class="" @change="cityFun">
                            <option v-for="item in areaList" :value="item.areaCode">
                                {{item.areaName}}
                            </option>
                        </select>
                    </span> -->
                        <span class="content-icensehead">
                        <!-- {{licenseAreaName}}-->
                        杭州
                        </span>
                        <i class="iconfont position icon1">&#xe624;</i>
                </div>
            </li>
            <li class="car-item flexbox">
                <label for="" class="title">车牌号码</label>
                <div class="content flex flexbox align-items">
                    <input type="text flexbox" maxlength="7" class="content-input1" placeholder="请输入车辆号码" v-model="licenseNo" @input="Case(licenseNo, 'licenseNo')">
                </div>
                <div class="right">
                    <div class="icon">
                        <i class="iconfont" v-show="icon">&#xe612;</i>
                        <i class="iconfont" v-show="!icon">&#xe611;</i>
                    </div>
                   <div class="select_op" @click="car_number()" v-show="isAndroid&&select.length>0"></div>
                   <select class="select_op"  v-model="licenseNo" v-show="!isAndroid&&select.length">
                        <option :value="licenseNo" style="display:none"></option>
                        <option  v-for="item in select" :value="item" v-text="item"></option>
                    </select>
                </div>
            </li>
            <li class="car-item">
                <span class="choose" @click="newCarFun">
                    <i class="iconfont" v-if="!newCar">&#xe6ad;</i>
                    <i class="iconfont green" v-else>&#xe628;</i>
                    新车未上牌
                </span>
                <!-- <span class="fr green">
                    历史查询车辆
                </span> -->
            </li>
        </ul>
        <div class="layer-shade" v-if="isshow">
            <div class="choose-city">
                <div class="title">
                    请选择投保地区
                    <span class="close" @click="closeChoose">
                        <i class="iconfont position">&#xe629;</i>
                    </span>
                </div>
                <div class="city-list">
                    <span class="city-item" @click="cityFun" v-bind:class="{cur:isFirst}">
                        {{areaName}}
                    </span>
                    <span class="city-item" @click="cityDetailFun" v-bind:class="{cur:!isFirst}">
                        请选择
                    </span>
                </div>
                <ul class="cityDetail-list" v-if="isFirst"> 
                    <li class="cityDetail-item" 
                        v-for="(item,index) in areaList"
                        @click="cityChoose(index,item.areaCode,item.areaName)"
                        v-bind:class="{cur:index===cityi}" :value="item.areaCode">
                        {{item.areaName}}
                        <i class="iconfont" v-show="index===cityi">&#xe620;</i>
                    </li>
                </ul>
                <ul class="cityDetail-list" v-if="!isFirst"> 
                    <li class="cityDetail-item" 
                        v-for="(item,index) in licenseList"
                        @click="cityDetailChoose(index,item.areaCode,item.areaName)"
                        v-bind:class="{cur:index===cityDetaili}" :value="item.areaCode">
                        {{item.areaName}}
                        <i class="iconfont" v-show="index===cityDetaili">&#xe620;</i>
                    </li>
                </ul>
            </div>
        </div>
        <div class="ui-btn-group">
            <a class="ui-btn" @click="searchFun">查询</a>
        </div>
        <div class="layer-shade mu" style="z-index:10" v-show="number11">    
        </div>
        <div class="home" v-show="false">
             <div>
                 <i class="iconfont" v-show="!icon1" @click="top_l('1')">&#xe601;</i>
                 <i class="iconfont" v-show="icon1" @click="top_l()">&#xe600;</i>
             </div>
             <div v-show="output==''">
                 <div class="flexbox flex-column align-items">
                     <div>未登录</div>
                     <div class="flexbox align-items justify-content" @click="go_login()">立即去登录</div>
                 </div>
             </div>
             <div v-show="output!=''">
                 <div class="flexbox flex-column align-items">
                     <div>已登录账户</div>
                     <div v-text="output.userName"></div>
                     <div class="flexbox align-items justify-content" @click="off()">退出当前账户</div>
                 </div>
             </div>
        </div>
         <div class="layer-shade car_number" v-show="number">
            <div class="choose-city">
                <div class="title">
                    请选择车牌号
                    <span class="close" @click="closeChoose1">
                        <i class="iconfont position">&#xe629;</i>
                    </span>
                </div>
                <div class="city-list">
                    <span class="city-item cur">
                        请选择
                    </span>
                </div>
                <ul class="cityDetail-list"> 
                    <li class="cityDetail-item" @click="number_li(item)" v-for="item in select" v-text="item"></li>
                </ul>
            </div>
        </div>
        <!--弹框组件-->
        <layer1 :layer-options="layer1" v-on:onlayerback="closeLayer" ></layer1>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer1" ></layer>
        <multiAlert :multiResponse="multiResponse" :multiShow="multiShow"></multiAlert>
    </div>
</template>
<script>
import Swiper from 'swiper';
import {Common, storage, valid} from 'js/common'
import request from 'js/interface/request'
import loading from '../../components/loading';
import toast from '../../components/toast' // toast引用：
import layer1 from '../../components/layer1' // layer引用
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
import multiAlert from '../../components/multiAlert';
export default {
    components: {
        toast,
        layer1,
        loading,
        layer,
        multiAlert
    },
    data () {
        return {
            multiResponse: {},
            multiShow: false,
            toast: { // toast引用
                isshow: false,
                message: ''
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
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            appId: '',
            loading: false, // 加载中
            icon: true, // iconfont
            select: [], // 点击selsec
            flashSale: '', // 是否有活动1：限时 0：非限
            promotionName: '', // 活动名称
            areaList: '', // 车险省份列表
            licenseList: '',
            areaName: '',
            licenseAreaName: '',
            isshow: false, // 是否显示选择投保地区
            cityi: 0,
            cityDetaili: 0,
            i: 10,
            newCar: false, // 新车未上牌
            isFirst: true, // 是否初始加载
            licenseNo: '浙A', // 车牌号
            licensehead: '', // 车牌号开头
            areaCode: '330100', // 地区代码
            companyCode: '', // 车险公司代码 大地 110 // 天安2
            isTimeout: false,
            time: { // 倒计时
                days: '',
                hours: '',
                minutes: '',
                seconds: ''
            },
            promotionExpTime: '',
            home: '', //home节点
            icon1: false,
            img_head: [],
            output: '',
            isWeiXin1: '', // 判断是否是微信
            isAndroid: '', // 判断是够是安卓
            number: false, // 车牌；列表显示
            number11: false, // 个人中新
            carDetail: {} // 获取的客户信息资料
        }
    },
    created () {
        this.isWeiXin1 = valid.isWeiXin();
        this.isAndroid = valid.isAndroid()
        this.ins();
        let flag = storage.get('FQcarnumber')
        if (flag) {
            flag = JSON.parse(flag);
            this.select = flag;
        }
    },
    mounted () {
        this.$nextTick(() => {
            if (Common.getQueryString('domainId')) {
                storage.set('domainId', Common.getQueryString('domainId'))
            }
            if (Common.getQueryString('referrerUserId')) {
                storage.set('referrerUserId', Common.getQueryString('referrerUserId'))
            }
            // 微信端
            if (valid.isWeiXin()) {
                this.initWeixinSDK();
            }
            this.banner();
        })
        this.home = document.querySelector('.home');
        this.resetBody();
    },
    watch: {
    },
    methods: {
        initWeixinSDK () {
            let obj = {
                url: window.location.href
            }
            request.getWXJsAPISignature(obj, (response) => {
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    this.appId = output.appId;
                    this.userAccess();
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
        // 轮播图
        banner () {
            let swiper = new Swiper('#swiper-my', {
                pagination: '.swiper-pagination',
                loop: true,
                autoplay: 5000,
                paginationClickable: true,
                autoplayDisableOnInteraction: false
            });
        },
        resetBody () {
            this.$nextTick(() => {
                Common.setFullScreen();
            })
        },
         //转换大小写
        Case (text, name) {
            if (this.newCar) {
                this[name] = '';
            } else {
                this[name] = text.toUpperCase();
            }
        },
        // 个人资料初始化
        ins () {
            this.output = JSON.parse(storage.get('userInfo'))?JSON.parse(storage.get('userInfo')):'';
        },
        // 去登录
        go_login () {
            window.location.href = 'FQLogin.html';
        },
        // 注销登录
        off () {
            var data = {
                userId: Common.getUserId()
            }
            request.logout(data, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    this.showtoast(response.data.respMsg, true)
                    storage.remove('userId');
                    storage.remove('userInfo');
                    storage.remove('sessionId');
                    this.output = '';
                    window.location.reload();
                    this.top_l();
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // 点击出来home
        top_l (number) {
            this.icon1 = !this.icon1;
            this.number11 = !this.number11;
            if (number) {
                this.home.style.bottom = '1rem';
            } else {
                this.home.style.bottom = '-2.84rem';
            }
        },
        href_url (number) {
            if (number === '1') {
                console.log('1')
            } else if (number === '2') {
                console.log('2')
            } else if (number === '3') {
                console.log('3')
            } else {
                console.log('4')
            }
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        location (citys) { // 地图
            var geolocation = new window.BMap.Geolocation();
            var gc = new window.BMap.Geocoder();
            geolocation.getCurrentPosition((r) => {
                // success
                if (geolocation.getStatus() === 0) {
                    var pt = r.point;
                    gc.getLocation(pt, (rs) => {
                        var addComp = rs.addressComponents
                        this.licenseAreaName = addComp.city;
                        citys.map((item) => {
                            if (item.areaName === this.licenseAreaName) {
                                this.areaCode = item.areaCode;
                                this.licenseNo = item.licensePreff;
                                return;
                            }
                        })
                    });
                } else {
                    switch (geolocation.getStatus()) {
                    case 2:
                        this.showtoast('位置结果未知 获取位置失败.', true);
                        break;
                    case 3:
                        this.showtoast('导航结果未知 获取位置失败..', true);
                        break;
                    case 4:
                        this.showtoast('非法密钥 获取位置失败.', true);
                        break;
                    case 5:
                        this.showtoast('对不起,非法请求位置  获取位置失败.', true);
                        break;
                    case 6:
                        this.showtoast('对不起,当前 没有权限 获取位置失败.', true);
                        break;
                    case 7:
                        this.showtoast('对不起,服务不可用 获取位置失败.', true);
                        break;
                    case 8:
                        this.showtoast('对不起,请求超时 获取位置失败.', true);
                        break;
                    }
                }
            },
            {enableHighAccuracy: true})
        },
        insCity () { // 初始化获取城市和code
            let flag = storage.get('FQcarnumber')
            if (flag) {
                flag = JSON.parse(flag);
                this.select = flag;
            }
            let data = {
                companyCode: this.companyCode,
                areaCode: 0
            }
            request.getAvaCarAreas(data, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    // 省
                    this.areaList = response.data.output.areaList;
                    // console.log(this.areaList)
                    for (var i = 0; i < this.areaList.length; i++) {
                        this.areaName = this.areaList[i].areaName;
                        let provinceCode = this.areaList[i].areaCode;
                        let data1 = {
                            companyCode: this.companyCode,
                            areaCode: provinceCode
                        }
                        request.getAvaCarAreas(data1, (response) => {
                            if (response.data.respCode === '000000') {
                                // 市
                                this.licenseList = response.data.output.areaList;
                                // 百度地图
                                // this.location(this.licenseList);
                            } else {
                                this.showtoast(response.data.respMsg, true);
                            }
                        }, () => {
                            this.showtoast('网络错误，请查看网络是否连接', true);
                        });
                    }
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        closeChoose () {
            this.isshow = false;
        },
        cityFun (e) {
            var that = this;
            var _this = e.currentTarget;
            this.isFirst = true;
        },
        cityDetailFun (e) {
            var that = this;
            var _this = e.currentTarget;
            this.isFirst = false;
        },
        showChoose () {
            this.isshow = true;
        },
        cityChoose (index, code, name) {
            var that = this;
            this.cityi = index;
            this.areaCode = code;
            this.areaName = name;
            this.isFirst = false;
            var data1 = {
                'companyCode': that.companyCode,
                'areaCode': that.areaCode
            }
            request.getAvaCarAreas(data1, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    that.licenseList = response.data.output.areaList;
                    that.licenseAreaName = that.licenseList[0].areaName;
                    that.licenseNo = that.licenseList[0].licensePreff;
                    that.areaCode = that.licenseList[0].areaCode;
                }
            }, () => {
                that.showtoast('网络错误，请查看网络是否连接', true);
            });
        },
        cityDetailChoose (index, code, name) {
            this.cityDetaili = index;
            this.areaCode = code;
            this.licenseAreaName = name;
            var licenseList = this.licenseList;
            var olen = licenseList.length;
            for (var i = 0; i < olen; i++) {
                if (licenseList[i].areaCode === this.areaCode) {
                    this.licenseNo = licenseList[i].licensePreff;
                }
            }
            this.closeChoose();
        },
        licenseheadFun (e) {
            var _this = e.currentTarget;
            this.licensehead = _this.value;
        },
        car_number () { // 点击car icon
            this.icon = !this.icon;
            this.number = true;
        },
         // 车牌号显示
        closeChoose1 () {
            this.number = false;
            this.icon = !this.icon;
        },
        number_li (item) {
            this.licenseNo = item;
            this.closeChoose1();
        },
        // 点击查询
        searchFun () {
            console.log(Common.isLogin())
            if (Common.isLogin() || valid.isWeiXin()) {
                //
            } else {
                this.go_login();
                return false;
            }
            var licenseNo = '';
            if (this.newCar) {
                licenseNo = 0;
            } else {
                licenseNo = this.licenseNo; // this.licensehead +
            }
            // 是否新车判断
            let newCarFlag = '';
            if (licenseNo !== 0) {
                newCarFlag = '0'
            } else {
                newCarFlag = '1'
            }
            var data = {
                areaCode: this.areaCode, // 城市代码
                licenseNo: licenseNo, // 车牌号
                userId: storage.get('userId'),  // 用户Id
                newCarFlag: newCarFlag // 新车标识
            }
            if (!this.newCar&&valid.plateNumber(licenseNo)) {
                var carnumber = [];
                var flag = storage.get('FQcarnumber');
                if (flag) {
                    carnumber = JSON.parse(flag);
                    if (carnumber.indexOf(licenseNo) === -1) {
                        carnumber.push(licenseNo);
                    }
                    storage.set('FQcarnumber', JSON.stringify(carnumber));
                } else {
                    carnumber.push(licenseNo);
                    storage.set('FQcarnumber', JSON.stringify(carnumber));
                }
            }
            if (!this.newCar && !valid.plateNumber(licenseNo)) {
                this.showtoast('请检查车牌号', true);
            } else if (!this.areaCode) {
                this.showtoast('请先选择投保城市', true);
            } else {
                let carInfo = {
                    licenseNo: licenseNo,
                    areaCode: this.areaCode,
                    newCarFlag: newCarFlag,
                    location: '杭州'
                }
                storage.set('FQcarInfo', JSON.stringify(carInfo));
                storage.remove('FQcarDetail');
                // 当非新车时填写车辆资料
                if (licenseNo !== 0) {
                    this.Re_Quote(licenseNo, data);
                } else {
                    this.gotoNextPage(licenseNo, data)
                }
            }
        },
        gotoNextPage (licenseNo, data) {
            if (!this.loading) {
                this.loading = true;
                request.queryIsPriceAndTrade(data, (response) => {
                    console.log(response.data)
                    // 账户已经在其他设备上登录
                    this.multiLogin(response);
                    if (response.data.respCode === '000000') {
                        console.log(response.data)
                        let output = response.data.output;
                        this.loading = false;
                        //新车时直接跳下一步
                        if (licenseNo === 0) {
                            window.location.href = 'FQcarInsure.html';
                            return false;
                        }
                        // 如果有订单跳转至订单详情
                        if (output.getTradeListRecordList[0].tradeId !=='') {
                            let tradeId = output.getTradeListRecordList[0].tradeId
                            window.location.href = 'FQOrderDetail.html?tradeId=' + tradeId;
                            return false;
                        }
                        // 如果有报价时弹框 0：无;1:有
                        if (output.isPrice === '1') {
                            this.confirmFun(); // 有报价时显示cofim弹框
                            return false;
                        }
                        if (output.isPrice === '0') {
                            window.location.href = 'FQcarInsure.html';
                            return false;
                        }
                    }
                }, () => {
                    this.loading = false;
                    this.showtoast('网络错误，请查看网络是否连接', true);
                })
            }
        },
        // 新车未上牌
        newCarFun () {
            this.newCar = !this.newCar;
            if (this.newCar) {
                this.licenseNo = '';
            }
        },
        // 倒计时
        setTime () {
            Common.countdown(this.time, this.promotionExpTime, this.isTimeout, (time, isTimeout) => {
                this.time = time;
                this.isTimeout = isTimeout;
            });
        },
        //车辆信息自动填写
        Re_Quote (licenseNo, data) {
           //查询车辆信息
            let carInfo = JSON.parse(storage.get('FQcarInfo'));
            var obj = {
                userId: storage.get('userId'),
                licenseNo: carInfo.licenseNo,
                newCarFlag: carInfo.newCarFlag
            }
            request.getCarInfo(obj, (response) => {
                console.log(response.data)
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    if (response.data.output.insCarInfoRecord.length > 0) {
                        let output = response.data.output.insCarInfoRecord[0];
                        let carDetail = {
                            city: output.city, //城市代码
                            licenseNo: output.licenseNo, // 车牌号
                            'modelType': output.modelType, // 品牌型号
                            'vinNo': output.vinNo, // 车辆识别代码
                            'engineNo': output.engineNo, // 发动机编号
                            'firstRegDate': output.firstRegDate, // 车辆初登日期
                            'seats': output.seats, // 荷载人数
                            'syStartTime': output.syStartTime, // 商业险起保时间
                            'jqStartTime': output.jqStartTime, // 交强险起保时间
                            'transferFlag': output.transferFlag, // 是否过户车
                            'transferDate': output.transferFlag===1?output.transferDate:'', // 过户日期
                            'driverName': output.driverName, // 车主姓名
                            'idNo': output.idNo, // 身份证号码
                            'mobile': output.mobile, // 车主手机
                            'newCarFlag': output.newCarFlag, // 新车标识
                            carDetailInfo: output.carDetailInfo
                        }
                        this.carDetail = carDetail;
                        storage.set('FQcarDetail', JSON.stringify(carDetail)); // 存入storage
                    }
                    this.gotoNextPage(licenseNo, data);
                }
                this.loading = false;
            }, () => {
                this.loading = false;
                this.showtoast('网络错误，请查看网络是否连接', true);
                return false;
            })
        },
        // 去报价列表
        mony_lsit() {
            storage.set('FQlicenseNo', this.carDetail.licenseNo);
            window.location.href = 'FQQuotationDetail.html?userId=' + storage.get('userId') + '&queryIdNo=' + this.carDetail.idNo + '&vinNo=' + this.carDetail.vinNo;
            return false;
        },
        // 点击确定弹窗
        confirmFun () {
            this.confirmShow('此车已有报价结果');
        },
        confirmShow (val) { // confirm实例
            let that = this;
            this.showLayer(val, {
                type: 'confirm',
                btns: ['重新报价', '去看看'],
                yes: function () {
                    that.mony_lsit()
                },
                no: function () {
                    window.location.href = 'FQcarInsure.html';
                    return false;
                }
            })
        },
        showLayer (msg, options) {
            // layer引用：3.显示弹框
            this.layer1.type = options.type;
            this.layer1.message = msg;
            this.layer1.isshow = true;
            this.layer1.shadeClose = options.shadeClose;
            this.layer1.btns = options.btns;
            this.layer1.yes = options.yes;
            this.layer1.no = options.no;
        },
        closeLayer (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer1.no && this.layer1.no();
            } else {
                this.layer1.yes && this.layer1.yes();
            }
        },
        showLayer1 (msg, options) {
            // layer引用：3.显示弹框
            this.layer.type = options.type;
            this.layer.message = msg;
            this.layer.isshow = true;
            this.layer.shadeClose = options.shadeClose;
            this.layer.btns = options.btns;
            this.layer.yes = options.yes;
            this.layer.no = options.no;
        },
        // 多点登录
        multiLogin (response) {
            this.multiResponse = response;
            this.multiShow = true;
        },
        alertShow1 (value) { // alert实例
            this.showLayer1(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    storage.set('prevPage', './FQcarInfo.html');
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        closeLayer1 (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        wxAuthLogin (code, mobile) {
            let data = {
                code: code,
                mobile: mobile
            }
            if (storage.get('domainId')) {
                data.domainId = storage.get('domainId');
                storage.remove('domainId')
            } else if (storage.get('referrerUserId')) {
                data.referrerUserId = storage.get('referrerUserId');
                storage.remove('referrerUserId')
            }
            // window.alert(JSON.stringify(data))
            request.wxAuthLogin(data, (response) => {
                // window.alert(JSON.stringify(response))
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (output && output.mobile) {
                        storage.set('mobile', output.mobile);
                        storage.set('sessionId', output.sessionId);
                        storage.set('userInfo', JSON.stringify(output));
                        storage.set('userId', output.userId);
                        storage.set('unionId', output.unionId);
                    } else if (!output.mobile) {
                        storage.set('unionId', output.unionId);
                        window.location.href = window.location.href.split('wap/')[0] + 'wap/FQLogin.html';
                    }
                } else {
                    // window.alert(response.data.respMsg);
                }
            }, (err) => {
                console.log(JSON.stringify(err));
            })
        },
        userAccess () {
            let mobile = storage.get('mobile');
            let unionId = storage.get('unionId');
            // 有code
            // window.alert(mobile)
            // window.alert(unionId)
            if (Common.getQueryString('code')) {
                if (mobile) {
                    // code+mobile=>主页
                    this.wxAuthLogin(Common.getQueryString('code'), mobile)
                }
            } else { // 没有code
                // 已经授权
                if (unionId) {
                    // 没有手机号
                    if (!mobile) {
                        window.location.href = window.location.href.split('wap/')[0] + 'wap/FQLogin.html';
                    }
                } else {
                    // 未授权 (老用户) 当前页面授权
                    // 有手机号 (code+mobile=>主页)
                    if (mobile) {
                        let link = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appId + '&redirect_uri=' + window.encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect';
                        window.location.href = link;
                    } else {
                        // (新用户) 绑定页面授权
                        let link = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appId + '&redirect_uri=' + window.encodeURIComponent(window.location.href.split('wap/')[0] + 'wap/FQLogin.html') + '&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect';
                        window.location.href = link;
                    }
                }
            }
        }
    },
    filters: {
    }
}
</script>