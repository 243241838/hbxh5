<template>
    <footer>
       <!--最后-->
        <div class="bottom">
            <ul>
                <li class="fl l1">
                        <i class="iconfont ic">&#xe61a;</i>
                        <a :href="'tel:'+footer.number">联系客服</a>
                </li>
                <li class="fl l2">
                        <i class="iconfont ic">&#xe610;</i>
                        <a :href="footer.url">电子保单</a>
                </li>
                <li class="fl l3" @click="aa">
                        <span>我要理赔</span>
                        <i class="iconfont ic">&#xe613;</i>
                </li>
            </ul>
        </div>
    </footer>
</template>
<script>
export default {
    data () {
        return {
        }
    },
    props: {
        footer: {
            type: Object,
            default () {
                return {
                    number: '',
                    url: ''
                }
            }
        }
    },
    computed: {
    },
    methods: {
        aa () {
            console.log(this.footer.number)
        }
    }
}
</script>
<style lang='scss' scoped>
@import "../../assets/scss/usage/layout/reset.scss";
@import "../../assets/scss/usage/layout/common.scss";
$number:#a8aeac;
$padding:17px;
$ul:#fff;
footer{
    z-index:10000;
    height:1.2rem;
    width:100%;
    border-top:1px solid #ddd;
    position:fixed;
    bottom:0;
    left:0;
    background:#fff;
    @include flexbox();
}
.bottom{
    @include flex();
	width:100%;
	height:1.2rem;
	background:#fff;
	padding:0 $padding;
	li{
		 line-height:1.2rem; 
		span,a{
			@include font-size(14px);
			margin-left:0.15rem;
			color:#484c4b;
			float:left;
	   }
	   .ic{
		  color:#2ece90;
		  @include font-size(22px);
	      line-height:1.2rem;
		  float:left;
	   }
	}
	.l1{
        width:2.07rem;
	}
	.l2{
		width:2.5rem;
		.ic{
			display: inline-block;
			padding-left:0.4rem;
		}
	}
	.l3{
		width:2.08rem;
		span{
			float:right;
		}
		.ic{
			float:right;
		}
	}
}
</style>