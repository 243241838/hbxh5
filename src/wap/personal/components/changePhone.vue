<template>  
    <div :class="{'box': isWeiXin}">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div class="cell-list">
            <div class="cell">
                <div class="cell-input" v-text="output.mobile"></div>
                <span v-show="isGeting" class="green-span" @click="getVerifyCode">获取验证码</span>
                <span v-show="!isGeting" class="green-span"><span v-text="time"></span>秒</span>
            </div>
            <div class="cell bordertop">
                <input class="cell-input" type="text" placeholder="请输入验证码" v-model="smsCode">
            </div>
        </div>
        <div style="margin-top:30px;" class="button" @click="commit">验证后绑定新手机</div>
        <router-link :to="{name: 'verifyPassword', params: {prevPage: 'changePhone'}}">
            <div style="padding-top:23px;text-align:center;">
                <span class="green-span">通过登录密码验证身份</span>
            </div>
        </router-link>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
// 换绑手机
import request from 'js/interface/request';
import toast from 'components/toast' // toast引用
import { Common, valid, storage } from 'js/common.js';
import headerCommon from 'components/headerCommon.vue';
export default {
    components: {
        toast,
        headerCommon
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            output: '', // 获取的数据
            smsCode: '', // 验证码
            time: 60, // 倒计时
            isGeting: true, // 验证码切换
            isWeiXin: false,
            title: '换绑手机'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '换绑手机';
    },
    mounted () {
        this.getData(); // 获取数据
    },
    methods: {
        // 获取用户资料
        getData () {
            this.output = JSON.parse(storage.get('userInfo'));
        },
        // 获得验证码
        getVerifyCode () {
            var data = {
                bizType: '15', // 修改绑定手机
                mobile: this.output.mobile,
                codeType: '1' // 短信验证码
            }
            console.log(JSON.stringify(data))
            request.getVerifyCode(data, (response) => {
                if (response.data.respCode === '000000') {
                    console.log(response.data.output.smsCode)
                    this.showtoast('验证码已发送至手机，请注意查收', true);
                    this.isGeting = !this.isGeting;
                    this.time60();// 倒计时
                } else {
                    this.showtoast('获得验证码失败', true)
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
         // 倒计时
        time60 () {
            this.isGeting = false;// 切换倒计时和获得验证码
            this.isTimeout = false;// 是否超时
            let timer = setInterval(() => {
                this.time--;
                if (this.time === 0) {
                    this.time = 60;
                    this.isGeting = true;
                    this.isTimeout = true;// 超时
                    clearInterval(timer);
                }
            }, 1000);
        },
        // 确定
        commit () {
            if (this.isTimeout) {
                this.showtoast('请重新获取验证码', true);
                return;
            }
            if (this.smsCode.length === 0) {
                this.showtoast('请输入验证码', true);
                return;
            }
            let obj = {
                codeType: '1',
                userId: Common.getUserId(),
                verifyCode: this.smsCode,
                bizType: '15',
                userName: this.output.mobile
            }
            console.log(JSON.stringify(obj))
            request.verifyCode(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.$router.push({name: 'bindPhone'});
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
