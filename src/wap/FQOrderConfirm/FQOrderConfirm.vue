<template>
    <div id="body" :class="{isshow:!isWeiXin}" v-show="render">
        <div class="img_Detail" v-show="isImg">
             <img :src="output.resultImg" alt="">
             <i class="iconfont" @click="showImg1()">&#xe62a;</i>
        </div>
        <div class="body_fixed">
            <div class="head_list">
                <div class="item flexbox">
                    <div class="left flex flexbox align-items">
                        <div class="flexbox align-items justify-content">
                            <img :src="output.insurerLogo" alt="">
                        </div>
                        <div class="flex flexbox align-items" v-text="output.insurerName"></div>
                    </div> 
                </div>
                <a href="javascript:;" @click="enquiry()" v-show="priceSts!='0'">
                    <div class="flexbox">
                        <div class="left flex flexbox align-items">
                            调整投保方案
                        </div>
                        <div class="right flexbox align-items">
                            <i class="iconfont font_s">&#xe61d;</i>
                        </div>
                </div>
                </a>
            </div>
            <div class="center_list">
                <div class="flexbox">
                    <div class="left flex flexbox align-items">投保城市</div> 
                    <div class="right flexbox align-items">杭州市</div> 
                </div>
                <div class="flexbox" v-show="output.jqPreium">
                    <div class="left flex flexbox align-items">交强险</div> 
                    <div class="right flexbox align-items">￥{{output.jqPreium | formatMoney}}</div> 
                </div>
                <div class="flexbox" v-show="output.ccsPreium">
                    <div class="left flex flexbox align-items">代缴车船税</div> 
                    <div class="right flexbox align-items">￥{{output.ccsPreium | formatMoney}}</div> 
                </div>
                <div class="flexbox">
                    <div class="left flex flexbox align-items">商业险</div> 
                    <div class="right flexbox align-items">￥{{output.syPreium | formatMoney}}</div> 
                </div>
                <div class="flexbox">
                    <div class="left flex flexbox align-items"></div> 
                    <div class="right flexbox align-items green" @click="showImg()">商业险详情>></div> 
                </div>
                <div class="flexbox">
                    <div class="left flex flexbox align-items">总额</div> 
                    <div class="right flexbox align-items orange">￥{{output.insuredAmount | formatMoney}}</div> 
                </div>
            </div>
            <div class="bottom_list">
                <div class="item flexbox">
                    <div class="left flex flexbox align-items">车牌号</div> 
                    <div class="right flexbox align-items" v-text="output.licenseNo==0?'新车未上牌':output.licenseNo"></div> 
                </div>
                <div class="item flexbox">
                    <div class="left flex flexbox align-items">车主</div> 
                    <div class="right flexbox align-items" v-text="output.queryRealName">你好</div> 
                </div>
                <div class="item flexbox">
                    <div class="left flex flexbox align-items">证件号码</div> 
                    <div class="right flexbox align-items" v-text="output.queryIdNo"></div> 
                </div>
                <div class="item flexbox">
                    <div class="left flex flexbox align-items">联系电话</div> 
                    <div class="right flexbox align-items" v-text="output.queryMobile"></div> 
                </div>
            </div>
            <div class="location">
                <div></div>
                <a :href="location_url">
                    <div class="no_location flexbox" v-show="!location1">
                            <div class="flex flexbox align-items">请添加保单邮寄地址</div>
                            <div class="flexbox align-items">
                            <i class="iconfont">&#xe61d;</i>
                            </div>
                    </div>
                    <div class="y_location flexbox" v-show="location1">
                            <div class="flexbox align-items">
                            <i class="iconfont">&#xe624;</i>
                            </div>
                            <div class="name flex">
                                <div class="flexbox">
                                    <div class="flex flexbox align-items" v-text="location.cneeName"></div>
                                    <div class="flexbox align-items" >{{location.mobile | ellipsisMobile}}</div>
                                </div>
                                <div class="location" v-text="location.address"></div>
                            </div>
                            <div class="flexbox align-items flex-right">
                            <i class="iconfont">&#xe61d;</i>
                            </div>
                    </div>
                </a>
            </div>
            <div class="read">
                温馨提示：当前保费仅适用于本次报价，24小时内有效
            </div>
            <div class="foot flexbox">
                <div class="flex flexbox align-items money"><span>￥</span><span>{{output.insuredAmount | formatMoney}}</span></div>
                <div class="center flexbox align-items" v-show="priceSts!='0'">
                    <div class="box flex flexbox align-items justify-content">
                         <div class="flexbox align-items justify-content" @click="sub('0')"  :class="{'green': isFQ=='0'}">我要投保</div>
                    </div>
                    <div class="box flex flexbox align-items justify-content">
                         <div class="flexbox align-items justify-content" @click="sub('1')"  :class="{'green': isFQ=='1'}">我要分期</div>
                    </div>
                    
                </div>
                <div class="right flexbox align-items justify-content" v-show="priceSts=='0'" @click="enquiry()">
                    重新询价
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
import {Common, valid, storage} from 'js/common'
import request from 'js/interface/request'
import toast from '../../components/toast' // toast引用：
import loading from '../../components/loading';
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
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            render: false, // 页面显示
            body_fixed: '', // 主体是否固定
            output: {},
            location: {}, //地址
            location_url: '', // 地址跳转url
            location1: false,
            loading: false, // 加载中
            isSelect: false, // 阅读协议是否勾选
            priceSts: '', // 订单状态 0 无效 1 有效
            serialId: '', // 流水号
            isFQ: '1', // 是否分期
            isImg: false, // 商业图片
            isWeiXin: '',
            carObj: ''
        }
    },
    created () {
        this.ins();
    },
    mounted () {
        this.isWeiXin = valid.isWeiXin();
        this.body_fixed = document.querySelector('.body_fixed');
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
    },
    watch: {
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
        // 初始化
        ins () {
            if (storage.get('FQenquiry')) {
                this.output = JSON.parse(storage.get('FQenquiry'));
                this.render = true;
            }
            this.serialId = Common.getQueryString('serialId');
            this.location_url = 'FQAddLocation.html?serialId=' + this.serialId;
            this.priceSts = this.output.priceSts;
            if (storage.get('FQlocation')) {
                let location = JSON.parse(storage.get('FQlocation'))
                if (location) {
                    this.location = location;
                    this.location1 = !this.location1;
                }
            }
            console.log(this.output)
        },
         // 重新询价
        enquiry () {
            let licenseNo = this.output.licenseNo;
            if (parseInt(licenseNo) !== 0) {
                var data = {
                    userId: storage.get('userId'),
                    licenseNo: licenseNo,
                    newCarFlag: 0
                }
                request.getCarInfo(data, (response) => {
                    console.log(response.data)
                    // 账户已经在其他设备上登录
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
                                'transferDate': output.transferDate, // 过户日期
                                'driverName': output.driverName, // 车主姓名
                                'idNo': output.idNo, // 身份证号码
                                'mobile': output.mobile, // 车主手机
                                'newCarFlag': output.newCarFlag, // 新车标识
                                carDetailInfo: output.carDetailInfo
                            }
                            storage.set('FQcarDetail', JSON.stringify(carDetail)); // 存入storage
                            window.location.href = 'FQcarInsure.html';
                        }
                    }
                }, () => {
                    this.loading = false;
                    this.showtoast('网络错误，请查看网络是否连接', true);
                    return false;
                })
            } else {
                window.location.href = 'FQcarInsure.html';
            }
        },
        // 投保
        sub (number) {
            if (!this.location1) {
                this.showtoast('地址不能为空', true);
                return false;
            }
            this.isFQ = number;
            if (this.isFQ === '0') {
                this.installmentFlg = '0'; // 不分期
            } else {
                this.installmentFlg= '1';
            }
            let obj = {
                userId: storage.get('userId'),
                serialId: this.serialId, // 流水号
                insurerId: this.output.insurerId, // 保险公司ID
                priceId: this.output.priceId, // 报价ID
                installmentFlg: this.installmentFlg, // 是否分期(0：不分期，1：分期)
                expressName: this.location.cneeName, //收件人姓名
                expressMobile: this.location.mobile, // 收件人手机
                expressAddress: this.location.address, // 收件人详细地址
                expressProvince: this.location.areaId0, // 省code
                expressCity: this.location.areaId1, // 市code
                expressDistrict: this.location.areaId2, // 县code
                licenseNo: this.output.licenseNo // 车牌号
            }
            this.carObj = obj;
            storage.set('FQOrderConfirm', JSON.stringify(this.carObj));
            if (number === '0') {
                window.location.href = 'FQSubmitInfo.html';
                return false;
            } else {
                this.confirmFun()
            }
        },
        showImg () {
            this.isImg = !this.isImg
            this.body_fixed.style.position = 'fixed';
        },
        showImg1 () {
            this.isImg = !this.isImg
            this.body_fixed.style.position = 'static';
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        confirmFun () {
            this.confirmShow('车险分期仅限车主本人操作哦');
        },
        confirmShow (val) { // confirm实例
            this.showLayer(val, {
                type: 'confirm',
                btns: ['考虑一下', '我是本人'],
                yes: function () {
                    window.location.href = 'FQSubmitInfo.html';
                    return false;
                },
                no: function () {
                    //
                }
            })
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
                    storage.set('prevPage', './FQOrderConfirm.html?serialId = ' + this.serialId);
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
        },
        // 多点登录
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
                this.showtoast(response.data.respMsg, true);
            }
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
        formatMoney (value) {
            if (!value) {
                return '';
            }
            return (value / 100).toFixed(2);
        }
    }
}
</script>
