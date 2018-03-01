<template>
     <header class="flexbox" :class="{'rem': rem, 'fixed': isFiexd}">
        <div class="flex left">
            <i v-if="!url" @click="onClickBack" style="color:#fff" class="iconfont icon-xiayibu back" :class="{'none':none}"></i>
            <a v-if="url" :href="url" style="color:#fff" class="iconfont icon-xiayibu back" :class="{'none':none}"></a>
        </div>
        <div class="centerH" v-text="title">
        </div>
        <div class="flex right">
            <i @click="go_user()" v-if="setting" class="iconfont icon-shezhi"></i>
        </div>
    </header>
</template>

<script>
import {Common, storage, valid} from 'js/common';
export default {
    // name: 'header',
    props: {
        title: String,
        isFiexd: Boolean,
        rem: Boolean,
        url: String,
        none: Boolean,
        setting: Boolean
    },
    methods: {
        onClickBack () {
            window.history.back();
            return false;
        },
         //去个人信息
        go_user () {
            window.location.href = 'FQuserData.html';
            return false;
        }
    }
}
</script>
<style lang='scss' scoped>
@import "../assets/scss/usage/layout/reset.scss";
@import "../assets/scss/usage/layout/common.scss";
@import "../assets/fonts/iconfont.css";
header{
    background: #2dce8f;
    color: #fff;
    padding:0 18px;
    height:44px;
    line-height:44px;
    width:100%;
    .back{
        display:inline-block;
        width:16px;
        height:100%;
        transform:rotate(180deg);
        color:#fff;
        font-size:16px;
    }
    .centerH{
        text-align: center;
        @include flex(5);
        font-size:16px;
        width:100%;
    }
}
.rem{
    height:0.88rem;
    line-height:0.88rem;
    .back{
        width:0.34rem;
        font-size:0.34rem;
    }
    .centerH{
        font-size:0.34rem;
    }
}
.fixed{
    position:fixed;
    z-index: 10;
}
.none{
    display:none !important;
}
.right{
    text-align:right;
    .icon-shezhi{
        font-size:0.44rem;
        color:#fff;
    }
}


</style>