<template>
    <div class="container">
        <div id="body">
            <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
            <ul class="hot-list" v-if="hotList.length>0">
                <li class="hot-item" v-for="(item,index) in hotList" :class="{'noborder':index==0}" @click="toProductDetail(item.productId,item.classType,item.productName)">
                    <img :src="item.productLogo" alt="">
                    <p class="title">
                        {{item.productName}}
                        <span class="fr">
                            <span class="green">￥
                                <span class="big">{{item.productPrice/100}}</span>
                            </span>
                            起
                        </span>
                    </p>
                    <p class="info">
                        {{item.productFeature}}
                    </p>
                </li>
            </ul>
            <ul class="hot-list" v-if="adsList.length>0">
                <li class="hot-item" v-for="item in adsList">
                    <a v-if="item.showType == 0" :href="item.adLink" class="link">
                        <img :src="item.adURL" alt="">
                        <p class="title" v-text="item.resourceName"></p>
                        <p class="info" v-text="item.resourceDesc"></p>
                    </a>
                    <a href="#" v-else @click="toProductDetail(item.hostId, item.showType, item.resourceName)" class="link">
                        <img :src="item.adURL" alt="">
                        <p class="title" v-text="item.resourceName"></p>
                        <p class="info" v-text="item.resourceDesc"></p>
                    </a>
                </li>
            </ul>
            <ul class="hot-list" v-if="specialList.length>0">
                <li class="hot-item" v-for="item in specialList">
                    <a :href="item.specialUrl" class="link">
                        <img :src="item.specialLogo" alt="">
                        <p class="title" v-text="item.specialName"></p>
                        <p class="info" v-text="item.specialIntro"></p>
                    </a>
                </li>
            </ul>
        </div>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import request from 'js/interface/request';
import Mydropload from 'js/mydropload.js';
import toast from '../../components/toast';
import myPromise from 'js/tools';
import headerCommon from '../../components/headerCommon.vue';
import {Common, storage, valid} from 'js/common';
export default {
    components: {
        toast,
        headerCommon
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            title: '',
            isWeiXin: false,
            hotList: [], // 爆款列表
            adsList: [], // 优选列表
            specialList: [], // 专题列表
            pageIndex: 1,
            pageSize: 10,
            type: '1'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        this.type = Common.getQueryString('type');
        this.setTitle();
        let d = new Mydropload('body', this.refreshData, this.getList);
        //console.log(d)
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        // 设置页面标题
        setTitle () {
            let titleDom = document.getElementsByTagName('title')[0];
            if (this.type === '1') {
                titleDom.innerText = '爆款推荐';
                this.title = '爆款推荐';
            } else if (this.type === '2') {
                titleDom.innerText = '优选活动';
                this.title = '优选活动';
            } else if (this.type === '3') {
                titleDom.innerText = '专题活动';
                this.title = '专题活动';
            }
        },
        // 数据列表
        getList (me) {
            let fnName = '';
            let list = [];
            let backName = '';
            if (this.type === '1') {
                // 爆款
                fnName = 'getSpecialProductList';
                list = this.hotList;
                backName = 'productList';
            } else if (this.type === '2') {
                // 优选
                fnName = 'getAdsList';
                list = this.adsList;
                backName = 'adsList';
            } else if (this.type === '3') {
                // 专题
                fnName = 'getSpecials';
                list = this.specialList;
                backName = 'specialList';
            }
            let obj = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            }
            // 请求参数, 请求方法名, 数据列表, 后台返回列表名称, dropload
            let p = myPromise.pagination(obj, fnName, list, backName, me);
            //console.log(p)
            p.then((obj) => {
                list = obj.productList;
                console.log(list);
                if (this.type === '1') {
                    this.hotList = list;
                } else if (this.type === '2') {
                    this.adsList = list;
                } else if (this.type === '3') {
                    this.specialList = list;
                }
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
        refreshData (me) {
            me.resetload();
        },
        // 到详情页面
        toProductDetail (val, type, name) {
            // 车险
            if (type === '1') {
                storage.set('productName', name);
                if (Common.isLogin()) {
                    window.location.href = 'carInfo.html';
                    return false;
                } else {
                    window.location.href = 'login.html';
                    return false;
                }
            } else {
                window.location.href = 'productDetail.html?productId=' + val;
                return false;
            }
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        }
    }
}
</script>