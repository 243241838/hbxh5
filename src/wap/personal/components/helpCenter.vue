<template>  
    <div id="body" class="help_body" >
        <div class="head_box">
        <headerCommon v-if="!isWeiXin" :title="title" :rem= "true"></headerCommon>
        <div class="banner" id="banner"><img src="../images/help_banner .jpg"/></div>
        <div class="help_head flexbox">
                 <div class="flex flexbox justify-content">
                        <div class="item" :class="{border:head_border==1}" @click="head(1)">
                            常见问题
                        </div>
                    </div>
                    <div class="flex flexbox justify-content">
                        <div class="item" :class="{border:head_border==2}" @click="head(2)">
                            理赔指南
                        </div>
                    </div>
                     <div class="flex flexbox justify-content">
                        <div class="item" :class="{border:head_border==3}" @click="head(3)">
                            退保指南
                        </div>
                    </div>
                     <div class="flex flexbox justify-content">
                        <div class="item" :class="{border:head_border==4}" @click="head(4)">
                            其他
                        </div>
                    </div>
            </div>
        </div>
        <div class="help_box" :class="{isWeiXin:isWeiXin}">
           <div class="help_list" v-if="output.length>0">
                <router-link :to="{name:'InfoCenter', params:{id:item.infoId}}" class="list_item" v-for="(item ,index) in output" :class="{noborder:index==output.length-1}">{{item.infoTitle}}</router-link>
            </div>
            <div class="help_more" v-if="totalCount>output.length">
                <a href="javascript:;" class="help_morebtn" @click="getData(totalCount)">查看更多问题</a>
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <!--loading加载组件-->
        <loading :isshow="loading"></loading>
        </div>
        <!--loading加载组件-->
    </div>
</template>
<script>
// 账户安全
import request from 'js/interface/request';
import { Common, valid, storage } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
export default {
    components: {
        toast,
        loading,
        headerCommon
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            output: '', // 数据
            loading: true,
            title: '帮助中心',
            isWeiXin: false,
            head_border: 3,
            messageType: 10,
            pageIndex: 1,
            pageSize: 10,
            totalCount: ''
        }
    },
    created () {
        this.head_border = this.$route.query.table;
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '帮助中心';
        this.getData();
        this.resetBody();
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        head (number) {
            this.output = '';
            if (number === 1) {
                this.head_border = 1;
                this.messageType = 10;
                this.getData();
            } else if (number === 2) {
                this.head_border = 2;
                this.messageType = 20;
                this.getData();
            } else if (number ===3) {
                this.head_border = 3;
                this.messageType = 30;
                this.getData();
            } else if (number ===4) {
                this.head_border = 4;
                this.messageType = 40;
                this.getData();
            }
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        // 关闭提示框
        closetoast () {
            this.toast.isshow = false;
        },
        getData (total) {
            if (total) {
                this.scroll = true;
            }
            var data = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                messageType: this.messageType
            }
            if (total) {
                data.pageSize= this.totalCount;
            }
            request.getServiceInfoList(data, (response) => {
                this.loading = false;
                if (response.data.respCode === '000000') {
                    this.output = response.data.output.infos;
                    this.totalCount = response.data.output.totalCount;
                    this.$nextTick(() => {
                        let by = document.getElementById('body')
                        Common.setFullScreen(by);
                    })
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.loading = false;
                this.showTotast(error, true);
            })
        },
        resetBody () {
            this.$nextTick(() => {
                setTimeout(() => {
                    Common.setFullScreen()
                }, 0)
            })
        }
    }
}
</script>