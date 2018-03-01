<template>
    <div class="container">
        <div id="body">
            <div class="header" v-bind:class="{green:isSearch}">
                <div v-if="!isWeiXin" v-show="personalInfo" class="personal" @click="showPersonalInfo"><img src="./images/personal.png" alt=""></div>
                <div class="search" v-bind:class="{'ing':isSearch,'translateR': !isWeiXin}">
                    <input type="text" placeholder="搜索产品" v-model="searchKey" id="searchText" @click="searchShowFun" @keypress="searchFun(searchKey, $event)" @blur="searchFun(searchKey)">
                    <span class="clear" @click="clearFun">
                        <i class="iconfont">&#xe630;</i>
                    </span>
                    <span class="cancel" @click="hideSearch">取消</span>
                </div>
                <div class="swiper-container" id="swiper" v-bind:class="{hide:isSearch}">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-if="bannerInfo.length == 0">
                            <a href="#">
                                <img src="../../assets/images/defaultBanner.jpg" alt="">
                            </a>
                        </div>
                        <div class="swiper-slide" v-else v-for="banner in bannerInfo">
                            <a v-if="banner.showType == 0" :href="banner.adLink">
                                <img v-if="banner.adURL" :src="banner.adURL" alt="">
                                <img v-else src="../../assets/images/defaultBanner.jpg" alt="">
                            </a>
                            <a v-else @click="toProductDetail(banner.hostId, banner.showType, banner.resourceName)">
                                <img v-if="banner.adURL" :src="banner.adURL" alt="">
                                <img v-else src="../../assets/images/defaultBanner.jpg" alt="">
                            </a>
                        </div>
                    </div>
                    <!-- 如果需要分页器 -->
                    <div class="swiper-pagination"></div>
                </div>
            </div>
            <div class="search-content" v-if="isSearch">
                <div v-if="!isSearchContent">
                    <div class="title" v-if="isHotshow">
                        热门搜索
                    </div>
                    <ul class="hot-list">     
                        <li class="hot-item" v-for="hitem in hotList" @click="searchFun(hitem.keyName, 'button')">
                            {{hitem.keyName}}
                        </li>
                    </ul>
                    <div class="title">
                        历史搜索
                        <span class="fr" @click="clearAll">
                            <i class="iconfont">&#xe625;</i>
                            清空
                        </span>
                    </div>
                    <ul class="history-list" id="history">
                        <li class="history-item" v-for="hitem in historyList">
                            <span @click="searchFun(hitem, 'button')">
                                <i class="iconfont">&#xe62b;</i>
                                <span class="text">{{hitem}}</span> 
                            </span>
                            <span class="fr" @click="deleteHistory">
                                <i class="iconfont">&#xe629;</i>
                            </span>
                        </li>
                    </ul>
                </div>
                    
                <div class="recommend-list" style="margin-top:0.2rem;" v-if="isSearchContent">
                    <p class="nodata1 flexbox flex-column align-items" v-if="nodata1">
                        <img src="../../assets/images/nodata.png" alt="">
                        <span>暂无数据</span>
                    </p>
                    <!--产品列表-->
                    <div class="recommend-item" v-else v-for="(ritem,index) in searchList" @click="toProductDetail(ritem.productId,ritem.classType,ritem.productName)" :class="{'noMargin':index==searchList.length-1}">
                        <div class="logo">
                            <img v-show="ritem.productLogo" :src="ritem.productLogo" alt="">
                            <img v-show="!ritem.productLogo" src="../../assets/images/defaultProduct.jpg" alt="">
                            <span class="insurer-name">{{ritem.insurerName}}</span>
                            <span class="newP" v-if="ritem.isProduceFlag=='1' && isLogin">新品</span>
                        </div>
                        <div class="text">
                            <p class="flexbox name">
                                <span class="pName" :class="{'pNameBig':!ritem.activeSpecial || !isLogin}" v-text="ritem.productName"></span>
                                <span>
                                    <span class="hotP" v-show="ritem.activeSpecial && isLogin" v-if="ritem.activeSpecial.split(',').length>=1">{{ritem.activeSpecial.split(',')[0]}}</span>
                                </span>
                            </p>
                            <p class="info">{{ritem.productFeature}}</p>
                            <div class="detail">
                                <span class="green">￥<span class="big">{{(ritem.specialPrice || ritem.minPremium) | formatMoney}}</span></span> 起
                                <span class="fr">
                                    销量 
                                    {{ritem.totalAmount | overWan}}份
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="!isSearch">
                <ul class="title-list">
                    <li class="title-item">
                        <a href="hot.html?type=1">
                            <img src="./images/title1.png" alt="">
                            <p>爆款推荐</p>
                        </a>
                    </li>
                    <li class="title-item">
                        <a href="hot.html?type=2">
                            <img src="./images/title2.png" alt="">
                            <p>优选活动</p>
                        </a>
                    </li>
                    <li class="title-item">
                        <a href="hot.html?type=3">
                            <img src="./images/title3.png" alt="">
                            <p>专题活动</p>
                        </a>
                    </li>
                </ul>
                <div id="type" style="height:0;width:100%;margin-top: 0.2rem;"></div>
                <!--辅助条-->
                <div v-show="typeList.length>0" class="type-content none" :class="{'show':isFixed}">
                    <ul class="type-list" v-bind:style="{width: typeWidth / 50 +'rem'}">
                        <li v-for="(pitem,index) in typeList"
                            @click="typeShow(index,pitem.typeId,undefined,undefined,pitem.classType)"
                            v-bind:class="{cur:index===typei}">{{pitem.typeName}}</li> 
                    </ul>
                </div>
                <!--用户可交互-->
                <div v-show="typeList.length>0" class="type-content" :class="{'fixed':isFixed}">
                    <ul class="type-list" v-bind:style="{width: typeWidth / 50 +'rem'}">
                        <li v-for="(pitem,index) in typeList"
                            @click="typeShow(index,pitem.typeId,undefined,undefined,pitem.classType)"
                            v-bind:class="{cur:index===typei}">{{pitem.typeName}}</li> 
                    </ul>
                </div>
                <!--辅助条-->
                <div class="sort-list none" :class="{'show':isFixed}">
                    <span class="sort-item" @click="spFun">
                        价格
                        <img class="icon" v-if="isGoup==1" src="./images/paixu_shang.png" alt="">
                        <img class="icon" v-else-if="isGoup==2" src="./images/paixu_xia.png" alt="">
                    </span>
                    <span class="sort-item" @click="heightMount">
                        销量最高
                    </span>
                </div>
                <!--用户可交互-->
                <div class="sort-list"  :class="{'fixed':isFixed}">
                    <span class="sort-item" @click="spFun">
                        价格
                        <img class="icon" v-if="isGoup==1" src="./images/paixu_shang.png" alt="">
                        <img class="icon" v-else-if="isGoup==2" src="./images/paixu_xia.png" alt="">
                    </span>
                    <span :class="{'greenColor': isHeight}" class="sort-item" @click="heightMount">
                        销量最高
                    </span>
                </div>
                <div class="ui-scroll">
                    <p style="text-align:center;color:#a8afac;" v-show="nodata">暂无数据</p>
                    <div class="recommend-list" v-show="!nodata">
                        <!--产品列表-->
                        <div class="recommend-item" v-for="(ritem,index) in recommendList" @click="toProductDetail(ritem.productId,ritem.classType,ritem.productName)" :class="{'noMargin':index==recommendList.length-1}">
                            <div class="logo">
                                <img v-show="ritem.productLogo" :src="ritem.productLogo" alt="">
                                <img v-show="!ritem.productLogo" src="../../assets/images/defaultProduct.jpg" alt="">
                                <span class="insurer-name">{{ritem.insurerName}}</span>
                                <span class="newP" v-if="ritem.isProduceFlag=='1' && isLogin">新品</span>
                            </div>
                            <div class="text">
                                <p class="flexbox name">
                                    <span class="pName" :class="{'pNameBig':!ritem.activeSpecial || !isLogin}" v-text="ritem.productName"></span>
                                    <span>
                                        <span class="hotP" v-show="ritem.activeSpecial && isLogin" v-if="ritem.activeSpecial.split(',').length>=1">{{ritem.activeSpecial.split(',')[0]}}</span>
                                    </span>
                                </p>
                                <p class="info">{{ritem.productFeature}}</p>
                                <div class="detail">
                                    <span class="green">￥<span class="big">{{(ritem.specialPrice || ritem.minPremium) | formatMoney}}</span></span> 起
                                    <span class="fr">
                                        销量 
                                        {{ritem.totalAmount | overWan}}份
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <personal></personal>
    </div>
</template>
<script>
import {Common, storage, valid} from 'js/common';
import Mydropload from 'js/mydropload.js';
import Swiper from 'swiper';
import toast from '../../components/toast'; // toast引用
import personal from '../../components/indexpersonal/indexpersonal';
import request from 'js/interface/request';
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
            bannerInfo: [],
            isSearch: false, // 显示搜索模块
            isFixed: false, // 滑动后导航菜单模块固定
            offsetTop: 0,
            isSearchContent: false, // 是否有搜索内容
            typei: 0, // 导航菜单模块定义初始值
            searchKey: '', // 查找关键字
            typeWidth: '', // 产品类型宽度
            isGoup: 0, // 价格高低标志
            typeList: [],
            currentType: '', // 当前显示的类型
            isHotshow: true, // 热门搜索有无判断显示隐藏
            hotList: [], // 热门
            historyList: [], // 历史搜索
            recommendList: [], // 产品列表
            searchList: [], // 搜索列表
            nodata: false, // 主页没记录时
            nodata1: false, // 搜索没记录时
            isHeight: false, // 销量最高
            pageSize: 10,
            pageIndex: 1,
            isLockDown: false, // 上拉加载
            isData: true,
            sortCode: '0', // 排序
            isSort: false,
            searchPageIndex: 1,
            isClear: false, // 是否是清除文本框内容
            searchLock: false, // 搜索默认是解开的
            isWeiXin: valid.isWeiXin(),
            personalInfo: true,
            foot: '',
            boy: ''
        }
    },
    created () {
        // this.isLogin = Common.isLogin();
        this.getBannerInfo(); // 轮播图信息
        this.getProductTypeNew(); // 产品类型
        this.getHot(); // 热门搜索
        this.searchHistory(); // 历史搜索
    },
    mounted () {
        this.scrollFixed();
        this.foot = document.getElementById('foot');
        this.boy = document.getElementById('body');
    },
    computed: {
    },
    methods: {
        // 滚动固定
        scrollFixed () {
            // fixed条
            let type = document.getElementById('type');
            this.offsetTop = type.offsetTop;
            if (valid.isIOS() && valid.isWeiXin()) {
            } else {
                window.onscroll = () => {
                    var top = document.documentElement.scrollTop || document.body.scrollTop;
                    if (top > this.offsetTop && !this.isSearch) {
                        this.isFixed = true;
                    } else if (!this.isSearch) {
                        this.isFixed = false;
                    }
                }
            }
        },
        // toast
        showtoast (msg, isshow) {
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        showpersonal (isshow) {
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        // 轮播图信息
        getBannerInfo () {
            request.getBannerInfo(undefined, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    this.bannerInfo = response.data.output.ads;
                    this.$nextTick(() => {
                        let swiper = new Swiper('#swiper', {
                            pagination: '.swiper-pagination',
                            loop: true,
                            autoplay: 5000,
                            speed: 500,
                            paginationClickable: true,
                            autoplayDisableOnInteraction: false
                        });
                    })
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                console.log(error)
                this.showtoast(error, true);
            })
        },
        // 点击搜索
        searchShowFun () {
            this.personalInfo = false;
            this.isClear = false;
            this.isSearch = true;
            this.isSearchContent = false;
            var storage = window.localStorage;
            var searchname = storage.getItem('searchname');
            this.searchList = [];
            if (searchname) {
                this.searchHistory();
            } else {
                this.historyList = '';
            }
            this.$nextTick(() => {
                Common.setFullScreen(document.getElementById('body'));
            })
        },
        // 获取产品类型
        getProductTypeNew () {
            let obj = {
                parentId: '0'
            }
            request.getProductTypeNew(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.typeList = response.data.output.typeList;
                    this.typeWidth = this.typeList.length * 64;
                    console.log('typeList:', this.typeList)
                    // 初始加载
                    let d = new Mydropload('body', this.refreshData, this.pagination);
                } else {
                    this.showtoast(response.data.respMsg, true);
                    console.log(3);
                }
                this.resetBody();
            }, (error) => {
                this.showtoast(error, true);
            });
        },
        // 隐藏搜索
        hideSearch () {
            this.personalInfo = true;
            this.isSearch = false;
            this.searchKey = '';
            this.recommendList = [];
            this.typeShow(this.typei, this.typeList[this.typei].typeId, window.dropload);
        },
        // 是否回车键
        isEnterKey (e) {
            e = e || window.event;
            if (e.keyCode === 13) {
                return true;
            } else {
                return false;
            }
        },
        // 查找
        searchFun (value, e) {
            if (valid.isAndroid() && this.isEnterKey(e)) {
                document.getElementById('searchText').blur();
            }
            // android手机并且(回车/点击按钮), ios手机并且(不是keypress/点击按钮)
            if ((valid.isAndroid() && (this.isEnterKey(e) || e === 'button')) || (valid.isIOS() && (!e || e === 'button'))) {
                this.searchKey = value;
                if (!this.searchKey) {
                    return;
                }
                if (this.searchLock) {
                    return;
                }
                this.searchLock = true;// 搜索锁住
                setTimeout(() => {
                    this.searchLock = false;// 搜索解开
                    // 如果是点击删除按钮，不搜索
                    if (this.isClear) {
                        return;
                    }
                    // 记录历史搜索
                    this.setHistory(this.searchKey)
                    // 查找
                    this.search(this.searchKey);
                }, 0);
            }
        },
        // 记录历史搜索
        setHistory (value) {
            var storage = window.localStorage;
            var name = storage.getItem('searchname');
            if (name) {
                // 如果是重复的值则不操作
                var nameArr = name.split(',');
                var len = nameArr.length;
                var flag = 1;
                nameArr.forEach(function (index) {
                    if (index === value) {
                        flag *= 0;
                        return false;
                    } else {
                        flag *= 1;
                    }
                })
                if (flag === 1) {
                    name = value + ',' + storage.getItem('searchname');
                    storage.setItem('searchname', name);
                }
            } else {
                name = value;
                storage.setItem('searchname', name);
            }
        },
        // 查找
        search (value) {
            this.typeShow(undefined, undefined, undefined, value);
        },
        // 清除搜索框
        clearFun () {
            var searchText = document.getElementById('searchText');
            searchText.value = '';
            this.searchKey = '';
            this.isClear = true;
        },
        // 清空历史搜索
        clearAll () {
            // 移除localStorage的searchname
            var storage = window.localStorage;
            storage.removeItem('searchname');
            // 移除历史搜索列表
            var list = document.getElementById('history');
            if (list) {
                list.remove('li');
            } else {
                return;
            }
        },
        // 删除当前条历史搜索
        deleteHistory (e) {
            var that = this;
            var _this = e.currentTarget;
            var storage = window.localStorage;
            var otext = _this.parentNode.getElementsByTagName('span')[0].getElementsByTagName('span')[0].innerHTML;
            var name = storage.getItem('searchname');
            var nameArr = name.split(',');
            if (name) { // 移除storage里的当前数据
                that.unique(nameArr, otext);
                storage.setItem('searchname', nameArr.toString());
                if (storage.getItem('searchname').length === 0) {
                    storage.removeItem('searchname');
                }
            }
            _this.parentNode.remove();
        },
        // 产品类型选择(tab切换)
        typeShow (index, type, me, searchKey, classType) {
            // me 用来标识是否是分页
            // nav切换, 排序
            // console.log(index, type, me, searchKey)
            if (!me && !searchKey) {
                this.pageIndex = 1;
                this.recommendList = [];
            } else if (!me && searchKey) {
                // 搜索
                this.searchPageIndex = 1;
                this.searchList = [];
            } else {
                // 保存dropload对象
                window.dropload = me;
                // 禁止刷新
                window.dropload.isLockUp = true;
            }
            let obj = {};
            // 搜索
            if (searchKey) {
                obj = {
                    pageIndex: this.searchPageIndex,
                    pageSize: this.pageSize,
                    benefitNum: 0,
                    key: searchKey
                }
            } else {
                this.currentType = type;
                this.typei = index;
                obj = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    productType: this.currentType,
                    benefitNum: 0,
                    sortCode: this.sortCode
                }
            }
            console.log(type)
            // 车险
            if (classType === 1) {
                // window.location.href = 'productList.html?productType=' + type;
                return false;
            }
            this.getProducts(obj, (response) => {
                console.log(response)
                // 销量，价格排序重置
                if (!me && !this.isSort && !searchKey) { // nav切换
                    this.resetStatus();
                }
                if (searchKey) {
                    this.isSearchContent = true;
                    this.nodata1 = false;
                } else {
                    this.nodata = false;
                }
                console.log(response)
                if (response.data.output.totalCount === '0') {
                    if (searchKey) {
                        this.nodata1 = true;
                    } else {
                        this.nodata = true;
                    }
                    // 如果没有数据 , 锁定
                    if (typeof window.dropload !== 'undefined') {
                        window.dropload.isLockDown = true;
                        window.dropload.isData = false;
                        window.dropload.opts.domDown.domNoData = '<div class="dropload-noData" id="nodata" style="color:rgb(168, 175, 172);"></div>';
                    }
                    // window.dropload.isLockDown = true;
                    // window.dropload.isData = false;
                    // window.dropload.opts.domDown.domNoData = '<div class="dropload-noData" id="nodata" style="color:rgb(168, 175, 172);"></div>';
                } else {
                    let arr = [];
                    let temp = '';
                    if (searchKey) {
                        if (me) {
                            arr = this.searchList;
                        }
                        temp = this.searchList.length;
                        response.data.output.productList.map((item) => {
                            arr.push(item);
                        })
                        this.searchList = arr;
                    } else {
                        if (me) {
                            arr = this.recommendList;
                        }
                        temp = this.recommendList.length;
                        response.data.output.productList.map((item) => {
                            arr.push(item);
                        })
                        this.recommendList = arr;
                    }
                    // 没有分页数据
                    if (arr.length >= parseInt(response.data.output.totalCount)) {
                        // 如果没有数据 , 锁定
                        console.log(window.dropload)
                        if (typeof window.dropload !== 'undefined') {
                            console.log('b')
                            window.dropload.isLockDown = true;
                            window.dropload.isData = false;
                            window.dropload.opts.domDown.domNoData = '<div class="dropload-noData" id="nodata" style="color:rgb(168, 175, 172);">暂无数据</div>';
                        }
                        // window.dropload.isLockDown = true;
                        // window.dropload.isData = false;
                        // window.dropload.opts.domDown.domNoData = '<div class="dropload-noData" id="nodata" style="color:rgb(168, 175, 172);">暂无数据</div>';
                    } else {
                        // 有分页数据
                        if (typeof window.dropload !== 'undefined') {
                            window.dropload.isLockDown = false;
                            window.dropload.isData = true;
                        }
                        // window.dropload.isLockDown = false;
                        // window.dropload.isData = true;
                        if (searchKey) {
                            this.searchPageIndex++;
                        } else {
                            this.pageIndex++;
                        }
                    }
                }
                this.$nextTick(() => {
                    Common.setFullScreen(document.getElementById('body'))
                    if (typeof window.dropload !== 'undefined') {
                        window.dropload.direction = 'up';
                        window.dropload.resetload();
                    }
                    // window.dropload.direction = 'up';
                    // window.dropload.resetload();
                    this.isSort = false;
                })
            })
        },
        // 重置状态
        resetStatus () {
            this.isGoup = 0;
            this.isHeight = false;
            this.sortCode = '0';
        },
        // 销量最高排序
        heightMount () {
            if (!this.isHeight) {
                this.sortCode = '-2'
            } else {
                this.sortCode = '0';
            }
            // 销量最高排序(状态)
            this.isHeight = !this.isHeight;
            this.isGoup = 0;
            this.isSort = true;
            // 排序
            this.typeShow(this.typei, this.typeList[this.typei].typeId)
        },
        // 价格排序
        spFun () {
            if (this.isGoup === 0) {
                this.sortCode = '1';
            } else if (this.isGoup === 1) {
                this.sortCode = '-1';
            } else if (this.isGoup === 2) {
                this.sortCode = '0'
            }
            // 价格排序(状态)
            this.isGoup++;
            if (this.isGoup > 2) {
                this.isGoup = 0;
            }
            this.isHeight = false;
            this.isSort = true;
            // 排序
            this.typeShow(this.typei, this.typeList[this.typei].typeId)
        },
        // 产品
        getProducts (obj, callback) {
            request.getProducts(obj, (response) => {
                if (response.data.respCode === '000000') {
                    callback(response);
                    console.log(1)
                } else {
                    this.showtoast(response.data.respMsg, true);
                    console.log(2);
                }
                this.resetBody();
            }, (error) => {
                this.showtoast(error, true);
                console.log(error);
            });
        },
        // 获取热门搜索
        getHot () {
            let obj = {
                pageIndex: 1,
                pageSize: 10
            }
            request.getHotKeys(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.hotList = response.data.output.keyList;
                    if (response.data.output.totalCount === '0') {
                        this.isHotshow = false;
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                this.resetBody();
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 历史搜索显示
        searchHistory () {
            var storage = window.localStorage;
            var searchname = storage.getItem('searchname');
            if (searchname) {
                this.historyList = searchname.split(',');
            } else {
                this.historyList = '';
                return;
            }
        },
        // 到详情页面
        toProductDetail (val, type, name) {
            if (type === 1) {
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
        // 删除重复的值
        unique (arr, val) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i] === val) {
                    arr.splice(i, 1);
                }
            }
        },
        resetBody () {
            this.$nextTick(() => {
                setTimeout(() => {
                    Common.setFullScreen()
                }, 0)
            })
        },
        // 分页
        pagination (me) {
            if (this.isSearch) {
                this.typeShow(undefined, undefined, me, this.searchKey);
            } else {
                this.typeShow(this.typei, this.typeList[this.typei].typeId, me);
            }
        },
        refreshData (me) {
            me.resetload();
        },
        // 显示个人信息资料
        showPersonalInfo () {
            this.foot.style.top = '0';
            this.boy.style.position = 'fixed';
        }
    },
    filters: {
        overWan (value) {
            if (value <= 10000) {
                return value;
            } else {
                return parseInt(value / 10000) + '万';
            }
        },
        formatMoney (value) {
            if (!value) {
                return '';
            }
            return parseFloat(value / 100);
        }
    }
}
</script>
