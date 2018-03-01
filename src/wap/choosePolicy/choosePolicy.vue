<template>
    <div id='body' :class="{isWeiXin:isWeiXin}">
        <div id='swiper-my' class='swiper-container'>
            <div class='swiper-wrapper'>
                <div class='swiper-slide' v-for="(item,index) in benefitList">
                    <div class='box'>
                        <div class='logo' v-show="index%2==0">
                            <div>热销款</div>
                        </div>
                        <div class="logo1" v-show="index%2!=0"></div>
                        <div class='bottom'>
                             <div class='top'>
                                 <p>
                                    <span class='fl'>交强险</span>
                                    <span class='fr'>投保</span>           
                                 </p>
                                 <p>
                                    <span class='fl'>商业险</span>
                                    <span class='fr'>投保</span>           
                                 </p>
                             </div>
                             <ul class="list">
                                 <li v-for="item1 in item.syxList">
                                    <span class='fl'>{{item1.itemName}}</span>
                                    <span class="fr right">
                                         <span v-if="item1.franchiseFlag == 0 || item1.franchiseFlag == 1">不计免赔</span>
                                    </span>
                                    <span class="fr number" v-for="itm in item1.amountList" v-text="itm.amountName" v-show="item1.chooseAmount==itm.amountCode"></span>  
                                 </li>
                             </ul>
                             <p class='money1' v-show="money['sts' + index] == '0'">询价中...</p>
                             <p class='money' v-show="money['sts' + index] == '1'">￥<span v-text="money[index]"></span></p>
                             <p class='money1' v-show="money['sts' + index] == '2'">暂无报价</p>
                             <p class='money1' v-show="money['sts' + index] == '3'">服务器超时</p>
                             <p class='a_href' v-show="money['sts' + index] < '2'" @click="changePlan(item,index)">修改投保方案<span>></span></p>                    
                        </div>
                    </div>
                </div>
            </div>
            <!-- 如果需要分页器 -->
            <div class='swiper-pagination'></div>       
        </div>
        <div class='btn flexbox'>
           <a href="carHelp.html">
                <span class="left">
                    <i class="iconfont">&#xe658;</i>
                    帮助
                </span>
           </a>
           <span class="text flex" @click="sureFun">确定</span>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import Swiper from 'swiper';
import {Common, getheader, valid, storage} from 'js/common'
import request from 'js/interface/request'
import toast from '../../components/toast' // totast引用：
import loading from '../../components/loading';
export default {
    components: {
        toast,
        loading
    },
    data () {
        return {
            toast: { // totast引用
                isshow: false,
                message: ''
            },
            time: {
                seconds: 0
            },
            isTimeout: false,
            endTime: 0,
            loading: false, // 加载中
            flag: true,
            index: '', // 选择值index
            serialId: '', //流水号
            carTypeSelect: '', //获取上个页面的数据
            modelCode: '', // 车辆品牌
            carPrice: '', //参考啊价格
            carExtras: '', //附加字段
            benefitList: '', // 投保方案
            benefitListArr: '',
            benefitList1: [], // 后台返回
            pkgName: [], // 套餐名称
            money: {}, // 询价集合
            money1: {}, // 价钱集合
            isWeiXin: ''
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        this.ins();
    },
    mounted () {
        let swiper = new Swiper('#swiper-my', {
            pagination: '.swiper-pagination',
            // loop: true,
            spaceBetween: 30,
            slidesPerView: 1.4,
            centeredSlides: true,
            paginationClickable: true,
            effect: 'coverflow',
            coverflow: {
                rotate: 0,
                depth: 120,
                slideShadows: false
            },
            onTransitionStart: (swiper) => {
                this.index = swiper.activeIndex;
            }
        });
        this.time15();
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
        ins () {
            // var carDetail = JSON.parse(storage.get('carDetail')); // 暂时没有用到，暂留
            this.serialId = Common.getQueryString('serialId');
            //上个页面存储
            let carTypeSelect = storage.get('carTypeSelect');
            if (carTypeSelect) {
                this.carTypeSelect = JSON.parse(carTypeSelect);
                this.benefitList = this.carTypeSelect.benefitList; //套餐
                this.format1(); // 格式化提交的数据
            }
        },
        //格式化提交的数据
        format1 () {
            var benefitList = this.benefitList;
            // console.log(this.benefitList)
            var benefitListArr = [];
            for (var i = 0; i < benefitList.length; i++) {
                this.pkgName.push(benefitList[i].pkgName);
                var obenefitList = [];
                for (var a = 0; a < benefitList[i].fjxList.length; a++) {
                    let itemCode = benefitList[i].fjxList[a].itemCode;
                    let franchiseFlag = benefitList[i].fjxList[a].franchiseFlag;
                    let chooseAmount = benefitList[i].fjxList[a].chooseAmount;
                    let benefitItem = {
                        'chooseAmount': chooseAmount,
                        'franchiseFlag': franchiseFlag,
                        'itemCode': itemCode
                    }
                    obenefitList.push(benefitItem);
                }
                for (var b = 0; b < benefitList[i].syxList.length; b++) {
                    let itemCode = benefitList[i].syxList[b].itemCode;
                    let franchiseFlag = benefitList[i].syxList[b].franchiseFlag;
                    let chooseAmount = benefitList[i].syxList[b].chooseAmount;
                    let benefitItem = {
                        'chooseAmount': chooseAmount,
                        'franchiseFlag': franchiseFlag,
                        'itemCode': itemCode
                    }
                    obenefitList.push(benefitItem);
                }
                for (var c = 0; c < benefitList[i].qtxList.length; c++) {
                    let itemCode = benefitList[i].qtxList[c].itemCode;
                    let franchiseFlag = benefitList[i].qtxList[c].franchiseFlag;
                    let chooseAmount = benefitList[i].qtxList[c].chooseAmount;
                    let benefitItem = {
                        'chooseAmount': chooseAmount,
                        'franchiseFlag': franchiseFlag,
                        'itemCode': itemCode
                    }
                    obenefitList.push(benefitItem);
                }
                for (var d = 0; d < benefitList[i].jqxList.length; d++) {
                    let itemCode = benefitList[i].jqxList[d].itemCode;
                    let franchiseFlag = benefitList[i].jqxList[d].franchiseFlag;
                    let chooseAmount = benefitList[i].jqxList[d].chooseAmount;
                    let benefitItem = {
                        'chooseAmount': chooseAmount,
                        'franchiseFlag': franchiseFlag,
                        'itemCode': itemCode
                    }
                    obenefitList.push(benefitItem);
                }
                benefitListArr[i] = obenefitList;
            }
            this.benefitListArr = benefitListArr;
            // console.log(this.benefitList[0].syxList)
            this.getData(); // 循环提交套餐
        },
        // 过期时间
        getEndTime (second) {
            let sTime = storage.get('choosePolicyTime');
            let endTime = '';
            if (sTime) {
                endTime = new Date().getTime() >= sTime ? new Date().getTime() + second * 1000 : sTime;
            } else {
                endTime = new Date().getTime() + second * 1000;
            }
            storage.set('choosePolicyTime', endTime);
            return endTime;
        },
        // 倒计时
        time15 (i) {
            // 毫秒
            this.endTime = this.getEndTime(15);
            Common.countdown(this.time, this.endTime, this.isTimeout, (time, isTimeout) => {
                this.time = time;
                this.isTimeout = isTimeout;
                if (this.isTimeout) {
                    for (var i = 0; i < this.benefitList.length; i++) {
                        if (this.money['sts' + i] === '0') {
                            this.money['sts' + i] = '3' // 服务器超时
                        }
                    }
                }
            });
        },
        //循环提交套餐
        getData () {
            for (var i = 0; i < this.benefitList.length; i++) {
                if (!this.isTimeout) {
                    this.getData1(i);
                }
            }
        },
        getData1 (val) {
            var data = {
                serialId: this.serialId,
                modelCode: this.carTypeSelect.modelCode, //车辆品牌型号
                carPrice: this.carTypeSelect.carPrice, //参考价格
                carExtras: this.carTypeSelect.carExtras, //附加字段
                traffFlag: '1', //1:交强险+商业险0:商业险
                benefitList: this.benefitListArr[val]
            }
            // console.log(data)
            let sts = 'sts' + val;
            if (this.money[sts] === undefined || this.money[sts] === 'undefined') {
                this.$set(this.money, sts, '0') // 询价中
                this.$set(this.money, val.toString(), '');
            } else {
                this.money[sts] = '0' // 询价中
                this.money[val] = ''
            }
            let obj = {
                totalPreium: '', // 总保费
                jqPreium: '', // 交强险保费
                ccsTax: '', // 车船险保费
                carExtras: '' // 后台返回
            }
            this.money1[val] = obj;
            request.getCarInsCalc(data, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    this.formatting(response.data.output.benefitList)
                } else {
                    let output = ''
                    this.formatting(output)
                }
                if (response.data.respCode === '000000') {
                    this.money[val] = response.data.output.totalPreium;
                    console.log(response.data)
                    this.money[sts] = '1' // 成功
                    let output = response.data.output;
                    let obj = {
                        totalPreium: output.totalPreium, // 总保费
                        jqPreium: output.jqPreium, // 交强险保费
                        ccsTax: output.ccsTax, // 车船险保费
                        carExtras: output.carExtras, //附加字段
                        totalFranchisePreium: output.totalFranchisePreium, // 附加免赔从费用 大地公司返回
                        quotesId: output.quotesId // 报价编号
                    }
                    this.money1[val] = obj;
                } else {
                    this.money[sts] = '2' // 暂无报价
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
         // 格式化后台数据
        formatting (output) {
            console.log('a')
            // console.log(JSON.stringify(output))
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
            // console.log(this.benefitList1)
        },
        changePlan (item, index) {
            let index1 = this.index;
            let money = this.money[index1];
            let money1 = this.money1[index1];
            if (money !== '') {
                storage.remove('choosePolicyTime');
                window.location.href = 'carAdjust.html?serialId=' + this.serialId + '&index=' + index;
            }
        },
        sureFun () { //点击确定
            let index = this.index;
            let money = this.money[index];
            let money1 = this.money1[index];
            if (money !== '') {
                let obj = {
                    totalPreium: money1.totalPreium, // 总保费
                    jqPreium: money1.jqPreium, // 交强险保费
                    ccsTax: money1.ccsTax, // 车船险保费
                    carExtras: money1.carExtras, //附加字段
                    quotesId: money1.quotesId, // 报价编号
                    totalFranchisePreium: money1.totalFranchisePreium, //不计免赔总费用
                    // totalFranchisePreium: '43242332', //测试用
                    benefitList: this.benefitList1[index] // 选中的套餐
                }
                console.log(this.benefitList1)
                storage.set('totalPreium', JSON.stringify(obj));
                storage.remove('choosePolicyTime');
                storage.remove('carOrderCheck');
                window.location.href = 'carOrderConfirm.html?serialId=' + this.serialId + '&id=' + index;
            }
        }
    },
    filters: {
        overWan (value) {
            if (value < 10000) {
                return value;
            } else {
                return value / 10000 + '万';
            }
        }
    }
}
</script>