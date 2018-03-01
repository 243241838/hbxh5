<template>
    <div id="body" :class="{isWeiXin:isWeiXin}">
        <div class="progress" v-show="asynchronous">
            <div class="write">
                <img src="./images/write.gif" alt="">
                <div class="green" id="green"></div>
            </div>
            <div>
                <img src="./images/bounce.gif" alt="">
                <div>正在审核中...</div>
            </div>
        </div>
        <ul class="info-list">
            <li class="info-item" v-show="false">
                <span v-text="carDate.insurerName"></span>
                <span>-</span>
                <span v-text="carDate.licenseNo == 0 ? '新车未上牌' :carDate.licenseNo"></span>
                <span class="fr"><i class="iconfont"></i></span>
            </li>
        </ul>
        <div class="check-list">
            <div class="check-item" :class="{'cur': state1=='3'}">
                <i class="iconfont" v-show="state1!='3'">&#xe645;</i>
                <i class="iconfont" v-show="state1==3">&#xe649;</i>
                <p class="big">已提交保险公司审核</p>
                <p class="small">
                     <span v-text="data">
                     </span>提交<span v-text="carDate.insurerName"></span>核保
                </p>  
            </div>
            <div class="check-item" :class="{'cur': state=='0'}" v-show="state!=-1">
                <i class="iconfont" v-show="state!='0'">&#xe646;</i>
                <i class="iconfont" v-show="state=='0'">&#xe644;</i>
                <p class="big" v-show="state1=='3'">稍后返回核保结果</p>
                <p class="big" v-show="state=='0'">正在审核中</p>
                <p class="small" v-show="state=='0' && !asynchronous">稍后返回核保结果</p>
                <p class="small" v-show="state=='0' && asynchronous">保险公司忙，您可以稍后在订单中查看结果。</p>
                <p class="big" v-show="state=='1'">核保通过</p>
                <p class="small" v-show="state=='1'">支付链接以短信发送你的手机</p>
            </div>
            <div class="check-item no-border" v-show="state!='-1'" :class="{'cur': state=='1'}">
                <i class="iconfont" v-show="state !='1'">&#xe643;</i>
                <i class="iconfont" v-show="state =='1'">&#xe647;</i>
                <p class="big last">支付订单</p>
                <p class="small" v-show="state=='1'">
                    初始报价：￥<span v-text="carDate.totalPreium"></span>
                </p>
                <p class="small" v-show="state=='1'">
                    核保价格：￥<span class="orange" v-text="output.totalPreium"></span>
                </p>
            </div>
            <div class="check-item no-border" v-if="state=='-1'" :class="{'fail': state=='-1'}">
                <i class="iconfont">&#xe648;</i>
                <p class="big last">核保失败</p>
                <p class="small ellip"><span v-text="carDate.insurerName"></span>反馈：<span v-text="output.msg"></span></p>
            </div>
        </div>
        <div class="check-tip">
            <p>温馨提示：本产品由<span v-text="carDate.insurerName"></span>承保。</p>
            <p>联系电话：<span v-text="carDate.phone"></span></p>   
        </div>
        <div class="foot" v-show="state=='-1'||state=='1'">
            <div class="ui-btn-group" v-if="state=='-1'"><a :href="url" class="ui-btn">重新选择</a></div>
            <div class="ui-btn-group" v-if="state=='1'" @click="sub()"><a class="ui-btn">确认支付</a></div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow='toast.isshow' @ontoastback='closetoast'>{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import axios from 'axios'
import {Common, valid, storage} from 'js/common'
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
            data: '', // 时间
            output: '', // 核保数据
            carDate: '', // 车辆信息和保险公司
            state: '',
            state1: '3',
            tradeId: '',
            url: '', //车险
            msg: '', //失败返回原因
            isWeiXin: '',
            serialId: '', //流水号
            setTime: '', // 定时器
            setTime1: '', //进度条
            green: '', //进度条dom
            tradeSts: '', // 大地状态
            asynchronous: false // 进度条出现与否
        }
    },
    created () {
        this.go_car();// 获取车险类型code
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
        this.green = document.getElementById('green');
        setTimeout(() => {
            this.state1 = '';
            this.state = this.output.state;
        }, 1000)
    },
    watch: {
    },
    methods: {
         //获取车险的类型code
        go_car () {
            let obj = {
                parentId: '0'
            }
            request.getProductTypeNew(obj, (response) => {
                if (response.data.respCode === '000000') {
                    // console.log(response.data.output)
                    let output = response.data.output;
                    if (output.typeList.length > 0) {
                        for (let i = 0; i < output.typeList.length; i++) {
                            //当clasType为1时为车险
                            if (parseInt(output.typeList[i].classType) === 1) {
                                this.productType = output.typeList[i].typeId;
                                console.log(output.typeList[i])
                            }
                        }
                        this.ins(); // 初始化数据
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            });
        },
        //初始化
        ins () {
            this.serialId = Common.getQueryString('serialId');
            //获取时间
            let data = new Date();
            let m = data.getMinutes()<10 ? '0'+data.getMinutes() : data.getMinutes()
            this.data = data.getHours() + ':' + m;
            if (this.serialId) {
                // 如果有代表是从订单确认过来的
                this.getData();
            } else {
                // 没有代表从订单详情过来的
                this.getDetail();
            }
            //失败时跳转车险商城
            if (this.productType) {
                this.url = 'productList.html?productType=' + this.productType;
                console.log(this.productType)
            }
        },
        //整合订单确认时的数据
        getData () {
            //订单确认时存取的数据
            let carOrderConfirm = storage.get('carOrderConfirm');
            if (carOrderConfirm) {
                carOrderConfirm = JSON.parse(carOrderConfirm);
                this.output = carOrderConfirm.output;
                this.msg = carOrderConfirm.respMsg; //返回提示失败时用
                this.carDate = this.output.obj; // 车辆及保险公司数据
                this.asynchronous = this.output.asynchronous; //进度条出现与否 true出现
                //大地时核保中循环提交
                if (this.output.asynchronous) {
                    this.circulation(); // 循环
                }
                //成功保存状态 返回时不允许选择地址
                if (this.output.state === '1') {
                    storage.set('carOrderCheck', '1')
                }
            }
        },
        //整合订单详情的数据
        getDetail () {
            //订单详情存取的数据
            let orderDetailChe = storage.get('orderDetailChe');
            if (orderDetailChe) {
                orderDetailChe = JSON.parse(orderDetailChe);
                console.log(orderDetailChe)
                this.carDate = {
                    licenseNo: orderDetailChe.insuredList[0].carInfo.licenseNo, // 车牌号
                    insurerName: orderDetailChe.insurerName, // 保险公司名称
                    phone: orderDetailChe.insurerTels, // 保险公司电话
                    totalPreium: orderDetailChe.tradePremium // 询价保费
                }
                this.asynchronous = true; // 核保中状态条出现
                this.output = {
                    tradeId: orderDetailChe.tradeId, // 订单
                    state: 0, // 核保中
                    tradePremium: orderDetailChe.payAmount, // 实付金额
                    msg: '' // 核保失败出现的原因
                }
                this.circulation(); // 大地循环
            }
        },
        // 循环提交
        circulation () {
            let maxTime = 60 * 2;
            let number = 1;
            this.setTime1 = setInterval(() => {
                number++;
                if (number === 85) {
                    clearInterval(this.setTime1);
                }
                this.green.style.width = number + '%';
            }, 100);
            this.getState();
            this.setTime = setInterval(() => {
                maxTime -= 3;
                // -7核保中 10 成功
                if (this.tradeSts === '-7' || this.tradeSts === '10') {
                    clearInterval(this.setTime);
                    clearInterval(this.setTime1);
                    if (this.tradeSts === '-7') {
                        this.state = '-1';  //失败-1 核保中0 失败-1
                    } else if (this.tradeSts === '10') {
                        this.state = '1';
                        this.green.style.width = '100%';
                        //成功保存状态 返回时不允许选择地址
                        storage.set('carOrderCheck', '1')
                    }
                    this.asynchronous = false;
                    return false;
                }
                if (maxTime <= 0) {
                    clearInterval(this.setTime);
                    return false;
                }
                this.getState();
            }, 10000)
        },
        //大地核保中循环获取状态
        getState () {
            let obj = {
                userId: storage.get('userId'),
                tradeId: this.output.tradeId
            }
            request.getOrderStatus(obj, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (output) {
                        this.tradeSts = output.tradeSts; // 7审核中 10成功 -7失败
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.loading = false;
                this.showtoast(error, true);
            });
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        sub () {
            let obj = {
                userId: storage.get('userId'),
                tradeId: this.output.tradeId
            }
            console.log(obj)
            request.reqCarInsPay(obj, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    // orderNo: 'bbkj00000000000166248058', // 流水号
                    // payType: '7',
                    // pageUrl: 'https://www.baidu.com', // 回调url
                    // wxOpenId: ''
                    let url = response.data.output.payUrl
                    console.log(response.data.output)
                    // window.location.href = url + '?orderNo=' + Common.getQueryString('serialId') + '&payType=7&pageUrl=' + 'http://10.1.100.144:8083/views/paymentSuccess.html?tradeId=' + this.output.tradeId + '&wxOpenId=' + '';
                    window.location.href = url;
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            });
        }
    },
    filters: {
    }
}
</script>
