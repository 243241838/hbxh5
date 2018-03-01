<template>
    <div id="body">
        <ul class="info-list">
            <li class="info-item" @click="href_adjust()">
                <span v-text="output.insurerName"></span>
                <span>-</span>
                <span v-text="carDetail.licenseNo!='0'?carDetail.licenseNo:'新车未上牌'"></span>
                <span class="fr"><i class="iconfont icon-xiayibu"></i></span>
            </li>
        </ul>
        <div class="check-list">
            <div class="check-item" :class="{'cur': state1=='1'}">
                <i class="iconfont" v-show="state1!='1'">&#xe645;</i>
                <i class="iconfont" v-show="state1=='1'">&#xe649;</i>
                <p class="big" v-show="state1=='1'">正在提交</p>
                <p class="big" v-show="state1!='1'">已提交</p>
                <p class="small" v-show="state1=='1'">
                     <span>正在提交</span><span v-text="output.insurerName"></span>报价
                </p>  
                 <p class="small" v-show="state1!='1'">
                     <span v-text="time"></span>提交<span v-text="output1.insurerName"></span>报价
                </p>  
            </div>
            <div class="check-item" v-show="state1!='-20'" :class="{'cur': state1=='10'}">
                <i class="iconfont" v-show="state1!='10'">&#xe646;</i>
                <i class="iconfont" v-show="state1=='10'">&#xe644;</i>
                <p class="big" v-show="state1=='1'">待审核</p>
                <p class="big" v-show="state1=='10'">正在审核中</p>
                <p class="small" v-show="state1=='10'">稍后返回审核结果</p>
                <p class="big" v-show="state1=='20'">已审核</p>
                <p class="small" v-show="state1=='20'">您的车辆已通过保险公司审核</p>
            </div>
            <div class="check-item" v-show="state1!='-20'" :class="{'last1': state1=='20'}">
                <i class="iconfont" v-show="state1!=='20'">&#xe643;</i>
                <i class="iconfont" v-show="state1=='20'">&#xe647;</i>
                <p class="big" v-show="state1!='20'">待报价</p>
                <p class="big top_border" v-show="state1=='20'" >已报价</p>
                <p class="small" v-show="state1=='20'">
                    {{output1.insurerName}}：<span>￥</span><span>{{output1.insuredAmount | formatMoney}}</span>
                </p>
            </div>
            <div class="check-item last" v-if="state1=='-20'" >
                <i class="iconfont">&#xe648;</i>
                <p class="big top_border" :class="{'fail': state1=='-20'}">审核失败</p>
                <p class="small ellip">失败原因：<span v-text="output1.queryResult"></span></p>
            </div>
        </div>
        <div class="check-tip">
            <p>温馨提示：本产品由<span v-text="output.insurerName"></span>承保。</p>
            <p>联系电话：<span>400-678-6078</span></p>
        </div>
        <div class="foot" v-show="state1=='20'&&querySts!=10||state1=='-20'&&querySts!=10">
            <div class="ui-btn-group" v-if="state1=='-20'" @click="href_url()"><a href="javascript:;" class="ui-btn">重新询价</a></div>
            <div class="ui-btn-group" v-if="state1=='20'" @click="sub()"><a class="ui-btn">下一步</a></div>
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toasts提示组件-->
        <toast :isshow='toast.isshow' @ontoastback='closetoast'>{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import {Common, valid, storage} from 'js/common';
import request from 'js/interface/request';
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
            loading: false, // 加载中
            serialId: '', // 流水号
            output: '',
            output1: '',
            carDetail: '', //信息填写时存储的数据
            querySts: '', // 报价详情列表
            state1: '1',
            time: '', // 询价时间
            url: '', //车险
            setTime: 'timer',
            adjust: '', // 方案储存
            adjust_first: false, // 判断第一次请求
            Interval: ''
        }
    },
    created () {
    },
    mounted () {
        this.serialId = Common.getQueryString('serialId');
        this.output = JSON.parse(storage.get('FQcompany'));
        this.querySts = Common.getQueryString('querySts');
        console.log(this.output)
        if (this.querySts) {
            this.carDetail = this.output;
            this.Interval = 0;
        } else {
            this.carDetail = JSON.parse(storage.get('FQcarDetail'));
            this.Interval = 1000;
        }
        setTimeout(() => {
            this.state1 = '1';
            this.getData();
            this.ins();
        }, this.Interval)
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
        // 循环提交
        ins () {
            // 5分钟
            let maxTime = 60 * 5;
            this.setTime = setInterval(() => {
                maxTime -= 15;
                if (parseInt(this.state1) === 20 || parseInt(this.state1) === -20) {
                    clearInterval(this.setTime);
                    return false;
                }
                if (maxTime <= 0) {
                    clearInterval(this.setTime);
                    return false;
                }
                this.getData();
            }, 15000)
        },
        getData () {
            let obj = {
                userId: storage.get('userId'),
                serialId: this.serialId // 流水号
            }
            request.getPriceDetail(obj, (response) => {
                console.log(response.data)
                this.multiLogin(response)
                if (response.data.respCode === '000000') {
                    let output = response.data.output
                    this.output1 = output.priceDetailRecord[0];
                    if (!this.adjust_first) {
                        console.log('第一次')
                        this.adjust = output.queryBenefitsRecord;
                        storage.set('FQSeeAdjust', JSON.stringify(this.adjust));
                    }
                    this.state1 = this.output1.querySts;
                    // 毫秒转换成日期
                    let data = new Date(this.output1.queryTime)
                    let hours = data.getHours();
                    let minutes = data.getMinutes();
                    if (parseInt(minutes) < 10) {
                        minutes = '0' + minutes;
                    }
                    this.time = hours + ':' + minutes;
                    storage.set('FQenquiry', JSON.stringify(this.output1));
                    this.adjust_first = true;
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // quu
        href_adjust () {
            if (this.adjust) {
                window.location.href = 'FQSeecarAdjust.html'
            } else {
                //
            }
        },
        // 重新报价
        href_url () {
            if (this.querySts) {
                this.enquiry()
            } else {
                window.location.href = 'FQcarInsure.html';
            }
        },
         // 重新询价
        enquiry () {
            storage.remove('FQcarDetail');
            let licenseNo = this.output.licenseNo;
            if (parseInt(licenseNo) !== 0) {
                var data = {
                    userId: storage.get('userId'),
                    licenseNo: licenseNo,
                    newCarFlag: 0
                }
                request.getCarInfo(data, (response) => {
                    console.log(response.data)
                    this.multiLogin(response)
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
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        sub () {
            window.location.href = 'FQOrderConfirm.html?serialId=' + this.serialId;
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
                    storage.set('prevPage', './FQcarOrderCheck.html?serialId=' + this.serialId);
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
        formatMoney (value) {
            if (!value) {
                return '';
            }
            return (value / 100).toFixed(2);
        }
    }
}
</script>
