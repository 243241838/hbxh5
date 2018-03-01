<template>
    <div class="personalcenter_body">
         <headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon>
        <div id="My_c_head" class="flexbox align-items justify-content flex-column" :class="{isWeiXin:isWeiXin}">
            <router-link :to="homepersonaldata">
                 <div class="t_img"  :style="{'backgroundImage': 'url(' + logo + ')'}"></div>
            </router-link>
            <div class="name" v-if="output.nickName" v-text="output.nickName" style="text-align:center;"></div>
            <div class="name" v-else-if="output.mobile" v-text="output.mobile" style="text-align:center;"></div>
            <!--<a href="./login.html" class="name" v-else>未登录</a>-->
        </div>
        <div class="My_c_list">
            <router-link to="homeOrder">
                <div class="My_c_item flexbox align-items">
                    <div class="flex flexbox align-items">
                        <i class="iconfont">&#xe610;</i>
                        <span>我的订单</span>
                    </div>
                    <span class="icon">
                        <i class="iconfont">&#xe61d;</i>
                    </span>
                </div>
            </router-link>
            <router-link to="homePolicy">
                <div class="My_c_item flexbox align-items">
                    <div class="flex flexbox align-items">
                        <i class="iconfont">&#xe63e;</i>
                        <span>我的保单</span>
                    </div>
                    <div class="icon">
                        <i class="iconfont">&#xe61d;</i>
                    </div>
                </div>
            </router-link>
            <router-link to="homeLocation">
                <div class="My_c_item flexbox align-items">
                    <div class="flex flexbox align-items">
                        <i class="iconfont">&#xe63c;</i>
                        <span>地址管理</span>
                    </div>
                    <div class="icon">
                        <i class="iconfont">&#xe61d;</i>
                    </div>
                </div>
            </router-link>
            <router-link to="accountSecurity">
                <div class="My_c_item flexbox align-items no_border">
                    <div class="flex flexbox align-items">
                        <i class="iconfont">&#xe63d;</i>
                        <span>账户安全</span>
                    </div>
                    <div class="icon">
                        <i class="iconfont">&#xe61d;</i>
                    </div>
                </div>
            </router-link>
        </div>
        <footer class="My_c_footer flexbox align-items justify-content">
            <div class="icon"><i class="iconfont">&#xe63f;</i></div>
            <span class="saerve">服务热线：</span>
            <a href="tel:4006786078" class="phone">400-678-6078</a>
        </footer>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import request from 'js/interface/request';
import toast from '../../../components/toast'; // toast引用
import { Common, valid, storage } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
export default {
    components: {
        toast,
        headerCommon
    },
    data () {
        return {
            output: '',
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            homepersonaldata: '',
            title: '个人中心',
            isWeiXin: '',
            logo: require('../images/img.png')
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '个人中心';
        this.getData();
    },
    mounted () {
        this.$nextTick(() => {
            Common.setFullScreen();
        })
    },
    computed: {
    },
    methods: {
        getData () {
            var data = {
                userId: Common.getUserId()
            }
            request.getUserInfo(data, (response) => {
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (output) {
                        this.output = output;
                        if (this.output.logo) {
                            this.logo = this.output.logo;
                        }
                    }
                    this.homepersonaldata = {name: 'homepersonaldata'};
                    storage.set('userInfo', JSON.stringify(this.output));
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                console.log(error)
                // this.showtoast(error, true);
            })
        },
        // 显示提示框
        showtoast (msg, isshow) {
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
