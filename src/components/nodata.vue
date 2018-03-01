<template>
    <div class="policy-data">
        <div class="policy-data-container">
            <div class="info">
                <img src="../assets/images/baodannodata.png"/>
                <div>{{infomessage}}</div>
            </div>
        </div>
        <div class="btn-box">
       <button v-show="buttonmessage" class="btn"  @click="gohome(url)">{{buttonmessage}}</button>
       </div>
    </div>
</template>

<script>
export default {
    name: 'totast',
    props: {
        infomessage: String,
        buttonmessage: String,
        url: String
    },
    data () {
        return {
        }
    },
    methods: {
        gohome (url) {
            window.location.href = url;
            return false;
        }
    }
}
</script>
<style lang='scss' scoped>
@import "../assets/scss/usage/layout/reset.scss";
@import "../assets/scss/usage/layout/common.scss";
@import "../assets/fonts/iconfont.css";
.policy-data{
    padding-top:3rem;
    background:#F5F5F5;
}
.policy-data .policy-data-container{
    width:2.6rem;
    margin:0 auto;
    color: #a8aeac;
}

.info{
    font-size:0.24rem;
    text-align:center;
    width:100%;
}
.info img{
    width:100%;
}
.info div{
    padding-top:1rem;
    padding-bottom:1.68rem;
}
.btn-box{
    width:70%;
    margin: 0 auto;
}
.btn{
    border:none;
    width:100%;
    line-height:0.88rem;
    border-radius:0.08rem;
    color:#FFFFFF;
    background:#2DCE8F;
    font-size:0.32rem;
    margin-bottom:1rem;

}

</style>