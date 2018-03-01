<template>  
    <div id="body">
        <div class="list" v-show="rendering">
            <template v-for="output in arrOutput">
                <a href="javascript:;" class="item flexbox" v-for="item in output.couponList" @click="getId(item)">
                    <div class="rotate_box">
                        <div class="rotate fl" v-show="item.surplusDay==1">
                            <span >剩<span>一</span>天</span>
                        </div>
                        <div class="money flexbox align-items justify-content">
                            <span>{{item.couponValue | formatMoney(item.couponValue)}}</span>
                        </div>
                    </div>
                    <div class="content flex">
                        <p class="first" v-text="item.couponName"></p>
                        <p class="time">
                            有效期：<span v-text="item.effTime"></span>~<span v-text="item.expTime"></span>
                        </p>
                    </div>
                </a>
            </template>
         </div>
         <!--最后div-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
         <!--loading加载组件-->
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import request from 'js/interface/request'
import { Common } from 'js/common.js';
import Cookies from 'js/Cookies/Cookies.js';
import toast from '../../components/toast' // toast引用
import loading from '../../components/loading';

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
            loading: false, // 加载中
            output: '',
            arrOutput: [],
            url: '#',
            pageIndex: 1, // 当前页数
            pageSize: '10', // 条数
            totalCount: 0, // 总条数
            allPages: 0,
            userId: '56',
            rendering: false,
            isFirst: true
        }
    },
    created () {
    },
    mounted () {
        let d = new Mydropload('body', this.refreshData, this.getData);
        Common.setFullScreen();
    },
    // couponClass: '1：折扣优惠；2：金额优惠；3：随机金额优惠；'
    filters: {
        formatMoney (value) {
            if (!value) {
                return '';
            }
            return '￥' + parseInt(value / 100);
        }
    },
    computed: {
    },
    methods: {
        getData (me, size) { // 获取数据
            var data = {
                userId: Common.getUserId(),
                sts: 1,
                couponType: 2,
                pageIndex: size ? 1 : this.pageIndex,
                pageSize: size || this.pageSize
            }
            if (this.isFirst) {
                this.loading = true;
            }
            request.getUserCouponsList(data, (response) => {
                if (this.isFirst) {
                    this.loading = false;
                    this.isFirst = false;
                }
                if (!response.data.success) {
                    this.showtoast(response.data.respMsg, true);
                    return;
                }
                let output = response.data.output;
                // 取得总页数
                if (this.pageIndex === 1) {
                    // 返回来是前端传递的
                    this.pageSize = output.pageSize;
                    this.totalCount = output.totalCount;
                    if (this.totalCount % this.pageSize === 0) {
                        this.allPages = parseInt(this.totalCount / this.pageSize);
                    } else {
                        this.allPages = parseInt(this.totalCount / this.pageSize) + 1;
                    }
                }
                if (this.pageIndex > this.allPages) {
                    // 加载
                    if (!size) {
                        // 如果没有数据
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                } else {
                    // 有数据
                    if (!size) {
                        // 加载
                        this.arrOutput.push(output);
                        this.pageIndex++;
                    } else {
                        // 刷新
                        this.arrOutput = [];
                        this.arrOutput.push(output);
                    }
                }
                Common.setFullScreen()
                // 每次数据插入，必须重置
                me.resetload();
                this.rendering = true;
            }, (error) => {
                // 即使加载出错，也得重置
                this.showtoast(error, true);
                this.loading = false;
                me.resetload();
            })
        },
        refreshData (me) {
            me.resetload();
        },
        getId (item) {
            Cookies.setRedPacket(item);
            window.location.href = './paymentConfirm.html?tradeId=' + Common.getQueryString('tradeId');
        },
         // 显示提示框
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        // 关闭提示框
        closetoast () {
            this.toast.isshow = false;
        }
    }
}
</script>
