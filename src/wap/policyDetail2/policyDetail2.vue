<template>  
    <div id="body" :class="{isWeiXin:isWeiXin}">
                <div class="ui-scroll" v-if="render">
                    <div class="top_head">
                        <div class="fl">
                            <div class="china_pingan">
                            <img :src="output.insurerLogo" alt="">
                            </div>
                            <p class="p1" v-text="output.productName"></p>
                            <p class="p2">保单号：<span v-text="output.policyId"></span></p>
                        </div>
                        <div class="fr">
                             <img src="./images/img1.png" alt="" v-show="output.policySts<20">
                             <img src="./images/img2.png" alt="" v-show="output.policySts==20">
                             <img src="./images/img3.png" alt="" v-show="output.policySts==30">
                             <img src="./images/img4.png" alt="" v-show="output.policySts==40">
                        </div>
                    </div>
                    <ul class="list">
                        <li>
                            <span class="head">车辆信息</span>
                        </li>
                        <li class="itm">
                            <span class="fl">车牌号码</span>
                            <span class="fr" v-for="item in output.insuredList" v-text="item.carInfo.licenseNo == 0 ? '新车未上牌' : item.carInfo.licenseNo"></span>
                        </li>
                        <li class="itm">
                            <span class="fl">姓名</span>
                            <span class="fr" v-for="item in output.insuredList" v-text="item.insuredName"></span>
                        </li>
                        <li class="itm">
                            <span class="fl">证件类型</span>
                            <span class="fr" v-for="item in output.insuredList" v-text="item.insuredName"></span>
                        </li>
                        <li class="itm">
                            <span class="fl">证件号码</span>
                            <span class="fr" v-for="item in output.insuredList" v-text="item.idNo"></span>
                        </li>
                        <li class="itm itm_border">
                            <span class="fl">手机号</span>
                            <span class="fr" v-for="item in output.insuredList" v-text="item.mobile"></span>
                        </li>
                        <li>
                            <span class="head">保险起期</span>
                        </li>
                        <li class="itm" >
                            <span class="fl">交强险起期</span>
                            <span class="fr" v-text="output.jqxStartTime + ' ~ ' + output.jqxEndTime"></span>
                        </li>
                         <li class="itm itm_border flexbox" >
                            <span class="fl flex">商业险起期</span>
                            <span class="fr flexbox flex-right">{{output.startTime | data}} ~ {{output.endTime | data}}</span>
                        </li>
                        <ul class="list" v-for="item in output.insuredList">
                            <li class="head">强制保险</li>
                            <li class="itm">
                                <span class="fl">交强险</span>
                                <span class="fr" v-text="item.carInfo.jqPreium > 0 ? '投保': '不投保'"></span>
                            </li>
                            <li class="itm">
                                <span class="fl">车船税</span>
                                <span class="fr"  v-text="item.carInfo.ccsPreium > 0 ? '投保': '不投保'"></span>
                            </li>
                            <li class="head">商业险</li>
                        </ul>
                       <ul class="list" v-for="(item,index) in output.typeList" v-show="item.typeName != '不计免赔合并费用'">
                            <ul v-for="(itm1,i) in item.insureList">
                                <li class="itm">
                                    <span class="fl" v-text="itm1.insureName"></span>
                                    <span class="fr" v-text="itm1.insureAmount"></span>       
                                </li>
                            </ul>     
                       </ul>
                       <li class="itm itm_border">
                            <span class="fl">附加不计免赔</span>
                                <span class="fr" @click="checkadd()">
                                <i class="iconfont ic1" v-show="!add">&#xe612;</i>
                                <i class="iconfont ic1" v-show="add">&#xe611;</i>
                            </span>  
                        </li>
                       <ul class="list" v-for="(item,index) in output.typeList" v-show="item.typeName != '不计免赔合并费用' && add">
                           <ul class="fj_danger" >
                               <li class="itm1"  v-for="(itm1,i) in item.insureList" v-show="itm1.extrInsureName">
                                     <span class="fl" v-text="itm1.extrInsureName"></span>
                                     <span class="fr">投保</span>
                               </li>
                           </ul>
                       </ul>
                       <li class="data" v-show="add"></li>
                        <li>
                            <span class="head">车辆信息</span>
                        </li>
                        <li class="itm">
                            <span class="fl">车辆型号</span>
                            <span class="fr" v-for="item in output.insuredList" v-text="item.carInfo.vehicleModel"></span>
                        </li>
                        <li class="itm">
                            <span class="fl">车架号</span>
                            <span class="fr" v-for="item in output.insuredList" v-text="item.carInfo.vehicleFrameNo"></span>
                        </li>
                         <li class="itm">
                            <span class="fl">发动机号</span>
                            <span class="fr" v-for="item in output.insuredList" v-text="item.carInfo.vehicleFrameNo"></span>
                        </li>
                        <li class="itm itm_border">
                            <span class="fl">登记日期</span>
                            <span class="fr" v-for="item in output.insuredList" v-text="item.carInfo.registerDate"></span>
                        </li>
                        <li>
                            <span class="head">过户车辆</span>
                        </li>
                        <li  class="itm itm_border">
                            <span class="fl">过户车辆</span>
                            <span class="fr" v-text="vehicle"></span>
                        </li>
                        <li>
                            <span class="head">保单邮寄地址</span>
                        </li>
                        <li  class="itm">
                            <span class="fl">详细地址</span>
                            <span class="fr" v-text="output.shippingAddress"></span>
                        </li>
                    </ul>
                    <!--查看-->
                    <div class="look">
                        <p class="p1">
                            查看
                            <a :href="'./insureNotice.html?productId='+output.productId" class="a">《查看须知》</a>
                            <a href="javascript:;" class="a">《保险条款》</a>
                        </p>
                        <p class="p2">
                            <i class="iconfont ico">&#xe61c;</i>
                            <span>本页面保单信息仅供参考，实际保单状态请以保险公司核心业务系统中记载为准</span>
                        </p>
                    </div>
                </div>    
        <!--最外两个div-->
         <!--toasts提示组件-->
        <totast :isshow="totast.isshow" @ontoastback="closetoast">{{ totast.message}}</totast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import md5 from 'md5';
import request from 'js/interface/request';
import totast from '../../components/toast' // totast引用
import loading from '../../components/loading.vue';
import { Common, valid } from 'js/common.js';
import Cookies from 'js-cookie'
// console.log(Cookies)
Common.setFullScreen();
export default {
    components: {
        totast,
        loading
    },
    data () {
        return {
            output: '',
            icon: '',
            ic1: '&#xe612;',
            add: true,
            vehicle: '',
            totast: { // totast引用
                isshow: false,
                message: ''
            },
            render: false,
            loading: false,
            isWeiXin: ''
        }
    },
    created () {
    },
    mounted () {
        this.isWeiXin = valid.isWeiXin();
        // let d = new Mydropload('body', this.getData, this.loadData);
        this.getData(); // 获取数据
    },
    computed: {
    },
    methods: {
        checkadd () {
            this.add = !this.add;
            console.log('aa')
            console.log(this.add)
        },
        getData (me) {
            if (!me) {
                this.loading = true;
            }
            var data = {
                userId: Common.getUserId(),
                detailId: Common.getQueryString('detailId'), // 明细记录编号
                classType: 1 // 1:车险；2：个险
            }
            request.getTradeDetail(data, (response) => {
                if (response.data.respCode !== '000000') {
                    this.showTotast(response.data.respMsg, true);
                    return;
                }
                let output = response.data.output;
                this.output = output;
                console.log(response.data)
                // console.log(JSON.stringify(output))
                // console.log(output.shippingAddress)
                // console.log(response.data)
                // 是否过户车辆
                let ownership = '';
                if (output.insuredList[0].carInfo.specialCarFlag === 1) {
                    ownership = '是';
                } else {
                    ownership = '否';
                }
                this.vehicle = ownership;
                 // 底部
                // this.$emit('iphoneN', output.insurerTels);
                // this.$emit('durlN', output.insuredList[0].policyURL);
                // 下拉刷新
                if (me) {
                    // 每次数据加载完，必须重置
                    me.resetload();
                    // 解锁loadDownFn里锁定的情况
                    me.unlock();
                    me.noData(false);
                } else {
                    // 首次进入
                    this.loading = false;
                    this.render = true;
                }
                Common.setFullScreen();
            }, (error) => {
                this.showTotast(error, true);
                if (me) {
                    me.resetload();
                }
            })
        },
        formatDate (value) {
            let index = 12;
            let flg = [':', ':', ' ', '-', '-'];
            for (let i = 0; i < 5; i++) {
                value = value.substring(0, index) + flg[i] + value.substring(index, value.length);
                index -= 2;
            }
            return value;
        },
        loadData (me) {
            me.resetload();
        },
        // 显示提示框
        showTotast (msg, isshow) { // totast引用：3.显示
            this.totast.message = msg;
            this.totast.isshow = isshow;
        },
        // 关闭提示框
        closetoast () {
            this.totast.isshow = false;
        }
    },
    filters: {
        data (value) {
            if (value.length > 10) {
                return value.substring(0, 10)
            }
        }
    }
}
</script>
