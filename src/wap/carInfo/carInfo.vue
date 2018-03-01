<template>
    <div id="body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon>
        <img src="./images/carinfo_title.png" alt="" :class="{isWeiXin:isWeiXin}">
         <div v-if="!isTimeout&&flashSale==1" class="time">
             <div class="time_center">
                   <div class="time_name" v-text="promotionName"></div>
                   <div class="time_d">
                        <b>距结束仅剩</b><span v-text="time.days"></span><b>天</b><span v-text="time.hours"></span><b>时</b><span v-text="time.minutes"></span><b>分</b><span v-text="time.seconds"></span><b>秒</b>
                  </div>
             </div>
        </div>
        <ul class="car-info">
            <li class="car-item ">
                <label for="" class="title">投保城市</label>
                <div class="content" @click="showChoose">
                    <!-- <span class="content-select">
                        <select name="" class="" @change="cityFun">
                            <option v-for="item in areaList" :value="item.areaCode">
                                {{item.areaName}}
                            </option>
                        </select>
                    </span> -->
                    <span class="content-icensehead">
                        {{licenseAreaName}}
                    </span>
                    <i class="iconfont position">&#xe624;</i>
                </div>
            </li>
            <li class="car-item">
                <label for="" class="title">车牌号码</label>
                <div class="content flex">
                    <input type="text" maxlength="7" class="content-input" placeholder="请输入车辆号码" v-model="licenseNo" @input="Case(licenseNo, 'licenseNo')">
                </div>
                <div class="fr">
                    <div class="icon">
                        <i class="iconfont">&#xe612;</i>
                    </div>
                     <div class="select_op" @click="car_number()" v-show="isAndroid&&select.length>0"></div>
                   <select class="select_op"  v-model="licenseNo" v-show="!isAndroid&&select.length">
                        <option :value="licenseNo" style="display:none"></option>
                        <option v-for="item in select" :value="item" v-text="item"></option>
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
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import {Common, storage, valid} from 'js/common'
import headerCommon from '../../components/headerCommon.vue';
import request from 'js/interface/request'
import toast from '../../components/toast' // toast引用：
export default {
    components: {
        toast,
        headerCommon
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
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
            licenseNo: '', // 车牌号
            licensehead: '', // 车牌号开头
            areaCode: '', // 地区代码
            companyCode: '', // 车险公司代码 大地 110 // 天安2
            isTimeout: false,
            time: { // 倒计时
                days: '',
                hours: '',
                minutes: '',
                seconds: ''
            },
            promotionExpTime: '',
            isWeiXin: '',
            title: '',
            isAndroid: '',
            number: false // 车牌
        }
    },
    created () {
        this.title = storage.get('insurerName');
        this.instance();
    },
    mounted () {
        this.isWeiXin = valid.isWeiXin();
        this.isAndroid = valid.isAndroid()
    },
    watch: {
    },
    methods: {
         //转换大小写
        Case (text, name) {
            if (this.newCar) {
                this[name] = '';
            } else {
                this[name] = text.toUpperCase();
            }
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        location (province, citys) { // 地图
            var geolocation = new window.BMap.Geolocation();
            var gc = new window.BMap.Geocoder();
            geolocation.getCurrentPosition((r) => {
                // success
                if (geolocation.getStatus() === 0) {
                    var pt = r.point;
                    gc.getLocation(pt, (rs) => {
                        var addComp = rs.addressComponents
                        this.licenseAreaName = addComp.city;
                        //查找省id
                        province.map((item) => {
                            if (item.areaName === addComp.province) {
                                storage.set('carInfoareaCode', item.areaCode);
                            }
                        })
                        //查找城市id
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
            let flag = storage.get('carnumber')
            if (flag) {
                flag = JSON.parse(flag);
                this.select = flag;
            }
            let data = {
                companyCode: this.companyCode,
                areaCode: 0
            }
            // console.log(data)
            request.getAvaCarAreas(data, (response) => {
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
                                this.location(this.areaList, this.licenseList);
                            } else {
                                this.showtoast(response.data.respMsg, true);
                            }
                        }, (error) => {
                            this.showtoast(error, true);
                        });
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        //获取活动(调产品详情接口)
        instance () {
            var data = {
                productId: Common.getQueryString('id')
            }
            request.getProductDetail(data, (response) => {
                // console.log(response.data.output)
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    this.flashSale = output.flashSale; // 是否有活动1：限时 0：非限
                    this.promotionName = output.promotionName; // 活动名称
                    this.promotionExpTime = new Date(output.promotionExpTime).getTime(); //限购时间
                    //确认订单有用
                    let obj = {
                        productName: output.productName, // 产品名字
                        productId: output.productId, //产品id
                        insurerName: output.insurerName, // 保险公司名字
                        insurerTels: output.insurerTels // 保险公司电话
                    }
                    // storage.set('carproductName', response.data.output.productName); //产品名字
                    // storage.set('carproductId', response.data.output.productId); // 产品id
                    // storage.set('carinsurerId', response.data.output.insurerId); // 保险公司
                    //订单确认页面用的数据
                    storage.set('insuranceCompany', JSON.stringify(obj));
                    this.setTime();
                    this.companyCode = response.data.output.insurerId;
                    this.insCity();
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            });
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
            // console.log(this.areaCode)
            storage.set('carInfoareaCode', this.areaCode);
            var data1 = {
                'companyCode': that.companyCode,
                'areaCode': that.areaCode
            }
            request.getAvaCarAreas(data1, (response) => {
                if (response.data.respCode === '000000') {
                    that.licenseList = response.data.output.areaList;
                    that.licenseAreaName = that.licenseList[0].areaName;
                    that.licenseNo = that.licenseList[0].licensePreff;
                    that.areaCode = that.licenseList[0].areaCode;
                } else {
                    that.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                that.showtoast(error, true);
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
        //安卓点击车牌
        number_li (item) {
            this.licenseNo = item;
            this.closeChoose1();
        },
        // 点击查询
        searchFun () {
            var licenseNo = '';
            if (this.newCar) {
                licenseNo = 0;
            } else {
                licenseNo = this.licenseNo; // this.licensehead +
            }
            var data = {
                companyCode: this.companyCode,
                areaCode: this.areaCode,
                licenseNo: licenseNo,
                productId: Common.getQueryString('id')
            }
            if (!this.newCar&&valid.plateNumber(licenseNo)) {
                var carnumber = [];
                var flag = storage.get('carnumber');
                if (flag) {
                    carnumber = JSON.parse(flag);
                    if (carnumber.indexOf(licenseNo) === -1) {
                        carnumber.push(licenseNo);
                    }
                    storage.set('carnumber', JSON.stringify(carnumber));
                } else {
                    carnumber.push(licenseNo);
                    // console.log(carnumber)
                    storage.set('carnumber', JSON.stringify(carnumber));
                }
            }
            if (!this.newCar && !valid.plateNumber(licenseNo)) {
                this.showtoast('请检查车牌号', true);
            } else if (!this.areaCode) {
                this.showtoast('请先选择投保城市', true);
            } else {
                let carInfo = {
                    licenseNo: licenseNo,
                    city: this.licenseAreaName
                }
                storage.set('carInfo', JSON.stringify(carInfo));
                request.checkCarInsState(data, (response) => {
                    if (response.data.respCode === '000000') {
                        console.log(response.data)
                        let output = response.data.output;
                        if (output.state === '-1') {
                            this.showtoast('此车辆暂不支持投保', true);
                        } else if (output.state === '0') {
                            storage.set('extractCarProps', JSON.stringify(output.extractCarProps));
                            window.location.href = 'carInsure.html?serialId=' + response.data.output.serialId + '&areaCode=' + this.areaCode;
                        } else if (output.state === '1') {
                            window.location.href = 'carInsure.html?serialId=' + response.data.output.serialId + '&areaCode=' + this.areaCode;
                        }
                    } else {
                        this.showtoast(response.data.respMsg, true);
                    }
                }, (error) => {
                    this.showtoast(error, true);
                })
            }
        },
        // 新车未上牌
        newCarFun () {
            this.newCar = !this.newCar;
            this.licenseNo = '';
        },
        // 倒计时
        setTime () {
            Common.countdown(this.time, this.promotionExpTime, this.isTimeout, (time, isTimeout) => {
                this.time = time;
                this.isTimeout = isTimeout;
            });
        }
    },
    filters: {
    }
}
</script>
