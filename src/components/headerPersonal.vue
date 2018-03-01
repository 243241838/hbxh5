<template>
     <header class="flexbox">
        <div class="flex left">
            <img class="back" @click="showPersonalInfo()" src="../assets/images/personal.png" alt="">
        </div>
        <div class="centerH" v-text="title">
        </div>
        <div class="flex">
        </div>
    </header>
</template>

<script>
export default {
    data () {
        return {
            foot: ''
        }
    },
    // name: 'header',
    props: {
        title: String
    },
    mounted () {
        this.foot = document.getElementById('foot');
    },
    methods: {
        onClickBack () {
            window.history.back();
            return false;
        },
        // 显示个人信息资料
        showPersonalInfo () {
            this.foot.style.top = '0';
            document.getElementById('ui-scroll').style.position = 'fixed';
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
    width:100%;
    padding:0 0.36rem;
    height:0.88rem;
    line-height:0.88rem;
    position:fixed;
    z-index:9;
    .back{
        display:inline-block;
        width:0.4rem;
        height:0.4rem;
    }
    .centerH{
        text-align: center;
        @include flex(3);
        font-size:0.32rem;
    }
}
</style>