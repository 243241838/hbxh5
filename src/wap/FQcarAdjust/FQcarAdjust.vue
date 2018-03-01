<template>  
    <div id="body" :class="{isshow:!isWeiXin}">
        <div class="ui-scroll" v-show="render">
            <section>
                <div class="date_list">
                    <div class="head">保险起期</div>
                    <div class="itm flexbox align-items" v-show="jqxList.length>0">
                         <div class="name">交强险 / 车船税</div>
                         <div class="date flex"></div>
                         <div class="on_off" @click="off_data(1)">
                             <i class="iconfont icon-off" v-show="!jqxListDate"></i>
                             <i class="iconfont icon-on" v-show="jqxListDate"></i>
                         </div>
                    </div>
                    <div class="carTime flexbox align-items" v-show="jqxListDate&&jqxList.length>0">
                        <div class="left">交强险起保时间</div>
                        <datepicker v-model="jqDate" :disabled="disabled" class="flex flexbox justify-content" placeholder="请选择" language="zh" format="yyyy-MM-dd"></datepicker>
                        <div class="icon flexbox align-items">
                            <i class="iconfont icon-baodan-jiantou-xia"></i>
                        </div>
                   </div>
                   <div style="width:100%;height:0.26rem;background:#f5f5f5;" v-show="jqxList.length>0"></div>
                    <div class="itm flexbox align-items">
                         <div class="name">商业险</div>
                         <div class="date flex"></div>
                         <div class="on_off" @click="off_data(2)">
                             <i class="iconfont icon-off" v-show="!syxListDate"></i>
                             <i class="iconfont icon-on" v-show="syxListDate"></i>
                         </div>
                    </div>
                    <div class="carTime flexbox align-items itm_border">
                        <div class="left">商业险起保时间</div>
                        <datepicker v-model="syDate" :disabled="disabled" class="flex flexbox justify-content" placeholder="请选择" language="zh" format="yyyy-MM-dd"></datepicker>
                        <div class="icon flexbox align-items ">
                            <i class="iconfont icon-baodan-jiantou-xia"></i>
                        </div>
                   </div>
                </div>    
                <!--交强险-->
                <div class="list" v-show="false">
                        <div class="head">交强险调整</div>
                        <div class="itm" v-for="(item,index) in benefitList.jqxList" :class="{itm_border:index==jqxList.length-1}">
                            <p class="tata">
                                <span class="fl"  v-text="item.itemName"></span>
                                <span @click="show(item, index)">
                                     <span class="fr">
                                        <i class="iconfont ic1" v-show="item.selected">&#xe611;</i>
                                        <i class="iconfont ic1" v-show="!item.selected">&#xe612;</i>
                                    </span>
                                    <span class="fr" v-show="item.chooseAmount ==item1.value" v-for="item1 in item.amountList" v-text="item1.name"></span>
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
                                    <span class="fr" v-show="item.chooseAmount ==item1.value" v-for="item1 in item.amountList" v-text="item1.name"></span>
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
                                    <span class="fr" v-show="item.chooseAmount ==item1.value" v-for="item1 in item.amountList" v-text="item1.name"></span>
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
            </section>
            <footer>
                <div  class="fl box flexbox flex-column align-items" ><div  @click="recover()">恢复初始方案</div></div>
                <div class="fr box flexbox flex-column align-items"><div  @click="proof_time()">确认</div></div>
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
import Datepicker from 'vuejs-datepicker'
import toast from '../../components/toast' // toast引用：
import loading from '../../components/loading';
import request from 'js/interface/request';
import layer from '../../components/layer'
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        toast,
        loading,
        layer,
        Datepicker
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
            disabled: {
                to: new Date(),
                from: new Date(Common.GetDateStr(60))
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
            jqxListDate: true, //开关
            syxListDate: true, // 开关
            jqDate: '', // 交强险时间
            syDate: '', // 商业险时间
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
    },
    mounted () {
        // this.$nextTick(() => {
        //     this.isData() //判断本地是否有保存方案
        // })
        this.isWeiXin = valid.isWeiXin();
        this.isData() //判断本地是否有保存方案
        this.insDate(); // 出使时间
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
        //点击交强险
        off_data (number) {
            if (number === 1) {
                this.jqxListDate = !this.jqxListDate;
            } else {
                this.syxListDate = !this.syxListDate;
                this.showtoast('商业险必须购买哦', true);
                setTimeout(() => {
                    this.syxListDate = !this.syxListDate;
                }, 1000)
            }
        },
        // 初始化商业险时间和交强险时间
        insDate () {
            if (storage.get('FQcarDetail')) {
                let FQcarDetail = JSON.parse(storage.get('FQcarDetail'));
                console.log(FQcarDetail)
                if (FQcarDetail.syStartTime) {
                    this.syDate = new Date(FQcarDetail.syStartTime);
                    if (FQcarDetail.jqStartTime) {
                        this.jqDate = new Date(FQcarDetail.jqStartTime);
                        this.jqxListDate = true;
                    } else {
                        this.jqxListDate = false;
                    }
                }
            }
        },
        // 判断本地是否有data
        isData () {
            this.carTypeSelect = JSON.parse(storage.get('FQcarTypeSelect'));
            // console.log(this.carTypeSelect)
            this.loading = true;
            if (this.carTypeSelect) {
                this.benefitList = this.carTypeSelect;
                this.fjxList = this.benefitList.fjxList;
                this.syxList = this.benefitList.syxList;
                this.jqxList = this.benefitList.jqxList;
                this.loading = false;
                this.render = true;
            } else {
                this.getData(); // 后台获取数据
            }
            this.list = this.benefitList;
            console.log(this.benefitList)
        },
        // 后台获取数据
        getData () {
            var data = {}
            request.getItemKind(data, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let output = response.data.output.itemRecordList;
                    // console.log(JSON.stringify(output))
                    let syxList = [];
                    let fjxList = [];
                    let jqxList = [];
                    for (let i = 0; i < output.length; i++) {
                        if (output[i].itemCode.substring(0, 1) === 'Z') {
                            syxList.push(output[i])
                        } else if (output[i].itemCode.substring(0, 1) === 'J') {
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
                    storage.set('FQcarTypeSelect', JSON.stringify(this.benefitList))
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
            this.loading = false;
            this.render = true;
        },
        // 格式化后台数据
        formatting (data, name) {
            let list = [];
            for (let i = 0; i < data.length; i++) {
                let obj = {
                    itemCode: data[i].itemCode,
                    itemName: data[i].itemName,
                    itemType: data[i].itemType,
                    chooseAmount: data[i].defaultValue,
                    franchiseFlag: '',
                    amountList: data[i].amountList
                }
                let franchiseFlag = ''
                if (data[i].hasFranchise) {
                    if (data[i].defaultValue !== '0') {
                        franchiseFlag = '1'
                    } else {
                        franchiseFlag = '0'
                    }
                } else {
                    franchiseFlag = '-1'
                }
                obj.franchiseFlag = franchiseFlag;
                list.push(obj)
            }
            this[name] = list;
            this.benefitList[name] = list;
        },
         //验证时间
        proof_time () {
            let newDate = Common.formatNewDate(new Date())
            let day60 = Common.GetDateStr1(60)
            let jqDate = Common.formatNewDate(new Date(this.jqDate))
            let syDate = Common.formatNewDate(new Date(this.syDate))
            console.log(day60)
            console.log(jqDate)
            console.log(parseInt(jqDate) > parseInt(day60))
            if (this.jqxListDate && !this.jqDate) {
                this.showtoast('交强险时间不能为空', true);
                return false;
            }
            if (parseInt(jqDate) <= parseInt(newDate) && this.jqxListDate && this.jqDate !== '') {
                this.showtoast('交强险起期时间不能晚于次日', true);
                return false;
            }
            if (parseInt(jqDate) > parseInt(day60) && this.jqxListDate && this.jqDate !== '') {
                this.showtoast('交强险起期时间不能大于今日起60天', true);
                return false;
            }
            if (!this.syDate) {
                this.showtoast('商业险时间不能为空', true);
                return false;
            }
            if (parseInt(syDate) <= parseInt(newDate)) {
                this.showtoast('商业险起期时间不能晚于次日', true);
                return false;
            }
            if (parseInt(syDate) > parseInt(day60)) {
                this.showtoast('商业险起期时间不能大于今日起60天', true);
                return false;
            }
            this.sub(); // 提交
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
            if (storage.get('FQcarDetail')) {
                let FQcarDetail = JSON.parse(storage.get('FQcarDetail'));
                FQcarDetail.syStartTime = Common.formatNewDate1(this.syDate);
                FQcarDetail.syStartTime1= Common.formatNewDate(this.syDate);
                if (this.jqxListDate) {
                    FQcarDetail.jqStartTime = Common.formatNewDate1(this.jqDate);
                    FQcarDetail.jqStartTime1 = Common.formatNewDate(this.jqDate);
                    this.benefitList.jqxList[0].chooseAmount = '1';
                } else {
                    FQcarDetail.jqStartTime = '';
                    FQcarDetail.jqStartTime1 = '';
                    this.benefitList.jqxList[0].chooseAmount = '0';
                }
                console.log(this.benefitList)
                console.log(FQcarDetail)
                storage.set('FQcarDetail', JSON.stringify(FQcarDetail));
                storage.set('FQcarTypeSelect', JSON.stringify(this.benefitList));
                window.location.href = 'FQcompany.html?serialId=' + Common.getQueryString('serialId');
            }
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
                    storage.set('prevPage', './FQcarAdjust.html?serialId=' + Common.getQueryString('serialId'));
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
