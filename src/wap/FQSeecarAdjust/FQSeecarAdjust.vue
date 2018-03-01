<template>  
    <div id="body" :class="{isshow:!isWeiXin}" v-show="render">
        <div class="ui-scroll">
            <section>
             <!--交强险-->
                <div class="list" v-show="jqxList.length>0">
                        <div class="head">交强险调整</div>
                        <div class="itm" v-for="(item,index) in benefitList.jqxList" :class="{itm_border:index==jqxList.length-1}">
                            <p class="tata">
                                <span class="fl"  v-text="item.itemName"></span>
                                <span>
                                    <span class="fr" v-text="item.chooseAmount"></span>
                                </span>
                                 <span class="tata_center" v-show="item.franchiseFlag =='0'&&item.chooseAmount!='0'&&item.chooseAmount!=='不投保'">
                                    <i class="iconfont ico">&#xe6ad;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                                <span class="tata_center" v-show="item.franchiseFlag =='1'&&item.chooseAmount!='0'&&item.chooseAmount!=='不投保'">
                                    <i class="iconfont ico">&#xe617;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                            </p>    
                        </div>
                </div>
                <!--商业险-->
                <div class="list" v-show="syxList.length>0">
                        <div class="head">商业险调整</div>
                        <div class="itm" v-for="(item,index) in benefitList.syxList" :class="{itm_border:index==syxList.length-1}">
                            <p class="tata">
                                <span class="fl"  v-text="item.itemName"></span>
                                <span>
                                   <span class="fr" v-text="item.chooseAmount"></span>
                                </span>
                                 <span class="tata_center" v-show="item.franchiseFlag =='0'&&item.chooseAmount!='0'&&item.chooseAmount!=='不投保'">
                                    <i class="iconfont ico">&#xe6ad;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                                <span class="tata_center"  v-show="item.franchiseFlag =='1'&&item.chooseAmount!='0'&&item.chooseAmount!=='不投保'">
                                    <i class="iconfont ico">&#xe617;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                            </p>    
                        </div>
                </div>
                <!--附加-->
                <div class="list" v-show="fjxList.length>0">
                        <div class="head">附加险调整</div>
                        <div class="itm" v-for="(item,index) in benefitList.fjxList" :class="{itm_border:index==fjxList.length-1}">
                            <p class="tata">
                                <span class="fl"  v-text="item.itemName"></span>
                                <span>
                                    <span class="fr" v-text="item.chooseAmount"></span>
                                </span>
                                <span class="tata_center"  v-show="item.franchiseFlag =='0'&&item.chooseAmount!='0'&&item.chooseAmount!=='不投保'">
                                    <i class="iconfont ico">&#xe6ad;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                                <span class="tata_center" v-show="item.franchiseFlag =='1'&&item.chooseAmount!='0'&&item.chooseAmount!=='不投保'">
                                    <i class="iconfont ico">&#xe617;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                            </p>    
                        </div>
                </div>
            </section>
            <footer>
              <!--  <div class="fl" @click="recover()">恢复初始方案</div>
                <div class="fr" @click="sub()">确认</div>   
                -->
            </footer>
        </div>
        <div class="layer-shade" v-show="isshow">
           <div class="choose-city">
                <div class="title">
                    请选择投保
                    <span class="close" @click="closeChoose">
                        <i class="iconfont position">&#xe629;</i>
                    </span>
                </div>
                <div class="city-list">
                    <span class="city-item cur">
                        请选择
                    </span>
                </div>
                <ul class="cityDetail-list" v-if="true"> 
                    <li class="cityDetail-item" v-for="(item,index) in select.amountList" v-text="item.name" @click="select1(item)">
                    </li>
                </ul>
           </div>
        </div>
        <div class="layer-shade" v-show="isshow1">
            <div class="com_alert">
                <span class="fr fr_span" @click="close_alert()"><i class="iconfont">&#xe629;</i></span>
                <div class="center">
                    <div class="xun">询价金额为</div>
                    <div class="money1" v-show="money['sts0'] == '0'">询价中...</div>
                    <div class="money" v-show="money['sts0'] == '1'" v-text="money[0]"></div>
                    <div class="money1" v-show="money['sts0'] == '3'">服务器超时</div>
                    <div class="money1" v-show="money['sts0'] == '2'">暂无报价</div>
                </div>
                <div class="btn">
                    <div class="fl" @click="close_alert()">继续调整</div>
                    <div class="fr" @click="sureFun()">立即投保</div>
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
            render: false, // 渲染页面
            isTimeout: false,
            endTime: 0,
            loading: false, // 加载中
            dis: false,
            daIndex: '',
            isshow: false, // 弹窗
            isshow1: false,
            selected: true,
            carTypeSelect: '', // cokie
            benefitList: {}, // list
            list: {},
            benefitListArr: '',
            list_index: '', // list_index
            jqxList: '', // 交强
            syxList: '', // 商业
            qtxList: '', // 其他
            fjxList: '', // 附加
            select: '', // 底部选择
            index: '',
            serialId: '', //流水好
            modelCode: '',
            carPrice: '',
            carExtras: '',
            money: {}, // 询价集合
            money1: {},
            isWeiXin: ''
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
        this.getData()
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
        // 后台获取数据
        getData () {
            let output = storage.get('FQSeeAdjust');
            if (output) {
                output = JSON.parse(output);
                let syxList = [];
                let fjxList = [];
                let jqxList = [];
                for (let i = 0; i < output.length; i++) {
                    if (output[i].benefitCode.substring(0, 1) === 'Z') {
                        syxList.push(output[i])
                    } else if (output[i].benefitCode.substring(0, 1) === 'J') {
                        jqxList.push(output[i])
                    } else {
                        fjxList.push(output[i])
                    }
                }
                this.syxList = syxList;
                this.fjxList = fjxList;
                this.jqxList = jqxList;
                this.formatting(syxList, 'syxList');
                this.formatting(fjxList, 'fjxList');
                this.formatting(jqxList, 'jqxList');
                this.render = true;
            }
        },
        // 格式化后台数据
        formatting (data, name) {
            console.log(data)
            let list = [];
            for (let i = 0; i < data.length; i++) {
                let obj = {
                    itemCode: data[i].benefitCode,
                    itemName: data[i].benefitName,
                    itemType: data[i].typeName,
                    chooseAmount: data[i].insuredAmount,
                    franchiseFlag: data[i].franchiseFlag
                }
                list.push(obj)
            }
            this[name] = list;
            this.benefitList[name] = list;
            console.log(this.syxList)
        },
        // 确认跳转保险公司
        sub () {
            let syxList = this.benefitList.syxList;
            let arr = [];
            for (let i = 0; i < syxList.length; i++) {
                if (parseInt(syxList[i].chooseAmount) !== 0) {
                    arr.push(syxList[i])
                }
            }
            if (arr.length === 0) {
                this.showtoast('商业险必须投保一个', true);
                return false;
            }
            storage.set('FQcarTypeSelect', JSON.stringify(this.benefitList));
            window.location.href = 'FQcompany.html?serialId=' + Common.getQueryString('serialId');
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        change (flag) {
            let that = this;
            for (let key in that.benefitList) {
                let reg = /(List)$/;
                if (reg.test(key)) {
                    that.benefitList[key].map((obj) => {
                        if (flag) {
                            that.$set(obj, 'selected', false);
                        } else {
                            obj.selected = false;
                        }
                    })
                }
            }
        },
        // 显示下拉框
        show (item) {
            if (typeof item.selected === 'undefined') {
                this.change(true);
            } else {
                this.change(false);
            }
            item.selected = !item.selected;
            this.select = item
            this.isshow = true;
        },
        select1 (item) { // 点击
            let name = this.select.itemName;
            let that = this;
            for (let key in that.benefitList) {
                let reg = /(List)$/;
                if (reg.test(key)) {
                    that.benefitList[key].map((obj) => {
                        if (obj.itemName === name) {
                            obj.chooseAmount = item.value;
                            this.closeChoose();
                        }
                    })
                }
            }
        },
        disregard (item) { // 点击不计吗，免赔
            if (item.franchiseFlag.toString() === '1') {
                item.franchiseFlag = '0'
            } else {
                item.franchiseFlag = '1';
            }
        },
        recover () { // 回复原始方案
            this.isData();
        },
        closeChoose () { // 关闭投保底部
            this.isshow = false;
            this.change(false);
        },
        enquiry () { // 立即询价
            this.isshow1 = true;
            this.ins();
        },
        ins () { // 循环 benefitList 得到 benefitListArr
            var obenefitList = [];
            for (var i = 0; i < this.benefitList.fjxList.length; i++) {
                let itemCode = this.benefitList.fjxList[i].itemCode;
                let franchiseFlag = this.benefitList.fjxList[i].franchiseFlag;
                let chooseAmount = this.benefitList.fjxList[i].chooseAmount;
                let benefitItem = {
                    'chooseAmount': chooseAmount,
                    'franchiseFlag': franchiseFlag,
                    'itemCode': itemCode
                }
                obenefitList.push(benefitItem);
            }
            for (var k = 0; k < this.benefitList.syxList.length; k++) {
                let itemCode = this.benefitList.syxList[k].itemCode;
                let franchiseFlag = this.benefitList.syxList[k].franchiseFlag;
                let chooseAmount = this.benefitList.syxList[k].chooseAmount;
                let benefitItem = {
                    'chooseAmount': chooseAmount,
                    'franchiseFlag': franchiseFlag,
                    'itemCode': itemCode
                }
                obenefitList.push(benefitItem);
            }
            for (var h = 0; h < this.benefitList.qtxList.length; h++) {
                let itemCode = this.benefitList.qtxList[h].itemCode;
                let franchiseFlag = this.benefitList.qtxList[h].franchiseFlag;
                let chooseAmount = this.benefitList.qtxList[h].chooseAmount;
                let benefitItem = {
                    'chooseAmount': chooseAmount,
                    'franchiseFlag': franchiseFlag,
                    'itemCode': itemCode
                }
                obenefitList.push(benefitItem);
            }
            for (var z = 0; z < this.benefitList.jqxList.length; z++) {
                let itemCode = this.benefitList.jqxList[z].itemCode;
                let franchiseFlag = this.benefitList.jqxList[z].franchiseFlag;
                let chooseAmount = this.benefitList.jqxList[z].chooseAmount;
                let benefitItem = {
                    'chooseAmount': chooseAmount,
                    'franchiseFlag': franchiseFlag,
                    'itemCode': itemCode
                }
                obenefitList.push(benefitItem);
            }
            this.benefitListArr = obenefitList;
            this.getData1(0);
            this.time15();
        },
        // 过期时间
        getEndTime (second) {
            let sTime = storage.get('carAdjustTime');
            let endTime = '';
            if (sTime) {
                endTime = new Date().getTime() >= sTime ? new Date().getTime() + second * 1000 : sTime;
            } else {
                endTime = new Date().getTime() + second * 1000;
            }
            storage.set('carAdjustTime', endTime);
            return endTime;
        },
        // 倒计时
        time15 () {
            // 毫秒
            this.endTime = this.getEndTime(15);
            Common.countdown(this.time, this.endTime, this.isTimeout, (time, isTimeout) => {
                this.time = time;
                this.isTimeout = isTimeout;
                if (this.isTimeout) {
                    if (this.money['sts0'] === '0') {
                        this.money['sts0'] = '3' // 暂无报价
                    }
                }
            });
        },
        getData1 (val) {
            var data = {
                serialId: this.serialId,
                modelCode: this.modelCode,
                carPrice: this.carPrice,
                carExtras: this.carExtras,
                benefitList: this.benefitListArr
            }
            let sts = 'sts' + val;
            if (this.money[sts] === undefined || this.money[sts] === 'undefined') {
                this.$set(this.money, sts, '0') // 询价中
                this.$set(this.money, val.toString(), '');
            } else {
                this.money[sts] = '0' // 询价中
                this.money[val] = ''
            }
            request.getCarInsCalc(data, (response) => {
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    this.money[val] = response.data.output.totalPreium;
                    this.money[sts] = '1' // 成功
                    let obj = {
                        totalPreium: output.totalPreium, // 总保费
                        jqPreium: output.jqPreium, // 交强险保费
                        ccsTax: output.ccsTax, // 车船险保费
                        carExtras: output.carExtras
                    }
                    this.money1[0] = obj;
                } else {
                    this.money[sts] = '2' // 暂无报价
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        close_alert () { // 关闭弹窗
            this.isshow1 = false;
        },
        sureFun () { //点击确定
            let money1 = this.money1[0];
            if (this.money[0] !=='') {
                let index = this.list_index;
                this.carTypeSelect.benefitList[index] = this.benefitList;
                storage.set('carTypeSelect', JSON.stringify(this.carTypeSelect));
                let obj = {
                    totalPreium: money1.totalPreium, // 总保费
                    jqPreium: money1.jqPreium, // 交强险保费
                    ccsTax: money1.ccsTax, // 车船险保费
                    carExtras: money1.carExtras
                }
                storage.set('totalPreium', JSON.stringify(obj));
                storage.remove('carAdjustTime');
                window.location.href = 'carOrderConfirm.html?serialId=' + this.serialId + '&id=' + index;
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
                    storage.set('prevPage', './FQSeecarAdjust.html');
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
    }
}
</script>
