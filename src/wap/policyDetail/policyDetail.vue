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
                    <i class="iconfont" v-show="output.policySts==100&&output.claimState==40">&#xe6a0;</i>
                    <i class="iconfont blue" v-show="output.policySts==100&&output.claimState==30">&#xe69f;</i>
                    <i class="iconfont" v-show="output.policySts==30">&#xe69e;</i>
                    <i class="iconfont blue" v-show="output.policySts==100&&output.claimState==10">&#xe69d;</i>
                    <i class="iconfont blue" v-show="output.sts==60">&#xe69a;</i>
                    <i class="iconfont blue" v-show="output.policySts==100&&output.claimState==0">&#xe699;</i>
                    <i class="iconfont" v-show="output.policySts==40">&#xe688;</i>
                    <i class="iconfont blue"  v-show="output.policySts==20">&#xe6a1;</i>
                    <i class="iconfont"  v-show="output.policySts==100&&output.claimState==-20">&#xe6a2;</i>
                    </div>
            </div>
            <ul class="list">
                <li>
                    <span class="head">保险责任</span>
                </li>
                <li class="itm" v-for="(item,index) in insured_liability" :class="{'itm_border':index==insured_liability.length-1}" >
                    <span class="fl" v-text="item.name"></span>
                    <span class="fr" v-text="item.content"></span>
                </li>
                <li class="itm_finally"></li>
                <li class="itm">
                    <span class="fl">支付保费</span>
                    <span class="fr" v-text="output.payAmount / 100 + '元'"></span>
                </li>
                <li class="itm">
                    <span class="fl">保障开始时间</span>
                    <span class="fr" v-text="output.startTime"></span>
                </li>
                <li class="itm itm_border">
                    <span class="fl">保障结束时间</span>
                    <span class="fr" v-text="output.endTime"></span>
                </li>
                <li>
                    <span class="head">投保人</span>
                </li>
                <li  class="itm">
                    <span class="fl">姓名</span>
                    <span class="fr" v-text="output.applicant"></span>
                </li>
                <li  class="itm">
                    <span class="fl">证件类型</span>
                    <span class="fr">{{output.applicantType | data}}</span>
                </li>
                <li  class="itm">
                    <span class="fl">证件号</span>
                    <span class="fr" v-text="output.applicantIdNo"></span>
                </li>
                <li  class="itm">
                    <span class="fl">出生日期</span>
                    <span class="fr" v-for="item in output.insuredList" v-text="item.birthday"></span>
                </li>
                <li  class="itm itm_border">
                    <span class="fl">手机号码</span>
                    <span class="fr" v-text="output.applicantMobile"></span>
                </li>
                <li class="itm_finally"></li>
                <li  class="itm itm_border">
                    <span class="fl">被保人</span>
                    <span class="fr" v-for="item in output.insuredList" v-text="item.relationString"></span>
                </li>
            </ul>
            <!--查看-->
            <div class="look">
                    <p class="p1">
                    查看
                    <a class="a" :href="'./insureNotice.html?productId='+output.productId">《查看须知》</a>
                    <a href="javascript:;" class="a">《保险条款》</a>
                </p>
                <p class="p2">
                    <i class="iconfont ico">&#xe61c;</i>
                    <span>本页面保单信息仅供参考，实际保单状态请以保险公司核心业务系统中记载为准</span>
                </p>
            </div>
        </div>
         <!--toasts提示组件-->
        <totast :isshow="totast.isshow" @ontoastback="closetoast">{{ totast.message}}</totast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import request from 'js/interface/request'
import totast from '../../components/toast' // totast引用
import loading from '../../components/loading.vue';
import { Common, valid } from 'js/common.js';
Common.setFullScreen();
export default {
    components: {
        totast,
        loading
    },
    data () {
        return {
            aaa: '',
            output: '',
            icon: '',
            insured_liability: [ // 保险责任
                {name: '人身意外伤害-身故、残疾', content: ''},
                {name: '意外医疗费（免赔额100元)', content: ''},
                {name: '银行卡盗刷', content: ''}
            ],
            insured_liabilit_finally: [ // 保险责任下一个
                {name: '支持保费', content: ''},
                {name: '保障开始时间', content: ''},
                {name: '保障结束时间', content: ''}
            ],
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
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
        // let d = new Mydropload('body', this.getData, this.loadData);
        this.getData(); // 获取数据
    },
    computed: {
    },
    methods: {
        getData (me) { // 获取数据
            if (!me) {
                // this.loading = true;
            }
            var data = {
                userId: Common.getUserId(),
                'detailId': Common.getQueryString('detailId'), // 明细记录编号
                'classType': 2 // 1:车险；2：个险
            }
            request.getTradeDetail(data, (response) => {
                if (response.data.respCode !== '000000') {
                    this.showTotast(response.data.respMsg, true);
                    return;
                }
                let output = response.data.output;
                console.log(response.data);
                // console.log(JSON.stringify(output))
                this.output = output;
                // console.log(output.productId)
                //
                // 保险责任
                let list = response.data.output.typeList;
                let arr = [];
                for (let i = 0; i < list.length; i++) {
                    arr.push(list[i].insureList)
                };
                let arr1 = [];
                for (let z = 0; z < arr.length; z++) {
                    if (arr[z].length === 1) {
                        let nn = arr[z];
                        arr1.push(nn[0]);
                    } else {
                        let nn = arr[z];
                        for (let zz = 0; zz < arr[z].length; zz++) {
                            arr1.push(nn[zz])
                        }
                    }
                };
                let arr2 = [];
                for (let i = 0; i < arr1.length; i++) {
                    arr2.push({name: arr1[i].insureName, content: arr1[i].insureAmount});
                };
                this.insured_liability = arr2;
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
        formatDate (value) { // 日期格式过滤
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
        data (val) {
            if (val === '1') {
                val = '身份证';
            }
            if (val === '3') {
                val = '护照';
            }
            if (val === '2') {
                val = '军官证';
            }
            return val;
        }
    }
}
</script>
