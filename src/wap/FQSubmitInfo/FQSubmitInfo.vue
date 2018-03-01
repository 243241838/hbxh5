<template>
    <div class="container">
        <div v-if="!loading">
            <div class="info">请上传您的身份证和车辆证件</div>
            <div>
                <div class="flexbox flex-column pictureBox">
                    <a v-show="front_card=='0'" href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img class="radius" src="./images/shenfenzheng.jpg" alt="">
                            <input class="file" id="file1" type="file" accept="image/*" capture="camera" @change="addListenerUP($event, 'car_front_id_card')">
                        </div>
                    </a>
                    <a v-show="front_card=='1'"  href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img v-show="showSrc1" class="radius" :src="showSrc1" alt="">
                        </div>
                        <i @click="front_card='0';" class="iconfont delete">&#xe625;</i>
                    </a>
                    <a v-show="front_card=='2'" href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img v-show="showSrc1" class="radius" :src="showSrc1" alt="">
                            <span class="gray"></span>
                            <img class="shuiyin" src="./images/shuiyin.png" alt="">
                            <div class="caremaBox flexbox justify-content align-items flex-column">
                                <input  class="file" id="file1" type="file" accept="image/*" capture="camera" @change="addListenerUP($event, 'car_front_id_card')">
                                <img class="carema" src="./images/carema.png" alt="">
                                <span class="reup">点击重新上传</span>
                            </div>
                        </div>
                        <img class="noSuccessImg" src="./images/noSuccess.png" alt="">
                    </a>
                    <a v-show="front_card=='3'" href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img v-show="showSrc1" class="radius" :src="showSrc1" alt="">
                            <span class="gray"></span>
                            <img class="shuiyin" src="./images/shuiyin.png" alt="">
                        </div>
                        <img class="noSuccessImg" src="./images/yes.png" alt="">
                    </a>
                    <a v-show="back_card=='0'" href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img src="./images/reverse.jpg" alt="">
                            <input  class="file" id="file2" type="file" accept="image/*" capture="camera" @change="addListenerUP($event, 'car_back_id_card')">
                        </div>
                    </a>
                    <a v-show="back_card=='1'"  href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img v-show="showSrc2" class="radius" :src="showSrc2" alt="">
                        </div>
                        <i @click="back_card='0';" class="iconfont delete">&#xe625;</i>
                    </a>
                    <a v-show="back_card=='2'" href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img v-show="showSrc2" class="radius" :src="showSrc2" alt="">
                            <span class="gray"></span>
                            <img class="shuiyin" src="./images/shuiyin.png" alt="">
                            <div class="caremaBox flexbox justify-content align-items flex-column">
                                <input  class="file" id="file1" type="file" accept="image/*" capture="camera" @change="addListenerUP($event, 'car_back_id_card')">
                                <img class="carema" src="./images/carema.png" alt="">
                                <span class="reup">点击重新上传</span>
                            </div>
                        </div>
                        <img class="noSuccessImg" src="./images/noSuccess.png" alt="">
                    </a>
                    <a v-show="back_card=='3'" href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img v-show="showSrc2" class="radius" :src="showSrc2" alt="">
                            <span class="gray"></span>
                            <img class="shuiyin" src="./images/shuiyin.png" alt="">
                        </div>
                        <img class="noSuccessImg" src="./images/yes.png" alt="">
                    </a>
                    <a v-show="travel_card=='0'" href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img src="./images/xingshizheng.jpg" alt="">
                            <input  class="file" id="file3" type="file" accept="image/*" capture="camera" @change="addListenerUP($event, 'car_travel')">
                        </div>
                    </a>
                    <a v-show="travel_card=='1'"  href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img v-show="showSrc3" class="radius" :src="showSrc3" alt="">
                        </div>
                        <i @click="travel_card='0';" class="iconfont delete">&#xe625;</i>
                    </a>
                    <a v-show="travel_card=='2'" href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img v-show="showSrc3" class="radius" :src="showSrc3" alt="">
                            <span class="gray"></span>
                            <img class="shuiyin" src="./images/shuiyin.png" alt="">
                            <div class="caremaBox flexbox justify-content align-items flex-column">
                                <input  class="file" id="file1" type="file" accept="image/*" capture="camera" @change="addListenerUP($event, 'car_travel')">
                                <img class="carema" src="./images/carema.png" alt="">
                                <span class="reup">点击重新上传</span>
                            </div>
                        </div>
                        <img class="noSuccessImg" src="./images/noSuccess.png" alt="">
                    </a>
                    <a v-show="travel_card=='3'" href="javascript:void(0);" class='flex'>
                        <div class="card">
                            <img v-show="showSrc3" class="radius" :src="showSrc3" alt="">
                            <span class="gray"></span>
                            <img class="shuiyin" src="./images/shuiyin.png" alt="">
                        </div>
                        <img class="noSuccessImg" src="./images/yes.png" alt="">
                    </a>
                </div>
                <pre id="console"></pre>
            </div>
            <div class="tips">
                <i class="iconfont">&#xe61c;</i>
                <span>小贴士：提供清晰的照片能提高审核通过率</span>
            </div>
            <!--车辆补充-->
            <div class="subButton" v-if="isInfo">
                <a v-show="green" href="javascript:void(0);" class="bbtn green" @click="supplementCommit">确定</a>
                <a v-show="!green" href="javascript:void(0);" class="bbtn" @click="supplementCommit">确定</a>
            </div>
            <!--跳到链钱-->
            <div class="subButton" v-if="!isInfo">
                <a v-show="green" href="javascript:void(0);" class="bbtn green" @click="submit">确定</a>
                <a v-show="!green" href="javascript:void(0);" class="bbtn" @click="submit">确定</a>
            </div>
            <form id="form" style="display:none;" action="http://api.51hqb.cn/hbx/enroll" method="post">
                <input id="car_engine" type="text" name="car_engine"/>
                <input id="car_vin" type="text" name="car_vin"/>
                <input id="car_model" type="text" name="car_model"/>
                <input id="car_idCard" type="text" name="car_idCard"/>
                <input id="owner_name" type="text" name="owner_name"/>
                <input id="owner_number" type="text" name="owner_number"/>
                <input id="owner_phone" type="text" name="owner_phone"/>
                <input id="order_no" type="text" name="order_no"/>
                <input id="order_total" type="text" name="order_total"/>
                <input id="order_force" type="text" name="order_force"/>
                <input id="order_tax" type="text" name="order_tax"/>
                <input id="order_com" type="text" name="order_com"/>
                <input id="order_time" type="text" name="order_time"/>
                <input id="return_url" type="text" name="return_url"/>
                <input id="sign" type="text" name="sign"/>
                <input id="owner_idCard1" type="text" name="owner_idCard1">
                <input id="owner_idCard2" type="text" name="owner_idCard2">
                <input id="order_insurance" type="text" name="order_insurance">
            </form>
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
        <loading :isshow="loading2"></loading>
    </div>
</template>
<script>
import {Common, storage, valid} from 'js/common';
import toast from '../../components/toast'; // toast引用
import loading from '../../components/loading';
import request from 'js/interface/request';
import layer from '../../components/layer'
import urlutil from 'url';
// import co from 'co';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        toast,
        loading,
        layer
    },
    data () {
        return {
            showImg: '',
            loading: false,
            loading2: false,
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
            front_card: '0', // 0:初始化状态,1:上传成功显示状态,2:审核失败状态,3:审核成功状态
            back_card: '0',
            travel_card: '0',
            output: {},
            client: '',
            noClient: false,
            userId: '',
            content: '1231321', // content
            src1: '',
            src2: '',
            src3: '',
            showSrc1: '',
            showSrc2: '',
            showSrc3: '',
            orderInfo: {},
            info: {}, // 待补充信息
            isInfo: false // 是否是待补充信息
        }
    },
    created () {
        this.init();
    },
    mounted () {
        this.orderInfo = JSON.parse(storage.get('FQOrderConfirm'));
        console.log(this.orderInfo)
        this.resetBody();
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
    },
    computed: {
        green () {
            if ((this.front_card === '1' || this.front_card === '3') && (this.back_card === '1' || this.back_card === '3') && (this.travel_card === '1' || this.travel_card === '3')) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        initWeixinSDK () {
            let obj = {
                url: window.location.href
            }
            request.getWXJsAPISignature(obj, (response) => {
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
        // 待补充信息
        supplement () {
            if (Common.getQueryString('tradeId')) {
                this.info = JSON.parse(storage.get('FQOrerList'));
                this.isInfo = true;
                // 审核不通过
                if (parseInt(this.info.frontIdCardSts) === 0) {
                    this.showSrc1 = this.info.frontIdCardImg + '?time=' + new Date().getTime();
                    this.front_card = '2';
                } else {
                    // 审核通过
                    this.showSrc1 = this.info.frontIdCardImg + '?time=' + new Date().getTime();
                    this.front_card = '3';
                }
                if (parseInt(this.info.backIdCardSts) === 0) {
                    this.showSrc2 = this.info.backIdCardImg + '?time=' + new Date().getTime();
                    this.back_card = '2';
                } else {
                    this.showSrc2 = this.info.backIdCardImg + '?time=' + new Date().getTime();
                    this.back_card = '3';
                }
                if (parseInt(this.info.travelLicenseSts) === 0) {
                    this.showSrc3 = this.info.travelLicenseImg + '?time=' + new Date().getTime();
                    this.travel_card = '2';
                } else {
                    this.showSrc3 = this.info.travelLicenseImg + '?time=' + new Date().getTime();
                    this.travel_card = '3';
                }
            }
        },
        init () {
            // 待补充信息
            this.supplement();
            let obj = {
                userId: Common.getUserId(),
                uploadType: 'installment_car'
            }
            this.userId = obj.userId;
            request.getOssToken(obj, (response) => {
                // 账户已经在其他设备上登录
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    this.output = response.data.output;
                    let isClient = this.getClient(this.output);
                    if (isClient) {
                        this.client = isClient;
                    } else {
                        // 阿里云不支持
                        this.noClient = true;
                    }
                    this.loading = false;
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        addListenerUP (e, uploadType) {
            var file = e.target.files[0];
            var storeAs = this.output.filePath + this.userId + '_' + uploadType + '.jpg';// 存储路径
            this.loading2 = true;
            this.client.multipartUpload(storeAs, file, {
                headers: {
                    'x-oss-callback': this.encodeCallback({
                        url: this.output.notifyUrl,
                        query: {user: 'js-sdk'},
                        body: 'uploadType='+ uploadType +'&content=' + this.content
                    })
                }
            }).then((result) => {
                if (result.data.respCode === '000000') {
                    if (uploadType === 'car_front_id_card') {
                        this.src1 = this.output.domainUrl + '/' + result.name;
                        this.showSrc1 = this.output.domainUrl + '/' + result.name + '?time=' + new Date().getTime();
                        this.front_card = '1';
                    } else if (uploadType === 'car_back_id_card') {
                        this.src2 = this.output.domainUrl + '/' + result.name;
                        this.showSrc2 = this.output.domainUrl + '/' + result.name + '?time=' + new Date().getTime();
                        this.back_card = '1';
                    } else if (uploadType === 'car_travel') {
                        this.src3 = this.output.domainUrl + '/' + result.name;
                        this.showSrc3 = this.output.domainUrl + '/' + result.name + '?time=' + new Date().getTime();
                        this.travel_card = '1';
                    }
                } else {
                    this.showtoast(result.data.respMsg, true);
                }
                this.loading2 = false;
            }).catch(() => {
                this.loading2 = false;
                this.showtoast('网络错误，请查看网络是否连接', true);
            });
        },
        getClient (params) {
            let client = '';
            try {
                client = new window.OSS.Wrapper({
                    region: params.region,
                    accessKeyId: params.accessKeyId,
                    accessKeySecret: params.accessKeySecret,
                    stsToken: params.securityToken,
                    bucket: params.bucketName
                });
            } catch (err) {
                client = false;
                this.alertShow2('您的浏览器不支持图片上传，请用微信浏览器打开!');
            }
            if (client) {
                return client;
            } else {
                return false;
            }
        },
        encodeCallback (cb) {
            let url = urlutil.parse(cb.url);
            url.query = cb.query;
            var json = {
                callbackUrl: url.format(),
                callbackBody: cb.body,
                callbackBodyType: cb.contentType || 'application/x-www-form-urlencoded'
            };
            return new Buffer(JSON.stringify(json)).toString('base64');
        },
        // 提交
        submit () {
            // 未通过不能提交
            if (!this.green) {
                return;
            }
            this.orderInfo.frontIdCardImg = this.src1;
            this.orderInfo.backIdCardImg = this.src2;
            this.orderInfo.travelLicenseImg = this.src3;
            window.headers.sessionId = storage.get('sessionId');
            // 全额
            this.loading2 = true;
            if (this.orderInfo.installmentFlg === '0') {
                request.applyInstallmentOrder(this.orderInfo, (response) => {
                    console.log(response);
                    this.multiLogin(response);
                    if (response.data.respCode === '900002') {
                        // 重复下单
                        this.alertShow2(response.data.respMsg);
                    } else if (response.data.respCode === '000000') {
                        let output = response.data.output;
                        window.location.href = './FQPaySuccess.html?tradeId=' + output.order_no + '&FQOrerList=true';
                    }
                    this.loading2 = false;
                }, () => {
                    this.loading2 = false;
                    this.showtoast('网络错误，请查看网络是否连接', true);
                })
            } else if (this.orderInfo.installmentFlg === '1') {
                // 分期
                // 提交车险订单 12.9
                request.applyInstallmentOrder(this.orderInfo, (response) => {
                    console.log(response);
                    this.multiLogin(response);
                    if (response.data.respCode === '900002') {
                        // 重复下单
                        this.alertShow2(response.data.respMsg);
                    } else if (response.data.respCode === '000000') {
                        let output = response.data.output;
                        document.getElementById('car_engine').value = output.car_engine;// 车辆发动机号
                        document.getElementById('car_vin').value = output.car_vin;// 车辆识别代码
                        document.getElementById('car_model').value = output.car_model;// 车辆型号，空格用_代替
                        document.getElementById('car_idCard').value = output.car_idCard;// 车辆证件照片URL
                        document.getElementById('owner_name').value = output.owner_name;// 车主姓名
                        document.getElementById('owner_number').value = output.owner_number;// 车主证件号
                        document.getElementById('owner_phone').value = output.owner_phone;// 车主手机号
                        document.getElementById('order_no').value = output.order_no;// 汇报险订单号
                        document.getElementById('order_total').value = output.order_total;// 订单金额
                        document.getElementById('order_force').value = output.order_force;// 交强险金额
                        document.getElementById('order_tax').value = output.order_tax;// 车船税
                        document.getElementById('order_com').value = output.order_com;// 商险金额
                        document.getElementById('order_time').value = output.order_time;// 保单提交时间
                        document.getElementById('return_url').value = output.return_url;// 错误回调URL
                        document.getElementById('sign').value = output.sign;// 签名
                        document.getElementById('owner_idCard1').value = output.owner_idCard1;// 身份证正面照片
                        document.getElementById('owner_idCard2').value = output.owner_idCard2;// 身份证反面照片
                        document.getElementById('order_insurance').value = output.order_insurance;// 保险公司名称
                        document.querySelector('#form').submit();
                    }
                    this.loading2 = false;
                }, () => {
                    this.loading2 = false;
                    this.showtoast('网络错误，请查看网络是否连接', true);
                })
            }
        },
        // 待补充信息 提交
        supplementCommit () {
            // 未通过不能提交
            if (!this.green) {
                return;
            }
            this.info.frontIdCardImg = this.src1;
            this.info.backIdCardImg = this.src2;
            this.info.travelLicenseImg = this.src3;
            this.info.tradeId = Common.getQueryString('tradeId');
            console.log(this.info);
            this.loading2 = true;
            request.updateImg(this.info, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    console.log(response);
                    // 成功返回订单列表
                    this.showtoast('补充信息成功', true);
                    setTimeout(() => {
                        window.history.back();
                        return false;
                    }, 1000)
                }
                this.loading2 = false;
            }, () => {
                this.loading2 = false;
                this.showtoast('网络错误，请查看网络是否连接', true);
            });
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
                    // 资料待补充跳过来
                    if (Common.getQueryString('tradeId')) {
                        storage.set('prevPage', './FQSubmitInfo.html?tradeId=' + Common.getQueryString('tradeId'));
                    } else {
                        // 正常下单
                        storage.set('prevPage', './FQSubmitInfo.html');
                    }
                    // 用户未登录
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        alertShow2 (value) { // alert实例
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
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
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        resetBody () {
            this.$nextTick(() => {
                Common.setFullScreen()
            })
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
            } else if (response.data.respCode !== '000000' && response.data.respCode !== '900002') {
                this.showtoast(response.data.respMsg, true);
            }
        }
    }
}
</script>
