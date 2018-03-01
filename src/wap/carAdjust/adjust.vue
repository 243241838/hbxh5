<template>  
    <div id="body" :class="{isWeiXin:isWeiXin}">
        <div class="ui-scroll">
            <section>
                <!--交强险-->
                <div class="list" v-show="jqxList.length>0">
                        <div class="head">交强险调整</div>
                        <div class="itm" v-for="(item,index) in benefitList.jqxList" :class="{itm_border:index==jqxList.length-1}">
                            <p class="tata">
                                <span class="fl"  v-text="item.itemName"></span>
                                <span @click="show(item, index)">
                                     <span class="fr">
                                        <i class="iconfont ic1" v-show="item.selected">&#xe611;</i>
                                        <i class="iconfont ic1" v-show="!item.selected">&#xe612;</i>
                                    </span>
                                    <span class="fr" v-show="item.chooseAmount ==item1.amountCode" v-for="item1 in item.amountList" v-text="item1.amountName"></span>
                                </span>
                                <span class="tata_center" @click="disregard(item)" v-show="item.franchiseFlag =='0'">
                                    <i class="iconfont ico">&#xe6ad;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                                <span class="tata_center" @click="disregard(item)" v-show="item.franchiseFlag =='1'">
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
                                <span @click="show(item, index)">
                                     <span class="fr">
                                        <i class="iconfont ic1" v-show="item.selected">&#xe611;</i>
                                        <i class="iconfont ic1" v-show="!item.selected">&#xe612;</i>
                                    </span>
                                    <span class="fr" v-show="item.chooseAmount ==item1.amountCode" v-for="item1 in item.amountList" v-text="item1.amountName"></span>
                                </span>
                                 <span class="tata_center" @click="disregard(item)" v-show="item.franchiseFlag =='0'&&item.chooseAmount!='0'">
                                    <i class="iconfont ico">&#xe6ad;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                                <span class="tata_center" @click="disregard(item)" v-show="item.franchiseFlag =='1'&&item.chooseAmount!='0'">
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
                                <span @click="show(item, index)">
                                     <span class="fr">
                                        <i class="iconfont ic1" v-show="item.selected">&#xe611;</i>
                                        <i class="iconfont ic1" v-show="!item.selected">&#xe612;</i>
                                    </span>
                                    <span class="fr" v-show="item.chooseAmount ==item1.amountCode" v-for="item1 in item.amountList" v-text="item1.amountName"></span>
                                </span>
                                <span class="tata_center" @click="disregard(item)" v-show="item.franchiseFlag =='0'">
                                    <i class="iconfont ico">&#xe6ad;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                                <span class="tata_center" @click="disregard(item)" v-show="item.franchiseFlag =='1'">
                                    <i class="iconfont ico">&#xe617;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                            </p>    
                        </div>
                </div>
                <!--其它附加-->
                 <div class="list" v-show="qtxList.length>0">
                        <div class="head">其它附加险调整</div>
                        <div class="itm" v-for="(item,index) in benefitList.qtxList" :class="{itm_border:index==qtxList.length-1}">
                            <p class="tata">
                                <span class="fl"  v-text="item.itemName"></span>
                                <span @click="show(item, index)">
                                     <span class="fr">
                                        <i class="iconfont ic1" v-show="item.selected">&#xe611;</i>
                                        <i class="iconfont ic1" v-show="!item.selected">&#xe612;</i>
                                    </span>
                                    <span class="fr" v-show="item.chooseAmount ==item1.amountCode" v-for="item1 in item.amountList" v-text="item1.amountName"></span>
                                </span>
                                <span class="tata_center" @click="disregard(item)" v-show="item.franchiseFlag =='0'">
                                    <i class="iconfont ico">&#xe6ad;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                                <span class="tata_center" @click="disregard(item)" v-show="item.franchiseFlag =='1'">
                                    <i class="iconfont ico">&#xe617;</i>
                                    <span class="disregard">不计免赔</span>
                                </span>
                            </p>    
                        </div>
                </div>
            </section>
            <footer>
                <div  class="fl">
                     <div @click="recover()">恢复初始方案</div>
                </div>
                <div class="fr">
                     <div  @click="enquiry()">立即询价</div>            
                </div>
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
                    <li class="cityDetail-item" v-for="(item,index) in select.amountList" v-text="item.amountName" @click="select1(item)">
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
                        <div @click="getData1(0, undefined, 'load')" class="load flexbox align-items justify-content">
                            <img src="./images/load.png" alt="">
                        </div>
                    </div>
                    <div class="foot flexbox">
                          <div class="flex" @click="off_code()">取消</div>
                          <div class="flex" @click="getData1(0, 'isJs')">确定</div>
                    </div>
               </div>
        </div>
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
import request from 'js/interface/request'
import md5 from 'md5';
import Vue from 'vue'
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
            time: {
                seconds: 0
            },
            isTimeout: false,
            endTime: 0,
            loading: false, // 加载中
            dis: false,
            daIndex: '',
            isshow: false, // 弹窗
            isshow1: false,
            selected: true,
            carTypeSelect: '', // cokie
            benefitList: '', // list
            benefitList1: [], // 后台返回
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
            isWeiXin: '',
            traffFlag: '', //1:交强险+商业险0:商业险
            codeiSshow: false, // 验证码出现
            img_code: '', // 二维码
            checkNo: '', // 车辆交管查询码 大地江苏地区查询车型会返回
            checkCode: '' // 车辆交管验证码 大地江苏地区查询车型会返回
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
        this.$nextTick(() => {
            this.getData();// 获取数据
        })
    },
    computed: {
    },
    methods: {
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        getData () { // 获取数据
            this.carTypeSelect = JSON.parse(storage.get('carTypeSelect'));
            this.list_index = Common.getQueryString('index');
            this.benefitList = this.carTypeSelect.benefitList[this.list_index];
            // console.log(this.benefitList)
            this.serialId = Common.getQueryString('serialId');
            // this.modelCode = this.carTypeSelect.modelCode;
            // this.carPrice = this.carTypeSelect.carPrice;
            // this.carExtras = this.carTypeSelect.carExtras;
            this.jqxList = this.benefitList.jqxList;
            this.syxList = this.benefitList.syxList;
            // console.log(this.syxList)
            this.fjxList = this.benefitList.fjxList;
            this.qtxList = this.benefitList.qtxList;
            // console.log(this.benefitList)
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
                            obj.chooseAmount = item.amountCode;
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
            this.getData();
        },
        closeChoose () { // 关闭投保底部
            this.isshow = false;
            this.change(false);
        },
        enquiry () { // 立即询价
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
        //询价
        getData1 (val, isJs, load) {
            this.loading = true;
            if (isJs) {
                if (this.checkCode.length === 0) {
                    this.showtoast('验证码不能为空', true);
                    this.loading = false;
                    return false;
                }
            }
            //刷新清空验证码
            if (load) {
                this.empty();
            }
            this.time15();
            var data = {
                serialId: this.serialId, // 流水号
                modelCode: this.carTypeSelect.modelCode, // 车辆品牌
                carPrice: this.carTypeSelect.carPrice, //参考价格
                carExtras: this.carTypeSelect.carExtras, // 附加字段
                benefitList: this.benefitListArr, // 方案
                traffFlag: this.benefitList.jqxList[0].chooseAmount, // 1:交强险+商业险0:商业险
                checkCode: this.checkCode, // 江苏地区要填code
                checkNo: this.checkNo // 江苏地区要填code
            }
            console.log(data)
            let sts = 'sts' + val;
            if (this.money[sts] === undefined || this.money[sts] === 'undefined') {
                this.$set(this.money, sts, '0') // 询价中
                this.$set(this.money, val.toString(), '');
            } else {
                this.money[sts] = '0' // 询价中
                this.money[val] = ''
            }
            request.getCarInsCalc(data, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    this.loading = false;
                    this.codeiSshow = false; // 关闭验证码弹框
                    let output = response.data.output;
                    if (output.checkCode && output.checkNo) {
                        this.checkNo = output.checkNo; // 大地江苏地区查询车型会返回
                        this.code(output.checkCode); // 大地江苏地区要验证码
                    } else {
                        this.isshow1 = true;
                        this.formatting(output.benefitList)
                        this.money[val] = response.data.output.totalPreium;
                        this.money[sts] = '1' // 成功
                        let obj = {
                            totalPreium: output.totalPreium, // 总保费
                            jqPreium: output.jqPreium, // 交强险保费
                            ccsTax: output.ccsTax, // 车船险保费
                            carExtras: output.carExtras, //附加字段
                            totalFranchisePreium: output.totalFranchisePreium, // 附加免赔从费用 大地公司返回
                            quotesId: output.quotesId // 报价编号
                        }
                        this.money1[0] = obj;
                    }
                } else {
                    this.loading = false;
                    this.money[sts] = '2' // 暂无报价
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.loading = false;
                this.showtoast(error, true);
            })
        },
         //江苏地区要验证码
        code (checkCode, checkNo) {
            this.img_code = 'data:image/jpeg;base64,' + checkCode;
            this.codeiSshow = true;
        },
        //清空验证码
        empty () {
            this.checkCode = '';
            this.checkNo = '';
        },
        // 关闭
        off_code () {
            this.codeiSshow = false;
            this.empty(); // 验证码清空
        },
         // 格式化后台数据
        formatting (output) {
            console.log(JSON.stringify(output))
            let syxList = [];
            let fjxList = [];
            let jqxList = [];
            let qtxList = [];
            for (let i = 0; i < output.length; i++) {
                if (output[i].itemCode.substring(0, 1) === 'Z') {
                    syxList.push(output[i])
                } else if (output[i].itemCode.substring(0, 1) === 'J') {
                    jqxList.push(output[i])
                } else if (output[i].itemCode.substring(0, 1) === 'F') {
                    fjxList.push(output[i])
                } else {
                    qtxList.push(output[i])
                }
            }
            let obj = {
                syxList: syxList,
                fjxList: fjxList,
                jqxList: jqxList,
                qtxList: qtxList
            }
            this.benefitList1.push(obj)
            console.log(this.benefitList1)
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
                    carExtras: money1.carExtras, // 附加字段
                    quotesId: money1.quotesId, // 报价编号
                    totalFranchisePreium: money1.totalFranchisePreium, //不计免赔总费用
                    // totalFranchisePreium: '43242332', //测试用
                    benefitList: this.benefitList1[0]
                }
                console.log(obj)
                storage.set('totalPreium', JSON.stringify(obj));
                storage.remove('carAdjustTime');
                storage.remove('carOrderCheck');
                window.location.href = 'carOrderConfirm.html?serialId=' + this.serialId + '&id=' + index;
            }
        },
        formatDate (value) {
            let index = 12;
            let flg = [':', ':', ' ', '-', '-'];
            for (let i = 0; i < 5; i++) {
                value = value.substring(0, index) + flg[i] + value.substring(index, value.length);
                index -= 2;
            }
            return value;
        }
    }
}
</script>
