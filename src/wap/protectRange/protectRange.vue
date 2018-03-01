<template>
    <div class="container">
        <div id="body">
            <ul class="protect-title flexbox" v-if="planListLen!==1">
                <li class="protect-title-item flex" v-for="(item,index) in planList" v-bind:class="{ cur:index===i}" @click="typeChoose(index)">
                    <span>{{item.planName}}</span>
                </li>
            </ul>
            <div class="protect-list">
                <div class="protect-item" v-for="item in benefitList">
                    <div class="protect-item-title">
                        {{item.benefitName}}
                        <span class="fr">{{item.insuredAmount}}</span>
                    </div>
                    <div class="protect-item-content">
                        {{item.benefitDesc}}
                    </div>
                </div>
            </div>
        </div>
        <!--toast提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import request from 'js/interface/request';
import loading from '../../components/loading';
import { Common } from 'js/common'
import toast from '../../components/toast' // toast引用：
export default {
    components: {
        toast,
        loading
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            productId: '',
            benefitList: [],
            planList: [],
            i: 0,
            loading: true, // 加载中
            planListLen: ''
        }
    },
    created () {
        this.productId = Common.getQueryString('productId');
    },
    mounted () {
        this.getproductClause();
    },
    computed: {
    },
    methods: {
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        typeChoose (index) {
            this.i = index;
            this.benefitList = this.planList[index].classNameList[0].benefitList;
        },
        getproductClause () {
            var that = this;
            var data = {
                productId: this.productId
            }
            request.getProductDetail(data, (response) => {
                this.loading = false;
                if (response.data.respCode === '000000') {
                    that.planList = response.data.output.planList;
                    that.planListLen = that.planList.length;
                    that.benefitList = response.data.output.planList[that.i].classNameList[0].benefitList;
                } else {
                    that.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                that.showtoast(error, true);
            })
        }
    },
    filters: {
    }
}
</script>