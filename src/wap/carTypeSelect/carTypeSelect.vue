<template>
    <div id="body" :class="{isWeiXin:isWeiXin}">
        <ul class="car-type">
            <li class="ctype-item" 
                v-for="(item,index) in carInfoList"
                @click="typeChoose(index,item)">
                <p>{{item.modelClass}}   {{item.modelType}}   {{item.stalls}}</p>
                <p>{{item.releaseYear}}   {{item.configName}}  {{item.seats+"座"}} {{item.displacement}}</p>
                <p>新车参考价：<span class="orange">{{item.carPrice}}元</span></p>
                <i class="iconfont green" v-if="index===i">&#xe62f;</i>
            </li>
        </ul>
        <div class="choose-btn">
            <p>请选择与您车辆最匹配的车型</p>
            <span class="btn" @click="noAll">不是以上车型</span>
        </div>
        <div class="ui-btn-group" @click="submitFun">
            <a class="ui-btn">确认车型</a>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import request from 'js/interface/request'
import {Common, getheader, valid, storage} from 'js/common'
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
            loading: false, // 加载中
            carInfoList: '', // 车辆信息列表
            i: 0,
            serialId: '', // 报价流水号
            modelCode: '', //  品牌代码
            carPrice: '', // 参考价格
            carExtras: '', // 附加字段
            planList: '', // 车险套餐列表
            benefitList: '', // 投保的车辆保障条款
            carTypeSelect: '',
            isWeiXin: ''
        }
    },
    created () {
        this.isWeiXin1 = valid.isWeiXin();
        this.serialId = Common.getQueryString('serialId');
        //车辆补充信息接口返回存储
        let carInsure = storage.get('carInsure');
        if (carInsure) {
            this.carTypeSelect = JSON.parse(carInsure);
            this.ins();
        }
    },
    mounted () {
    },
    watch: {
    },
    methods: {
        ins () {
            this.carInfoList = this.carTypeSelect.carInfoList; // 车辆信息列表
            this.planList = this.carTypeSelect.planList; // 车险套餐列表
            console.log(this.carTypeSelect)
            //默认选中第一个(数据)
            this.modelCode = this.carTypeSelect.carInfoList[0].modelCode; // 品牌代码
            this.carPrice = this.carTypeSelect.carInfoList[0].carPrice; // 参考价格
            this.carExtras = this.carTypeSelect.extraJson; // 附加字段
        },
        //选择车辆品牌
        typeChoose (index, item) {
            this.i = index; //暂时不知道干什么，暂留
            this.modelCode = item.modelCode; // 车辆品牌
            this.carPrice = item.carPrice; // 参考价格
            // this.carExtras = item.carExtras; // 附加字段（用这个this.carTypeSelect.extraJson）
        },
        noAll () {
            window.location.href = 'carInsure.html?serialId=' + this.serialId;
        },
        submitFun () {
            var data = {
                'serialId': this.serialId,
                'modelCode': this.modelCode, //车辆品牌
                'carPrice': this.carPrice, //参考价格
                'carExtras': this.carExtras, // 附加字段
                'benefitList': this.planList // 套餐
            }
            console.log(data)
            var odata = JSON.stringify(data);
            //车辆询价时用
            storage.set('carTypeSelect', odata);
            let carInfoareaCode = storage.get('carInfoareaCode');
            //判断是江苏省直接进方案调整页面
            if (Common.getQueryString('isDadi') === 'true') {
                window.location.href = 'choosePolicy.html?serialId=' + this.serialId;
                return false;
            }
            if (carInfoareaCode) {
                if (carInfoareaCode === '320000') {
                    window.location.href = 'carAdjust.html?serialId=' + this.serialId + '&index=0';
                    return false;
                }
            }
            window.location.href = 'choosePolicy.html?serialId=' + this.serialId;
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        }
    },
    filters: {
    }
}
</script>
