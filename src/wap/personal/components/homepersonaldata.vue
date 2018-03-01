<template>  
    <div class="person_data_">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div>
            <div class="person_data_list">
                <div class="person_data_item first flexbox align-items">
                    <div class="left">头像</div>
                    <div class="right flex flexbox align-items">
                        <div class="img" :style="{'backgroundImage': 'url(' + logo + ')'}"></div>
                    </div>
                </div>
                <div class="person_data_item flexbox align-items">
                    <div class="left">昵称</div>
                    <div class="right flex flexbox align-items">
                        <input type="text" v-text="output.nickName" v-model="name" placeholder="请输入">
                    </div>
                </div>
                <div class="person_data_item flexbox align-items">
                    <div class="left">性别</div>
                    <div class="right flex flexbox align-items">
                        <span class="gender" @click="select=true">
                            <i class="iconfont icon" :class="{icon_select:select}">&#xe642;</i>
                            <span :class="{orange:select}">男</span>
                        </span>
                        <span @click="select=false">
                            <i class="iconfont icon" :class="{icon_select:!select}">&#xe641;</i>
                            <span :class="{orange:!select}">女</span>
                        </span>
                    </div>
                </div>
                <router-link to="accountSecurity" class="person_data_item flexbox align-items router-link">
                    <div class="left">手机号</div>
                    <div class="right flex flexbox align-items" v-text="output.mobile"></div>
                    <div class="right_icon">
                        <i class="iconfont">&#xe61d;</i>
                    </div>
                </router-link>
                <div class="person_data_item last flexbox align-items">
                    <div class="left">邮箱号</div>
                    <div class="right flex flexbox align-items">
                        <input type="text" v-text="output.email" v-model="myEmail" placeholder="请输入">
                    </div>
                </div>
                <!--list div-->
            </div>
            <router-link :to="backUrl">
                 <div class="person_data_btn" @click="subm">保存</div>
            </router-link>
        </div>
         <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import request from 'js/interface/request'
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
import { Common, valid, storage } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
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
            loading: false,
            output: '',
            render: true,
            isFirst: true,
            select: true,
            gender: '', // 性别状态 0男1女
            myEmail: '', // 邮箱
            name: '', // 昵称
            backUrl: '', // 跳转
            isWeiXin: false,
            title: '个人资料设置',
            logo: require('../images/img.png')
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '个人资料设置';
    },
    mounted () {
        Common.setFullScreen();
        this.getData(); // 获取数据
    },
    computed: {
    },
    methods: {
        getData () { // 获取数据
            this.output = JSON.parse(storage.get('userInfo'));
            if (this.output) {
                if (this.output.logo) {
                    this.logo = this.output.logo;
                }
            }
            console.log(this.output.email);
            this.myEmail = this.output.email;
            this.name = this.output.nickName;
            if (this.output.gender === 0) {
                this.select = true;
            } else {
                this.select = false;
            }
        },
        subm () {
            if (this.select) {
                this.gender = 0;
            } else {
                this.gender = 1;
            }
            if (this.name.length === 0 && this.myEmail.length === 0 && this.gender === this.output.gender) {
                this.$router.go(-1);
                return;
            }
            if (this.name.length > 0 && this.myEmail.length === 0 && !valid.nickName(this.name)) {
                this.showtoast('昵称不能用非法字符，长度为1-6', true);
                return;
            }
            if (this.name.length === 0 && this.myEmail.length > 0 && !valid.isEmail(this.myEmail)) {
                this.showtoast('邮箱格式错误', true);
                return;
            }
            if (this.name.length > 0 && this.myEmail.length > 0 && !valid.nickName(this.name)) {
                this.showtoast('昵称不能用非法字符，长度为1-6', true);
                return;
            }
            if (this.name.length > 0 && this.myEmail.length > 0 && !valid.isEmail(this.myEmail)) {
                this.showtoast('邮箱格式错误', true);
                return;
            }
            var obj = {
                userId: Common.getUserId(),
                nickName: this.name,
                gender: this.select ? 0 : 1,
                email: this.myEmail
            }
            request.updateUserInfo(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.$router.go(-1)
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
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
