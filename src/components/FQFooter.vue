<template>
     <div class="FQFooter flexbox">
        <a :href="tabOne" class="flex flexbox justify-content align-items flex-column">
            <i class="iconfont icon" :class="{'selected':selected==0}">&#xe661;</i>
            <span class="des" :class="{'selected':selected==0}">车险查询</span>
        </a>
        <a :href="tabTwo" class="flex flexbox justify-content align-items flex-column">
            <i class="iconfont icon" :class="{'selected':selected==1}">&#xe65e;</i>
            <span class="des" :class="{'selected':selected==1}">报价列表</span>
        </a>
        <a :href="tabThree" class="flex flexbox justify-content align-items flex-column">
            <i class="iconfont icon" :class="{'selected':selected==2}">&#xe66f;</i>
            <span class="des" :class="{'selected':selected==2}">个人中心</span>
        </a>
        <!--<a :href="tabThree" class="flex flexbox justify-content align-items flex-column">
            <i class="iconfont icon" :class="{'selected':selected==2}">&#xe662;</i>
            <span class="des" :class="{'selected':selected==2}">订单列表</span>
        </a>
        <a :href="tabFour" class="flex flexbox justify-content align-items flex-column">
            <i class="iconfont icon" :class="{'selected':selected==3}">&#xe664;</i>
            <span class="des" :class="{'selected':selected==3}">邀请好友</span>
        </a>-->
    </div>
</template>

<script>
import {Common, valid} from 'js/common';
export default {
    data () {
        return {
            tabOne: './FQLogin.html',
            tabTwo: './FQLogin.html',
            tabThree: './FQLogin.html',
            tabFour: './FQLogin.html'
        }
    },
    props: {
        selected: Number
    },
    created () {
        if (Common.isLogin() || valid.isWeiXin()) {
            this.tabOne = './FQcarInfo.html';
            this.tabTwo = './FQQuotationList.html';
            this.tabThree = './FQpersonal.html';
            // this.tabThree = './FQOrerList.html';
            // this.tabFour = './FQinvite.html';
        }
    }
}
</script>
<style lang='scss' scoped>
@import "../assets/scss/usage/layout/reset.scss";
@import "../assets/scss/usage/layout/common.scss";
@import "../assets/fonts/iconfont.css";
.FQFooter{
    position: fixed !important;
    width:100%;
    height:1rem;
    left:0;
    bottom:0;
    font-size:0.32rem;
    background: #fff;
    @include border(1px 0 0 0,#e3e3e3,solid);
    z-index:10;
    .icon{
        font-size:0.4rem;
        color:#a8afac;
    }
    .des{
        font-size:0.2rem;
        color:#a8afac;
    }
    .selected{
        color:#2dce8f;
    }
}
</style>