<template>
    <div id="body" :class="{isWeiXin:isWeiXin}">
        <div class="ui-scroll" id="ui-scroll">
            <ul class="car-list">
                <li class="car-item" v-for="item in productList" @click="href_Url(item)">
                    <div class="logo">
                        <img v-show="item.productLogo" :src="item.productLogo" alt="">
                         <img v-show="!item.productLogo" src="../../assets/images/defaultProduct.jpg" alt="">
                       <!-- <span v-show="item.insurerName" class="insurer-name">{{item.insurerName}}</span>
                       -->
                        <span class="newP" v-if="item.isProduceFlag=='1'">新品</span>
                    </div>

                    <div class="text">
                        <p class="flexbox name">
                            <span class="pName" :class="{'pNameBig':!item.activeSpecial || !isLogin}"
 v-text="item.productName"></span>
                            <span>
                                <span class="hotP" v-show="item.activeSpecial && isLogin" v-if="item.activeSpecial.split(',').length>=1">{{item.activeSpecial.split(',')[0]}}</span>
                            </span>
                        </p>
                        <p class="info">承保车辆：{{item.businessDesc}}</p>
                        <div class="detail">
                            <span class="fl">
                                承保地区：<span class="green">{{item.areaDesc}}</span>
                            </span>    
                            <span class="fr">
                                销量 
                                {{item.totalAmount | overWan}}份
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <personal></personal>
        <div id="load" style="width:100%;text-align:center;"></div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import {Common, storage, valid} from 'js/common'
import Mydropload from 'js/mydropload.js';
import myPromise from 'js/tools.js';
import request from 'js/interface/request';
import toast from '../../components/toast' // toast引用
import personal from '../../components/indexpersonal/indexpersonal';
export default {
    components: {
        toast,
        personal
    },
    data () {
        return {
            isLogin: true,
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            productList: [], // 产品列表
            insurerAreas: [], // 保险公司开展业务地区
            pageIndex: 1, // 请求页面
            pageSize: 10,
            productType: '', // 车险分类
            foot: '', // 侧滑
            isWeiXin: ''
        }
    },
    created () {
        this.productType = Common.getQueryString('productType');
    },
    mounted () {
        this.isWeiXin = valid.isWeiXin();
        let d = new Mydropload('body', this.refreshData, this.getproductList);
    },
    watch: {
    },
    methods: {
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        getproductList (me) {
            var obj = {
                'pageIndex': this.pageIndex,
                'pageSize': this.pageSize,
                'sortCode': 0,
                'productType': this.productType,
                'benefitNum': 0
            }
            let p = myPromise.pagination(obj, 'getProducts', this.productList, 'productList', me);
            p.then((obj) => {
                this.productList = obj.productList;
                this.$nextTick(() => {
                    Common.setFullScreen(document.getElementById('body'))
                    me.direction = 'up';
                    me.resetload();
                })
                this.pageIndex = obj.pageIndex;
            }, (error) => {
                this.showtoast(error, true);
            });
        },
        href_Url(item) {
            let productType = Common.getQueryString('productType');
            if (Common.isLogin() && storage.get('userId')) {
                storage.set('insurerName', item.insurerName);
                window.location.href = 'carInfo.html?id=' + item.productId;
            } else {
                storage.set('prevPage', 'productList.html?productType=' + productType);
                window.location.href = 'login.html';
            }
        },
        resetBody () {
            this.$nextTick(() => {
                Common.setFullScreen();
            })
        },
        refreshData (me) {
            me.resetload();
        }
    },
    filters: {
        overWan (value) {
            if (value <= 10000) {
                return value;
            } else {
                return value / 10000 + '万';
            }
        }
    }
}
</script>
