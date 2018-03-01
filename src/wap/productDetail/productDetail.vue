<template>
    <div class="container" :class="{isWeiXin:isWeiXin}">
        <div v-show="!loading">
            <div v-text="test"></div>
            <div id="body" v-show="!isshowAddress">
                <div class="prodetail-head">
                    <img class="prodetail-head-ad" :src="productDetail.productLogo" alt="">
                    <!-- ./images/product_detail_img.png -->
                    <p class="text">{{productDetail.insurerName}} | 销量{{productDetail.totalAmount}}</p>
                </div>
                <div class="time flexbox" v-show="flashSale=='1'">
                    <div class="time_name flexbox justify-content align-items">{{productDetail.promotionName}}</div>
                    <div class="time_d flex flexbox justify-content align-items">
                        <div v-if="productDetail.store == 0" class="finish">已抢光</div>
                        <div v-else-if="isTimeout" class="finish">活动已结束</div>
                        <div v-else>
                            <div class="top flexbox justify-content align-items">
                                <b>距结束仅剩</b>
                            </div>
                            <div class="bottom flexbox justify-content align-items">
                                <span v-text="time.days"></span>
                                <b>天</b>
                                <span v-text="time.hours"></span>
                                <b>时</b>
                                <span v-text="time.minutes"></span>
                                <b>分</b>
                                <span v-text="time.seconds"></span>
                                <b>秒</b>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="prodetail-title">
                    <div class="fr" v-show="false">推广费最高{{money}}%</div>
                    <h2 class="big">{{productDetail.productName}}</h2>
                    <ul class="tips-list">
                        <li>{{productDetail.productFeature}}</li>
                        <li>{{productDetail.perferWords}}</li>
                    </ul>
                    <a class="green" @click="seeUnique">查看更多特色</a>
                </div>
                <div class="safe-title" v-if="planListLen === 1">
                    <i class="iconfont">&#xe616;</i>
                    保障清单
                </div>
                <ul class="safe-type" v-else-if="planListLen === 2">
                    <li class="safe-titem middleW" v-for="(pitem,index) in productDetail.planList" @click="typeShow(index,pitem.planName,pitem.planId)" :class="{'cur':index===i,'floatR':index==1}">
                        <p class="empty"></p>
                        <p class="tgreen">
                            <span class="big">{{pitem.planPrice/100}}</span>￥ 起
                        </p>
                        <p class="gray">{{pitem.planName}}</p>
                    </li>
                </ul>
                <ul class="safe-type" v-else-if="planListLen === 3">
                    <li class="safe-titem" v-for="(pitem,index) in productDetail.planList" @click="typeShow(index,pitem.planName,pitem.planId)" v-bind:class="{ cur:index===i}">
                        <p class="empty"></p>
                        <p class="tgreen">
                            <span class="big">
                                {{pitem.planPrice/100}}</span>￥ 起
                        </p>
                        <p class="gray">{{pitem.planName}}</p>
                    </li>
                </ul>
                <div class="safe-detail">
                    <p class="detail" v-for="item in benefitList">
                        {{item.benefitName}}
                        <span class="fr"> {{item.insuredAmount}}</span>
                    </p>
                    <a class="green" @click="protectRange">查看保障详情</a>
                </div>
                <ul class="safe-list">
                    <!--计价因子-->
                    <li class="safe-item sitem" v-if="priceElements.price_element" v-for="(item,index) in priceElements.price_element">
                        {{item.name}}
                        <div class="item-fr" v-show="optionArr[index].length > 1">
                            <select class="select" :class="{'price_age': item.code == 'age'}" name="" dir="rtl" @click="priceChange(item.code, index)">
                                <option v-for="oitem in optionArr[index]" :value="oitem">
                                    {{oitem}}
                                </option>
                            </select>
                        </div>
                        <div id="ooitem" v-show="optionArr[index].length <= 1" style="float:right;text-align:center;" v-for="oitem in optionArr[index]">{{oitem}}</div>
                    </li>
                    <!--额外信息 productParamsList-->
                    <li class="safe-item" v-for="(ppItem, ppIndex) in productDetail.productParamsList">
                        <span :class="{'safe-item-left':ppItem.paramType == 10}">{{ppItem.paramName}}</span>
                        <!--任何信息-->
                        <input @blur="anyInfo" class="safe-item-input" v-model="textValue" v-text="textValue" v-if="ppItem.paramType == 10" type="text">
                        <!--选择城市-->
                        <div v-if="ppItem.paramType == 30" style="float:right;width:71%;">
                            <div style="width:100%;" class="item-fr" v-if="JSON.parse(ppItem.paramValue).city5.length > 1">
                                <select id="choiceCity" class="select" name="" dir="rtl" @change="choiceCity">
                                    <option v-for="pvItem in JSON.parse(ppItem.paramValue).city5" :value="ppItem.paramVar+','+pvItem.name">
                                        {{pvItem.name}}
                                    </option>
                                </select>
                            </div>
                            <div v-else v-for="pvItem in JSON.parse(ppItem.paramValue).city5">{{pvItem.name}}</div>
                        </div>
                        <!--日期-->
                        <div class="item-fr" v-if="ppItem.paramType == 40">
                            <datepicker placeholder="请选择" id="birthday" language="zh" :highlighted="state.highlighted" format="yyyy-MM-dd" :disabled="disabled2" v-on:selected="selectedBirthday(birthday)" v-model="birthday" :limit="limit"></datepicker>
                        </div>
                    </li>
                    <li class="safe-item sitem">
                        保障时间
                        <div class="item-fr" v-if="guaranteePeriod.length > 1">
                            <select class="select" name="" dir="rtl" @change="timeSelect(index,$event)">
                                <option v-for="titem in guaranteePeriod" :value="titem | formatTime" :id="titem">
                                    {{titem | formatTime}}
                                </option>
                            </select>
                        </div>
                        <div style="float:right;" v-if="guaranteePeriod.length <= 1" v-for="titem in guaranteePeriod">
                            {{titem | formatTime}}
                        </div>
                    </li>
                    <li class="safe-item" v-show="output.length > 0">
                        职业类别
                        <div class="fr" @click="showAddress">
                            <i class="iconfont"></i>
                        </div>
                        <div class="job" style="float:right" @click="showAddress">
                            <input type="text" placeholder="请选择职业类别" :value="areaName" readonly>
                        </div>
                    </li>

                    <li class="safe-item" v-if="endTimeNum > 0">
                        生效日期
                        <div class="item-fr">
                            <datepicker placeholder="请选择" id="startTime" language="zh" :disabled="disabled" :highlighted="state.highlighted" format="yyyy-MM-dd"></datepicker>
                        </div>
                    </li>
                    <li class="safe-item" v-else>
                        生效日期
                        <div style="float:right">
                            {{effectDate}}
                        </div>
                    </li>
                    <li class="safe-item">
                        购买份数
                        <div class="buynum">
                            <span class="buynum-button" @click="reduceFun" v-show="productDetail.quota>1">
                                <i class="iconfont">&#xe627;</i>
                            </span>
                            <span class="buynum-input" v-show="productDetail.quota!=1">
                                <input type="text" class="input" @blur="numberBulr" v-model="number">
                            </span>
                            <span class="buynum-input" v-show="productDetail.quota == 1">
                                {{productDetail.quota}}
                            </span>
                            <span class="buynum-button buynum-add" @click="addFun" v-show="productDetail.quota>1">
                                <i class="iconfont">&#xe836;</i>
                            </span>
                        </div>
                    </li>
                </ul>
                <div class="item-title">
                    投保人信息
                </div>
                <ul class="safe-list">
                    <li class="safe-item">
                        <span class="safe-item-left">
                            投保人
                        </span>
                        <input type="text" class="safe-item-input" v-model="applicant" @blur="blurApplicant(applicant)" placeholder="请输入投保人姓名">
                    </li>
                    <li class="safe-item">
                        <span class="safe-item-left">
                            证件类型
                        </span>
                        <select class="safe-item-select" name="" @change="changeIdType" id="idType">
                            <option value="1">身份证</option>
                            <option value="3" v-show="productDetail.isAllowInsure!='1'">护照</option>
                            <option value="2" v-show="productDetail.isAllowInsure!='1'">军官证</option>
                        </select>
                        <label class="fr" for="idType"></label>
                    </li>
                    <li class="safe-item">
                        <span class="safe-item-left">
                            证件号码
                        </span>
                        <input type="text" class="safe-item-input" v-model="idNo" @blur="blurId(idNo)" placeholder="请输入证件号码">
                    </li>
                    <li class="safe-item">
                        <span class="safe-item-left">
                            手机号码
                        </span>
                        <input type="tel" class="safe-item-input" v-model="mobile" @blur="blurTel(mobile)" placeholder="请输入手机号码" maxlength="11">
                    </li>
                </ul>
                <div class="item-title">
                    被保人信息
                </div>
                <ul class="safe-list">
                    <li class="safe-item">
                        <span class="safe-item-left">
                            与投保人关系
                        </span>
                        <select class="safe-item-select" name="" @change="relationTypeChange" id="idType">
                            <option v-for="item in productDetail.relationship" :value="item.code">{{item.name}}</option>
                        </select>
                        <label class="fr" for="idType"></label>
                    </li>
                    <ul v-show="relationType != '01'">
                        <li>
                            <ul>
                                <li class="safe-item">
                                    <span class="safe-item-left">
                                        被保人
                                    </span>
                                    <input type="text" class="safe-item-input" v-model="passiveapplicant" @blur="blurPassiveApplicant(passiveapplicant)" placeholder="请输入被保人姓名">
                                </li>
                                <li class="safe-item">
                                    <span class="safe-item-left">
                                        证件类型
                                    </span>
                                    <select class="safe-item-select" name="" @change="changePassiveIdType" id="beiidType">
                                        <option value="1">身份证</option>
                                        <option value="3">护照</option>
                                        <option value="2">军官证</option>
                                    </select>
                                    <label class="fr" for="beiidType"></label>
                                </li>
                                <li class="safe-item">
                                    <span class="safe-item-left">
                                        证件号码
                                    </span>
                                    <input type="text" class="safe-item-input" v-model="passiveidNo" @blur="blurPassiveId(passiveidNo)" placeholder="请输入证件号码">
                                </li>
                                <li class="safe-item">
                                    <span class="safe-item-left">
                                        手机号码
                                    </span>
                                    <input type="tel" class="safe-item-input" v-model="passMobile" @blur="passBlurTel(passMobile)" placeholder="请输入手机号码" maxlength="11">
                                </li>
                            </ul>
                        </li>
                    </ul>
                </ul>
                <div class="item-title">
                    <i class="iconfont">&#xe61c;</i>
                    保险受益人为法定受益人
                </div>
                <ul class="info-list">
                    <li class="info-item">
                        <a @click="claimProcess">
                            理赔流程
                            <span class="fr">
                                <i class="iconfont">&#xe61d;</i>
                            </span>
                        </a>
                    </li>
                </ul>
                <div class="info-tips">
                    <img class="info-check" @click="checkFun" v-if="!check" src="../../assets/images/weigouxuan.png" alt="">
                    <img class="info-check" @click="checkFun" v-else src="../../assets/images/gouxuan.png" alt=""> 我已阅读
                    <span @click="insureNotice" class="green">《投保须知》</span>
                    <span @click="insurance_clause" class="green">《保险条款》</span>
                    <span v-show="productDetail.isProductPrompt=='1'" @click="healthNotice" class="green">《健康告知》</span>，并同意上述协议约定
                </div>
                <div class="footer" style="position:fixed;z-index:9;">
                    <!--打折-->
                    <div class="price flexbox flex-column align-items justify-content" v-if="productDetail.discountType == 1 && !isTimeout">
                        <div class="big">
                            <span class="yuan">￥</span>{{totalPrice/100 * productDetail.discountRate/100 * number | formatMoney}}</div>
                        <div class="small">￥{{totalPrice/100*number | formatMoney}}</div>
                    </div>
                    <!--减少-->
                    <div class="price flexbox flex-column align-items justify-content" v-else-if="productDetail.discountType == 2 && !isTimeout">
                        <div class="big">
                            <span class="yuan">￥</span>{{(totalPrice - productDetail.discountRate) / 100 * number | formatMoney}}</div>
                        <div class="small">￥{{totalPrice/100*number | formatMoney}}</div>
                    </div>
                    <!--原价-->
                    <div class="price" v-else>
                        <span class="yuan">￥</span>{{totalPrice/100 * number | formatMoney}}
                    </div>
                    <!--电话咨询-->
                    <a :href="call_up" class="ask">
                        <i class="iconfont">&#xe61e;</i>
                        咨询
                    </a>
                    <div class="button" :class="{'gray': !check || (continueFlg == '0' && flashSale == '1')}" @click="insure">
                        我要投保
                    </div>
                </div>
            </div>
            <div v-show="isshowAddress" class="address" @click="isshowAddress=false;">
                <div class="bottom" @click.stop>
                    <div class="select">
                        <div class="title">请选择职业
                            <i class="iconfont icon-close" @click="isshowAddress=false;">&#xe629;</i>
                        </div>
                        <div class="select-list flexbox">
                            <div class="select-item">
                                <span @click="selectProvince" :class="{'item-green':selected==0}" class="item" v-text="province"></span>
                            </div>
                            <div class="select-item">
                                <span @click="selectCity" :class="{'item-green':selected==1}" class="item" v-text="city"></span>
                            </div>
                            <div class="select-item">
                                <span :class="{'item-green':selected==2}" class="item" v-text="area"></span>
                            </div>
                        </div>
                    </div>
                    <div class="scroll">
                        <div class="cell" v-for="item in output" v-text="item.typeName" @click="selectCell(item.typeId, item.insurerCode)"></div>
                    </div>
                </div>
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--弹框组件-->
        <layer :layer-options="layer" v-on:onlayerback="closeLayer"></layer>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import { Common, valid, storage } from 'js/common';
import Datepicker from 'vuejs-datepicker';
import request from 'js/interface/request';
import loading from 'components/loading';
import toast from 'components/toast';
import layer from 'components/layer';

export default {
    components: {
        Datepicker,
        toast,
        loading,
        layer
    },
    data() {
        return {
            loading: true, // 加载中
            isshowAddress: false, // 弹出框
            selected: 0,
            province: '请选择', // 省
            city: '', // 市
            area: '', // 区
            areaName: '',
            occupation: '', // 城市码
            // ---------------------------------------------
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            disabled: {
                // to: new Date(),
                // from: new Date('2018-01-10')
            },
            disabled2: {
                to: new Date()
            },
            flashSale: '0', //是否是限时抢购, 为0时是没有活动, 不显示
            promotionExpTime: '', //倒计时
            isTimeout: false,
            time: { // 倒计时
                days: '',
                hours: '',
                minutes: '',
                seconds: ''
            },
            money: '', //推广率
            address: '', // 详细地址
            agent: '', // 代理人
            applicantId: '', // 投保人ID
            applicant: '', // 投保人姓名
            areaCode: '', // 城市编号
            benList: '', // 受益人列表
            benefitList: '', // 保障利益分类
            check: false, // 是否已阅读
            cneeName: '', // 收货人姓名
            cneeMobile: '', // 收货人手机
            endTimeNum: '', // 保单生效方式
            effectDate: '', // 保单生效日期
            guaranteePeriod: [], // 产品期限
            guaranteeTime: '', // 保障时间
            i: 0,
            idNo: '', // 投保人证件号码
            idType: 1, // 证件类型
            insureWindow: '', // 免责时间
            insuredList: '', // 被保险人列表
            isExpress: '0', // 需要快递？
            lastInsureTime: '', // 终保时间
            endtInsureTime: '', //开保时间
            mobile: '', // 手机号码
            passMobile: '', // 被保人手机号码
            number: 1,
            optionArr: '',
            passiveapplicant: '', // 被保人姓名
            passiveidNo: '', // 被保人证件号码
            passiveidType: '1', // 被保人证件类型
            period: '', // 保障期限值
            planId: '', // 计划编号
            productDetail: {}, // 产品详情
            productId: '', // 产品编号
            priceKeyword: '', // 价格关键字
            priceList: [], // 报价列表
            planlist: [], // 计划列表
            planName: '', // 计划名称
            priceElements: '', // 价格元素
            planListLen: '',
            relateTrade: '', // 渠道订单号
            referrer: '', // 推荐地址
            relationType: '01', // 与投保人关系(本人)
            startInsureTime: '', // 起保时间
            state: '', // 日期控件
            totalPrice: 0, // 总共的价格
            userId: '', // 用户ID
            inputDetail: {
                applicant: '',
                idNo: '',
                mobile: '',
                passapplicant: '',
                passidNo: '',
                passMobile: ''
            }, // 存入填写的数据
            call_up: '#', // 拨打电话
            oldOutput: '',
            output: [],
            selectedAge: '', // 年龄段
            selectedAge_desc: [],
            extraInfos: {},
            birthday: '',
            birthdayName: '', // 出生日期
            textName: '',
            textValue: '',
            continueFlg: '0',
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function() { }, // 确认回调
                no: function() { } // 取消回调
            },
            isWeiXin: '', // 判断微信调整头部
            limit: ''
            //loginText: ''//是否重新登录时的显示文案
        }
    },
    created() {
        this.isWeiXin = valid.isWeiXin();
        // app嵌入
        if (Common.getQueryString('isApp')) {
            this.isWeiXin = true;
        }
        this.userId = Common.getUserId('userId');
        this.applicantId = this.userId;
        this.prodetailFun();
        this.ins();
        console.log(this.disabled);
    },
    mounted() {
        this.yesterday();
    },
    watch: {
    },
    methods: {
        // 初始化投保人信息
        ins() {
            var inputDetail = JSON.parse(storage.get('inputDetail'));
            if (inputDetail) {
                this.inputDetail = {
                    applicant: inputDetail.applicant,
                    idNo: inputDetail.idNo,
                    mobile: inputDetail.mobile,
                    passapplicant: inputDetail.passapplicant,
                    passidNo: inputDetail.passidNo,
                    passMobile: inputDetail.passMobile
                }
                //console.log('inputDetail: ', this.inputDetail)
                this.applicant = inputDetail.applicant;
                this.idNo = inputDetail.idNo;
                this.mobile = inputDetail.mobile;
                //this.passiveapplicant = inputDetail.passapplicant;
                //this.passiveidNo = inputDetail.passidNo;
                //this.passMobile = inputDetail.passMobile;
            }
        },
        // 投保人姓名
        blurApplicant(name) {
            this.inputDetail.applicant = name;
            storage.set('inputDetail', JSON.stringify(this.inputDetail));
            // 本人
            if (this.relationType === '01') {
                this.blurPassiveApplicant(name);
            }
        },
        // 投保人证件号码
        blurId(id) {
            this.inputDetail.idNo = id;
            storage.set('inputDetail', JSON.stringify(this.inputDetail));
            // 本人
            if (this.relationType === '01') {
                this.blurPassiveId(id);
            }
        },
        // 投保人手机号码
        blurTel(val) {
            this.inputDetail.mobile = val;
            storage.set('inputDetail', JSON.stringify(this.inputDetail));
            // 本人
            if (this.relationType === '01') {
                this.passBlurTel(val);
            }
        },
        // 被保人手机号码
        passBlurTel(val) {
            this.inputDetail.passMobile = val;
            this.passMobile = val;
            storage.set('inputDetail', JSON.stringify(this.inputDetail));
        },
        // 被保人姓名
        blurPassiveApplicant(val) {
            this.inputDetail.passapplicant = val;
            this.passiveapplicant = val;
            storage.set('inputDetail', JSON.stringify(this.inputDetail));
        },
        // 被保人证件号码
        blurPassiveId(val) {
            this.inputDetail.passidNo = val;
            this.passiveidNo = val;
            storage.set('inputDetail', JSON.stringify(this.inputDetail));
        },
        // 是否同意上述协议约定
        checkFun() {
            this.check = !this.check;
            this.continueFlgFun();
        },
        // 继续购买
        continueFlgFun() {
            // 是活动 && 不超时 && 有库存
            if (this.flashSale === '1' && !this.isTimeout && this.productDetail.store >= 1) {
                this.continueFlg = '1';
            } else {
                this.continueFlg = '0';
            }
        },
        // 获取产品详情
        prodetailFun() {
            this.productId = Common.getQueryString('productId');
            var data = {
                productId: this.productId
            }
            request.getProductDetail(data, (response) => {
                if (response.data.respCode === '000000') {
                    // console.log(JSON.stringify(response.data.output))
                    this.productDetail = response.data.output;
                    this.call_phone(this.productDetail.mobile);
                    //console.log('isAllowInsure: ', this.productDetail.isAllowInsure)
                    // 一级分销，二级分销
                    this.money = parseFloat(this.productDetail.commisionValue1) + parseFloat(this.productDetail.commisionValue2);
                    if (this.productDetail.promotionCommisionValue1) {
                        this.money += parseFloat(this.productDetail.promotionCommisionValue1);
                    }
                    if (this.productDetail.promotionCommisionValue2) {
                        this.money += parseFloat(this.productDetail.promotionCommisionValue2);
                    }
                    this.flashSale = this.productDetail.flashSale;
                    console.log('flashSale: ' + this.flashSale)
                    if (this.promotionExpTime) {
                        this.promotionExpTime = this.productDetail.promotionExpTime.replace(/-/g, '/'); //限购时间
                        this.promotionExpTime = new Date(this.promotionExpTime).getTime();
                        console.log('promotionExpTime: ' + this.promotionExpTime)
                        this.setTime();
                    }
                    // 投保人与被保人的关系
                    if (this.productDetail.relationship) {
                        this.productDetail.relationship = JSON.parse(this.productDetail.relationship);
                        this.relationType = this.productDetail.relationship[0].code;
                        console.log('投保人与被保人的关系: ', this.productDetail.relationship)
                    }
                    //默认保障时间限制
                    // this.guaranteeTime = this.guaranteePeriod[0].split('_')[0];
                    let keyword = this.productDetail.defaultKeyword; // 默认选中关键字
                    // 分割关键字（“，和 ；”）
                    keyword = keyword.split(';');
                    keyword = keyword.join(',');
                    keyword = keyword.split(',');
                    this.guaranteeTime = keyword[2] ? keyword[2] : keyword[1];
                    // 保障期限
                    this.guaranteePeriod = this.productDetail.guaranteePeriod.split(';');
                    //console.log('guaranteePeriod: ' + this.guaranteePeriod)
                    for (let i = 0; i < this.guaranteePeriod.length; i++) {
                        let val = (this.guaranteePeriod)[i]
                        if (val.split('_')[0] === this.guaranteeTime) {
                            this.period = val;
                        }
                    }
                    // this.period = this.guaranteePeriod[0];
                    this.priceList = this.productDetail.priceList;
                    this.endTimeNum = this.productDetail.endTimeNum; // 生效日期
                    console.log('生效日期: ', this.endTimeNum);
                    this.insureWindow = this.productDetail.insureWindow;
                    this.effectDate = this.productDetail.effectDate;
                    console.log('effectDate: ', this.effectDate);
                    this.startInsureTime = this.productDetail.startInsureTime;
                    this.lastInsureTime = this.productDetail.lastInsureTime;
                    this.endtInsureTime = this.productDetail.endtInsureTime;
                    if (this.endTimeNum > 0) {
                        this.disabled = {
                            to: new Date((this.startInsureTime).replace(/-/g, ',')),
                            //to: this.formatTime1((new Date()).setDate(new Date(this.startInsureTime).getDate()-1)),
                            from: new Date(this.endtInsureTime)
                        }
                        console.log(1111);
                        //console.log((this.startInsureTime).replace(/-/g, ','));
                        console.log(new Date((this.startInsureTime).replace(/-/g, ',')));
                        console.log(this.endtInsureTime)
                    }
                    if (this.endTimeNum === 0) {
                        this.endTimeNum = this.effectDate;
                        console.log(this.endtInsureTime);
                    }
                    this.planName = this.productDetail.planList[0].planName;
                    this.planId = this.productDetail.planList[0].planId;
                    this.benefitList = this.productDetail.planList[0].classNameList[0].benefitList;
                    // extraInfos
                    //console.log('productParamsList: ', this.productDetail.productParamsList)
                    if (this.productDetail.productParamsList.length > 0) {
                        this.extraInfos = {};
                    }
                    this.productDetail.productParamsList.map((item) => {
                        // select
                        if (item.paramType === 30) {
                            let cc = storage.get('currentCity');
                            //console.log('currentCity: ', cc)
                            if (cc) {
                                try {
                                    this.extraInfos[item.paramVar] = cc;
                                    setTimeout(() => {
                                        let options = document.getElementById('choiceCity').options;
                                        for (let i = 0; i < options.length; i++) {
                                            if (cc === options[i].innerText.trim()) {
                                                document.getElementById('choiceCity').options.selectedIndex = i;
                                            }
                                        }
                                    }, 0)
                                } catch (err) {
                                    console.log('err: ', err)
                                }
                            } else {
                                if (item.paramValue) {
                                    this.extraInfos[item.paramVar] = JSON.parse(item.paramValue).city5[0].name;
                                }
                            }
                        } else if (item.paramType === 10) {
                            // text
                            let anyInfomation = storage.get('anyInfo');
                            this.textName = item.paramVar;
                            if (anyInfomation) {
                                this.textValue = anyInfomation;
                                this.extraInfos[item.paramVar] = anyInfomation;
                            } else {
                                this.extraInfos[item.paramVar] = '';
                            }
                        } else if (item.paramType === 40) {
                            // date
                            this.birthdayName = item.paramVar;
                            this.extraInfos[this.birthdayName] = storage.get('birthday') || '';
                            setTimeout(() => {
                                document.getElementById('birthday').value = this.extraInfos[this.birthdayName];
                            }, 0)
                        }
                    })
                    // 不同的计划显示不同的样式
                    if (this.productDetail.planList.length === 1) {
                        this.planListLen = 1;
                    } else if (this.productDetail.planList.length === 2) {
                        this.planListLen = 2;
                    } else {
                        this.planListLen = 3;
                    }
                    console.log('计价因子')
                    // 计价因子
                    try {
                        if (this.productDetail.priceElements) {
                            let priceElements = JSON.parse(this.productDetail.priceElements);
                            let len = priceElements.price_element.length;
                            let optionArr = [];
                            for (let j = 0; j < len; j++) {
                                let item = priceElements.price_element[j];
                                //console.log(item)
                                optionArr.push(item.option.split(','));
                                // 选择年龄段
                                if (item.code === 'age') {
                                    this.selectedAge_desc.push(item.desc.split(','));
                                    //console.log('selectedAge_desc: ', this.selectedAge_desc);
                                }
                            }
                            this.priceElements = priceElements;
                            this.optionArr = optionArr;
                            console.log('priceElements: ', this.priceElements)
                            console.log('optionArr: ', this.optionArr)
                        }
                    } catch (err) {
                        console.log('err: ', err)
                    }
                    this.selectProvince();
                    this.$nextTick(() => {
                        this.default_select();
                        this.priceChange();
                    })
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                this.loading = false;
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        //默认选中 计价因子
        default_select() {
            var sitem = document.querySelectorAll('li.sitem');
            let keyword = this.productDetail.defaultKeyword; // 默认选中关键字
            // 分割关键字（“，和 ；”）
            keyword = keyword.split(';');
            keyword = keyword.join(',');
            keyword = keyword.split(',')
            //console.log('计价因子默认选中: ', keyword)
            // 循环selsect选中
            for (var i = 0; i < sitem.length; i++) {
                let key = keyword[i + 1];
                let options = [];
                let select = sitem[i].querySelector('select');
                if (select) {
                    options = select.options;
                }
                for (var h = 0; h < options.length; h++) {
                    if (options[h].value === key) {
                        options[h].selected = true;
                        let priceAge = document.querySelector('.select.price_age')
                        if (priceAge && priceAge === select) {
                            for (var k = 0; k < this.priceElements.price_element.length; k++) {
                                if (this.priceElements.price_element[k].code === 'age') {
                                    this.priceElements.price_element[k].option.split(',').map((item, index) => {
                                        if (item === key) {
                                            this.selectedAge = this.selectedAge_desc[0][index];
                                            console.log('selectedAge: ', this.selectedAge)
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
            // 价钱选择
            let plan = this.productDetail.planList;
            for (var j = 0; j < plan.length; j++) {
                if (plan[j].planName === keyword[0]) {
                    this.i = j;
                    this.typeShow(j, keyword[0], plan[j].planId)
                }
            }
        },
        // 额外信息选择城市
        choiceCity(e) {
            let arr = e.target.value.split(',');
            this.extraInfos[arr[0]] = arr[1];
            storage.set('currentCity', arr[1]);
        },
        // 任何信息
        anyInfo() {
            storage.set('anyInfo', this.textValue);
        },
        // 咨询电话
        call_phone(mobile) {
            if (Common.getQueryString('mobile')) {
                this.call_up = 'tel:' + Common.getQueryString('mobile');
            } else {
                // this.call_up = 'tel:4006786078';
                this.call_up = 'tel:' + mobile;
            }
        },
        // 出生日期
        selectedBirthday() {
            setTimeout(() => {
                // 出生日期
                let b = document.getElementById('birthday');
                if (b) {
                    this.extraInfos[this.birthdayName] = b.value;
                    storage.set('birthday', b.value);
                }
            }, 0)
        },
        // 购买份数增加
        addFun() {
            if (this.productDetail.quota <= this.number && this.productDetail.quota !== 0) {
                this.number = this.productDetail.quota;
            } else {
                this.number++;
            }
        },
        // 购买份数减少
        reduceFun() {
            if (this.number < 2) {
                this.number = 1;
            } else {
                this.number--;
            }
        },
        // 编辑购买份数
        numberBulr() {
            if (this.productDetail.quota <= this.number && this.productDetail.quota !== 0) {
                this.number = this.productDetail.quota;
            }
            if (this.number < 2) {
                this.number = 1;
            }
        },
        // 计价因子
        priceChange(code, index) {
            var olen = '';
            var olen1 = this.priceList.length;
            var sitem = document.querySelectorAll('li.sitem');
            var name = '';
            if (this.priceElements.price_element) {
                olen = this.priceElements.price_element.length;
            } else {
                olen = 0;
            }
            for (var i = 0; i < olen; i++) {
                var val = sitem[i].getElementsByTagName('select')[0].value;
                if (name) {
                    name = name + ',' + val;
                } else {
                    name = val;
                }
            }
            // 选择年龄段
            if (code === 'age') {
                var temp = name.split(',')[index];
                for (var k = 0; k < this.priceElements.price_element.length; k++) {
                    if (this.priceElements.price_element[k].code === 'age') {
                        this.priceElements.price_element[k].option.split(',').map((item, index) => {
                            if (item === temp) {
                                this.selectedAge = this.selectedAge_desc[0][index];
                            }
                        })
                    }
                }
                console.log('selectedAge: ', this.selectedAge);
            }
            var priceKeyword = this.planName + ';' + name + ';' + this.guaranteeTime + ';';
            if (this.priceElements.price_element) {
                priceKeyword = this.planName + ';' + name + ';' + this.guaranteeTime + ';';
            } else {
                priceKeyword = this.planName + ';' + this.guaranteeTime + ';';
            }
            // 价格关键字
            this.priceKeyword = priceKeyword;
            //console.log(this.priceKeyword)
            // console.log(this.priceList)
            for (var j = 0; j < olen1; j++) {
                if (this.priceList[j].priceKeyword === priceKeyword) {
                    this.totalPrice = this.priceList[j].productPremium;
                }
            }
        },
        // 投保人-证件类型
        changeIdType(e) {
            this.idType = e.currentTarget.value;
            if (this.relationType === '01') {
                this.changePassiveIdType(null, this.idType);
            }
        },
        // 被保人-证件类型
        changePassiveIdType(e, type) {
            if (e) {
                this.passiveidType = e.currentTarget.value;
            } else if (type === '01') {
                // 本人
                this.passiveidType = type;
                document.getElementById('beiidType').value = type;
            }
        },
        // 与投保人关系
        relationTypeChange(e) {
            this.relationType = e.currentTarget.value;
            //console.log('relationType: ', this.relationType, 'idType: ', this.idType)
            // 选择本人时，被保人信息为投保人
            if (this.relationType === '01') {
                this.passiveapplicant = this.applicant;
                this.passiveidNo = this.idNo;
                // 被保人姓名
                this.inputDetail.passapplicant = this.passiveapplicant;
                // 被保人证件号码
                this.inputDetail.passidNo = this.passiveidNo;
                this.changePassiveIdType(null, this.idType);
                storage.set('inputDetail', JSON.stringify(this.inputDetail));
            } else {
                this.passiveapplicant = '';
                this.passiveidNo = '';
                // 被保人姓名
                this.inputDetail.passapplicant = '';
                // 被保人证件号码
                this.inputDetail.passidNo = '';
                // 被保人-证件类型(初始化为身份证类型)
                this.changePassiveIdType(null, '1');
                storage.set('inputDetail', JSON.stringify(this.inputDetail));
            }
        },
        typeShow(index, name, id) {
            this.i = index;
            this.planName = name;
            this.planId = id;
            this.benefitList = this.productDetail.planList[index].classNameList[0].benefitList; // 保障详情不同显示
            this.priceChange();
        },
        //保障时间调整
        timeSelect(index, e) {
            var _this = e.currentTarget;
            this.guaranteeTime = _this.value;
            this.period = _this.options[_this.selectedIndex].id;
            //console.log(this.period)
            this.priceChange();
        },
        // 投保-提交订单
        insure() {
            //index 随便加的阻止跳转
            // let index = 1;
            // if (index) {
            //     this.alertShow('您好，网站正在报备中，暂时无法投保')
            //     return false;
            // }
            console.log(this.disabled);
            if (!Common.isLogin()) {
                storage.set('prevPage', 'productDetail.html' + window.location.search);
                window.location.href = 'login.html?referrerUserId=' + Common.getQueryString('referrerUserId');
                return false;
            }
            this.priceChange();
            // 生效日期
            var ostartTime = '';
            if (this.endTimeNum > 0) {
                var startTime = document.getElementById('startTime').value;
                ostartTime = startTime.replace(/-/g, '') + '000000';
            } else {
                ostartTime = this.effectDate.replace(/-/g, '') + '000000';
            }
            // 任何信息
            if (this.textValue) {
                this.extraInfos[this.textName] = this.textValue;
            }
            var benList = [
                {
                    'benId': 0,
                    'relation': '',
                    'benRate': ''
                }
            ]
            var insuredList = [
                {
                    insuredId: '',
                    insuredName: this.relationType === '01' ? this.applicant : this.passiveapplicant,
                    mobile: this.relationType === '01' ? this.mobile : this.passMobile,
                    idNo: this.relationType === '01' ? this.idNo : this.passiveidNo,
                    idType: this.relationType === '01' ? this.idType : this.passiveidType,
                    num: this.number,
                    relationType: this.relationType,
                    benList: benList,
                    occupation: this.occupation
                }
            ]
            var data = {
                address: this.address, // 详细地址
                agent: this.agent, // 代理人
                areaCode: this.areaCode, // 城市编号
                applicantId: '', // 投保人ID
                applicant: this.applicant, // 投保人姓名
                classType: 2, // 2：个险
                cneeMobile: this.cneeMobile, // 收货人手机
                cneeName: this.cneeName, // 收货人姓名
                email: '',
                endTime: this.lastInsureTime, // 终保时间
                extraInfos: this.extraInfos, // 额外信息
                idNo: this.idNo, // 证件号码
                idType: this.idType, // 证件类型
                insuredList: insuredList, // 被保险人列表
                isExpress: this.isExpress, // 需要快递？
                mobile: this.mobile, // 手机号码
                period: this.period, // 保障期限值
                planId: this.planId, // 计划编号
                priceKeyword: this.priceKeyword, // 价格关键字
                productId: this.productId, // 产品编号
                referrer: this.referrer, // 推荐地址
                relateTrade: '',
                startTime: ostartTime, // 起保时间
                selectedAge: this.selectedAge, // 选择年龄
                userId: this.userId, // 用户ID
                continueFlg: this.continueFlg, // 是否继续购买
                specialId: this.productDetail.specialId
            }
            // 是否勾选保险协议
            if (!this.check) {
                return false;
            }
            // 是活动 && 不超时 && 有库存
            this.continueFlgFun();
            // 是活动 && 不可购买
            if (this.flashSale === '1' && this.continueFlg === '0') {
                return false;
            }
            if (this.productDetail.productParamsList) {
                let arr = this.productDetail.productParamsList;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].isRequired) {
                        if (!this.extraInfos[arr[i].paramVar]) {
                            this.showtoast(arr[i].paramName + '不能为空', true)
                            return false;
                        }
                    }
                }
            }
            if (!startTime && this.endTimeNum > 0) {
                this.showtoast('请填写生效日期', true);
                return false;
            } else if (!this.applicant) {
                this.showtoast('请输入投保人姓名', true);
                return false;
            } else if (!valid.ID(this.idNo) && this.idType === 1) {
                this.showtoast('请检查投保人证件号码', true);
                return false;
            } else if (!valid.phone(this.mobile)) {
                this.showtoast('请检查投保人手机号码', true);
                return false;
            } else if (this.relationType !== '01' && !this.passiveapplicant) {
                this.showtoast('请输入被保人姓名', true);
                return false;
            } else if (!valid.ID(this.passiveidNo) && this.passiveidType === 1) {
                this.showtoast('请检查被保人证件号码', true);
                return false;
            } else if (this.occupation === '' && this.output.length > 0) {
                this.showtoast('请选择的职业', true);
            } else if (this.relationType !== '01' && !valid.phone(this.passMobile)) {
                // console.log(this.relationType)
                this.showtoast('请检查被保人手机号码', true);
                return false;
            } else if (!this.check) {
                this.showtoast('先阅读协议约定', true);
                return false;
            } else {
                console.log(data);
                request.applyTrade(data, (response) => {
                    console.log(response.data);
                    if (response.data.respCode === '000000') {
                        window.location.href = 'paymentConfirm.html?tradeId=' + response.data.output.tradeId;
                        return false;
                    } else if (response.data.respCode === '600100') {
                        this.confirmShow('活动结束啦！是否需要继续购买？');
                    } else if (response.data.respCode === '600200') {
                        this.alertShow('活动已经结束啦！');
                    } else if (response.data.respCode === '600300') {
                        this.alertShow('活动库存已售罄！');
                    } else if (response.data.respCode === '600400') {
                        this.confirmShow('活动库存已售罄！是否需要继续购买？');
                    } else if (response) {
                        this.showtoast(response.data.respMsg, true);
                    }
                }, (error) => {
                    this.showtoast(error, true);
                })
            }
        },
        // 查看更多特色
        seeUnique() {
            storage.set('adultrisks_productName', this.productDetail.productName);
            window.location.href = 'adultrisks.html?productId=' + this.productId;
        },
        // 查看保障详情
        protectRange() {
            window.location.href = 'protectRange.html?productId=' + this.productId;
        },
        // 理赔指南
        claimProcess() {
            window.location.href = 'claimProcess.html?productId=' + this.productId;
        },
        // 投保条款
        insurance_clause() {
            window.location.href = 'clause.html?productId=' + this.productId;
            return false;
        },
        // 投保须知
        insureNotice() {
            window.location.href = 'insureNotice.html?productId=' + this.productId;
        },
        // 健康告知
        healthNotice() {
            window.location.href = 'healthNotice.html?productId=' + this.productId;
        },
        // 倒计时
        setTime() {
            Common.countdown(this.time, this.promotionExpTime, this.isTimeout, (time, isTimeout) => {
                this.time = time;
                this.isTimeout = isTimeout;
            });
        },
        showAddress() {
            this.isshowAddress = true;
            this.selectProvince();
        },
        // 职业类别
        selectProvince() {
            this.city = '';
            this.area = '';
            this.province = '请选择'
            this.selected = 0;
            this.newAreaName = '';
            let obj = {
                parentId: '0',
                insurerId: this.productDetail.insurerId
            }
            if (!this.productDetail.insurerId) {
                return;
            }
            if (this.oldOutput) {
                this.output = this.oldOutput;
            } else {
                request.getOccupationType(obj, (response) => {
                    if (response.data.respCode === '000000') {
                        this.output = response.data.output.typeList;
                        this.oldOutput = this.output;
                    } else {
                        this.showtoast(response.data.respMsg, true);
                    }
                }, (error) => {
                    this.showtoast(error, true);
                })
            }
            // 职业类别
            let career = JSON.parse(storage.get('career'));
            if (career) {
                this.areaName = career.careerName;
                this.occupation = career.occupation;
            }
        },
        selectCity() {
            this.city = '请选择';
            this.area = '';
            this.selected = 1;
            this.newAreaName = this.selectedProviceName;
            this.output = this.selectedCityArr;
            this.selectCell(this.selectedProviceId);
        },
        selectCell(areaId, insurerCode) {
            this.output.map((item) => {
                if (item.typeId === areaId) {
                    if (item.subType.length === 0) {
                        this.isshowAddress = false;
                        this.areaName = item.typeName;
                        this.occupation = insurerCode;
                        let obj = {
                            careerName: this.areaName,
                            occupation: this.occupation
                        }
                        storage.set('career', JSON.stringify(obj));
                    } else {
                        this.output = item.subType;
                        this.newAreaName = item.typeName;
                    }
                    if (this.selected === 0) {
                        this.province = item.typeName;
                        this.city = '请选择'
                        this.selectedProviceId = areaId;
                        this.selectedProviceName = item.typeName;
                        this.selectedCityArr = item.subType;
                    } else if (this.selected === 1) {
                        this.city = item.typeName;
                        this.area = '请选择';
                    }
                    this.selected++;
                }
            })
        },
        yesterday() {
            // let to = new Date();
            // to.setDate(new Date().getDate() - 1);
            // this.disabled.to = to;
            //this.disabled.from = to;
            //from: this.startInsureTime,
            //to: this.endtInsureTime
            // if (this.endTimeNum > 0) {
            //     this.disabled.to = new Date();
            //     this.disabled.from = new Date();
            // }
        },
        // alert弹框
        alertShow(val) {
            this.showLayer(val, {
                type: 'alert', // 必填
                btns: ['我知道了'], // 必填
                yes: () => { // 选填
                }
            })
        },
        // confirm实例
        confirmShow(val) {
            this.showLayer(val, {
                type: 'confirm',
                btns: ['下次吧', '立即投保'],
                yes: () => {
                    this.continueFlg = '1';
                    this.insure();
                },
                no: () => {
                    this.continueFlg = '0';
                }
            })
        },
        // confirm实例
        confirmShow_login(val) {
            //检验是否登录
            // if (!Common.isLogin()) {
            //     this.showLayer(val, {
            //         type: 'confirm',
            //         btns: ['退出', '重新登录'],
            //         yes: () => {
            //             window.location.href = 'login.html';
            //         },
            //         no: () => {
            //         }
            //     })
            // }
        },
        showLayer(msg, options) {
            // layer引用：3.显示弹框
            this.layer.type = options.type;
            this.layer.message = msg;
            this.layer.isshow = true;
            this.layer.shadeClose = options.shadeClose;
            this.layer.btns = options.btns;
            this.layer.yes = options.yes;
            this.layer.no = options.no;
        },
        closeLayer(type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        showtoast(msg, isshow) {
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast() {
            this.toast.isshow = false;
        },
        formatTime1(val) {
            var t = Date.parse(val);
            if (!isNaN(t)) {
                return new Date(Date.parse(val.replace(/-/g, '/')));
            } else {
                return new Date();
            }
        }
    },
    filters: {
        formatTime(val) {
            if (val) {
                val = val.split('_')[0];
            }
            return val;
        },
        formatMoney(val) {
            if (!val) {
                return val;
            }
            return val.toFixed(2);
        }
    }
}
</script>