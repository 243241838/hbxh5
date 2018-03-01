<template>
    <div class="container">
        <div class="head">
            <span :class="{span_border:currentIndex==0}"  @click="currentIndex=0">产品特色</span>
            <span :class="{span_border:currentIndex==1}" @click="currentIndex=1">产品问答</span>
            <span :class="{span_border:currentIndex==2}" class="span_last" @click="currentIndex=2">案例分析</span>
        </div>
        <div id="body">
            <section>
                <div class="list">
                    <div class="bottom">
                        <div class="feature" v-show="currentIndex==0">
                            <img v-for="item in output.productAdvantageList" :src="item">
                        </div>
                        <div class="answers" v-show="currentIndex==1" v-html="output1">
                        </div>
                        <div class="analyze" v-show="currentIndex==2" v-html="output2">
                        </div>    
                    </div>
                </div>
            </section>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import request from 'js/interface/request'
import { Common } from 'js/common.js';
import toast from '../../components/toast' // toast引用：
export default {
    components: {
        toast
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            output: '',
            output1: '',
            output2: '',
            currentIndex: 0,
            list: [],
            curSelected: '-',
            oDisplay: '-',
            currentPage: 1, // 点击切换
            src: [], // 产品特色
            productId: ''
        }
    },
    created () {
        this.productId = Common.getQueryString('productId');
    },
    mounted () {
        this.getData();// 获取产品特色
        this.getData1();// 获取问答
        this.getData2();// 获取案例分析
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
        show (item) { // 点击
            if (typeof item.isSelected === undefined) {
                this.$set(item, 'isSelected', true);
            } else {
                this.$set(item, 'isSelected', true);
            }
        },
        getData () { // 获取产品特色数据
            var data = {
                productId: this.productId
            }
            request.getProductDetail(data, (response) => {
                if (response.data.respCode === '000000') {
                    this.output = response.data.output;
                    console.log(this.output)
                    if (this.output.productAdvantageList.length > 0) {
                        this.currentIndex === 0;
                    } else {
                        this.currentPage === 1;
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                Common.setFullScreen();
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        getData1 () { // 获取问答数据
            var data = {
                productId: this.productId
            }
            request.getProductQa(data, (response) => {
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    this.output1 = output.productQa;
                    if (this.currentIndex === 1) {
                        if (output.productQa !== '') {
                            this.currentIndex === 1;
                        } else {
                            this.currentIndex === 2;
                        }
                    }
                    Common.setFullScreen();
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        getData2 () { // 获取案例分析
            var data = {
                productId: this.productId
            }
            request.getProductCase(data, (response) => {
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    this.output2 = output.productCase;
                    if (this.currentIndex === 2) {
                        if (output.productCase !== '') {
                            this.currentIndex === 2;
                        } else {
                            this.currentIndex === 0;
                        }
                    }
                    Common.setFullScreen();
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        }
    }
}
</script>